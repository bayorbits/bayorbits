const REQUIRED_DOM_IDS = [
  "stage",
  "ui-root",
  "settings-panel",
  "chat-panel",
  "settings-toggle",
  "chat-log",
  "prompt-input",
  "send-btn"
];

function requireElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required DOM element: #${id}`);
  }
  return element;
}

export function getDomRefs() {
  const refs = {
    canvas: requireElement("stage"),
    uiRoot: requireElement("ui-root"),
    settingsPanel: requireElement("settings-panel"),
    chatPanel: requireElement("chat-panel"),
    settingsToggle: requireElement("settings-toggle"),
    chatLog: requireElement("chat-log"),
    promptInput: requireElement("prompt-input"),
    sendBtn: requireElement("send-btn")
  };

  if (!(refs.canvas instanceof HTMLCanvasElement)) {
    throw new Error("Expected #stage to be a <canvas> element.");
  }

  if (!(refs.promptInput instanceof HTMLTextAreaElement || refs.promptInput instanceof HTMLInputElement)) {
    throw new Error("Expected #prompt-input to be an <input> or <textarea> element.");
  }

  return refs;
}

export function validateDomContract() {
  for (const id of REQUIRED_DOM_IDS) {
    requireElement(id);
  }
}
