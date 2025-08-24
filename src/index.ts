import type {
  SmoothPinchZoomOptions,
  ViewportValues,
  ZoomEvent,
} from "./types/types";
import { AnimationController } from "./utils/animations/animationController";
import { EasingType } from "./types/animationTypes";
import {
  DEFAULT_CONFIG,
  DEFAULT_VIEWPORT_VALUES,
} from "./config/defaultConfig";
import { ViewportParser } from "./utils/viewportParser";
import { BrowserSupport } from "./utils/browserSupport";
import { MobilePinchHandler } from "./utils/MobilePinchHandler";

export class SmoothPinchZoom {
  private currentZoom = 1;
  private minZoom: number;
  private maxZoom: number;
  private initialZoom: number;
  private wheelIncrement: number;
  private customZoomApplicator?: (zoomLevel: number) => void;
  private onZoomChange?: (zoomLevel: number, percentage: number) => void;
  private enableWheelZoom: boolean;
  private enablePinchZoom: boolean;
  private autoReadViewport: boolean;
  private useExperimentalCssZoom: boolean;

  private isPinching = false;
  private baseZoom = 1;
  private wheelListener?: (e: WheelEvent) => void;
  private visualViewportListener?: () => void;
  private mobilePinchHandler?: MobilePinchHandler;
  private isDestroyed = false;
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
    this.useExperimentalCssZoom =
      options.useExperimentalCssZoom ?? DEFAULT_CONFIG.useExperimentalCssZoom;

    this.animationController = new AnimationController();

    // Detect CSS zoom support once (only if experimental zoom is enabled)
    this.supportsCSSZoom =
      this.useExperimentalCssZoom && BrowserSupport.hasCSSZoom();

    // Initialize transform properties once for better performance
    if (!this.supportsCSSZoom) {
      document.body.style.transformOrigin = "0 0";
    }

