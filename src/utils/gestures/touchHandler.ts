export class TouchGestureHandler {
  private element: Document;
  private initialDistance = 0;
  private initialScale = 1;
  private centerX = 0;
  private centerY = 0;
  private isPinching = false;
  private isZoomAllowed = false;
  private onPinchChange?: (
    scale: number,
    centerX: number,
    centerY: number
  ) => void;
  private onPinchStart?: () => void;
  private onPinchEnd?: () => void;
  private shouldAllowZoom?: (source: "pinch", target?: EventTarget) => boolean;

  constructor(
    element: Document = document,
    callbacks?: {
      onPinchChange?: (scale: number, centerX: number, centerY: number) => void;
      onPinchStart?: () => void;
      onPinchEnd?: () => void;
      shouldAllowZoom?: (source: "pinch", target?: EventTarget) => boolean;
    }
  ) {
    this.element = element;
    this.onPinchChange = callbacks?.onPinchChange;
    this.onPinchStart = callbacks?.onPinchStart;
    this.onPinchEnd = callbacks?.onPinchEnd;
    this.shouldAllowZoom = callbacks?.shouldAllowZoom;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.element.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
      {
        passive: false,
      }
    );
    this.element.addEventListener(
      "touchmove",
      this.handleTouchMove.bind(this),
      {
        passive: false,
      }
    );
    this.element.addEventListener("touchend", this.handleTouchEnd.bind(this), {
      passive: false,
    });
  }

  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 2) {
      if (this.shouldAllowZoom) {
        this.isZoomAllowed = this.shouldAllowZoom(
          "pinch",
          e.target || undefined
        );
        if (!this.isZoomAllowed) {
          return;
        }
      } else {
        this.isZoomAllowed = true;
      }

      this.isPinching = true;
      this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      this.initialScale = 1;

      this.centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      this.centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      this.onPinchStart?.();
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    if (e.touches.length === 2 && this.isPinching && this.isZoomAllowed) {
      e.preventDefault();

      const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
      const scaleChange = currentDistance / this.initialDistance;

      this.onPinchChange?.(scaleChange, this.centerX, this.centerY);
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    if (e.touches.length < 2 && this.isPinching) {
      this.isPinching = false;
      this.isZoomAllowed = false;
      this.onPinchEnd?.();
    }
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public setInitialScale(scale: number): void {
    this.initialScale = scale;
  }

  public destroy(): void {
    this.element.removeEventListener(
      "touchstart",
      this.handleTouchStart.bind(this)
    );
    this.element.removeEventListener(
      "touchmove",
      this.handleTouchMove.bind(this)
    );
    this.element.removeEventListener(
      "touchend",
      this.handleTouchEnd.bind(this)
    );
  }
}
