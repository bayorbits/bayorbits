import { lessonSteps } from "./copyRegistry.js";
import { setStage } from "./stageMachine.js";

function createEntry(role, text) {
  if (role === "assistant") {
    return { role, text, revealIndex: 0, visibleText: "", streaming: true };
  }
  return { role, text };
}

function revealEntryInstantly(entry) {
  if (entry.role !== "assistant") return;
  entry.revealIndex = entry.text.length;
  entry.visibleText = entry.text;
  entry.streaming = false;
}

function addAssistantStep(state, step) {
  const entry = createEntry("assistant", step.text);
  state.chatEntries.push(entry);
  setStage(state, step.stage);
}

export function startLesson(state, promptText) {
  const trimmed = promptText.trim();
  if (!trimmed) return false;

  state.currentPromptText = trimmed;
  state.currentLessonIndex = 0;
  state.lessonInProgress = true;

  state.chatEntries.push(createEntry("user", trimmed));
  addAssistantStep(state, lessonSteps[0]);
  return true;
}

export function continueLesson(state) {
  if (!state.lessonInProgress) return false;
  const next = state.currentLessonIndex + 1;

  if (next >= lessonSteps.length) {
    state.lessonInProgress = false;
    const done = createEntry("assistant", "Lesson complete. Submit a new prompt to run again.");
    revealEntryInstantly(done);
    state.chatEntries.push(done);
    return false;
  }

  state.currentLessonIndex = next;
  addAssistantStep(state, lessonSteps[next]);
  return true;
}

export function updateChatStreaming(state, dt) {
  const activeEntry = state.chatEntries.find((entry) => entry.role === "assistant" && entry.streaming);
  if (!activeEntry) return false;

  const chars = Math.max(1, Math.floor((state.streamCharsPerSecond * dt) / 1000));
  const nextIndex = Math.min(activeEntry.text.length, activeEntry.revealIndex + chars);
  if (nextIndex === activeEntry.revealIndex) return false;

  activeEntry.revealIndex = nextIndex;
  activeEntry.visibleText = activeEntry.text.slice(0, nextIndex);
  if (nextIndex >= activeEntry.text.length) activeEntry.streaming = false;
  return true;
}

export function renderChatLog(chatLog, entries) {
  chatLog.innerHTML = "";
  for (const entry of entries) {
    const wrapper = document.createElement("article");
    wrapper.className = `chat-entry ${entry.role}`;

    const role = document.createElement("div");
    role.className = "role";
    role.textContent = entry.role;

    const text = document.createElement("p");
    text.textContent = entry.role === "assistant" ? entry.visibleText ?? entry.text : entry.text;

    wrapper.append(role, text);
    chatLog.appendChild(wrapper);
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

export function resetLesson(state) {
  const resetText = "Reset complete. Enter a prompt to run the guided sequence again.";
  state.currentPromptText = "";
  state.currentLessonIndex = -1;
  state.lessonInProgress = false;
  state.chatEntries = [
    {
      role: "assistant",
      text: resetText,
      revealIndex: resetText.length,
      visibleText: resetText,
      streaming: false
    }
  ];
}
