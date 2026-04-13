import { tickStages } from "../sim/stageMachine.js";
import { updateChatStreaming } from "../flow/lessonFlow.js";
import { computeFrame } from "../sim/animationEngine.js";
import { renderFrame } from "../sim/renderer.js";

function resizeCanvas(canvas, ctx) {
  const ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const targetWidth = Math.max(1, Math.floor(canvas.clientWidth * ratio));
  const targetHeight = Math.max(1, Math.floor(canvas.clientHeight * ratio));

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

export function startRenderLoop({ state, dom, ctx, syncUi }) {
  let lastTick = performance.now();

  function animateFrame(now) {
    resizeCanvas(dom.canvas, ctx);
    const dt = now - lastTick;
    lastTick = now;

    if (state.responseStreamingActive) {
      tickStages(state, dt);
    }
    const didStreamUpdate = state.responseStreamingActive ? updateChatStreaming(state, dt) : false;
    const frame = computeFrame(state, now);
    renderFrame(ctx, dom.canvas, frame, state.layoutContext, now);
    if (didStreamUpdate) {
      syncUi(state, dom);
    }

    requestAnimationFrame(animateFrame);
  }

  requestAnimationFrame(animateFrame);
}
