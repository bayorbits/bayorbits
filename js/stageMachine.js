import { stageOrder } from "./copyRegistry.js";

const stageDuration = {
  idle: Infinity,
  prompt: 1600,
  tokenize: 1700,
  projection: 1900,
  transformation: 2400,
  context: 2200,
  response: 2300
};

export function startStages(state) {
  state.currentAnimationStage = "prompt";
  state.stageElapsedMs = 0;
}

export function tickStages(state, dt) {
  if (!state.animationRunning || !state.promptGeometry) return;

  const stage = state.currentAnimationStage;
  const duration = stageDuration[stage] ?? 2000;
  state.stageElapsedMs += dt;

  if (state.stageElapsedMs < duration) return;

  const idx = stageOrder.indexOf(stage);
  const next = stageOrder[Math.min(idx + 1, stageOrder.length - 1)];

  state.currentAnimationStage = next;
  state.stageElapsedMs = 0;

  if (next === "response") {
    state.animationRunning = false;
  }
}

export function getStageProgress(state) {
  const stage = state.currentAnimationStage;
  const duration = stageDuration[stage] ?? 1;
  if (!Number.isFinite(duration)) return 0;
  return Math.min(state.stageElapsedMs / duration, 1);
}
