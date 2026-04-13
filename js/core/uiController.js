import { detectOrientation, buildLayoutContext, applyLayoutToDom } from "../ui/layout.js";
import { updateSettingsStatus } from "../ui/settingsPanel.js";
import { renderChatLog, resetLesson } from "../flow/lessonFlow.js";

export function syncLayout(state, dom) {
  state.orientationMode = detectOrientation();
  state.layoutContext = buildLayoutContext(state, dom);
  applyLayoutToDom(state, dom);
}

export function syncUi(state, dom) {
  renderChatLog(dom.chatLog, state.chatEntries);
  dom.sendBtn.textContent = state.responseStreamingActive ? "Stop" : "Send";
  dom.promptInput.disabled = state.responseStreamingActive;
  dom.settingsToggle.setAttribute("aria-expanded", String(state.settingsOpen));
  updateSettingsStatus(dom.settingsPanel, state);
}

export function toggleSettings(state, dom) {
  state.settingsOpen = !state.settingsOpen;
  syncLayout(state, dom);
  syncUi(state, dom);
}

export function closeSettings(state, dom) {
  state.settingsOpen = false;
  syncLayout(state, dom);
  syncUi(state, dom);
}

export function resetAll(state, dom) {
  state.settingsOpen = false;
  state.animationRunning = false;
  state.currentAnimationStage = "idle";
  state.stageElapsedMs = 0;
  state.promptGeometry = null;
  resetLesson(state);
  dom.promptInput.value = "";
  dom.promptInput.disabled = false;
  syncLayout(state, dom);
  syncUi(state, dom);
}
