import { ViewportValues } from "../types/types";

export class ViewportParser {
  static parseViewportMeta(): ViewportValues {
    const result: ViewportValues = {
      initialScale: null,
      minimumScale: null,
      maximumScale: null,
      userScalable: true,
    };

    const viewportMeta = document.querySelector('meta[name="viewport"]');

    if (!viewportMeta) {
      return result;
    }

    const content = viewportMeta.getAttribute("content");
    if (!content) {
      return result;
    }

    const pairs = content.split(",").map((s) => s.trim());

    for (const pair of pairs) {
      const [key, value] = pair.split("=").map((s) => s.trim());

      switch (key) {
        case "initial-scale":
          result.initialScale = parseFloat(value);
          if (isNaN(result.initialScale)) result.initialScale = null;
          break;

        case "minimum-scale":
          result.minimumScale = parseFloat(value);
          if (isNaN(result.minimumScale)) result.minimumScale = null;
          break;

        case "maximum-scale":
          result.maximumScale = parseFloat(value);
          if (isNaN(result.maximumScale)) result.maximumScale = null;
          break;

        case "user-scalable":
          result.userScalable = value !== "no" && value !== "0";
          break;
      }
    }

    return result;
  }

  static hasViewportMeta(): boolean {
    return !!document.querySelector('meta[name="viewport"]');
  }

  static getViewportContent(): string | null {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    return viewportMeta?.getAttribute("content") || null;
  }
}
