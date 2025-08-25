declare class p {
    static isSupported(): boolean;
    constructor(t?: {});
    currentZoom: any;
    isPinching: boolean;
    baseZoom: number;
    isDestroyed: boolean;
    autoReadViewport: any;
    viewportValues: {
        initialScale: any;
        minimumScale: any;
        maximumScale: any;
        userScalable: boolean;
    };
    minZoom: any;
    maxZoom: any;
    initialZoom: any;
    wheelIncrement: any;
    customZoomApplicator: any;
    onZoomChange: any;
    enableWheelZoom: any;
    enablePinchZoom: any;
    useExperimentalCssZoom: any;
    animationController: e;
    supportsCSSZoom: boolean;
    init(): void;
    setupPinchZoom(): void;
    mobilePinchHandler: d;
    setupWheelZoom(): void;
    wheelListener: (t: any) => void;
    clampZoom(t: any): number;
    applyZoom(t: any, e: any): void;
    applyDefaultZoom(t: any): void;
    getCurrentAppliedZoom(): number;
    setZoom(t: any): void;
    getZoom(): number;
    getMinZoom(): any;
    getMaxZoom(): any;
    resetZoom(): void;
    zoomIn(t?: number): void;
    zoomOut(t?: number): void;
    getViewportValues(): {
        initialScale: any;
        minimumScale: any;
        maximumScale: any;
        userScalable: boolean;
    };
    updateViewportConstraints(t: any): void;
    refreshViewportMeta(): void;
    animateZoom(t: any, e?: {}): Promise<any>;
    cancelAnimation(): void;
    isAnimating(): boolean;
    destroy(): void;
}
declare function v(t: any): p;
declare class e {
    targetFPS: number;
    frameInterval: number;
    animate(e: any, i: any, o?: {}): Promise<any>;
    currentAnimation: {
        isActive: boolean;
        startValue: any;
        targetValue: any;
        currentValue: any;
        duration: any;
    };
    animationFrameId: any;
    cancel(): void;
    isAnimating(): boolean;
    setTargetFPS(t: any): void;
    getTargetFPS(): number;
    destroy(): void;
}
declare class d {
    constructor(t: Document, e: any);
    initialDistance: number;
    initialScale: number;
    centerX: number;
    centerY: number;
    isPinching: boolean;
    element: Document;
    onPinchChange: any;
    onPinchStart: any;
    onPinchEnd: any;
    bindEvents(): void;
    handleTouchStart(t: any): void;
    handleTouchMove(t: any): void;
    handleTouchEnd(t: any): void;
    getDistance(t: any, e: any): number;
    setInitialScale(t: any): void;
    destroy(): void;
}
export { p as SmoothPinchZoom, p as default, v as enableSmoothPinchZoom };
//# sourceMappingURL=index.esm.d.ts.map