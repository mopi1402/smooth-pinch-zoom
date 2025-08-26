import { SmoothPinchZoomControls } from "../types/types";

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

  constructor(controls: SmoothPinchZoomControls) {
    this.controls = controls;
    this.element = this.createControl();
  }

  private _calcZoom(increment: number): number {
    const newZoom = this.controls.getZoom() + increment;
    return newZoom;
  }

  private _updateZoom(zoom: number): void {
    this.controls.animateZoom(zoom, {
      duration: 300,
      easing: "back",
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

    // Ajouter la logique de slider virtuel
    indicator.addEventListener("mousedown", (e) => this.startSliderMode(e));
    indicator.addEventListener("mouseup", () => this.stopSliderMode());
    indicator.addEventListener("mouseleave", () => this.stopSliderMode());

    return indicator;
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
    this.element.style.opacity = "1";
    this.element.style.transform = "translateX(-50%) scale(1)";
    this.element.style.backdropFilter = "blur(20px)";
    this.element.style.filter = "blur(0px)";
  }

  public hide(): void {
    this.element.style.opacity = "0";
    this.element.style.transform = "translateX(-50%) scale(0)";

    setTimeout(() => {
      this.element.style.backdropFilter = "blur(0px)";
      this.element.style.filter = "blur(20px)";
    }, 200);
  }

  public mount(container: HTMLElement = document.body): void {
    const zoomContainer = document.createElement("div");
    zoomContainer.className = "zoom-container";

    this.element.style.pointerEvents = "auto";

    zoomContainer.appendChild(this.element);
    document.documentElement.appendChild(zoomContainer);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private startSliderMode(event: MouseEvent): void {
    const indicator = this.element.querySelector(
      ".zoom-indicator"
    ) as HTMLElement;
    if (!indicator) return;

    const startX = event.screenX;
    let lastX = startX;

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.screenX;
      const diff = currentX - lastX;

      if (Math.abs(diff) > 2) {
        if (diff > 0) {
          this.controls.zoomIn(1);
        } else {
          this.controls.zoomOut(1);
        }
        lastX = currentX;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  private stopSliderMode(): void {
    // Cette méthode est appelée mais la logique est dans startSliderMode
  }

  public destroy(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
