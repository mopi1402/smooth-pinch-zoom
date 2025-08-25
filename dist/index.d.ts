type ZoomSource = "pinch" | "wheel" | "api";
interface SmoothPinchZoomOptions {
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

type EasingType = "linear" | "easeInOut" | "easeOut" | "easeIn" | "spring" | "bounce" | "elastic" | "back";

declare class SmoothPinchZoom {
    private currentZoom;
    private minZoom;
    private maxZoom;
    private initialZoom;
    private wheelIncrement;
    private customZoomApplicator?;
    private onZoomChange?;
    private enableWheelZoom;
    private enablePinchZoom;
    private autoReadViewport;
    private useExperimentalCssZoom;
    private isPinching;
    private baseZoom;
    private wheelListener?;
    private visualViewportListener?;
    private mobilePinchHandler?;
    private isDestroyed;
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

export { SmoothPinchZoom, SmoothPinchZoom as default, enableSmoothPinchZoom };
export type { EasingType, SmoothPinchZoomOptions, ViewportValues, ZoomEvent };
