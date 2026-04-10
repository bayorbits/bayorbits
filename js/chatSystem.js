import { teachingSequence } from "./copyRegistry.js";

function createEntry(role, text) {
  return { role, text };
}

export function startLesson(state, promptText) {
  const trimmed = promptText.trim();
  if (!trimmed) return false;

  state.currentPromptText = trimmed;
  state.currentLessonIndex = 0;
  state.lessonInProgress = true;

  state.chatEntries.push(createEntry("user", trimmed));
  state.chatEntries.push(createEntry("assistant", `Thanks for your prompt: “${trimmed}.”`));
  state.chatEntries.push(
    createEntry(
      "assistant",
      "This response is simulated and pre-recorded for teaching, not live model inference."
    )
  );
  state.chatEntries.push(createEntry("assistant", teachingSequence[0]));
  return true;
}

export function continueLesson(state) {
  if (!state.lessonInProgress) return false;
  const next = state.currentLessonIndex + 1;

  if (next >= teachingSequence.length) {
    state.lessonInProgress = false;
    state.chatEntries.push(
      createEntry(
        "assistant",
        "Sequence complete. You can submit another prompt to restart the guided simulation."
      )
    );
    return false;
  }

  state.currentLessonIndex = next;
  state.chatEntries.push(createEntry("assistant", teachingSequence[next]));
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
    text.textContent = entry.text;

    wrapper.append(role, text);
    chatLog.appendChild(wrapper);
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

export function resetLesson(state) {
  state.currentPromptText = "";
  state.currentLessonIndex = -1;
  state.lessonInProgress = false;
  state.chatEntries = [
    {
      role: "assistant",
      text: "Reset complete. Enter a prompt to run the guided sequence again."
    }
  ];
}
