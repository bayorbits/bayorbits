import { referenceCopy } from "./copyRegistry.js";

export function renderSettings(panel) {
  panel.innerHTML = `
    <div class="settings-head">
      <h2>Settings & Reference</h2>
      <button id="settings-close-btn" class="btn settings-close-btn" type="button" aria-label="Close settings panel">Close</button>
    </div>

    <p class="settings-intro">Use this panel for stage reference and session status while the chat delivers one bite at a time.</p>

    <section class="settings-section" aria-label="Session status">
      <h3>Session Status</h3>
      <ul class="kv-list compact">
        <li><strong>Viewport Mode:</strong> <span data-status="orientation">-</span></li>
        <li><strong>Menu State:</strong> <span data-status="layout">-</span></li>
        <li><strong>Animation Stage:</strong> <span data-status="stage">idle</span></li>
        <li><strong>Token Units:</strong> <span data-status="tokens">0</span></li>
      </ul>
    </section>

    <section class="settings-section" aria-label="Educational copy registry">
      <h3>Educational Copy Registry</h3>
      <ul class="kv-list">
        <li><strong>Prompt.</strong> ${referenceCopy.prompt}</li>
        <li><strong>Token.</strong> ${referenceCopy.token}</li>
        <li><strong>Projection.</strong> ${referenceCopy.projection}</li>
        <li><strong>Transformation.</strong> ${referenceCopy.transformation}</li>
        <li><strong>Context / Influence.</strong> ${referenceCopy.contextInfluence}</li>
        <li><strong>Response Formation.</strong> ${referenceCopy.responseFormation}</li>
      </ul>
    </section>

    <section class="settings-section" aria-label="Visual legend">
      <h3>Visual Legend</h3>
      <ul>
        <li>Blue points: prompt-derived token-like units.</li>
        <li>Thin links: contextual influence pathways.</li>
        <li>Mint hull: emergent response shape estimate.</li>
      </ul>
    </section>

    <section class="settings-section" aria-label="Honesty note">
      <h3>Honesty Note</h3>
      <p>${referenceCopy.honesty}</p>
    </section>

    <section class="settings-section" aria-label="Controls">
      <h3>Controls</h3>
      <ul>
        <li><strong>Send / Start:</strong> submits prompt and starts staged flow.</li>
        <li><strong>Continue:</strong> reveals the next single paragraph and stage.</li>
        <li><strong>Pause:</strong> pauses or resumes stage animation.</li>
        <li><strong>Reset:</strong> clears state for a fresh lesson.</li>
      </ul>
    </section>
  `;
}

export function updateSettingsStatus(panel, state) {
  const setStatus = (key, value) => {
    const slot = panel.querySelector(`[data-status="${key}"]`);
    if (slot) slot.textContent = String(value);
  };

  setStatus("orientation", state.orientationMode);
  setStatus("layout", state.settingsOpen ? "menu open" : "menu closed");
  setStatus("stage", state.currentAnimationStage);
  setStatus("tokens", state.promptGeometry?.nodes?.length ?? 0);
}
