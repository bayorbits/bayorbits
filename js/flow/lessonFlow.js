import { placeholderLessonSteps, placeholderMessages } from "../content/placeholders.js";
import { getStageIndex, getStageOrder } from "../sim/stageMachine.js";

const CHAT_AUTOSCROLL_THRESHOLD_PX = 48;
const chatRenderState = new WeakMap();

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

function getRevealCapForStage(state, entry) {
  if (!entry || entry.role !== "assistant") return 0;

  const totalStages = Math.max(1, getStageOrder().length);
  const stageIndex = getStageIndex(state.currentAnimationStage);
  const stageRatio = (stageIndex + 1) / totalStages;
  return Math.max(entry.revealIndex, Math.floor(entry.text.length * stageRatio));
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
  const revealCap = getRevealCapForStage(state, activeEntry);
  const nextIndex = Math.min(activeEntry.text.length, activeEntry.revealIndex + chars, revealCap);
  if (nextIndex === activeEntry.revealIndex) return false;

  activeEntry.revealIndex = nextIndex;
  activeEntry.visibleText = activeEntry.text.slice(0, nextIndex);

  if (nextIndex >= activeEntry.text.length) {
    activeEntry.streaming = false;
    state.lessonInProgress = false;
    state.responseStreamingActive = false;
    state.streamingInterrupted = false;

    const done = createEntry("assistant", placeholderMessages.complete);
    revealEntryInstantly(done);
    state.chatEntries.push(done);
  }
  return true;
}

function isNearBottom(chatLog) {
  const distanceFromBottom = chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight;
  return distanceFromBottom <= CHAT_AUTOSCROLL_THRESHOLD_PX;
}

function createChatEntryNode(entry) {
  const wrapper = document.createElement("article");
  wrapper.className = `chat-entry ${entry.role}`;

  const role = document.createElement("div");
  role.className = "role";
  role.textContent = entry.role;

  const text = document.createElement("p");
  const textNode = document.createTextNode("");
  text.appendChild(textNode);

  wrapper.append(role, text);
  return { wrapper, textNode };
}

function getEntryText(entry) {
  return entry.role === "assistant" ? entry.visibleText ?? entry.text : entry.text;
}

function createChatRenderState() {
  return {
    renderedEntries: [],
    activeStreamingEntry: null,
    activeStreamingTextNode: null
  };
}

export function renderChatLog(chatLog, entries) {
  const shouldAutoscroll = isNearBottom(chatLog);
  const renderState = chatRenderState.get(chatLog) ?? createChatRenderState();

  if (entries.length === 0) {
    chatLog.innerHTML = "";
    renderState.renderedEntries = [];
    renderState.activeStreamingEntry = null;
    renderState.activeStreamingTextNode = null;
    chatRenderState.set(chatLog, renderState);
    return;
  }

  while (renderState.renderedEntries.length > entries.length) {
    chatLog.lastElementChild?.remove();
    renderState.renderedEntries.pop();
  }

  for (let index = renderState.renderedEntries.length; index < entries.length; index += 1) {
    const entry = entries[index];
    const { wrapper, textNode } = createChatEntryNode(entry);
    textNode.nodeValue = getEntryText(entry);
    chatLog.appendChild(wrapper);
    renderState.renderedEntries.push({ entry, textNode });
  }

  if (renderState.activeStreamingEntry && renderState.activeStreamingTextNode) {
    const nextText = getEntryText(renderState.activeStreamingEntry);
    if (renderState.activeStreamingTextNode.nodeValue !== nextText) {
      renderState.activeStreamingTextNode.nodeValue = nextText;
    }
  }

  const activeStreaming = renderState.renderedEntries.find((item) => item.entry.role === "assistant" && item.entry.streaming) ?? null;
  renderState.activeStreamingEntry = activeStreaming?.entry ?? null;
  renderState.activeStreamingTextNode = activeStreaming?.textNode ?? null;

  chatRenderState.set(chatLog, renderState);
  if (shouldAutoscroll) {
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

export function resetLesson(state) {
  state.currentPromptText = "";
  state.currentLessonIndex = -1;
  state.lessonInProgress = false;
  state.responseStreamingActive = false;
  state.streamingInterrupted = false;
  state.chatEntries = [];
}
