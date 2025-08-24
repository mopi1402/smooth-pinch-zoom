export const DEFAULT_CONFIG = {
  minZoom: 0.5,
  maxZoom: 2.0,
  initialZoom: 1.0,
  wheelIncrement: 0.02,
  enableWheelZoom: true,
  enablePinchZoom: true,
  autoReadViewport: true,
  useExperimentalCssZoom: false,
} as const;

export const DEFAULT_VIEWPORT_VALUES = {
  initialScale: null,
  minimumScale: null,
  maximumScale: null,
  userScalable: true,
} as const;
