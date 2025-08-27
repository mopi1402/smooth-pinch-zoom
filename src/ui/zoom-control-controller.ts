import { ZoomControl } from "./zoom-control";
import { SmoothPinchZoomControls, ZoomEvents } from "../types/types";
import { EventDebouncerManager } from "pithos/performance/event-debouncer-manager";

export interface ZoomControlControllerOptions {
  delay?: number;
}

export class ZoomControlController {
  private eventManager: EventDebouncerManager;
  private zoomControl: ZoomControl;
  private isHovering = false;

  constructor(
    instance: SmoothPinchZoomControls,
    options: ZoomControlControllerOptions = {}
  ) {
    this.zoomControl = new ZoomControl(instance);

    this.eventManager = new EventDebouncerManager(
      () => this.zoomControl.hide(),
      options.delay ?? 3000
    );

    this.setupEventListeners();
    this.zoomControl.mount();
  }

  private setupEventListeners(): void {
    window.addEventListener(ZoomEvents.ZOOM_CHANGE, this.handleZoomUpdate);

    const element = this.zoomControl.getElement();
    if (element) {
      element.addEventListener("mouseenter", this.handleMouseEnter);
      element.addEventListener("mouseleave", this.handleMouseLeave);
    }
  }

  private handleZoomUpdate = (event: Event): void => {
    if (event.type === ZoomEvents.ZOOM_CHANGE) {
      const customEvent = event as CustomEvent;
      this.zoomControl.updateZoom(customEvent.detail?.zoomLevel || 1);
    }

    this.zoomControl.show();

    if (!this.isHovering) {
      this.eventManager.trigger();
    }
  };

  private handleMouseEnter = (): void => {
    this.isHovering = true;
    this.eventManager.cancel();
  };

  private handleMouseLeave = (): void => {
    this.isHovering = false;
    this.eventManager.trigger();
  };

  destroy(): void {
    window.removeEventListener(ZoomEvents.ZOOM_CHANGE, this.handleZoomUpdate);

    const element = this.zoomControl.getElement();
    if (element) {
      element.removeEventListener("mouseenter", this.handleMouseEnter);
      element.removeEventListener("mouseleave", this.handleMouseLeave);
    }

    this.eventManager.destroy();
    this.zoomControl.destroy();
  }
}
