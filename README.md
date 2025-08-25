# Smooth Pinch Zoom

A lightweight, performant JavaScript library that transforms pinch-to-zoom gestures into smooth, precise page-level zoom with continuous granularity.

## ✨ Features

- **🖱️ Smooth Wheel Zoom** - Ctrl+wheel zoom with customizable increment
- **📱 Pinch-to-Zoom** - Native touch gesture support for mobile devices
- **🎯 Precise Control** - Continuous zoom levels with min/max constraints
- **⚡ Performance Optimized** - GPU acceleration with `will-change: transform`
- **🎨 Customizable** - Flexible options for zoom behavior and styling
- **📱 Mobile First** - Optimized for touch devices and mobile browsers
- **🔧 TypeScript Ready** - Full TypeScript support with exported types
- **📦 Tree Shaking** - ES modules for optimal bundle size

## 🚀 Quick Start

### Installation

```bash
npm install smooth-pinch-zoom
```

### Basic Usage

```typescript
import SmoothPinchZoom from 'smooth-pinch-zoom';

const zoom = new SmoothPinchZoom({
  minZoom: 0.5,
  maxZoom: 3.0,
  wheelIncrement: 0.1
});
```

### Advanced Configuration

```typescript
import SmoothPinchZoom, { type SmoothPinchZoomOptions } from 'smooth-pinch-zoom';

const options: SmoothPinchZoomOptions = {
  minZoom: 0.5,
  maxZoom: 3.0,
  initialZoom: 1.2,
  wheelIncrement: 0.05,
  enableWheelZoom: true,
  enablePinchZoom: true,
  autoReadViewport: true,
  useExperimentalCssZoom: false,
  onZoomChange: (zoomLevel, percentage) => {
    console.log(`Zoom: ${percentage}%`);
  },
  customZoomApplicator: (zoomLevel) => {
    // Custom zoom implementation
    document.body.style.transform = `scale(${zoomLevel})`;
  }
};

const zoom = new SmoothPinchZoom(options);
```

## 📖 API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minZoom` | `number` | `0.5` | Minimum zoom level |
| `maxZoom` | `number` | `2.0` | Maximum zoom level |
| `initialZoom` | `number` | `1.0` | Starting zoom level |
| `wheelIncrement` | `number` | `0.02` | Zoom increment per wheel event |
| `enableWheelZoom` | `boolean` | `true` | Enable Ctrl+wheel zoom |
| `enablePinchZoom` | `boolean` | `true` | Enable pinch-to-zoom |
| `autoReadViewport` | `boolean` | `true` | Auto-read viewport meta tags |
| `useExperimentalCssZoom` | `boolean` | `false` | Use CSS zoom property if available |
| `onZoomChange` | `function` | - | Callback on zoom change |
| `customZoomApplicator` | `function` | - | Custom zoom implementation |

### Methods

#### `setZoom(percentage: number)`
Set zoom to specific percentage (50 = 50%, 200 = 200%)

#### `getZoom(): number`
Get current zoom percentage

#### `zoomIn(increment?: number)`
Zoom in by specified increment (default: 10%)

#### `zoomOut(increment?: number)`
Zoom out by specified increment (default: 10%)

#### `resetZoom()`
Reset zoom to initial level

#### `animateZoom(targetPercentage: number, options?)`
Animate to target zoom level

```typescript
await zoom.animateZoom(150, {
  duration: 500,
  easing: 'easeInOut',
  onComplete: () => console.log('Animation complete')
});
```

#### `destroy()`
Clean up event listeners and reset zoom

### Events

The library dispatches custom events you can listen to:

```typescript
window.addEventListener('smoothZoomChange', (e) => {
  const { zoomLevel, percentage, source } = e.detail;
  console.log(`Zoom changed to ${percentage}% via ${source}`);
});

window.addEventListener('smoothZoomApplied', (e) => {
  const { zoomLevel, percentage, isDefaultState } = e.detail;
  console.log(`Zoom applied: ${percentage}%`);
});
```

## 🎨 Styling

The library automatically applies CSS custom properties and transforms:

```css
:root {
  --zoom: 1; /* Current zoom level */
}

/* Custom styling based on zoom */
.zoom-aware-element {
  transform: scale(calc(1 / var(--zoom)));
}
```

## 📱 Browser Support

- **Modern Browsers** - Full support with GPU acceleration
- **Mobile Safari** - Native pinch-to-zoom support
- **Chrome/Edge** - Wheel zoom + touch support
- **Firefox** - Wheel zoom support

## 🔧 Development

### Build

```bash
npm run build
```

### Development

```bash
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by Pierre Moati**
