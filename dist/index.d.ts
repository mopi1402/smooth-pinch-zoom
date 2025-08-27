import { EasingFunction } from 'pithos/types/animations/easing';
export { ViewportValues } from 'pithos/types/dom/viewport';

type ZoomSource = "pinch" | "wheel" | "api";
declare enum ZoomEvents {
    ZOOM_CHANGE = "smoothZoomChange",
    ZOOM_APPLIED = "smoothZoomApplied"
}
interface ZoomAnimationOptions {
    duration?: number;
    easing?: EasingFunction;
    onComplete?: () => void;
}
interface SmoothPinchZoomControls {
    zoomIn: (increment?: number) => void;
    zoomOut: (increment?: number) => void;
    resetZoom: () => void;
    getZoom: () => number;
    getMinZoom: () => number;
    animateZoom(targetPercentage: number, options: ZoomAnimationOptions): Promise<void>;
}
interface EnabledOptions {
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
interface SmoothPinchZoomConfig extends EnabledOptions, SmoothPinchZoomCallback {
    minZoom: number;
    maxZoom: number;
    initialZoom: number;
    wheelIncrement: number;
}
type SmoothPinchZoomOptions = Partial<SmoothPinchZoomConfig>;
interface ZoomEvent {
    zoomLevel: number;
    percentage: number;
    source: ZoomSource;
}

declare class SmoothPinchZoom implements SmoothPinchZoomControls {
    private currentZoom;
    private baseZoom;
    private wheelGestureHandler?;
    private touchGestureHandler?;
    private zoomControlController?;
    private isDestroyed;
    private isWheeling;
    private animationController;
    private supportsCSSZoom;
    private readonly _config;
    get config(): EnabledOptions;
    constructor(options?: SmoothPinchZoomOptions);
    private init;
    private setupPinchZoom;
    private setupWheelZoom;
    private clampZoom;
    private applyZoom;
    private applyDefaultZoom;
    setZoom(percentage: number): void;
    getZoom(): number;
    getMinZoom(): number;
    getMaxZoom(): number;
    resetZoom(): void;
    zoomIn(increment?: number): void;
    zoomOut(increment?: number): void;
    updateViewportConstraints(options: {
        minZoom?: number;
        maxZoom?: number;
        initialZoom?: number;
    }): void;
    animateZoom(targetPercentage: number, options?: {
        duration?: number;
        easing?: EasingFunction;
        onComplete?: () => void;
    }): Promise<void>;
    cancelAnimation(): void;
    isAnimating(): boolean;
    destroy(): void;
}

export { SmoothPinchZoom, ZoomEvents, SmoothPinchZoom as default };
export type { SmoothPinchZoomOptions, ZoomEvent, ZoomSource };
