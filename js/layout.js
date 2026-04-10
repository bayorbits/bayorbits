function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeRect(rect, vw, vh) {
  return {
    left: rect.left / vw,
    right: rect.right / vw,
    top: rect.top / vh,
    bottom: rect.bottom / vh,
    width: rect.width / vw,
    height: rect.height / vh
  };
}

function fallbackLayout(state) {
  const split = state.verticalSplitRatio;
  if (state.orientationMode === "horizontal") {
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

function buildHorizontalContext(dom, vw, vh) {
  const chatRect = dom.chatPanel?.getBoundingClientRect();
  const settingsRect = dom.settingsPanel?.getBoundingClientRect();
  if (!chatRect) return null;

  const margin = 0.02;
  const chat = normalizeRect(chatRect, vw, vh);
  const settings = settingsRect ? normalizeRect(settingsRect, vw, vh) : null;

  const usedRight = settings && settings.width > 0 ? Math.max(chat.right, settings.right) : chat.right;
  const x = clamp(usedRight + margin, 0.03, 0.92);
  const y = 0.06;
  const w = clamp(1 - x - margin, 0.24, 0.9);
  const h = 0.86;

  return {
    focusX: x + w * 0.52,
    focusY: y + h * 0.44,
    safeZone: { x, y, w, h }
  };
}

function buildVerticalContext(state, dom, vw, vh) {
  const margin = 0.05;

  if (state.settingsOpen) {
    return {
      focusX: 0.5,
      focusY: 0.5,
      safeZone: { x: margin, y: margin, w: 1 - margin * 2, h: 1 - margin * 2 }
    };
  }

  const chatRect = dom.chatPanel?.getBoundingClientRect();
  if (!chatRect) return null;

  const chat = normalizeRect(chatRect, vw, vh);
  const y = margin;
  const h = clamp(chat.top - margin * 1.6, 0.28, 0.86);

  return {
    focusX: 0.5,
    focusY: y + h * 0.48,
    safeZone: { x: margin, y, w: 1 - margin * 2, h }
  };
}

export function detectOrientation() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return w >= 900 && w >= h ? "horizontal" : "vertical";
}

export function buildLayoutContext(state, dom = null) {
  const vw = Math.max(window.innerWidth, 1);
  const vh = Math.max(window.innerHeight, 1);

  if (!dom) return fallbackLayout(state);

  const context =
    state.orientationMode === "horizontal"
      ? buildHorizontalContext(dom, vw, vh)
      : buildVerticalContext(state, dom, vw, vh);

  return context ?? fallbackLayout(state);
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
