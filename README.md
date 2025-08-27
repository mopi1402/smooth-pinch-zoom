# 🎯 Smooth Pinch Zoom

[![npm version](https://img.shields.io/npm/v/smooth-pinch-zoom)](https://www.npmjs.com/package/smooth-pinch-zoom)
[![Bundle size](https://img.shields.io/badge/bundle%20size-~12%20kB-blue)](https://bundlephobia.com/result?p=smooth-pinch-zoom)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/demo-live%20demo-green)](https://smooth-pinch-zoom-demo.vercel.app/)

Transform pinch-to-zoom gestures into smooth, precise page-level zoom with **continuous granularity**.

Unlike browser zoom that jumps between fixed levels (100%, 125%, 150%), this library provides **surgical precision** - zoom to exactly 137%, 63%, or any percentage you want!

**Replaces the magnifying glass effect** with clean, coherent page-level zoom that keeps your interface usable at any zoom level.

## 🌐 Live Demo

**[Try it now!](https://smooth-pinch-zoom-demo.vercel.app/)** - Experience surgical precision zoom in action!

Test all features: pinch gestures, wheel zoom, animations, and custom zoom levels. See how smooth and precise the zoom really is!

## ✨ Features

- 🎯 **Continuous precision**: Zoom to any percentage (137%, 63%, 142.5%)
- 📱 **Cross-platform**: Works on desktop trackpads, mobile touch, and tablets
- 🖱️ **Multiple input methods**: Pinch gestures + Ctrl+scroll wheel
- 🛡️ **Accessibility friendly**: Preserves native browser zoom (Ctrl+/-)
- 🚀 **Zero dependencies**: Lightweight vanilla JavaScript/TypeScript
- 🎛️ **Highly configurable**: Custom zoom ranges, callbacks, and behaviors
- 🧹 **Memory safe**: Proper cleanup and event listener management

## ♿ Accessibility

This library is **fully accessible** and preserves all native browser accessibility features:

- ✅ **Screen readers**: Works seamlessly with assistive technologies
- ✅ **Keyboard navigation**: Ctrl+/- shortcuts remain functional
- ✅ **Zoom preferences**: Respects user's browser zoom settings
- ✅ **WCAG compliant**: Meets accessibility standards

## 📦 Installation

```bash
npm install smooth-pinch-zoom
```

## 🚀 Quick Start

### 1. Choose Your Import Method

- ES Modules (Recommended)

```javascript
import { enableSmoothPinchZoom } from "smooth-pinch-zoom";

// Enable with default settings
const zoom = enableSmoothPinchZoom();

// Listen to zoom changes
window.addEventListener("smoothZoomChange", (e) => {
  console.log(`Zoom: ${e.detail.percentage}%`);
});
```

- UMD (Browser)

```html
<script src="https://unpkg.com/smooth-pinch-zoom/dist/index.umd.js"></script>
<script>
  const zoom = SmoothPinchZoom.enableSmoothPinchZoom();
</script>
```

### 2. CSS Setup

**Important**: You must declare the CSS variable `--zoom` in your CSS:

```css
:root {
  --zoom: 1;
}
```

This variable will be automatically updated by the library to reflect the current zoom level.

## 🚀 Basic Examples

### Simple Implementation

```javascript
import { enableSmoothPinchZoom } from "smooth-pinch-zoom";

// Basic usage with defaults
const zoom = enableSmoothPinchZoom();

// Listen to zoom changes
window.addEventListener("smoothZoomChange", (e) => {
  console.log(`Zoom: ${e.detail.percentage}%`);
});
```

### Custom Zoom Range

```javascript
const zoom = enableSmoothPinchZoom({
  minZoom: 0.5, // 50% minimum
  maxZoom: 3.0, // 300% maximum
  wheelIncrement: 0.01, // 1% per scroll
});
```

### With Callbacks

```javascript
const zoom = enableSmoothPinchZoom({
  onZoomChange: (zoomLevel, percentage) => {
    console.log(`Zoomed to ${percentage}%`);
    updateZoomIndicator(percentage);
  },
});
```

### With Zoom Guard

```javascript
const zoom = enableSmoothPinchZoom({
  shouldAllowZoom: (source, target) => {
    // Block zoom on map elements
    if (target && target.closest(".map-container")) {
      return false;
    }
    return true;
  },
});
```

## 🎯 Next Steps

Now that you have the basics, you can:

1. **Customize zoom ranges** - Adjust `minZoom` and `maxZoom`
2. **Add callbacks** - Use `onZoomChange` to update your UI
3. **Explore advanced options** - See the full configuration below
4. **Check the demo** - Try the interactive examples

## 🎛️ Advanced Configuration

### Configuration Priority

The library follows this priority order for configuration:

1. **Library Configuration** (highest priority) - Options passed to `SmoothPinchZoom()`
2. **Viewport Meta Tag** - `user-scalable=no` to disable browser zoom
3. **Default Values** (lowest priority) - Built-in fallbacks

## 🎨 SCSS Utilities

The library provides SCSS utility functions for automatic zoom management:

- **`z-clamp()`** - Create responsive `clamp()` values that adapt to zoom
- **`z-fixed()`** - Keep elements at fixed size regardless of zoom
- **`z-100vh()`** and **`z-100vw()`** - Fullscreen dimensions that adapt to zoom

**Quick example:**

```scss
@use "smooth-pinch-zoom/scss" as *;

.my-element {
  padding: z-clamp(0.5rem, 1rem, 2rem);
  width: z-fixed(200px);
  height: z-100vh(-60px);
}
```

**For detailed documentation, examples, and advanced usage, see the [SCSS README](src/scss/README.md).**

### Constructor Options

| Option                      | Type     | Default | Description                             |
| --------------------------- | -------- | ------- | --------------------------------------- |
| `minZoom`                   | number   | 0.25    | Minimum zoom level (25%)                |
| `maxZoom`                   | number   | 5.0     | Maximum zoom level (500%)               |
| `wheelIncrement`            | number   | 0.01    | Zoom step for wheel scroll (1%)         |
| `enablePinchZoom`           | boolean  | true    | Enable touch/trackpad pinch             |
| `enableWheelZoom`           | boolean  | true    | Enable Ctrl+wheel zoom                  |
| `enableZoomControl`         | boolean  | true    | Enable zoom control UI component        |
| `enableLocalStorage`        | boolean  | true    | Enable zoom persistence in localStorage |
| `useExperimentalCssZoom` ⚠️ | boolean  | false   | Enable CSS zoom (experimental)          |
| `onZoomChange`              | function | -       | Callback for zoom changes               |
| `shouldAllowZoom`           | function | -       | Guard to control when zoom is allowed   |
| `customZoomApplicator`      | function | -       | Custom zoom implementation              |

### All Methods

```javascript
// Programmatic control
zoom.setZoom(137); // Set to exactly 137%
zoom.getZoom(); // Get current zoom percentage
zoom.resetZoom(); // Reset to 100%

zoom.zoomIn(15); // Zoom in by 15%
zoom.zoomOut(10); // Zoom out by 10%

// Lifecycle
zoom.destroy(); // Clean up and reset

// Static methods
SmoothPinchZoom.isSupported(); // Check browser support
```

### Events

Listen to the global `smoothZoomChange` event:

```javascript
window.addEventListener("smoothZoomChange", (event) => {
  const { zoomLevel, percentage, source } = event.detail;
  console.log(`${source} zoom: ${percentage}%`);
});
```

## 🎯 Common Use Cases

### Interactive Maps

Perfect for map applications where users need precise zoom control:

```javascript
const mapZoom = enableSmoothPinchZoom({
  minZoom: 0.1, // Zoom out to see whole world
  maxZoom: 10, // Zoom in to street level
  customZoomApplicator: (zoom) => {
    mapContainer.style.zoom = zoom;
    updateMapTiles(zoom);
  },
});
```

### Image Viewers

For applications requiring precise image inspection:

```javascript
const imageZoom = new SmoothPinchZoom({
  maxZoom: 8, // 800% for detailed inspection
  wheelIncrement: 0.02, // 2% per scroll for fine control
  onZoomChange: (level, percent) => {
    updateZoomIndicator(percent);
  },
});
```

### Accessibility Enhancement

Provide smooth zoom while preserving browser accessibility:

```javascript
// This replaces pinch-zoom behavior but keeps Ctrl+/- working
enableSmoothPinchZoom({
  onZoomChange: (level, percent) => {
    // Update your app's zoom indicator
    document.querySelector(".zoom-level").textContent = `${percent}%`;
  },
});
```

## 📚 API Reference

### Quick Methods

```javascript
// Essential methods you'll use most
zoom.setZoom(137); // Set to exactly 137%
zoom.getZoom(); // Get current zoom percentage
zoom.resetZoom(); // Reset to 100%
zoom.destroy(); // Clean up and reset
```

## 🔧 Browser Support

- ✅ Chrome 61+
- ✅ Firefox 91+
- ✅ Safari 13+
- ✅ Edge 79+
- ✅ Mobile browsers with VisualViewport API

**Feature Detection:**

```javascript
if (SmoothPinchZoom.isSupported()) {
  enableSmoothPinchZoom();
} else {
  console.warn("Smooth pinch zoom not supported");
}
```

## 🤔 Why Use This?

**Browser zoom limitations:**

- Fixed steps: 25%, 33%, 50%, 67%, 75%, 90%, 100%, 110%, 125%, 150%, etc.
- Can't zoom to 137% or 63% precisely

**Pinch-to-zoom problems:**

- Acts like a magnifying glass
- UI elements fall off screen
- Interface becomes unusable

**This library's solution:**

- ✅ Continuous precision: Any percentage you want
- ✅ Clean page-level zoom: Interface stays coherent
- ✅ Best of both worlds: Smooth gestures + proper zoom behavior
- ✅ Performance optimized: Uses `transform: scale()` by default
- ✅ No rendering delays: Smooth 60fps zoom experience

## ⚡ Performance Options

### CSS Zoom vs Transform

The library offers two zoom implementation strategies:

**Default (Recommended): `useExperimentalCssZoom: false`**

- Uses `transform: scale()` everywhere
- **Optimal performance** and smooth rendering
- **No rendering delays** or visual glitches
- Works consistently across all browsers

**Experimental: `useExperimentalCssZoom: true`**

- Uses CSS `zoom` property on supported browsers
- **May cause rendering delays** and performance issues
- **Known bug**: Elements can take time to render after zoom
- Only enable if you specifically need CSS zoom behavior

```javascript
// Performance optimized (default)
const zoom = new SmoothPinchZoom({
  useExperimentalCssZoom: false, // Uses transform: scale()
});

// Experimental mode (may have performance issues)
const zoom = new SmoothPinchZoom({
  useExperimentalCssZoom: true, // Uses CSS zoom where supported
});
```

### Why Transform is Better

- **Hardware acceleration**: `transform` is GPU-accelerated
- **No layout recalculation**: Only visual transformation
- **Smooth animations**: 60fps rendering guaranteed
- **Cross-browser consistency**: Same behavior everywhere

## 🐛 Troubleshooting

**Pinch gestures not working?**

- Check that VisualViewport API is supported

**Zoom too sensitive?**

- Reduce `wheelIncrement` (try 0.005 for finer control)
- Adjust `minZoom`/`maxZoom` range

**Layout issues?**

- Use `customZoomApplicator` to target specific elements
- Test with different CSS zoom vs transform approaches

**Rendering delays or slow zoom?**

- This is a known issue with CSS `zoom` property on some browsers
- **Solution**: Keep `useExperimentalCssZoom: false` (default)
- The library automatically uses `transform: scale()` for optimal performance

## 🎮 Demo

Try the live demo to see smooth-pinch-zoom in action:

```bash
cd example
npm install
npm start
```

The demo showcases all features with interactive examples and responsive design.

## 🚀 Contributing

Contributions welcome! Please check the [GitHub repository](https://github.com/mopi1402/smooth-pinch-zoom).

## 📄 License

MIT License - feel free to use in your projects!
