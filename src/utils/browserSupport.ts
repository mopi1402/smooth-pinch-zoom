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

  static getSupportInfo(): {
    hasWindow: boolean;
    hasVisualViewport: boolean;
    hasAddEventListener: boolean;
    isFullySupported: boolean;
  } {
    return {
      hasWindow: this.hasWindow(),
      hasVisualViewport: this.hasVisualViewport(),
      hasAddEventListener: this.hasAddEventListener(),
      isFullySupported: this.isSupported(),
    };
  }
}
