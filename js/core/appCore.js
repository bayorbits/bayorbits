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

export function initApp() {
  validateDomContract();
  const dom = getDomRefs();
  const ctx = dom.canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    throw new Error("Unable to initialize 2D rendering context for #stage canvas.");
  }

  renderSettings(dom.settingsPanel);
  syncLayout(state, dom);
  syncUi(state, dom);
  bindEvents(dom);
  startRenderLoop({ state, dom, ctx, syncUi });
}
