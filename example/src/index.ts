import { SmoothPinchZoom } from 'smooth-pinch-zoom';
import type { SmoothPinchZoomOptions } from 'smooth-pinch-zoom';

let smoothZoom: SmoothPinchZoom;

document.addEventListener('DOMContentLoaded', function () {
  if (!SmoothPinchZoom.isSupported()) {
    const statusElement = document.getElementById('zoomStatus');
    if (statusElement) {
      statusElement.textContent =
        'Browser not fully supported - some features may not work';
      statusElement.style.color = '#ffcc00';
    }
  }

  const options: SmoothPinchZoomOptions = {
    wheelIncrement: 0.02,
    onZoomChange: function (_zoomLevel: number, percentage: number) {
      updateZoomDisplay(percentage);
    },
  };

  smoothZoom = new SmoothPinchZoom(options);

  window.addEventListener('smoothZoomChange', function (event: Event) {
    const customEvent = event as CustomEvent;
    const { percentage, source } = customEvent.detail;
    updateZoomStatus(`Zoomed via ${source}: ${percentage}%`);
  });

  window.addEventListener('smoothZoomApplied', function (event: Event) {
    const customEvent = event as CustomEvent;
    const { percentage } = customEvent.detail;
    updatePinchZoomStatus(percentage);
  });

  updateInputConstraints();
  setupFPSControl();
  updatePinchZoomStatus(100);
});

function updateZoomDisplay(percentage: number): void {
  const formattedPercentage = percentage.toFixed(2);
  const displayElement = document.getElementById('zoomDisplay');
  if (displayElement) {
    displayElement.textContent = formattedPercentage + '%';
  }
}

function updateZoomStatus(message: string): void {
  const statusEl = document.getElementById('zoomStatus');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.style.color = '#90EE90';

    setTimeout(() => {
      statusEl.textContent = 'Ready - Try pinching or Ctrl+scroll!';
      statusEl.style.color = '';
    }, 3000);
  }
}

function updateInputConstraints(): void {
  if (smoothZoom) {
    const minPercentage = smoothZoom.getMinZoom() * 100;
    const maxPercentage = smoothZoom.getMaxZoom() * 100;

    const input = document.getElementById('customZoom') as HTMLInputElement;
    if (input) {
      input.min = minPercentage.toString();
      input.max = maxPercentage.toString();
      input.placeholder = `${minPercentage} - ${maxPercentage}`;
    }
  }
}

async function zoomIn(): Promise<void> {
  if (smoothZoom) {
    const enableAnim = (
      document.getElementById('enableAnimations') as HTMLInputElement
    )?.checked;
    if (enableAnim) {
      const currentZoom = smoothZoom.getZoom();
      const duration = parseInt(
        (document.getElementById('animationDuration') as HTMLInputElement)
          ?.value || '500'
      );
      const easing =
        (document.getElementById('animationType') as HTMLSelectElement)
          ?.value || 'easeInOut';
      await smoothZoom.animateZoom(currentZoom + 10, {
        duration,
        easing: easing as any,
      });
    } else {
      smoothZoom.zoomIn(10);
    }
  }
}

async function zoomOut(): Promise<void> {
  if (smoothZoom) {
    const enableAnim = (
      document.getElementById('enableAnimations') as HTMLInputElement
    )?.checked;
    if (enableAnim) {
      const currentZoom = smoothZoom.getZoom();
      const duration = parseInt(
        (document.getElementById('animationDuration') as HTMLInputElement)
          ?.value || '500'
      );
      const easing =
        (document.getElementById('animationType') as HTMLSelectElement)
          ?.value || 'easeInOut';
      await smoothZoom.animateZoom(currentZoom - 10, {
        duration,
        easing: easing as any,
      });
    } else {
      smoothZoom.zoomOut(10);
    }
  }
}

async function resetZoom(): Promise<void> {
  if (smoothZoom) {
    const enableAnim = (
      document.getElementById('enableAnimations') as HTMLInputElement
    )?.checked;
    if (enableAnim) {
      const duration = parseInt(
        (document.getElementById('animationDuration') as HTMLInputElement)
          ?.value || '500'
      );
      const easing =
        (document.getElementById('animationType') as HTMLSelectElement)
          ?.value || 'easeInOut';
      await smoothZoom.animateZoom(100, {
        duration,
        easing: easing as any,
      });
    } else {
      smoothZoom.resetZoom();
    }
  }
}

async function minZoom(): Promise<void> {
  if (smoothZoom) {
    const enableAnim = (
      document.getElementById('enableAnimations') as HTMLInputElement
    )?.checked;
    if (enableAnim) {
      const minZoomLevel = smoothZoom.getMinZoom() * 100;
      const duration = parseInt(
        (document.getElementById('animationDuration') as HTMLInputElement)
          ?.value || '500'
      );
      const easing =
        (document.getElementById('animationType') as HTMLSelectElement)
          ?.value || 'easeInOut';
      await smoothZoom.animateZoom(minZoomLevel, {
        duration,
        easing: easing as any,
      });
    } else {
      smoothZoom.setZoom(smoothZoom.getMinZoom() * 100);
    }
  }
}

