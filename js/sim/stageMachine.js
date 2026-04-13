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

const stageTransition = {
  acknowledgement: "simulation-note",
  "simulation-note": "prompt",
  prompt: "token",
  token: "projection",
  projection: "transformation",
  transformation: "context",
  context: "response",
  response: "response"
};

const stageOrder = Object.keys(stageTransition);

function transitionToStage(state, stage) {
  if (!stage) return;
  state.currentAnimationStage = stage;
  state.stageElapsedMs = 0;
}

export function startStages(state) {
  transitionToStage(state, stageOrder[0]);
  state.animationRunning = true;
}

export function tickStages(state, dt) {
  if (!state.animationRunning || !state.promptGeometry) return;

  let stage = state.currentAnimationStage;
  let elapsed = state.stageElapsedMs + dt;

  while (true) {
    const duration = stageDuration[stage] ?? 2000;

    if (!Number.isFinite(duration)) {
      state.stageElapsedMs = 0;
      return;
    }

    if (elapsed < duration) {
      state.stageElapsedMs = elapsed;
      return;
    }

    if (stage === "response") {
      state.stageElapsedMs = duration;
      state.animationRunning = false;
      return;
    }

    elapsed -= duration;
    stage = stageTransition[stage] ?? "response";
    transitionToStage(state, stage);
  }
}

export function getStageProgress(state) {
  const stage = state.currentAnimationStage;
  const duration = stageDuration[stage] ?? 1;
  if (!Number.isFinite(duration)) return 0;
  return Math.min(state.stageElapsedMs / duration, 1);
}

export function getStageOrder() {
  return stageOrder;
}

export function getStageIndex(stage) {
  return Math.max(0, stageOrder.indexOf(stage));
}
