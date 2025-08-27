import type {
  SmoothPinchZoomControls,
  SmoothPinchZoomOptions,
  ViewportValues,
  ZoomEvent,
} from "./types/types";
import { AnimationController } from "./utils/animations/animationController";
import {
  DEFAULT_CONFIG,
  DEFAULT_VIEWPORT_VALUES,
} from "./config/defaultConfig";
import { ViewportParser } from "./utils/viewportParser";
import { BrowserSupport } from "./utils/browserSupport";
import { TouchGestureHandler } from "./utils/gestures/touchHandler";
import { WheelGestureHandler } from "./utils/gestures/wheelHandler";
import { ZoomControlController } from "./ui/zoomControlController";
import { EasingType } from "./types/animationTypes";
import { ZoomEvents } from "./types/types";
import { Storage } from "./utils/storage";

export class SmoothPinchZoom implements SmoothPinchZoomControls {
  private currentZoom = 1;
  private minZoom: number;
  private maxZoom: number;
  private initialZoom: number;
  private wheelIncrement: number;
  private customZoomApplicator?: (zoomLevel: number) => void;
  private onZoomChange?: (zoomLevel: number, percentage: number) => void;
  private enableWheelZoom: boolean;
  private enablePinchZoom: boolean;
  private enableZoomControl: boolean;
  private autoReadViewport: boolean;
  private useExperimentalCssZoom: boolean;
  private enableLocalStorage: boolean;
  private shouldAllowZoom?: (
    source: "pinch" | "wheel" | "api",
    target?: EventTarget
  ) => boolean;

  private baseZoom = 1;
  private wheelListener?: (e: WheelEvent) => void;
  private wheelGestureHandler?: WheelGestureHandler;
  private touchGestureHandler?: TouchGestureHandler;
  private zoomControlController?: ZoomControlController;
  private visualViewportListener?: () => void;
  private isDestroyed = false;
  private isWheeling = false;
  private viewportValues: ViewportValues;
  private animationController: AnimationController;
  private supportsCSSZoom: boolean;

  constructor(options: SmoothPinchZoomOptions = {}) {
    this.autoReadViewport =
      options.autoReadViewport ?? DEFAULT_CONFIG.autoReadViewport;
    this.viewportValues = this.autoReadViewport
      ? ViewportParser.parseViewportMeta()
      : { ...DEFAULT_VIEWPORT_VALUES };

    this.minZoom =
      options.minZoom ??
      this.viewportValues.minimumScale ??
      DEFAULT_CONFIG.minZoom;
    this.maxZoom =
      options.maxZoom ??
      this.viewportValues.maximumScale ??
      DEFAULT_CONFIG.maxZoom;
    this.initialZoom =
      options.initialZoom ??
      this.viewportValues.initialScale ??
      DEFAULT_CONFIG.initialZoom;
    this.currentZoom = this.initialZoom;

    this.wheelIncrement =
      options.wheelIncrement ?? DEFAULT_CONFIG.wheelIncrement;
    this.customZoomApplicator = options.customZoomApplicator;
    this.onZoomChange = options.onZoomChange;
    this.enableWheelZoom =
      options.enableWheelZoom ?? DEFAULT_CONFIG.enableWheelZoom;
    this.enablePinchZoom =
      options.enablePinchZoom ?? DEFAULT_CONFIG.enablePinchZoom;
    this.enableZoomControl = options.enableZoomControl ?? true;
    this.enableLocalStorage = options.enableLocalStorage ?? true;
    this.useExperimentalCssZoom =
      options.useExperimentalCssZoom ?? DEFAULT_CONFIG.useExperimentalCssZoom;
    this.shouldAllowZoom = options.shouldAllowZoom;

    this.animationController = new AnimationController();

    if (this.enableZoomControl !== false) {
      this.zoomControlController = new ZoomControlController(this, {
        delay: 3000,
      });
    }

    this.supportsCSSZoom =
      this.useExperimentalCssZoom && BrowserSupport.hasCSSZoom();

    if (!this.supportsCSSZoom) {
      document.body.style.transformOrigin = "0 0";
    }

    this.init();

    if (this.enableLocalStorage) {
      window.addEventListener("beforeunload", () => {
        Storage.set("smooth-pinch-zoom-level", this.currentZoom);
      });
    }
  }

