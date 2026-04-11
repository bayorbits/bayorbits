# Content Boundary Rules

## Why this file exists

Recent instability came from content and behavior being tightly coupled. This recovery pass separates them so structure can evolve safely.

## Runtime content source

Runtime placeholder text is centralized in:
- `js/content/placeholders.js`

This includes:
- lesson step text,
- settings reference text,
- welcome/reset/complete messages.

## What does *not* belong in behavior modules

Do not embed authored lesson copy directly into:
- `js/flow/*.js`,
- `js/ui/*.js`,
- `js/core/*.js`,
- `js/sim/*.js`.

Behavior modules should reference content via imports from `js/content/`.

## Placeholder policy for this phase

This phase intentionally keeps only minimal placeholder copy to preserve a testable shell.

Do not treat placeholder text as final curriculum.
Final educational authoring is intentionally deferred.

## Future content updates

For later content-authoring passes:
1. update/replace values in `js/content/` only,
2. avoid behavior changes unless required,
3. run smoke checks to ensure stage sequence still works.
