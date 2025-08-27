import { EasingType } from "./animationTypes";

export type ZoomSource = "pinch" | "wheel" | "api";

export enum ZoomEvents {
  ZOOM_CHANGE = "smoothZoomChange",
  ZOOM_APPLIED = "smoothZoomApplied",
}

export interface ZoomAnimationOptions {
  duration?: number;
  easing?: EasingType;
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

export interface SmoothPinchZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  wheelIncrement?: number;
  customZoomApplicator?: (zoomLevel: number) => void;
  onZoomChange?: (zoomLevel: number, percentage: number) => void;
  enableWheelZoom?: boolean;
  enablePinchZoom?: boolean;
  enableZoomControl?: boolean;
  autoReadViewport?: boolean;
  useExperimentalCssZoom?: boolean;
  enableLocalStorage?: boolean;
  shouldAllowZoom?: (source: ZoomSource, target?: EventTarget) => boolean;
}

export interface ZoomEvent {
  zoomLevel: number;
  percentage: number;
  source: ZoomSource;
}

export interface ViewportValues {
  initialScale: number | null;
  minimumScale: number | null;
  maximumScale: number | null;
  userScalable: boolean;
}
