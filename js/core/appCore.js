import { createInitialState } from "./state.js";
import { detectOrientation, buildLayoutContext, applyLayoutToDom } from "../ui/layout.js";
import { renderSettings, updateSettingsStatus } from "../ui/settingsPanel.js";
import { startLesson, stopLessonResponse, renderChatLog, resetLesson, updateChatStreaming } from "../flow/lessonFlow.js";
import { buildTokenUnits } from "../sim/promptProcessor.js";
import { buildPromptGeometry } from "../sim/geometryBuilder.js";
import { startStages, tickStages } from "../sim/stageMachine.js";
import { computeFrame } from "../sim/animationEngine.js";
import { renderFrame } from "../sim/renderer.js";

const state = createInitialState();

const dom = {
  canvas: document.getElementById("stage"),
  uiRoot: document.getElementById("ui-root"),
  settingsPanel: document.getElementById("settings-panel"),
  chatPanel: document.getElementById("chat-panel"),
  settingsToggle: document.getElementById("settings-toggle"),
  chatLog: document.getElementById("chat-log"),
  promptInput: document.getElementById("prompt-input"),
  sendBtn: document.getElementById("send-btn")
};

const ctx = dom.canvas.getContext("2d", { alpha: true });
let lastTick = performance.now();

function resizeCanvas() {
  const ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const targetWidth = Math.max(1, Math.floor(dom.canvas.clientWidth * ratio));
  const targetHeight = Math.max(1, Math.floor(dom.canvas.clientHeight * ratio));

  if (dom.canvas.width !== targetWidth || dom.canvas.height !== targetHeight) {
    dom.canvas.width = targetWidth;
    dom.canvas.height = targetHeight;
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function syncLayout() {
  state.orientationMode = detectOrientation();
  state.layoutContext = buildLayoutContext(state, dom);
  applyLayoutToDom(state, dom);
}

function syncUi() {
  renderChatLog(dom.chatLog, state.chatEntries);
  dom.sendBtn.textContent = state.responseStreamingActive ? "Stop" : "Send";
  dom.promptInput.disabled = state.responseStreamingActive;
  dom.settingsToggle.setAttribute("aria-expanded", String(state.settingsOpen));
  updateSettingsStatus(dom.settingsPanel, state);
}

function beginRunFromPrompt() {
  const didStart = startLesson(state, dom.promptInput.value);
  if (!didStart) return;

  const tokenUnits = buildTokenUnits(state.currentPromptText);
  state.layoutContext = buildLayoutContext(state, dom);
  state.promptGeometry = buildPromptGeometry(tokenUnits, state.layoutContext);
  state.animationRunning = true;
  startStages(state);

  dom.promptInput.value = "";
  syncUi();
}

function onPrimaryAction() {
  if (state.responseStreamingActive) {
    stopLessonResponse(state);
    syncUi();
    return;
  }

  beginRunFromPrompt();
}

function resetAll() {
  state.settingsOpen = false;
  state.animationRunning = false;
  state.currentAnimationStage = "idle";
  state.stageElapsedMs = 0;
  state.promptGeometry = null;
  resetLesson(state);
  dom.promptInput.value = "";
  dom.promptInput.disabled = false;
  syncLayout();
  syncUi();
}

function animateFrame(now) {
  resizeCanvas();
  const dt = now - lastTick;
  lastTick = now;

  if (state.responseStreamingActive) {
    tickStages(state, dt);
  }
  const didStreamUpdate = state.responseStreamingActive ? updateChatStreaming(state, dt) : false;
  const frame = computeFrame(state, now);
  renderFrame(ctx, dom.canvas, frame, state.layoutContext, now);
  if (didStreamUpdate) syncUi();

  requestAnimationFrame(animateFrame);
}

function bindEvents() {
  window.addEventListener("resize", () => {
    syncLayout();
    syncUi();
  });

  dom.settingsToggle.addEventListener("click", () => {
    state.settingsOpen = !state.settingsOpen;
    syncLayout();
    syncUi();
  });

  dom.settingsPanel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.id !== "settings-close-btn") return;
    state.settingsOpen = false;
    syncLayout();
    syncUi();
  });

  dom.sendBtn.addEventListener("click", onPrimaryAction);

  dom.promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onPrimaryAction();
    }
  });

  dom.settingsPanel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.id !== "new-chat-btn") return;
    resetAll();
  });
}

export function initApp() {
  renderSettings(dom.settingsPanel);
  syncLayout();
  syncUi();
  bindEvents();
  requestAnimationFrame(animateFrame);
}