  private init(): void {
    if (this.enableLocalStorage) {
      this.applyZoom(
        Storage.get<number>("smooth-pinch-zoom-level", this.initialZoom) ??
          this.initialZoom,
        "api"
      );
    } else if (this.initialZoom !== 1) {
      this.applyZoom(this.initialZoom, "api");
    }

    if (this.enablePinchZoom) {
      this.setupPinchZoom();
    }

    if (this.enableWheelZoom) {
      this.setupWheelZoom();
    }
  }

  private setupPinchZoom(): void {
    if (!window.visualViewport) {
      return;
    }

    if (!("ontouchstart" in window)) {
      return;
    }

    this.touchGestureHandler = new TouchGestureHandler(document, {
      onPinchStart: () => {
        this.baseZoom = this.currentZoom;
      },
      onPinchChange: (scaleChange: number) => {
        const newZoom = this.clampZoom(this.baseZoom * scaleChange);
        this.applyZoom(newZoom, "pinch");
      },
      shouldAllowZoom: this.shouldAllowZoom,
    });
  }

  private setupWheelZoom(): void {
    this.wheelGestureHandler = new WheelGestureHandler(
      document,
      {
        maxLogicalDistance: 100,
        minDelay: 200,
        maxDelay: 300,
      },
      {
        onStart: ({ startElement }) => {
          if (this.isDestroyed) return;

          if (
            this.shouldAllowZoom &&
            startElement &&
            !this.shouldAllowZoom("wheel", startElement)
          ) {
            return;
          }

          this.isWheeling = true;
        },

        onWheel: ({ event }) => {
          if (this.isDestroyed || !this.isWheeling) return;

          if (
            !this.shouldAllowZoom?.("wheel", event.target ?? undefined) ||
            event.ctrlKey
          ) {
            event.preventDefault();

            const zoomIncrement =
              event.deltaY > 0 ? -this.wheelIncrement : this.wheelIncrement;
            const newZoom = this.clampZoom(this.currentZoom + zoomIncrement);

            this.currentZoom = newZoom;
            this.applyZoom(newZoom, "wheel");
          }
        },

        onEnd: () => {
          this.isWheeling = false;
        },
      }
    );
  }

  private clampZoom(zoomLevel: number): number {
    return Math.max(this.minZoom, Math.min(this.maxZoom, zoomLevel));
  }

  private applyZoom(
    zoomLevel: number,
    source: "pinch" | "wheel" | "api"
  ): void {
    if (this.customZoomApplicator) {
      this.customZoomApplicator(zoomLevel);
    } else {
      this.applyDefaultZoom(zoomLevel);
    }

    this.currentZoom = zoomLevel;
    const percentage = zoomLevel * 100;

    if (this.onZoomChange) {
      this.onZoomChange(zoomLevel, percentage);
    }

    window.dispatchEvent(
      new CustomEvent(ZoomEvents.ZOOM_CHANGE, {
        detail: {
          zoomLevel,
          percentage,
          source,
        } as ZoomEvent,
      })
    );
  }

  private applyDefaultZoom(zoomLevel: number): void {
    const isZoom100 = Math.abs(zoomLevel - 1) < 0.001;

    document.documentElement.style.setProperty("--zoom", zoomLevel.toString());

    if (isZoom100) {
      if (this.supportsCSSZoom) {
        document.documentElement.style.removeProperty("zoom");
      } else {
        document.body.style.removeProperty("willChange");
        document.body.style.removeProperty("transform");
        document.body.style.removeProperty("height");
        document.body.style.removeProperty("width");
      }
    } else {
      if (this.supportsCSSZoom) {
        document.documentElement.style.zoom = zoomLevel.toString();
      } else {
        document.body.style.willChange = "transform";
        document.body.style.transform = `scale(${zoomLevel})`;
        const inverseZoom = 1 / zoomLevel;
        document.body.style.width = `${100 * inverseZoom}%`;
        document.body.style.height = `${100 * inverseZoom}%`;
      }
    }

    window.dispatchEvent(
      new CustomEvent(ZoomEvents.ZOOM_APPLIED, {
        detail: {
          zoomLevel,
          percentage: zoomLevel * 100,
          isDefaultState: isZoom100,
        },
      })
    );
  }

