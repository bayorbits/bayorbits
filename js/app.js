import { createInitialState } from "./state.js";
import { detectOrientation, buildLayoutContext, applyLayoutToDom, updateVerticalSplitFromClientY } from "./layout.js";
import { renderSettings, updateSettingsStatus } from "./settingsSystem.js";
import { startLesson, continueLesson, renderChatLog, resetLesson, updateChatStreaming } from "./chatSystem.js";
import { buildTokenUnits } from "./promptProcessor.js";
import { buildPromptGeometry } from "./geometryBuilder.js";
import { startStages, tickStages } from "./stageMachine.js";
import { computeFrame } from "./animationEngine.js";
import { renderFrame } from "./renderer.js";

const state = createInitialState();

const dom = {
  canvas: document.getElementById("stage"),
  uiRoot: document.getElementById("ui-root"),
  settingsPanel: document.getElementById("settings-panel"),
  chatPanel: document.getElementById("chat-panel"),
  splitDivider: document.getElementById("split-divider"),
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
  const w = Math.floor(window.innerWidth * ratio);
  const h = Math.floor(window.innerHeight * ratio);
  if (dom.canvas.width !== w || dom.canvas.height !== h) {
    dom.canvas.width = w;
    dom.canvas.height = h;
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
  dom.continueBtn.disabled = !state.lessonInProgress || assistantStreaming;
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
  state.verticalSplitRatio = 0.5;
  state.settingsOpen = false;
  state.animationRunning = true;
  state.currentAnimationStage = "idle";
  state.stageElapsedMs = 0;
  state.promptGeometry = null;
  resetLesson(state);
  syncLayout();
  syncUi();
}

function handleDividerDragStart(event) {
  if (state.orientationMode !== "vertical" || state.settingsOpen) return;
  state.dividerDragging = true;
  const y = event.touches?.[0]?.clientY ?? event.clientY;
  updateVerticalSplitFromClientY(state, y);
  syncLayout();
}

function handleDividerDragMove(event) {
  if (!state.dividerDragging) return;
  event.preventDefault();
  const y = event.touches?.[0]?.clientY ?? event.clientY;
  updateVerticalSplitFromClientY(state, y);
  syncLayout();
}

function handleDividerDragEnd() {
  state.dividerDragging = false;
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

  dom.splitDivider.addEventListener("mousedown", handleDividerDragStart);
  dom.splitDivider.addEventListener("touchstart", handleDividerDragStart, { passive: true });

  window.addEventListener("mousemove", handleDividerDragMove);
  window.addEventListener("touchmove", handleDividerDragMove, { passive: false });
  window.addEventListener("mouseup", handleDividerDragEnd);
  window.addEventListener("touchend", handleDividerDragEnd);

  dom.splitDivider.addEventListener("keydown", (event) => {
    if (state.orientationMode !== "vertical") return;
    if (event.key === "ArrowUp") {
      state.verticalSplitRatio = Math.max(0.25, state.verticalSplitRatio - 0.03);
      syncLayout();
      syncUi();
    }
    if (event.key === "ArrowDown") {
      state.verticalSplitRatio = Math.min(0.75, state.verticalSplitRatio + 0.03);
      syncLayout();
      syncUi();
    }
  });
}

function init() {
  renderSettings(dom.settingsPanel);
  syncLayout();
  syncUi();
  bindEvents();
  requestAnimationFrame(animateFrame);
}

init();
