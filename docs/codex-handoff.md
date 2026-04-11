# Codex Handoff Notes

## Recovery baseline summary (before edits)

Before this pass, JS files were mostly flat under `js/`, with content and behavior mixed:

```text
js/
├── animationEngine.js
├── app.js
├── chatSystem.js
├── copyRegistry.js
├── geometryBuilder.js
├── layout.js
├── promptProcessor.js
├── renderer.js
├── settingsSystem.js
├── stageMachine.js
└── state.js
```

Notable coupling in baseline:
- `chatSystem.js` relied on lesson text from `copyRegistry.js`.
- `settingsSystem.js` rendered educational reference copy directly from `copyRegistry.js`.
- state welcome/reset messages lived in behavior/state modules.

## After refactor

```text
js/
├── app.js
├── content/
│   └── placeholders.js
├── core/
│   ├── appCore.js
│   └── state.js
├── flow/
│   └── lessonFlow.js
├── sim/
│   ├── animationEngine.js
│   ├── geometryBuilder.js
│   ├── promptProcessor.js
│   ├── renderer.js
│   └── stageMachine.js
└── ui/
    ├── layout.js
    └── settingsPanel.js
```

## Old -> new mapping

- `js/app.js` -> `js/app.js` (entrypoint retained, now thin bootstrap)
- `js/state.js` -> `js/core/state.js`
- `js/layout.js` -> `js/ui/layout.js`
- `js/settingsSystem.js` -> `js/ui/settingsPanel.js`
- `js/chatSystem.js` -> `js/flow/lessonFlow.js`
- `js/promptProcessor.js` -> `js/sim/promptProcessor.js`
- `js/geometryBuilder.js` -> `js/sim/geometryBuilder.js`
- `js/stageMachine.js` -> `js/sim/stageMachine.js`
- `js/animationEngine.js` -> `js/sim/animationEngine.js`
- `js/renderer.js` -> `js/sim/renderer.js`
- `js/copyRegistry.js` -> removed; replaced by `js/content/placeholders.js`

## What was removed and why

- `js/copyRegistry.js` was removed because it mixed authored-style educational copy and stage metadata into behavior-facing imports, increasing coupling. Replaced by placeholder-only `js/content/placeholders.js` to keep this recovery pass content-minimal and explicit.

## Intentional deferrals

- Final authored curriculum copy is deferred.
- Any major UI redesign is deferred.
- Any backend, persistence, framework, or build system work is deferred.

## Suggested next safe step

If a future pass introduces final lesson content, update only `js/content/` first, then verify no flow/renderer logic requires changes.
