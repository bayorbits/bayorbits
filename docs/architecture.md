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

## Stage transition contract (`js/sim/stageMachine.js` + `js/flow/lessonFlow.js`)

Canonical authority: **Option B (duration-based stage machine only)**.

- `stageMachine.startStages(state)` always starts at `acknowledgement`.
- `stageMachine.tickStages(state, dt)` is the only module allowed to advance animation stages.
- Stages move only in this fixed order:
  1. `acknowledgement`
  2. `simulation-note`
  3. `prompt`
  4. `token`
  5. `projection`
  6. `transformation`
  7. `context`
  8. `response`
- Transition rule: when elapsed time for a stage reaches that stage duration, transition to the next stage and reset elapsed to `0`.
- Terminal rule: `response` is terminal; once its duration completes, animation stops.
- Non-canonical path removed: lesson flow does not set animation stage directly.
- `lessonFlow.updateChatStreaming(state, dt)` consumes current stage state and only reveals text up to the currently reached stage ratio.

This keeps stage ownership in `js/sim/` and keeps streaming UI as a consumer of stage events.

## Deferred concerns

- final authored educational copy,
- richer interaction models,
- any layout redesign beyond shell stability,
- build pipeline or framework migration.
