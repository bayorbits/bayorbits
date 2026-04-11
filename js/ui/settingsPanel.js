import { placeholderReferenceCopy } from "../content/placeholders.js";

export function renderSettings(panel) {
  panel.innerHTML = `
    <div class="settings-head">
      <h2>Settings & Reference</h2>
      <button id="settings-close-btn" class="btn settings-close-btn" type="button" aria-label="Close settings panel">Close</button>
    </div>

    <p class="settings-intro">This panel shows shell status and placeholder reference copy for recovery-mode testing.</p>

    <section class="settings-section" aria-label="Session status">
      <h3>Session Status</h3>
      <ul class="kv-list compact">
        <li><strong>Viewport Mode:</strong> <span data-status="orientation">-</span></li>
        <li><strong>Menu State:</strong> <span data-status="layout">-</span></li>
        <li><strong>Animation Stage:</strong> <span data-status="stage">idle</span></li>
        <li><strong>Token Units:</strong> <span data-status="tokens">0</span></li>
        <li><strong>Primary Action:</strong> <span data-status="primary-action">Send</span></li>
      </ul>
    </section>

    <section class="settings-section" aria-label="Session actions">
      <h3>Session Actions</h3>
      <button id="new-chat-btn" class="btn" type="button">New chat</button>
    </section>

    <section class="settings-section" aria-label="Placeholder copy registry">
      <h3>Placeholder Copy Registry</h3>
      <ul class="kv-list">
        <li><strong>Prompt.</strong> ${placeholderReferenceCopy.prompt}</li>
        <li><strong>Token.</strong> ${placeholderReferenceCopy.token}</li>
        <li><strong>Projection.</strong> ${placeholderReferenceCopy.projection}</li>
        <li><strong>Transformation.</strong> ${placeholderReferenceCopy.transformation}</li>
        <li><strong>Context / Influence.</strong> ${placeholderReferenceCopy.contextInfluence}</li>
        <li><strong>Response Formation.</strong> ${placeholderReferenceCopy.responseFormation}</li>
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
      <p>${placeholderReferenceCopy.honesty}</p>
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
  setStatus("primary-action", state.responseStreamingActive ? "Stop" : "Send");
}
