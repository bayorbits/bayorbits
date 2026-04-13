# Bay Orbits — LLM Star Chart (Recovery Baseline)

This repository hosts a **static browser simulation shell** for Bay Orbits' LLM Star Chart.

It is intentionally simple:
- HTML + CSS + vanilla JavaScript only.
- No backend, no build tools, no persistence layer.
- No live LLM inference.

This pass restores recoverability by simplifying structure, separating runtime content from behavior, and documenting boundaries for future Codex work.

## Current structure

```text
.
├── index.html
├── styles.css
├── js/
│   ├── app.js                  # public entrypoint (stable)
│   ├── content/
│   │   └── placeholders.js     # runtime placeholder content only
│   ├── core/
│   │   ├── appCore.js          # bootstrapping, wiring, event orchestration
│   │   └── state.js            # initial state shape
│   ├── flow/
│   │   └── lessonFlow.js       # chat/lesson progression behavior
│   ├── sim/
│   │   ├── promptProcessor.js  # prompt -> token units
│   │   ├── geometryBuilder.js  # token units -> geometry
│   │   ├── stageMachine.js     # animation stage timing/state
│   │   ├── animationEngine.js  # stage interpolation/frame model
│   │   └── renderer.js         # canvas draw layer
│   └── ui/
│       ├── layout.js           # layout context + open/close DOM state
│       └── settingsPanel.js    # settings panel render + status updates
└── docs/
    ├── architecture.md
    ├── content.md
    └── codex-handoff.md
```

## Recovery goals implemented

- JavaScript is no longer a flat cluster.
- Placeholder runtime content is isolated in `js/content/placeholders.js`.
- Behavioral modules no longer carry authored educational lesson copy.
- Public entrypoint (`js/app.js`) remains stable.
- Documentation spine added in `docs/`.

## Local smoke test

Because this is a static site, use any local static server:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> and verify:
- page renders,
- Menu opens/closes,
- Send/Continue/Pause/Reset do not throw startup errors,
- placeholder lesson text appears in chat/settings (not authored final copy).

## Guardrails for future passes

- Keep content data in `js/content/`.
- Keep behavior in `js/flow`, `js/sim`, and `js/ui`.
- Keep entrypoint thin; route wiring through `js/core/appCore.js`.
- Avoid framework migration and avoid adding persistence or backend concerns.

## Licensing model

This project is intended to use a two-track licensing model:

- **Default public track:** AGPLv3 (copyleft)
- **Commercial track:** separate proprietary commercial license from Bay Orbits

See `docs/licensing-two-track-model.md` for the implementation-ready system definition.
