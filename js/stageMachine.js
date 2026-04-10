const stageDuration = {
  idle: Infinity,
  acknowledgement: 1200,
  "simulation-note": 1200,
  prompt: 1600,
  token: 1700,
  projection: 1900,
  transformation: 2400,
  context: 2200,
  response: 2300
};

export function startStages(state) {
  state.currentAnimationStage = "acknowledgement";
  state.stageElapsedMs = 0;
}

export function setStage(state, stage) {
  if (!stage || state.currentAnimationStage === stage) return;
  state.currentAnimationStage = stage;
  state.stageElapsedMs = 0;
  state.animationRunning = true;
}

export function tickStages(state, dt) {
  if (!state.animationRunning || !state.promptGeometry) return;

  const stage = state.currentAnimationStage;
  const duration = stageDuration[stage] ?? 2000;
  state.stageElapsedMs += dt;

  if (state.stageElapsedMs >= duration) {
    state.stageElapsedMs = duration;
    if (stage === "response") state.animationRunning = false;
  }
}

export function getStageProgress(state) {
  const stage = state.currentAnimationStage;
  const duration = stageDuration[stage] ?? 1;
  if (!Number.isFinite(duration)) return 0;
  return Math.min(state.stageElapsedMs / duration, 1);
}