    this.init();
  }

  private init(): void {
    // Apply initial zoom if different from 1
    if (this.initialZoom !== 1) {
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

    // Only add touch listeners on devices that support touch
    if (!("ontouchstart" in window)) {
      return;
    }

    // Use the dedicated mobile pinch handler
    this.mobilePinchHandler = new MobilePinchHandler(document, {
      onPinchStart: () => {
        this.isPinching = true;
        this.baseZoom = this.currentZoom;
      },
      onPinchChange: (
        scaleChange: number,
        centerX: number,
        centerY: number
      ) => {
        const newZoom = this.clampZoom(this.baseZoom * scaleChange);
        this.applyZoom(newZoom, "pinch");
      },
      onPinchEnd: () => {
        this.isPinching = false;
        this.currentZoom = this.getCurrentAppliedZoom();
      },
    });
  }

  private setupWheelZoom(): void {
    this.wheelListener = (e: WheelEvent) => {
      if (this.isDestroyed) return;

      if (e.ctrlKey) {
        e.preventDefault();

        // Fine precision: wheelIncrement per scroll unit
        const zoomIncrement =
          e.deltaY > 0 ? -this.wheelIncrement : this.wheelIncrement;
        const newZoom = this.clampZoom(this.currentZoom + zoomIncrement);

        this.currentZoom = newZoom;
        this.applyZoom(newZoom, "wheel");
      }
    };

    document.addEventListener("wheel", this.wheelListener, { passive: false });
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

    const percentage = zoomLevel * 100;

    // Trigger callback
    if (this.onZoomChange) {
      this.onZoomChange(zoomLevel, percentage);
    }

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent("smoothZoomChange", {
        detail: {
          zoomLevel,
          percentage,
          source,
        } as ZoomEvent,
      })
    );
  }

  private applyDefaultZoom(zoomLevel: number): void {
    // Check if zoom is close enough to 100% to consider it as default state
    const isZoom100 = Math.abs(zoomLevel - 1) < 0.001; // 0.1% tolerance

    // Update CSS custom property for responsive spacing
    document.documentElement.style.setProperty("--zoom", zoomLevel.toString());

    if (isZoom100) {
      // Reset to default state - remove all zoom styles for maximum performance
      if (this.supportsCSSZoom) {
        document.documentElement.style.removeProperty("zoom");
      } else {
        document.body.style.removeProperty("transform");
        document.body.style.removeProperty("height");
        document.body.style.removeProperty("width");
      }
    } else {
      if (this.supportsCSSZoom) {
        document.documentElement.style.zoom = zoomLevel.toString();
      } else {
        document.body.style.transform = `scale(${zoomLevel})`;
        const inverseZoom = 1 / zoomLevel;
        document.body.style.width = `${100 * inverseZoom}%`;
        document.body.style.height = `${100 * inverseZoom}%`;
      }
    }

    // Dispatch event after zoom has been applied to DOM
    window.dispatchEvent(
      new CustomEvent("smoothZoomApplied", {
        detail: {
          zoomLevel,
          percentage: zoomLevel * 100,
          isDefaultState: isZoom100,
        },
      })
    );
  }

  private getCurrentAppliedZoom(): number {
    if (this.supportsCSSZoom) {
      return parseFloat(document.documentElement.style.zoom || "1");
    } else {
      const transform = document.body.style.transform;
      const scaleMatch = transform.match(/scale\(([^)]+)\)/);
      return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    }
  }

  // Public API methods

  /** Set zoom to specific percentage (e.g., 150.5 for 150.5%) */
  public setZoom(percentage: number): void {
    const zoomLevel = percentage / 100;
    const clampedZoom = this.clampZoom(zoomLevel);
    this.currentZoom = clampedZoom;
    this.applyZoom(clampedZoom, "api");
  }

  /** Get current zoom percentage */
  public getZoom(): number {
    return this.currentZoom * 100;
  }

  public getMinZoom(): number {
    return this.minZoom;
  }

  public getMaxZoom(): number {
    return this.maxZoom;
  }

  /** Reset zoom to initial scale (from viewport or 100%) */
  public resetZoom(): void {
    const resetPercentage = this.initialZoom * 100;
    this.setZoom(resetPercentage);
  }

  /** Zoom in by specified percentage (default: 10%) */
  public zoomIn(increment: number = 10): void {
    this.setZoom(this.getZoom() + increment);
  }

  /** Zoom out by specified percentage (default: 10%) */
  public zoomOut(increment: number = 10): void {
    this.setZoom(this.getZoom() - increment);
  }

  /** Get parsed viewport meta values */
  public getViewportValues(): ViewportValues {
    return { ...this.viewportValues };
  }

  /** Update viewport constraints dynamically */
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

    // Re-clamp current zoom with new constraints
    const clampedZoom = this.clampZoom(this.currentZoom);
    if (clampedZoom !== this.currentZoom) {
      this.setZoom(clampedZoom * 100);
    }
  }

  /** Re-read viewport meta tag and update constraints */
  public refreshViewportMeta(): void {
    if (!this.autoReadViewport) {
      return;
    }

    const newValues = ViewportParser.parseViewportMeta();
    this.viewportValues = newValues;

    // Update constraints if viewport values are present
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

  /** Animate zoom to target percentage with smooth easing */
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

  /** Cancel any ongoing zoom animation */
  public cancelAnimation(): void {
    this.animationController.cancel();
  }

  /** Check if currently animating */
  public isAnimating(): boolean {
    return this.animationController.isAnimating();
  }

  /** Check if browser supports the required APIs */
  public static isSupported(): boolean {
    return BrowserSupport.isSupported();
  }

  /** Destroy the instance and clean up event listeners */
  public destroy(): void {
    this.isDestroyed = true;

    // Destroy animation controller
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

    // Clean up mobile pinch handler
    if (this.mobilePinchHandler) {
      this.mobilePinchHandler.destroy();
    }

    // Reset zoom to initial
    this.resetZoom();
  }
}

// Convenience function for quick setup
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

// Default export
export default SmoothPinchZoom;