async function maxZoom(): Promise<void> {
  if (smoothZoom) {
    const enableAnim = (
      document.getElementById('enableAnimations') as HTMLInputElement
    )?.checked;
    if (enableAnim) {
      const maxZoomLevel = smoothZoom.getMaxZoom() * 100;
      const duration = parseInt(
        (document.getElementById('animationDuration') as HTMLInputElement)
          ?.value || '500'
      );
      const easing =
        (document.getElementById('animationType') as HTMLSelectElement)
          ?.value || 'easeInOut';
      await smoothZoom.animateZoom(maxZoomLevel, {
        duration,
        easing: easing as any,
      });
    } else {
      smoothZoom.setZoom(smoothZoom.getMaxZoom() * 100);
    }
  }
}

async function setCustomZoom(): Promise<void> {
  const input = document.getElementById('customZoom') as HTMLInputElement;
  if (!input) return;

  const value = parseFloat(input.value);

  if (isNaN(value)) {
    updateZoomStatus('Please enter a valid number');
    return;
  }

  if (!smoothZoom) return;

  const minPercentage = smoothZoom.getMinZoom() * 100;
  const maxPercentage = smoothZoom.getMaxZoom() * 100;

  if (value < minPercentage || value > maxPercentage) {
    updateZoomStatus(
      `Zoom must be between ${minPercentage.toFixed(
        2
      )}% and ${maxPercentage.toFixed(2)}%`
    );
    return;
  }

  const enableAnim = (
    document.getElementById('enableAnimations') as HTMLInputElement
  )?.checked;
  if (enableAnim) {
    const duration = parseInt(
      (document.getElementById('animationDuration') as HTMLInputElement)
        ?.value || '500'
    );
    const easing =
      (document.getElementById('animationType') as HTMLSelectElement)?.value ||
      'easeInOut';
    await smoothZoom.animateZoom(value, {
      duration,
      easing: easing as any,
    });
  } else {
    smoothZoom.setZoom(value);
  }
  input.value = '';
}

document
  .getElementById('customZoom')
  ?.addEventListener('keypress', function (e: KeyboardEvent) {
    if (e.key === 'Enter') {
      setCustomZoom();
    }
  });

window.addEventListener('beforeunload', function () {
  if (smoothZoom) {
    smoothZoom.destroy();
  }
});

function setupFPSControl(): void {
  const fpsInput = document.getElementById('targetFPS') as HTMLInputElement;
  if (fpsInput) {
    fpsInput.addEventListener('change', function () {
      const fps = parseInt(this.value);
      if (smoothZoom && (smoothZoom as any).animationController) {
        (smoothZoom as any).animationController.setTargetFPS(fps);
      }
    });
  }
}

function updatePinchZoomStatus(_percentage: number): void {
  const statusDisplay = document.getElementById('pinchStatusDisplay');
  if (!statusDisplay) return;

  const isCompatible = SmoothPinchZoom.isSupported();
  const isPinchEnabled =
    smoothZoom && (smoothZoom as any).enablePinchZoom && isCompatible;
  const currentZoom = smoothZoom ? smoothZoom.getZoom() : 1;
  const isZoomActive = Math.abs(currentZoom - 100) > 0.001;

  if (!isCompatible) {
    statusDisplay.innerHTML = `
      <div class="pinch-status-disabled">
        ❌ Pinch Zoom: DISABLED
      </div>
      <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
        Not supported by this browser. Use Ctrl+scroll or buttons.
      </p>
    `;
    return;
  }

  if (isPinchEnabled && !isZoomActive) {
    statusDisplay.innerHTML = `
      <div class="pinch-status-deactivated">
        ⚠️ Pinch Zoom: DEACTIVATED
      </div>
      <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
        Zoom at 100% - No zoom applied. Use Ctrl+scroll or buttons.
      </p>
    `;
    return;
  }

  if (isPinchEnabled && isZoomActive) {
    statusDisplay.innerHTML = `
      <div class="pinch-status-enabled">
        ✅ Pinch Zoom: ENABLED
      </div>
      <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
        Active zoom - You can use pinch gestures on trackpad and mobile
      </p>
    `;
    return;
  }

  statusDisplay.innerHTML = `
    <div class="pinch-status-disabled">
      ⚠️ Pinch Zoom: DEACTIVATED
    </div>
    <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
      Disabled for performance reasons. Use Ctrl+scroll or buttons.
    </p>
  `;
}

// Expose functions globally for HTML onclick handlers
(window as any).zoomIn = zoomIn;
(window as any).zoomOut = zoomOut;
(window as any).resetZoom = resetZoom;
(window as any).minZoom = minZoom;
(window as any).maxZoom = maxZoom;
(window as any).setCustomZoom = setCustomZoom;
