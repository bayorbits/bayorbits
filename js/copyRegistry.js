export const teachingSequence = [
  "A prompt is the starting instruction. It is the text that sets the direction for the model-like process shown in this simulation.",
  "The prompt is split into token-like pieces, which are small chunks of text that can be handled as units.",
  "Projection is a mapping step: those units are placed into a shared visual field so relationships can be compared.",
  "Transformation then reshapes positions through repeated operations, like passing through layers in a matrix-like system.",
  "Context or influence appears as links between units, where nearby or relevant pieces affect each other over time.",
  "Response formation is the final stage, where the transformed pattern converges into a structured output shape."
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
  "prompt",
  "tokenize",
  "projection",
  "transformation",
  "context",
  "response"
];
