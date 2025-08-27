import { DragDetector } from "pithos/gestures/drag-detector";
import { SmoothPinchZoomControls } from "../types/types";
import { easeOutBack } from "pithos/animations/ease-functions";
import { DragCallbacks } from "pithos/types/gestures/drag";
import { Nullable } from "pithos/types/common";

export interface ZoomControlOptions {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onClose?: () => void;
  onInstantZoomIn?: () => void;
  onInstantZoomOut?: () => void;
}

export class ZoomControl {
  private element: HTMLElement;
  private controls: SmoothPinchZoomControls;
  private dragDetector: Nullable<DragDetector> = null;

  constructor(controls: SmoothPinchZoomControls) {
    this.controls = controls;
    this.element = this.createControl();
    this.element.classList.add("hidden");
  }

  private _calcZoom(increment: number): number {
    return this.controls.getZoom() + increment;
  }

  private _updateZoom(zoom: number): void {
    this.controls.animateZoom(zoom, {
      duration: 300,
      easing: easeOutBack,
    });
  }

  private createControl(): HTMLElement {
    const control = document.createElement("div");
    control.className = "zoom-control";

    const zoomInBtn = this.createButton("+", () => {
      this._updateZoom(this._calcZoom(10));
    });

    const zoomIndicator = this.createZoomIndicator();

    const zoomOutBtn = this.createButton("−", () => {
      this._updateZoom(this._calcZoom(-10));
    });

    const separator = this.createSeparator();
    const separator2 = this.createSeparator();

    const resetBtn = this.createButton("↺", () => {
      this._updateZoom(100);
    });

    const closeBtn = this.createButton("×", () => {
      this.hide();
    });

    control.appendChild(zoomOutBtn);
    control.appendChild(zoomIndicator);
    control.appendChild(zoomInBtn);
    control.appendChild(separator);
    control.appendChild(resetBtn);
    control.appendChild(separator2);
    control.appendChild(closeBtn);

    return control;
  }

  private createButton(symbol: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = symbol;
    button.className = "zoom-control-button";
    button.onclick = onClick;
    return button;
  }

  private createZoomIndicator(): HTMLElement {
    const indicator = document.createElement("div");
    indicator.className = "zoom-indicator";
    this.initializeDragDetector(indicator);
    return indicator;
  }

  private initializeDragDetector(indicator: HTMLElement): void {
    const callbacks: DragCallbacks = {
      onDragLeft: (distance: number) => {
        this.controls.zoomOut(Math.min(distance * 0.5, 2));
      },
      onDragRight: (distance: number) => {
        this.controls.zoomIn(Math.min(distance * 0.5, 2));
      },
    };

    this.dragDetector = new DragDetector(callbacks, {
      threshold: 2,
      axis: "x",
      gestureType: "mouse",
      preventDefaultOnStart: true,
    });

    this.dragDetector.attachTo(indicator);
  }

  private createSeparator(): HTMLElement {
    const separator = document.createElement("div");
    separator.className = "zoom-separator";
    return separator;
  }

  public updateZoom(zoom: number): void {
    const indicator = this.element.querySelector(
      ".zoom-indicator"
    ) as HTMLElement;
    if (indicator) {
      const percentage = Math.round(zoom * 100);
      indicator.textContent = `${percentage}%`;
    }
  }

  public show(): void {
    this.element.classList.remove("hidden");
    this.element.classList.add("visible");
  }

  public hide(): void {
    this.element.classList.remove("visible");
    this.element.classList.add("hidden");
  }

  public mount(): void {
    const zoomContainer = document.createElement("div");
    zoomContainer.className = "zoom-container";

    this.element.style.pointerEvents = "auto";

    zoomContainer.appendChild(this.element);
    document.documentElement.appendChild(zoomContainer);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
    if (this.dragDetector) {
      this.dragDetector.destroy();
      this.dragDetector = null;
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
