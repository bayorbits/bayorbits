import { startLesson, stopLessonResponse } from "../flow/lessonFlow.js";
import { buildTokenUnits } from "../sim/promptProcessor.js";
import { buildPromptGeometry } from "../sim/geometryBuilder.js";
import { startStages } from "../sim/stageMachine.js";
import { buildLayoutContext } from "../ui/layout.js";

export function beginRunFromPrompt(state, dom, syncUi) {
  const didStart = startLesson(state, dom.promptInput.value);
  if (!didStart) return false;

  const tokenUnits = buildTokenUnits(state.currentPromptText);
  state.layoutContext = buildLayoutContext(state, dom);
  state.promptGeometry = buildPromptGeometry(tokenUnits, state.layoutContext);
  state.animationRunning = true;
  startStages(state);

  dom.promptInput.value = "";
  syncUi(state, dom);
  return true;
}

export function handlePrimaryAction(state, dom, syncUi) {
  if (state.responseStreamingActive) {
    stopLessonResponse(state);
    syncUi(state, dom);
    return;
  }

  beginRunFromPrompt(state, dom, syncUi);
}
