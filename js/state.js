export function createInitialState() {
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
        text: "Welcome. This is an educational simulation with pre-authored teaching responses and a metaphorical visualization."
      }
    ],
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
