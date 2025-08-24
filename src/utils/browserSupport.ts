export class BrowserSupport {
  static isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "visualViewport" in window &&
      "addEventListener" in document
    );
  }

  static hasVisualViewport(): boolean {
    return typeof window !== "undefined" && "visualViewport" in window;
  }

  static hasAddEventListener(): boolean {
    return typeof document !== "undefined" && "addEventListener" in document;
  }

  static hasWindow(): boolean {
    return typeof window !== "undefined";
  }

  static hasCSSZoom(): boolean {
    return typeof CSS !== "undefined" && CSS.supports("zoom", "1");
  }

  static getSupportInfo(): {
    hasWindow: boolean;
    hasVisualViewport: boolean;
    hasAddEventListener: boolean;
    hasCSSZoom: boolean;
    isFullySupported: boolean;
  } {
    return {
      hasWindow: this.hasWindow(),
      hasVisualViewport: this.hasVisualViewport(),
      hasAddEventListener: this.hasAddEventListener(),
      hasCSSZoom: this.hasCSSZoom(),
      isFullySupported: this.isSupported(),
    };
  }
}
