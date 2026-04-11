# Architecture (Recovery-and-Separation Pass)

## Intent

This codebase is a static educational simulation shell. It is **not** a production inference client.

This pass prioritizes:
1. structural simplification,
2. content/behavior separation,
3. recoverability for future edits.

## Module responsibilities

## `js/core/`
- `appCore.js`: application orchestration (DOM lookup, lifecycle, events, sync loops).
- `state.js`: initial state factory only.

## `js/ui/`
- `layout.js`: responsive/layout context and panel open/close DOM toggles.
- `settingsPanel.js`: settings panel rendering and status slot updates.

## `js/flow/`
- `lessonFlow.js`: staged lesson/chat behavior and streaming reveal logic.

## `js/sim/`
- `promptProcessor.js`: prompt text normalization/token-unit derivation.
- `geometryBuilder.js`: token-units -> deterministic geometry seed and link graph.
- `stageMachine.js`: stage timing/progression controls.
- `animationEngine.js`: frame interpolation by stage.
- `renderer.js`: canvas rendering only.

## `js/content/`
- `placeholders.js`: runtime placeholder-only copy and messages.

## File ownership boundary

- UI text used at runtime belongs in `js/content/`.
- DOM rendering code belongs in `js/ui/` or `js/flow/`.
- Animation math belongs in `js/sim/`.
- `js/app.js` remains a stable entrypoint and should stay minimal.

## Deferred concerns

- final authored educational copy,
- richer interaction models,
- any layout redesign beyond shell stability,
- build pipeline or framework migration.
