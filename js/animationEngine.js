import { getStageProgress } from "./stageMachine.js";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixNodePosition(node, stage, stageProgress, time) {
  const breath = Math.sin(time * 0.0014 + node.id + node.jitter * 100) * 0.006;

  switch (stage) {
    case "prompt":
      return { x: node.seedX + breath, y: node.seedY + breath };
    case "tokenize": {
      const ringX = node.seedX + Math.cos(node.id) * 0.08;
      const ringY = node.seedY + Math.sin(node.id) * 0.08;
      return {
        x: lerp(node.seedX, ringX, stageProgress) + breath,
        y: lerp(node.seedY, ringY, stageProgress) + breath
      };
    }
    case "projection":
      return {
        x: lerp(node.seedX, node.projectedX, stageProgress) + breath,
        y: lerp(node.seedY, node.projectedY, stageProgress) + breath
      };
    case "transformation":
      return {
        x: lerp(node.projectedX, node.transformedX, stageProgress) + breath,
        y: lerp(node.projectedY, node.transformedY, stageProgress) + breath
      };
    case "context": {
      const swirl = Math.sin(time * 0.001 + node.id) * 0.014;
      return {
        x: node.transformedX + swirl,
        y: node.transformedY + Math.cos(time * 0.001 + node.id) * 0.01
      };
    }
    case "response":
      return {
        x: lerp(node.transformedX, node.responseX, stageProgress) + breath * 0.7,
        y: lerp(node.transformedY, node.responseY, stageProgress) + breath * 0.7
      };
    default:
      return { x: node.seedX + breath, y: node.seedY + breath };
  }
}

export function computeFrame(state, time) {
  const geometry = state.promptGeometry;
  if (!geometry) return { points: [], links: [], hull: [], stage: "idle", stageProgress: 0 };

  const stage = state.currentAnimationStage;
  const stageProgress = getStageProgress(state);

  const points = geometry.nodes.map((node) => mixNodePosition(node, stage, stageProgress, time));

  return {
    points,
    links: geometry.links,
    hull: geometry.responseHull,
    stage,
    stageProgress
  };
}
