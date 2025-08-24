export type ZoomSource = "pinch" | "wheel" | "api";

export interface SmoothPinchZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  wheelIncrement?: number;
  customZoomApplicator?: (zoomLevel: number) => void;
  onZoomChange?: (zoomLevel: number, percentage: number) => void;
  enableWheelZoom?: boolean;
  enablePinchZoom?: boolean;
  autoReadViewport?: boolean;
  useExperimentalCssZoom?: boolean;
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
