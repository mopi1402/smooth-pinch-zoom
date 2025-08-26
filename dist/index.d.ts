type EasingType = "linear" | "easeInOut" | "easeOut" | "easeIn" | "spring" | "bounce" | "elastic" | "back";

type ZoomSource = "pinch" | "wheel" | "api";
declare enum ZoomEvents {
    ZOOM_CHANGE = "smoothZoomChange",
    ZOOM_APPLIED = "smoothZoomApplied"
}
interface ZoomAnimationOptions {
    duration?: number;
    easing?: EasingType;
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
interface SmoothPinchZoomOptions {
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
    shouldAllowZoom?: (source: ZoomSource, target?: EventTarget) => boolean;
}
interface ZoomEvent {
    zoomLevel: number;
    percentage: number;
    source: ZoomSource;
}
interface ViewportValues {
    initialScale: number | null;
    minimumScale: number | null;
    maximumScale: number | null;
    userScalable: boolean;
}

declare class SmoothPinchZoom implements SmoothPinchZoomControls {
    private currentZoom;
    private minZoom;
    private maxZoom;
    private initialZoom;
    private wheelIncrement;
    private customZoomApplicator?;
    private onZoomChange?;
    private enableWheelZoom;
    private enablePinchZoom;
    private enableZoomControl;
    private autoReadViewport;
    private useExperimentalCssZoom;
    private shouldAllowZoom?;
    private baseZoom;
    private wheelListener?;
    private wheelGestureHandler?;
    private touchGestureHandler?;
    private zoomControlController?;
    private visualViewportListener?;
    private isDestroyed;
    private isWheeling;
    private viewportValues;
    private animationController;
    private supportsCSSZoom;
    constructor(options?: SmoothPinchZoomOptions);
    private init;
    private setupPinchZoom;
    private setupWheelZoom;
    private clampZoom;
    private applyZoom;
    private applyDefaultZoom;
    private getCurrentAppliedZoom;
    setZoom(percentage: number): void;
    getZoom(): number;
    getMinZoom(): number;
    getMaxZoom(): number;
    resetZoom(): void;
    zoomIn(increment?: number): void;
    zoomOut(increment?: number): void;
    getViewportValues(): ViewportValues;
    updateViewportConstraints(options: {
        minZoom?: number;
        maxZoom?: number;
        initialZoom?: number;
    }): void;
    refreshViewportMeta(): void;
    animateZoom(targetPercentage: number, options?: {
        duration?: number;
        easing?: EasingType;
        onComplete?: () => void;
    }): Promise<void>;
    cancelAnimation(): void;
    isAnimating(): boolean;
    static isSupported(): boolean;
    destroy(): void;
}
declare function enableSmoothPinchZoom(options?: SmoothPinchZoomOptions): SmoothPinchZoom;

export { SmoothPinchZoom, ZoomEvents, SmoothPinchZoom as default, enableSmoothPinchZoom };
export type { EasingType, SmoothPinchZoomOptions, ViewportValues, ZoomEvent, ZoomSource };
