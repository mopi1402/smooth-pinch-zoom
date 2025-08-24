# 🎯 Smooth Pinch Zoom

Transform pinch-to-zoom gestures into smooth, precise page-level zoom with **continuous granularity**.

Unlike browser zoom that jumps between fixed levels (100%, 125%, 150%), this library provides **surgical precision** - zoom to exactly 137%, 63%, or any percentage you want!

## ✨ Features

- 🎯 **Continuous precision**: Zoom to any percentage (137%, 63%, 142.5%)
- 📱 **Cross-platform**: Works on desktop trackpads, mobile touch, and tablets
- 🖱️ **Multiple input methods**: Pinch gestures + Ctrl+scroll wheel
- 🛡️ **Accessibility friendly**: Preserves native browser zoom (Ctrl+/-)
- 🚀 **Zero dependencies**: Lightweight vanilla JavaScript/TypeScript
- 🎛️ **Highly configurable**: Custom zoom ranges, callbacks, and behaviors
- 🧹 **Memory safe**: Proper cleanup and event listener management

## 📦 Installation

```bash
npm install smooth-pinch-zoom
```

## 🚀 Quick Start

### ES Modules (Recommended)

```javascript
import { enableSmoothPinchZoom } from "smooth-pinch-zoom";

// Enable with default settings
const zoom = enableSmoothPinchZoom();

// Listen to zoom changes
window.addEventListener("smoothZoomChange", (e) => {
  console.log(`Zoom: ${e.detail.percentage}%`);
});
```

### CommonJS

```javascript
const { enableSmoothPinchZoom } = require("smooth-pinch-zoom");

const zoom = enableSmoothPinchZoom({
  minZoom: 0.5, // 50%
  maxZoom: 3.0, // 300%
});
```

### UMD (Browser)

```html
<script src="https://unpkg.com/smooth-pinch-zoom/dist/index.umd.js"></script>
<script>
  const zoom = SmoothPinchZoom.enableSmoothPinchZoom();
</script>
```

## 🎛️ Advanced Configuration

```javascript
import SmoothPinchZoom from "smooth-pinch-zoom";

const zoom = new SmoothPinchZoom({
  // Zoom range
  minZoom: 0.25, // 25% minimum
  maxZoom: 5.0, // 500% maximum

  // Precision
  wheelIncrement: 0.005, // 0.5% per wheel scroll (finer control)

  // Features
  enablePinchZoom: true, // Touch/trackpad pinch
  enableWheelZoom: true, // Ctrl + scroll wheel
  useExperimentalCssZoom: false, // CSS zoom (may cause rendering delays)

  // Callbacks
  onZoomChange: (zoomLevel, percentage) => {
    console.log(`Zoomed to ${percentage}%`);
    updateUI(percentage);
  },

  // Custom zoom implementation
  customZoomApplicator: (zoomLevel) => {
    // Apply zoom to specific element instead of whole page
    document.getElementById("map").style.zoom = zoomLevel;
  },
});
```

## 🎮 API Reference

### Class: `SmoothPinchZoom`

#### Constructor Options

| Option                      | Type     | Default | Description                     |
| --------------------------- | -------- | ------- | ------------------------------- |
| `minZoom`                   | number   | 0.25    | Minimum zoom level (25%)        |
| `maxZoom`                   | number   | 5.0     | Maximum zoom level (500%)       |
| `wheelIncrement`            | number   | 0.01    | Zoom step for wheel scroll (1%) |
| `enablePinchZoom`           | boolean  | true    | Enable touch/trackpad pinch     |
| `enableWheelZoom`           | boolean  | true    | Enable Ctrl+wheel zoom          |
| `useExperimentalCssZoom` ⚠️ | boolean  | false   | Enable CSS zoom (experimental)  |
| `onZoomChange`              | function | -       | Callback for zoom changes       |
| `customZoomApplicator`      | function | -       | Custom zoom implementation      |

#### Methods

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

## 🎯 Use Cases

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

## 📱 Mobile Considerations

Add this meta tag to prevent default pinch behavior:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, user-scalable=no"
/>
```

Or use CSS:

```css
html {
  touch-action: manipulation;
}
```

## 🐛 Troubleshooting

**Pinch gestures not working?**

- Ensure `user-scalable=no` in viewport meta tag
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

## 🚀 Contributing

Contributions welcome! Please check the [GitHub repository](https://github.com/yourusername/smooth-pinch-zoom).

## 📄 License

MIT License - feel free to use in your projects!
