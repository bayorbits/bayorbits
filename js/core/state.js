import { placeholderMessages } from "../content/placeholders.js";

export function createInitialState() {
  const welcomeText = placeholderMessages.welcome;
  return {
    orientationMode: "wide",
    settingsOpen: false,
    currentPromptText: "",
    currentLessonIndex: -1,
    lessonInProgress: false,
    chatEntries: [
      {
        role: "assistant",
        text: welcomeText,
        revealIndex: welcomeText.length,
        visibleText: welcomeText,
        streaming: false
      }
    ],
    streamCharsPerSecond: 170,
    animationRunning: true,
    currentAnimationStage: "idle",
    stageElapsedMs: 0,
    promptGeometry: null,
    layoutContext: {
      focusX: 0.5,
      focusY: 0.5,
      safeZone: { x: 0.08, y: 0.12, w: 0.84, h: 0.76 }
    }
  };
}
