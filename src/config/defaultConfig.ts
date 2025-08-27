export const DEFAULT_CONFIG = {
  minZoom: 0.5,
  maxZoom: 2.0,
  initialZoom: 1.0,
  wheelIncrement: 0.02,
  enableWheelZoom: true,
  enablePinchZoom: true,
  autoReadViewport: true,
  enableZoomControl: true,
  enableLocalStorage: true,

  useExperimentalCssZoom: false,
} as const;
