let smoothZoom;

// Initialize Smooth Pinch Zoom
document.addEventListener("DOMContentLoaded", function () {
  // Check support
  if (!SmoothPinchZoom.SmoothPinchZoom.isSupported()) {
    document.getElementById("zoomStatus").textContent =
      "Browser not fully supported - some features may not work";
    document.getElementById("zoomStatus").style.color = "#ffcc00";
  }

  // Initialize with custom options
  smoothZoom = new SmoothPinchZoom.SmoothPinchZoom({
    wheelIncrement: 0.02,
    useExperimentalCssZoom: false, // Disabled by default for optimal performance

    onZoomChange: function (zoomLevel, percentage) {
      updateZoomDisplay(percentage);
    },
  });

  // Listen to zoom change events
  window.addEventListener("smoothZoomChange", function (event) {
    const { percentage, source } = event.detail;
    updateZoomStatus(`Zoomed via ${source}: ${percentage}%`);
  });

  // Listen to zoom applied events (after DOM update)
  window.addEventListener("smoothZoomApplied", function (event) {
    const { percentage } = event.detail;
    updatePinchZoomStatus(percentage);
  });

  // Update input constraints based on actual zoom limits
  updateInputConstraints();

  // Setup FPS control
  setupFPSControl();

  // Update pinch zoom status display
  updatePinchZoomStatus(100);
});

// UI Update Functions
function updateZoomDisplay(percentage) {
  // Display with 2 decimal places for more precision
  const formattedPercentage = percentage.toFixed(2);
  document.getElementById("zoomDisplay").textContent =
    formattedPercentage + "%";
}

function updateZoomStatus(message) {
  const statusEl = document.getElementById("zoomStatus");
  statusEl.textContent = message;
  statusEl.style.color = "#90EE90";

  // Clear the message after 3 seconds
  setTimeout(() => {
    statusEl.textContent = "Ready - Try pinching or Ctrl+scroll!";
    statusEl.style.color = "";
  }, 3000);
}

function updateInputConstraints() {
  if (smoothZoom) {
    const minPercentage = smoothZoom.getMinZoom() * 100;
    const maxPercentage = smoothZoom.getMaxZoom() * 100;

    const input = document.getElementById("customZoom");
    input.min = minPercentage;
    input.max = maxPercentage;
    input.placeholder = `${minPercentage} - ${maxPercentage}`;
  }
}

// Control Functions
async function zoomIn() {
  if (smoothZoom) {
    const enableAnim = document.getElementById("enableAnimations").checked;
    if (enableAnim) {
      const currentZoom = smoothZoom.getZoom();
      const duration = parseInt(
        document.getElementById("animationDuration").value
      );
      const easing = document.getElementById("animationType").value;
      await smoothZoom.animateZoom(currentZoom + 10, {
        duration,
        easing,
      });
    } else {
      smoothZoom.zoomIn(10);
    }
  }
}

async function zoomOut() {
  if (smoothZoom) {
    const enableAnim = document.getElementById("enableAnimations").checked;
    if (enableAnim) {
      const currentZoom = smoothZoom.getZoom();
      const duration = parseInt(
        document.getElementById("animationDuration").value
      );
      const easing = document.getElementById("animationType").value;
      await smoothZoom.animateZoom(currentZoom - 10, {
        duration,
        easing,
      });
    } else {
      smoothZoom.zoomOut(10);
    }
  }
}

async function resetZoom() {
  if (smoothZoom) {
    const enableAnim = document.getElementById("enableAnimations").checked;
    if (enableAnim) {
      const duration = parseInt(
        document.getElementById("animationDuration").value
      );
      const easing = document.getElementById("animationType").value;
      await smoothZoom.animateZoom(100, {
        duration,
        easing,
      });
    } else {
      smoothZoom.resetZoom();
    }
  }
}

async function minZoom() {
  if (smoothZoom) {
    const enableAnim = document.getElementById("enableAnimations").checked;
    if (enableAnim) {
      const minZoomLevel = smoothZoom.getMinZoom() * 100;
      const duration = parseInt(
        document.getElementById("animationDuration").value
      );
      const easing = document.getElementById("animationType").value;
      await smoothZoom.animateZoom(minZoomLevel, {
        duration,
        easing,
      });
    } else {
      smoothZoom.setZoom(smoothZoom.getMinZoom() * 100);
    }
  }
}

async function maxZoom() {
  if (smoothZoom) {
    const enableAnim = document.getElementById("enableAnimations").checked;
    if (enableAnim) {
      const maxZoomLevel = smoothZoom.getMaxZoom() * 100;
      const duration = parseInt(
        document.getElementById("animationDuration").value
      );
      const easing = document.getElementById("animationType").value;
      await smoothZoom.animateZoom(maxZoomLevel, {
        duration,
        easing,
      });
    } else {
      smoothZoom.setZoom(smoothZoom.getMaxZoom() * 100);
    }
  }
}

async function setCustomZoom() {
  const input = document.getElementById("customZoom");
  const value = parseFloat(input.value);

  if (isNaN(value)) {
    updateZoomStatus("Please enter a valid number");
    return;
  }

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

  if (smoothZoom) {
    const enableAnim = document.getElementById("enableAnimations").checked;
    if (enableAnim) {
      const duration = parseInt(
        document.getElementById("animationDuration").value
      );
      const easing = document.getElementById("animationType").value;
      await smoothZoom.animateZoom(value, {
        duration,
        easing,
      });
    } else {
      smoothZoom.setZoom(value);
    }
    input.value = "";
  }
}

// Enter key support for custom zoom
document
  .getElementById("customZoom")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      setCustomZoom();
    }
  });

// Cleanup on page unload
window.addEventListener("beforeunload", function () {
  if (smoothZoom) {
    smoothZoom.destroy();
  }
});

function setupFPSControl() {
  const fpsInput = document.getElementById("targetFPS");
  fpsInput.addEventListener("change", function () {
    const fps = parseInt(this.value);
    if (smoothZoom && smoothZoom.animationController) {
      smoothZoom.animationController.setTargetFPS(fps);
    }
  });
}

function updatePinchZoomStatus(percentage) {
  const statusDisplay = document.getElementById("pinchStatusDisplay");

  // Check compatibility and state
  const isCompatible = SmoothPinchZoom.SmoothPinchZoom.isSupported();
  const isPinchEnabled =
    smoothZoom && smoothZoom.enablePinchZoom && isCompatible;
  const currentZoom = smoothZoom ? smoothZoom.getZoom() : 1;
  const isZoomActive = Math.abs(currentZoom - 100) > 0.001;

  // State 1: DISABLED (not compatible)
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

  // State 2: DEACTIVATED (zoom at 100%)
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

  // State 3: ENABLED (active zoom)
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

  // Default state: DEACTIVATED (manually disabled)
  statusDisplay.innerHTML = `
    <div class="pinch-status-disabled">
      ⚠️ Pinch Zoom: DEACTIVATED
    </div>
    <p style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.9rem;">
      Disabled for performance reasons. Use Ctrl+scroll or buttons.
    </p>
  `;
}
