import type {
  EnabledOptions,
  SmoothPinchZoomConfig,
  SmoothPinchZoomControls,
  SmoothPinchZoomOptions,
  ZoomEvent,
} from "./types/types";
import { DEFAULT_CONFIG } from "./config/defaultConfig";
import { ZoomControlController } from "./ui/zoom-control-controller";
import { ZoomEvents } from "./types/types";
import { WheelGestureHandler } from "pithos/gestures/wheel-handler";
import { AnimationController } from "pithos/animations/animation-controller";
import { parseViewportMeta } from "pithos/dom/viewport-parser";
import { hasCSSZoom } from "pithos/dom/browser/browser-support";
import { EasingFunction } from "pithos/types/animations/easing";
import { LocalStorage } from "pithos/data/storage/locale-storage";
import { ViewportValues } from "pithos/types/dom/viewport";
import { TouchGestureHandler } from "pithos/gestures/touch-handler";

export class SmoothPinchZoom implements SmoothPinchZoomControls {
  private currentZoom = 1;
  private baseZoom = 1;
  private wheelGestureHandler?: WheelGestureHandler;
  private touchGestureHandler?: TouchGestureHandler;
  private zoomControlController?: ZoomControlController;
  private isDestroyed = false;
  private isWheeling = false;
  private animationController: AnimationController;
  private supportsCSSZoom: boolean;

  private readonly _config: SmoothPinchZoomConfig;
  get config(): EnabledOptions {
    return this._config;
  }

  constructor(options: SmoothPinchZoomOptions = {}) {
    const viewportValues: Partial<ViewportValues> =
      options.autoReadViewport ?? DEFAULT_CONFIG.autoReadViewport
        ? parseViewportMeta()
        : {};

    this._config = {
      ...DEFAULT_CONFIG,
      ...options,
      minZoom:
        options.minZoom ??
        viewportValues?.minimumScale ??
        DEFAULT_CONFIG.minZoom,
      maxZoom:
        options.maxZoom ??
        viewportValues.maximumScale ??
        DEFAULT_CONFIG.maxZoom,
      initialZoom:
        options.initialZoom ??
        viewportValues.initialScale ??
        DEFAULT_CONFIG.initialZoom,
    };

    this.animationController = new AnimationController();

    if (this._config.enableZoomControl !== false) {
      this.zoomControlController = new ZoomControlController(this, {
        delay: 3000,
      });
    }

    this.supportsCSSZoom = this._config.useExperimentalCssZoom && hasCSSZoom();

    if (!this.supportsCSSZoom) {
      document.body.style.transformOrigin = "0 0";
    }

    this.init();

    if (this._config.enableLocalStorage) {
      window.addEventListener("beforeunload", () => {
        LocalStorage.set("smooth-pinch-zoom-level", this.currentZoom);
      });
    }
  }

  private init(): void {
    if (this._config.enableLocalStorage) {
      this.applyZoom(
        LocalStorage.get<number>(
          "smooth-pinch-zoom-level",
          this._config.initialZoom
        ) ?? this._config.initialZoom,
        "api"
      );
    } else if (this._config.initialZoom !== 1) {
      this.applyZoom(this._config.initialZoom, "api");
    }

    if (this._config.enablePinchZoom) {
      this.setupPinchZoom();
    }

    if (this._config.enableWheelZoom) {
      this.setupWheelZoom();
    }
  }

  private setupPinchZoom(): void {
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
      shouldAllowZoom: this._config.shouldAllowZoom,
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
            this._config.shouldAllowZoom &&
            startElement &&
            !this._config.shouldAllowZoom("wheel", startElement)
          ) {
            return;
          }

          this.isWheeling = true;
        },

        onWheel: ({ event }) => {
          if (this.isDestroyed || !this.isWheeling) return;

          if (
            !this._config.shouldAllowZoom?.(
              "wheel",
              event.target ?? undefined
            ) ||
            event.ctrlKey
          ) {
            event.preventDefault();

            const zoomIncrement =
              event.deltaY > 0
                ? -this._config.wheelIncrement
                : this._config.wheelIncrement;
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
    return Math.max(
      this._config.minZoom,
      Math.min(this._config.maxZoom, zoomLevel)
    );
  }

  private applyZoom(
    zoomLevel: number,
    source: "pinch" | "wheel" | "api"
  ): void {
    if (this._config.customZoomApplicator) {
      this._config.customZoomApplicator(zoomLevel);
    } else {
      this.applyDefaultZoom(zoomLevel);
    }

    this.currentZoom = zoomLevel;
    const percentage = zoomLevel * 100;

    if (this._config.onZoomChange) {
      this._config.onZoomChange(zoomLevel, percentage);
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
    if (
      this._config.shouldAllowZoom &&
      !this._config.shouldAllowZoom("api", undefined)
    ) {
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
    return this._config.minZoom;
  }

  public getMaxZoom(): number {
    return this._config.maxZoom;
  }

  public resetZoom(): void {
    const resetPercentage = this._config.initialZoom * 100;
    this.setZoom(resetPercentage);
  }

  public zoomIn(increment: number = 10): void {
    this.setZoom(this.getZoom() + increment);
  }

  public zoomOut(increment: number = 10): void {
    this.setZoom(this.getZoom() - increment);
  }

  public updateViewportConstraints(options: {
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
  }): void {
    if (options.minZoom !== undefined) {
      this._config.minZoom = options.minZoom;
    }
    if (options.maxZoom !== undefined) {
      this._config.maxZoom = options.maxZoom;
    }
    if (options.initialZoom !== undefined) {
      this._config.initialZoom = options.initialZoom;
    }

    const clampedZoom = this.clampZoom(this.currentZoom);
    if (clampedZoom !== this.currentZoom) {
      this.setZoom(clampedZoom * 100);
    }
  }

  public animateZoom(
    targetPercentage: number,
    options: {
      duration?: number;
      easing?: EasingFunction;
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

  public destroy(): void {
    this.isDestroyed = true;

    this.animationController.destroy();

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

export default SmoothPinchZoom;

export type {
  SmoothPinchZoomOptions,
  ZoomEvent,
  ZoomSource,
} from "./types/types";

export { ZoomEvents } from "./types/types";

export { ViewportValues } from "pithos/types/dom/viewport";
