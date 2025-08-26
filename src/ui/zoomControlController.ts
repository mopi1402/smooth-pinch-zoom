import { debounce } from "../utils/debouncer";
import { ZoomControl } from "./zoomControl";
import { SmoothPinchZoomControls, ZoomEvents } from "../types/types";

export interface ZoomControlControllerOptions {
  delay?: number;
}

export class ZoomControlController {
  private debouncer: ReturnType<typeof debounce>;
  private zoomControl: ZoomControl;
  private isHovering = false;
  private mouseOverHandler: () => void = () => {};
  private mouseOutHandler: (event: MouseEvent) => void = () => {};

  constructor(
    instance: SmoothPinchZoomControls,
    options: ZoomControlControllerOptions = {}
  ) {
    const { delay = 3000 } = options;

    this.debouncer = debounce(() => {
      if (!this.isHovering) {
        this.zoomControl.hide();
      }
    }, delay);

    this.zoomControl = new ZoomControl(instance);
    this.setupEventListeners();
    this.zoomControl.mount();
  }

  private setupEventListeners(): void {
    window.addEventListener(
      ZoomEvents.ZOOM_CHANGE,
      this.handleZoomEvent.bind(this)
    );

    const element = this.zoomControl.getElement();

    this.mouseOverHandler = () => {
      this.isHovering = true;
      this.debouncer.destroy();
    };

    this.mouseOutHandler = (event: MouseEvent) => {
      if (!element.contains(event.relatedTarget as Node)) {
        this.isHovering = false;
        this.debouncer.trigger();
      }
    };

    element.addEventListener("mouseover", this.mouseOverHandler);
    element.addEventListener("mouseout", this.mouseOutHandler);
  }

  private handleZoomEvent(event: Event): void {
    if (event.type === ZoomEvents.ZOOM_CHANGE) {
      const customEvent = event as CustomEvent;
      this.zoomControl.updateZoom(customEvent.detail?.zoomLevel || 1);
    }

    this.zoomControl.show();
    this.debouncer.trigger();
  }

  public destroy(): void {
    this.debouncer.destroy();
    this.zoomControl.destroy();

    window.removeEventListener(
      ZoomEvents.ZOOM_CHANGE,
      this.handleZoomEvent.bind(this)
    );

    const element = this.zoomControl.getElement();
    element.removeEventListener("mouseover", this.mouseOverHandler);
    element.removeEventListener("mouseout", this.mouseOutHandler);
  }
}