  public setZoom(percentage: number): void {
    if (this.shouldAllowZoom && !this.shouldAllowZoom("api", undefined)) {
      return;
    }

    const zoomLevel = percentage / 100;
    const clampedZoom = this.clampZoom(zoomLevel);
    this.currentZoom = clampedZoom;
    this.applyZoom(clampedZoom, "api");
  }

  public getZoom(): number {
    return this.currentZoom * 100;
  }

  public getMinZoom(): number {
    return this.minZoom;
  }

  public getMaxZoom(): number {
    return this.maxZoom;
  }

  public resetZoom(): void {
    const resetPercentage = this.initialZoom * 100;
    this.setZoom(resetPercentage);
  }

  public zoomIn(increment: number = 10): void {
    this.setZoom(this.getZoom() + increment);
  }

  public zoomOut(increment: number = 10): void {
    this.setZoom(this.getZoom() - increment);
  }

  public getViewportValues(): ViewportValues {
    return { ...this.viewportValues };
  }

  public updateViewportConstraints(options: {
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
  }): void {
    if (options.minZoom !== undefined) {
      this.minZoom = options.minZoom;
    }
    if (options.maxZoom !== undefined) {
      this.maxZoom = options.maxZoom;
    }
    if (options.initialZoom !== undefined) {
      this.initialZoom = options.initialZoom;
    }

    const clampedZoom = this.clampZoom(this.currentZoom);
    if (clampedZoom !== this.currentZoom) {
      this.setZoom(clampedZoom * 100);
    }
  }

  public refreshViewportMeta(): void {
    if (!this.autoReadViewport) {
      return;
    }

    const newValues = ViewportParser.parseViewportMeta();
    this.viewportValues = newValues;

    if (newValues.minimumScale !== null) {
      this.minZoom = newValues.minimumScale;
    }
    if (newValues.maximumScale !== null) {
      this.maxZoom = newValues.maximumScale;
    }
    if (newValues.initialScale !== null) {
      this.initialZoom = newValues.initialScale;
    }
  }

  public animateZoom(
    targetPercentage: number,
    options: {
      duration?: number;
      easing?: EasingType;
      onComplete?: () => void;
    } = {}
  ): Promise<void> {
    const startZoom = this.currentZoom;
    const targetZoom = this.clampZoom(targetPercentage / 100);

    return this.animationController.animate(startZoom, targetZoom, {
      duration: options.duration,
      easing: options.easing,
      onUpdate: (value) => {
        this.currentZoom = value;
        this.applyZoom(value, "api");
      },
      onComplete: () => {
        this.currentZoom = targetZoom;
        this.applyZoom(targetZoom, "api");
        options.onComplete?.();
      },
    });
  }

  public cancelAnimation(): void {
    this.animationController.cancel();
  }

  public isAnimating(): boolean {
    return this.animationController.isAnimating();
  }

  public static isSupported(): boolean {
    return BrowserSupport.isSupported();
  }

  public destroy(): void {
    this.isDestroyed = true;

    this.animationController.destroy();

    if (this.wheelListener) {
      document.removeEventListener("wheel", this.wheelListener);
    }

    if (this.visualViewportListener && window.visualViewport) {
      window.visualViewport.removeEventListener(
        "resize",
        this.visualViewportListener
      );
    }

    if (this.touchGestureHandler) {
      this.touchGestureHandler.destroy();
    }

    if (this.wheelGestureHandler) {
      this.wheelGestureHandler.destroy();
    }

    if (this.zoomControlController) {
      this.zoomControlController.destroy();
    }
  }
}

export function enableSmoothPinchZoom(
  options?: SmoothPinchZoomOptions
): SmoothPinchZoom {
  if (!SmoothPinchZoom.isSupported()) {
    console.warn(
      "SmoothPinchZoom: Required APIs not supported in this browser"
    );
  }

  return new SmoothPinchZoom(options);
}

export default SmoothPinchZoom;

export type {
  SmoothPinchZoomOptions,
  ViewportValues,
  ZoomEvent,
  ZoomSource,
} from "./types/types";

export { ZoomEvents } from "./types/types";

export type { EasingType } from "./types/animationTypes";
