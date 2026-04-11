import { createInitialState } from "./state.js";
import { detectOrientation, buildLayoutContext, applyLayoutToDom } from "../ui/layout.js";
import { renderSettings, updateSettingsStatus } from "../ui/settingsPanel.js";
import { startLesson, continueLesson, renderChatLog, resetLesson, updateChatStreaming } from "../flow/lessonFlow.js";
import { buildTokenUnits } from "../sim/promptProcessor.js";
import { buildPromptGeometry } from "../sim/geometryBuilder.js";
import { startStages, tickStages, getStageProgress } from "../sim/stageMachine.js";
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
  sendBtn: document.getElementById("send-btn"),
  continueBtn: document.getElementById("continue-btn"),
  pauseBtn: document.getElementById("pause-btn"),
  resetBtn: document.getElementById("reset-btn")
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
  const assistantStreaming = state.chatEntries.some((entry) => entry.role === "assistant" && entry.streaming);
  const stageSettled = !state.promptGeometry || getStageProgress(state) >= 0.99;
  dom.continueBtn.disabled = !state.lessonInProgress || assistantStreaming || !stageSettled;
  dom.pauseBtn.textContent = state.animationRunning ? "Pause" : "Resume";
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

function resetAll() {
  state.settingsOpen = false;
  state.animationRunning = true;
  state.currentAnimationStage = "idle";
  state.stageElapsedMs = 0;
  state.promptGeometry = null;
  resetLesson(state);
  syncLayout();
  syncUi();
}

function animateFrame(now) {
  resizeCanvas();
  const dt = now - lastTick;
  lastTick = now;

  tickStages(state, dt);
  const didStreamUpdate = updateChatStreaming(state, dt);
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

  dom.sendBtn.addEventListener("click", beginRunFromPrompt);
  dom.continueBtn.addEventListener("click", () => {
    continueLesson(state);
    syncUi();
  });
  dom.pauseBtn.addEventListener("click", () => {
    state.animationRunning = !state.animationRunning;
    syncUi();
  });
  dom.resetBtn.addEventListener("click", resetAll);

  dom.promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      beginRunFromPrompt();
    }
  });
}

export function initApp() {
  renderSettings(dom.settingsPanel);
  syncLayout();
  syncUi();
  bindEvents();
  requestAnimationFrame(animateFrame);
}
