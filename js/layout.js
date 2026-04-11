function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function detectOrientation() {
  return window.innerWidth >= 760 ? "wide" : "compact";
}

export function buildLayoutContext(state, dom = null) {
  if (!dom?.canvas) {
    return {
      focusX: 0.5,
      focusY: 0.5,
      safeZone: { x: 0.08, y: 0.12, w: 0.84, h: 0.76 }
    };
  }

  const rect = dom.canvas.getBoundingClientRect();
  const aspect = rect.width / Math.max(rect.height, 1);
  const zoneHeight = aspect > 1.7 ? 0.64 : 0.76;
  const zoneY = (1 - zoneHeight) * 0.5;

  return {
    focusX: 0.5,
    focusY: 0.5,
    safeZone: {
      x: 0.08,
      y: zoneY,
      w: 0.84,
      h: clamp(zoneHeight, 0.56, 0.82)
    }
  };
}

export function applyLayoutToDom(state, dom) {
  const { uiRoot, settingsPanel } = dom;
  uiRoot.classList.toggle("settings-open", state.settingsOpen);
  uiRoot.classList.toggle("settings-closed", !state.settingsOpen);
  uiRoot.dataset.orientation = state.orientationMode;
  settingsPanel.setAttribute("aria-hidden", String(!state.settingsOpen));
}
