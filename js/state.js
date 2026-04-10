export function createInitialState() {
  const welcomeText = "Welcome. This is a calm learning simulation with short guided steps.";
  return {
    orientationMode: "horizontal",
    settingsOpen: false,
    verticalSplitRatio: 0.5,
    dividerDragging: false,
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
    streamCharsPerSecond: 140,
    animationRunning: true,
    currentAnimationStage: "idle",
    stageElapsedMs: 0,
    promptGeometry: null,
    layoutContext: {
      focusX: 0.75,
      focusY: 0.4,
      safeZone: { x: 0, y: 0, w: 1, h: 1 }
    }
  };
}
