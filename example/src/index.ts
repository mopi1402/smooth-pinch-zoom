import { SmoothPinchZoom } from 'smooth-pinch-zoom';
import type { SmoothPinchZoomOptions, ZoomSource } from 'smooth-pinch-zoom';
import maplibregl from 'maplibre-gl';
import { getEasingFunction } from 'pithos/animations/ease-functions';
import { EasingFunction } from 'pithos/types/animations/easing';

let smoothZoom: SmoothPinchZoom;

document.addEventListener('DOMContentLoaded', () => {
  const options: SmoothPinchZoomOptions = {
    wheelIncrement: 0.02,
    onZoomChange: (_zoomLevel, percentage) => updateZoomDisplay(percentage),
    shouldAllowZoom: (_source: ZoomSource, target?: EventTarget) =>
      !(
        target instanceof Element &&
        (target.closest('#map') || target.closest('.map-container'))
      ),
  };

  smoothZoom = new SmoothPinchZoom(options);

  window.addEventListener('smoothZoomChange', (event: Event) => {
    const { percentage, source } = (event as CustomEvent).detail;
    updateZoomStatus(`Zoomed via ${source}: ${percentage}%`);
  });

  window.addEventListener('smoothZoomApplied', (event: Event) => {
    const { percentage } = (event as CustomEvent).detail;
    updatePinchZoomStatus(percentage);
  });

  updateInputConstraints();
  setupFPSControl();
  updatePinchZoomStatus(100);
  initializeMapLibre();
});

function updateZoomDisplay(percentage: number): void {
  const displayElement = document.getElementById('zoomDisplay');
  if (displayElement) {
    displayElement.textContent = `${percentage.toFixed(2)}%`;
  }
}

function updateZoomStatus(message: string): void {
  const statusEl = document.getElementById('zoomStatus');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.style.color = '#90EE90';

  setTimeout(() => {
    statusEl.textContent = 'Ready - Try pinching or Ctrl+scroll!';
    statusEl.style.color = '';
  }, 3000);
}

function updateInputConstraints(): void {
  const minPercentage = smoothZoom.getMinZoom() * 100;
  const maxPercentage = smoothZoom.getMaxZoom() * 100;
  const input = document.getElementById('customZoom') as HTMLInputElement;

  if (input) {
    input.min = minPercentage.toString();
    input.max = maxPercentage.toString();
    input.placeholder = `${minPercentage} - ${maxPercentage}`;
  }
}

async function applyZoom(
  targetZoom: number | (() => number),
  animate: boolean
): Promise<void> {
  const zoomValue =
    typeof targetZoom === 'function' ? targetZoom() : targetZoom;

  if (animate) {
    const duration = parseInt(
      (document.getElementById('animationDuration') as HTMLInputElement)
        ?.value || '500'
    );
    const easing = getEasingFunction(
      (document.getElementById('animationType') as HTMLSelectElement)?.value ||
        'linear'
    );

    await smoothZoom.animateZoom(zoomValue, {
      duration,
      easing: easing as EasingFunction,
    });
  } else {
    smoothZoom.setZoom(zoomValue);
  }
}

function animationsEnabled(): boolean {
  return !!(document.getElementById('enableAnimations') as HTMLInputElement)
    ?.checked;
}

function zoomIn() {
  return applyZoom(() => smoothZoom.getZoom() + 10, animationsEnabled());
}
function zoomOut() {
  return applyZoom(() => smoothZoom.getZoom() - 10, animationsEnabled());
}
function resetZoom() {
  return applyZoom(100, animationsEnabled());
}
function minZoom() {
  return applyZoom(() => smoothZoom.getMinZoom() * 100, animationsEnabled());
}
function maxZoom() {
  return applyZoom(() => smoothZoom.getMaxZoom() * 100, animationsEnabled());
}

async function setCustomZoom(): Promise<void> {
  const input = document.getElementById('customZoom') as HTMLInputElement;
  if (!input) return;

  const value = parseFloat(input.value);
  if (isNaN(value)) {
    updateZoomStatus('Please enter a valid number');
    return;
  }

  const minPercentage = smoothZoom.getMinZoom() * 100;
  const maxPercentage = smoothZoom.getMaxZoom() * 100;
  if (value < minPercentage || value > maxPercentage) {
    updateZoomStatus(
      `Zoom must be between ${minPercentage.toFixed(2)}% and ${maxPercentage.toFixed(2)}%`
    );
    return;
  }

  await applyZoom(value, animationsEnabled());
  input.value = '';
}

document
  .getElementById('customZoom')
  ?.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') setCustomZoom();
  });

window.addEventListener('beforeunload', () => smoothZoom.destroy());

function setupFPSControl(): void {
  const fpsInput = document.getElementById('targetFPS') as HTMLInputElement;
  fpsInput?.addEventListener('change', function () {
    const fps = parseInt(this.value);
    (smoothZoom as any).animationController?.setTargetFPS(fps);
  });
}

function updatePinchZoomStatus(_percentage: number): void {
  const statusDisplay = document.getElementById('pinchStatusDisplay');
  if (!statusDisplay) return;

  const isZoomActive = Math.abs(smoothZoom.getZoom() - 100) > 0.001;

  if (smoothZoom.config.enablePinchZoom) {
    statusDisplay.innerHTML = isZoomActive
      ? `
        <div class="pinch-status-enabled">✅ Pinch Zoom: ENABLED</div>
        <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
          Active zoom - You can use pinch gestures on trackpad and mobile
        </p>`
      : `
        <div class="pinch-status-deactivated">⚠️ Pinch Zoom: DEACTIVATED</div>
        <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
          Zoom at 100% - No zoom applied. Use Ctrl+scroll or buttons.
        </p>`;
    return;
  }

  statusDisplay.innerHTML = `
    <div class="pinch-status-disabled">⚠️ Pinch Zoom: DEACTIVATED</div>
    <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
      Disabled for performance reasons. Use Ctrl+scroll or buttons.
    </p>`;
}

function initializeMapLibre(): void {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  const map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    },
    center: [7.357, 46.2303],
    zoom: 13,
    attributionControl: true as any,
  });

  map.on('load', () => {
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.FullscreenControl(), 'top-right');
  });
}

/* Expose globally */
Object.assign(window as any, {
  zoomIn,
  zoomOut,
  resetZoom,
  minZoom,
  maxZoom,
  setCustomZoom,
});
