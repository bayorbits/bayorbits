function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function detectOrientation() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return w >= 900 && w >= h ? "horizontal" : "vertical";
}

export function buildLayoutContext(state) {
  const orientationMode = state.orientationMode;
  const split = state.verticalSplitRatio;

  if (orientationMode === "horizontal") {
    return state.settingsOpen
      ? {
          focusX: 0.81,
          focusY: 0.45,
          safeZone: { x: 0.58, y: 0.1, w: 0.38, h: 0.78 }
        }
      : {
          focusX: 0.74,
          focusY: 0.45,
          safeZone: { x: 0.42, y: 0.08, w: 0.52, h: 0.82 }
        };
  }

  return {
    focusX: 0.52,
    focusY: split * 0.48,
    safeZone: { x: 0.08, y: 0.06, w: 0.84, h: Math.max(split - 0.09, 0.28) }
  };
}

export function applyLayoutToDom(state, dom) {
  const { uiRoot, chatPanel, settingsPanel, splitDivider } = dom;
  uiRoot.classList.toggle("horizontal", state.orientationMode === "horizontal");
  uiRoot.classList.toggle("vertical", state.orientationMode === "vertical");
  uiRoot.classList.toggle("settings-open", state.settingsOpen);
  uiRoot.classList.toggle("settings-closed", !state.settingsOpen);

  if (state.orientationMode === "vertical" && !state.settingsOpen) {
    const splitPx = Math.round(window.innerHeight * clamp(state.verticalSplitRatio, 0.25, 0.75));
    const top = Math.max(splitPx + 8, 140);
    chatPanel.style.top = `${top}px`;
    splitDivider.style.top = `${splitPx}px`;
  } else {
    chatPanel.style.top = "";
    splitDivider.style.top = "";
  }

  settingsPanel.setAttribute("aria-hidden", String(!state.settingsOpen));
}

export function updateVerticalSplitFromClientY(state, clientY) {
  const ratio = clientY / window.innerHeight;
  state.verticalSplitRatio = clamp(ratio, 0.25, 0.75);
}
