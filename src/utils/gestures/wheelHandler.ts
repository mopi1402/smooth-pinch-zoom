export interface WheelGestureCallbacks {
  onStart?: (data: {
    event: WheelEvent;
    startElement: EventTarget | null;
    position: { x: number; y: number };
  }) => void;
  onWheel?: (data: {
    event: WheelEvent;
    startElement: EventTarget | null;
    currentElement: EventTarget;
    distance: number;
    adaptiveDelay: number;
    phase: "fast" | "normal" | "fine-tuning";
  }) => void;
  onEnd?: (data: {
    startElement: EventTarget | null;
    lastPosition: { x: number; y: number } | null;
  }) => void;
}

export interface WheelGestureOptions {
  maxLogicalDistance?: number;
  minDelay?: number;
  maxDelay?: number;
}

export class WheelGestureHandler {
  private element: Document;
  private isWheeling = false;
  private startElement: EventTarget | null = null;
  private lastEventTime = 0;
  private lastPosition: { x: number; y: number } | null = null;
  private timeout: number | null = null;

  private recentDeltas: number[] = [];
  private maxHistorySize = 5;

  private maxLogicalDistance: number;
  private minDelay: number;
  private maxDelay: number;

  private onStart: WheelGestureCallbacks["onStart"];
  private onWheel: WheelGestureCallbacks["onWheel"];
  private onEnd: WheelGestureCallbacks["onEnd"];

  constructor(
    element: Document = document,
    options: WheelGestureOptions = {},
    callbacks: WheelGestureCallbacks = {}
  ) {
    this.element = element;

    this.maxLogicalDistance = options.maxLogicalDistance || 100;
    this.minDelay = options.minDelay || 80;
    this.maxDelay = options.maxDelay || 300;

    this.onStart = callbacks.onStart;
    this.onWheel = callbacks.onWheel;
    this.onEnd = callbacks.onEnd;

    this.init();
  }

  private calculateDistance(
    pos1: { x: number; y: number },
    pos2: { x: number; y: number }
  ): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateAdaptiveDelay(): number {
    if (this.recentDeltas.length === 0) return this.maxDelay;

    const avgDelta =
      this.recentDeltas.reduce((a, b) => a + b, 0) / this.recentDeltas.length;

    let delay: number;

    if (avgDelta < 1) {
      delay = this.maxDelay;
    } else if (avgDelta > 10) {
      delay = this.minDelay;
    } else {
      const ratio = (10 - avgDelta) / 9;
      delay = this.minDelay + (this.maxDelay - this.minDelay) * ratio;
    }

    return Math.round(delay);
  }

  private getMovementPhase(): "fast" | "normal" | "fine-tuning" {
    if (this.recentDeltas.length === 0) return "normal";

    const avgDelta =
      this.recentDeltas.reduce((a, b) => a + b, 0) / this.recentDeltas.length;

    if (avgDelta < 2) return "fine-tuning";
    if (avgDelta > 8) return "fast";
    return "normal";
  }

  private detectNewGesture(event: WheelEvent): boolean {
    const now = performance.now();
    const currentPosition = { x: event.clientX, y: event.clientY };

    if (!this.isWheeling) {
      return true;
    }

    const adaptiveThreshold = this.calculateAdaptiveDelay() * 0.4;
    const timeSinceLastEvent = now - this.lastEventTime;

    if (timeSinceLastEvent > adaptiveThreshold) {
      return true;
    }

    if (this.lastPosition) {
      const distance = this.calculateDistance(
        this.lastPosition,
        currentPosition
      );
      const maxAcceptableDistance =
        this.maxLogicalDistance * Math.min(timeSinceLastEvent / 20, 2);

      if (distance > maxAcceptableDistance) {
        return true;
      }
    }

    return false;
  }

  private stopGesture(reason: string = "stopped"): void {
    if (this.isWheeling) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.onEnd?.({
        startElement: this.startElement,
        lastPosition: this.lastPosition,
      });
    }

    this.isWheeling = false;
    this.startElement = null;
    this.lastPosition = null;
    this.recentDeltas = [];
    this.lastEventTime = 0;
  }

  private init(): void {
    this.element.addEventListener(
      "wheel",
      (event: WheelEvent) => {
        if (!event.ctrlKey) {
          if (this.isWheeling) {
            this.stopGesture("no-ctrl");
          }
          return;
        }

        const now = performance.now();
        const currentPosition = { x: event.clientX, y: event.clientY };
        const deltaAbs = Math.abs(event.deltaY || event.deltaX);

        if (this.detectNewGesture(event)) {
          if (this.isWheeling) {
            if (this.timeout) {
              clearTimeout(this.timeout);
            }
            this.onEnd?.({
              startElement: this.startElement,
              lastPosition: this.lastPosition,
            });
          }

          this.isWheeling = true;
          this.startElement = event.target;
          this.lastPosition = currentPosition;
          this.recentDeltas = [];

          this.onStart?.({
            event,
            startElement: this.startElement,
            position: currentPosition,
          });
        }

        this.recentDeltas.push(deltaAbs);
        if (this.recentDeltas.length > this.maxHistorySize) {
          this.recentDeltas.shift();
        }

        const adaptiveDelay = this.calculateAdaptiveDelay();
        const phase = this.getMovementPhase();

        this.onWheel?.({
          event,
          startElement: this.startElement!,
          currentElement: event.target!,
          distance: this.lastPosition
            ? this.calculateDistance(this.lastPosition, currentPosition)
            : 0,
          adaptiveDelay,
          phase,
        });

        this.lastEventTime = now;
        this.lastPosition = currentPosition;

        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        this.timeout = window.setTimeout(() => {
          this.stopGesture("timeout");
        }, adaptiveDelay);
      },
      { passive: false }
    );

    this.element.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.key === "Control" && this.isWheeling) {
        this.stopGesture("ctrl-released");
      }
    });
  }

  public destroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.element.removeEventListener("wheel", this.init.bind(this));
    this.element.removeEventListener("keyup", this.init.bind(this));
  }
}
