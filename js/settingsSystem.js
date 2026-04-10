import { referenceCopy } from "./copyRegistry.js";

export function renderSettings(panel) {
  panel.innerHTML = `
    <h2>Settings & Reference</h2>
    <p>This panel is a support surface. The live teaching sequence appears in chat.</p>

    <h3>Educational Copy Registry</h3>
    <ul class="kv-list">
      <li><strong>Prompt.</strong> ${referenceCopy.prompt}</li>
      <li><strong>Token.</strong> ${referenceCopy.token}</li>
      <li><strong>Projection.</strong> ${referenceCopy.projection}</li>
      <li><strong>Transformation.</strong> ${referenceCopy.transformation}</li>
      <li><strong>Context / Influence.</strong> ${referenceCopy.contextInfluence}</li>
      <li><strong>Response Formation.</strong> ${referenceCopy.responseFormation}</li>
    </ul>

    <h3>Legend</h3>
    <ul>
      <li>Blue points: token-like units.</li>
      <li>Thin lines: context-like influence links.</li>
      <li>Mint hull: emergent response geometry.</li>
    </ul>

    <h3>Honesty Note</h3>
    <p>${referenceCopy.honesty}</p>

    <h3>Controls</h3>
    <ul>
      <li><strong>Send / Start:</strong> submits prompt and starts a staged run.</li>
      <li><strong>Continue:</strong> reveals the next single-paragraph teaching bite.</li>
      <li><strong>Pause:</strong> pauses or resumes animation.</li>
      <li><strong>Reset:</strong> clears lesson state and returns split to 50/50.</li>
    </ul>
  `;
}
