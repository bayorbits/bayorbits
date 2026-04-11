import { placeholderLessonSteps, placeholderMessages } from "../content/placeholders.js";
import { setStage } from "../sim/stageMachine.js";

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

function buildAssistantLessonText() {
  return placeholderLessonSteps
    .map((step, index) => `${index + 1}. ${step.text}`)
    .join("\n\n");
}

function syncStageToRevealProgress(state, entry) {
  if (!entry || entry.role !== "assistant") return;

  const ratio = entry.text.length > 0 ? entry.revealIndex / entry.text.length : 0;
  const stepIndex = Math.min(
    placeholderLessonSteps.length - 1,
    Math.floor(ratio * placeholderLessonSteps.length)
  );
  const nextStage = placeholderLessonSteps[Math.max(0, stepIndex)]?.stage ?? "response";
  setStage(state, nextStage);
}

export function startLesson(state, promptText) {
  const trimmed = promptText.trim();
  if (!trimmed || state.responseStreamingActive) return false;

  state.currentPromptText = trimmed;
  state.currentLessonIndex = 0;
  state.lessonInProgress = true;
  state.responseStreamingActive = true;
  state.streamingInterrupted = false;

  state.chatEntries.push(createEntry("user", trimmed));
  const assistantText = buildAssistantLessonText();
  state.chatEntries.push(createEntry("assistant", assistantText));
  setStage(state, placeholderLessonSteps[0].stage);
  return true;
}

export function stopLessonResponse(state) {
  const activeEntry = state.chatEntries.find((entry) => entry.role === "assistant" && entry.streaming);
  if (!activeEntry) return false;

  activeEntry.streaming = false;
  state.responseStreamingActive = false;
  state.lessonInProgress = false;
  state.animationRunning = false;
  state.streamingInterrupted = true;
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
  syncStageToRevealProgress(state, activeEntry);

  if (nextIndex >= activeEntry.text.length) {
    activeEntry.streaming = false;
    state.lessonInProgress = false;
    state.responseStreamingActive = false;
    state.streamingInterrupted = false;

    const done = createEntry("assistant", placeholderMessages.complete);
    revealEntryInstantly(done);
    state.chatEntries.push(done);
    setStage(state, "response");
  }
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
  state.currentPromptText = "";
  state.currentLessonIndex = -1;
  state.lessonInProgress = false;
  state.responseStreamingActive = false;
  state.streamingInterrupted = false;
  state.chatEntries = [];
}
