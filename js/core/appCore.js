import { createInitialState } from "./state.js";
import { getDomRefs, validateDomContract } from "./domRefs.js";
import { renderSettings } from "../ui/settingsPanel.js";
import { syncLayout, syncUi, toggleSettings, closeSettings, resetAll } from "./uiController.js";
import { handlePrimaryAction } from "./simController.js";
import { startRenderLoop } from "./loop.js";

const state = createInitialState();

function bindEvents(dom) {
  window.addEventListener("resize", () => {
    syncLayout(state, dom);
    syncUi(state, dom);
  });

  dom.settingsToggle.addEventListener("click", () => {
    toggleSettings(state, dom);
  });

  dom.settingsPanel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.id === "settings-close-btn") {
      closeSettings(state, dom);
      return;
    }

    if (target.id === "new-chat-btn") {
      resetAll(state, dom);
    }
  });

  dom.sendBtn.addEventListener("click", () => {
    handlePrimaryAction(state, dom, syncUi);
  });

  dom.promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handlePrimaryAction(state, dom, syncUi);
    }
  });
}

function renderStartupFallback(message) {
  const uiRoot = document.getElementById("ui-root");
  if (uiRoot) {
    uiRoot.innerHTML = `<p role="status">${message}</p>`;
    return;
  }

  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.textContent = message;
  status.style.margin = "1rem";
  status.style.fontFamily = "system-ui, sans-serif";
  status.style.fontSize = "0.95rem";

  document.body.appendChild(status);
}

function validateDom(dom) {
  const requiredRefs = [
    "canvas",
    "uiRoot",
    "settingsPanel",
    "chatPanel",
    "settingsToggle",
    "chatLog",
    "promptInput",
    "sendBtn"
  ];

  for (const ref of requiredRefs) {
    if (!dom?.[ref]) {
      return { ok: false, reason: `Missing required DOM reference: dom.${ref}` };
    }
  }

  const ctx = dom.canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return { ok: false, reason: "Unable to initialize 2D rendering context for #stage canvas." };
  }

  return { ok: true, ctx };
}

export function initApp() {
  let dom;
  try {
    validateDomContract();
    dom = getDomRefs();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DOM initialization failure.";
    console.error(`[appCore] Startup validation failed: ${message}`, error);
    renderStartupFallback("Unable to start the star chart. Required interface elements are missing.");
    return;
  }

  const validation = validateDom(dom);
  if (!validation.ok) {
    console.error(`[appCore] Startup validation failed: ${validation.reason}`);
    renderStartupFallback("Unable to start the star chart. Rendering support is unavailable.");
    return;
  }

  renderSettings(dom.settingsPanel);
  syncLayout(state, dom);
  syncUi(state, dom);
  bindEvents(dom);
  startRenderLoop({ state, dom, ctx: validation.ctx, syncUi });
}
