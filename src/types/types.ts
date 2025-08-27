import { EasingFunction } from "pithos/types/animations/easing";

export type ZoomSource = "pinch" | "wheel" | "api";

export enum ZoomEvents {
  ZOOM_CHANGE = "smoothZoomChange",
  ZOOM_APPLIED = "smoothZoomApplied",
}

export interface ZoomAnimationOptions {
  duration?: number;
  easing?: EasingFunction;
  onComplete?: () => void;
}
export interface SmoothPinchZoomControls {
  zoomIn: (increment?: number) => void;
  zoomOut: (increment?: number) => void;
  resetZoom: () => void;
  getZoom: () => number;
  getMinZoom: () => number;
  animateZoom(
    targetPercentage: number,
    options: ZoomAnimationOptions
  ): Promise<void>;
}

export interface EnabledOptions {
  enableWheelZoom: boolean;
  enablePinchZoom: boolean;
  enableZoomControl: boolean;
  useExperimentalCssZoom: boolean;
  enableLocalStorage: boolean;
  autoReadViewport: boolean;
}

interface SmoothPinchZoomCallback {
  customZoomApplicator?: (zoomLevel: number) => void;
  onZoomChange?: (zoomLevel: number, percentage: number) => void;
  shouldAllowZoom?: (source: ZoomSource, target?: EventTarget) => boolean;
}

export interface SmoothPinchZoomConfig
  extends EnabledOptions,
    SmoothPinchZoomCallback {
  minZoom: number;
  maxZoom: number;
  initialZoom: number;
  wheelIncrement: number;
}

export type SmoothPinchZoomOptions = Partial<SmoothPinchZoomConfig>;

export interface ZoomEvent {
  zoomLevel: number;
  percentage: number;
  source: ZoomSource;
}
