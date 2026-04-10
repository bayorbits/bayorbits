export const lessonSteps = [
  {
    id: "acknowledgement",
    stage: "acknowledgement",
    text: "Thanks for the prompt. We will walk through one short concept at a time."
  },
  {
    id: "simulation-note",
    stage: "simulation-note",
    text: "Note: this chat is simulated and pre-recorded for learning."
  },
  {
    id: "prompt",
    stage: "prompt",
    text: "Prompt stage: your instruction sets the direction for the process."
  },
  {
    id: "token",
    stage: "token",
    text: "Token stage: the prompt is split into small token-like units."
  },
  {
    id: "projection",
    stage: "projection",
    text: "Projection stage: those units are mapped into a shared visual space."
  },
  {
    id: "transformation",
    stage: "transformation",
    text: "Transformation stage: repeated operations shift unit positions."
  },
  {
    id: "context",
    stage: "context",
    text: "Context stage: links show how units influence each other."
  },
  {
    id: "response",
    stage: "response",
    text: "Response stage: the final pattern gathers into an output shape."
  }
];

export const referenceCopy = {
  prompt: "Prompt: the user instruction that starts the process.",
  token: "Token: a small text unit produced from the prompt.",
  projection: "Projection: placing token-like units into a shared field.",
  transformation: "Transformation: repeated operations that shift the field geometry.",
  contextInfluence: "Context / influence: how units interact and alter one another's weight.",
  responseFormation: "Response formation: assembling the final output pattern from transformed structure.",
  honesty: "Honesty note: this visualization is metaphorical, and chat responses here are simulated and pre-recorded for teaching."
};

export const stageOrder = [
  "idle",
  "acknowledgement",
  "simulation-note",
  "prompt",
  "token",
  "projection",
  "transformation",
  "context",
  "response"
];
