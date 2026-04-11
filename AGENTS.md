# AGENTS.md

## Project Identity

This repository powers **Bay Orbits’ LLM Star Chart**, a browser-based educational simulation.

It is:

- a static site
- an educational interface experiment
- a simulated teaching surface with metaphorical visualization

It is **not**:

- a live inference assistant
- a backend-driven application
- a framework migration target by default
- a product for scope expansion unless explicitly requested

## Default Technical Assumptions

Unless explicitly requested otherwise, preserve these defaults:

- HTML, CSS, and vanilla JavaScript
- static GitHub Pages compatibility
- simple file structure
- modular code with shallow directory organization
- calm, readable interface behavior

Do **not** introduce by default:

- frameworks
- build tools
- backend inference
- accounts or persistence
- downloads or exports
- decorative widgets
- speculative feature expansion

## Working Rule for Codex

For this repository, prefer **small, coherent passes**.

A pass should usually do **one main thing**:

1. recovery / cleanup
2. file reorganization
3. content separation
4. documentation
5. visual refinement
6. behavioral refinement
7. redesign planning
8. redesign implementation

Do not combine multiple pass types unless the later pass is strictly required by the earlier one.

## Ask First, Then Edit

When the task is broad, risky, or structurally unclear:

- inspect first
- summarize current structure
- identify likely affected files
- propose a staged plan
- note risks and deferrals before editing

When the task is already clear and bounded:

- make the smallest coherent change necessary
- preserve the working shell where practical
- avoid unrelated cleanup

## Scope Discipline

Codex may choose better **local implementation details**, but should not infer broader product priorities by implication.

That means:

- do not expand scope because a larger redesign appears attractive
- do not convert cleanup into redesign
- do not add new product features during recovery passes
- do not rewrite from scratch unless explicitly requested

## Project Memory and Documentation

When present, consult these files before making broad or structural changes:

- `README.md`
- `docs/architecture.md`
- `docs/content.md`
- `docs/codex-handoff.md`
- any more deeply scoped `AGENTS.md` files if they are later introduced

Use repository documentation as durable project memory.

Do not force every permanent project rule into each task prompt if the repo already documents it.

## Content Boundary

Keep **authored educational content** separate from **behavior modules** whenever possible.

Distinguish between:

- shell text required for a usable interface
- authored lesson or teaching content
- documentation content for humans

Do not delete all visible text during content-separation work. Preserve a minimal understandable shell.

## File Organization Guidance

Prefer shallow, coherent organization.

When reorganizing JavaScript:

- group by responsibility
- keep ownership clear
- avoid unnecessary nesting
- update imports cleanly
- provide an old-to-new file mapping when structure changes significantly

## Stability Boundaries

During recovery, cleanup, or reorganization passes, treat these as protected unless change is required for functionality:

- `CNAME`
- `_config.yml`
- deployment or domain settings
- public entrypoints
- essential visible shell labels needed for a testable placeholder shell

If any protected area is changed, explain why in the final summary.

## Recovery Pass Defaults

If the previous pass introduced bugs, instability, or scope drift, default to a **recovery-first posture**.

Recovery passes should usually:

- use the current public repo as baseline
- preserve the visible shell where practical
- avoid redesign unless strictly necessary for stability
- document removals and deferrals
- prefer simplification over expansion

## Redesign Discipline

Do not begin broad redesign during a cleanup or recovery pass unless explicitly requested.

For redesign work:

- identify the current interface model first
- define the proposed new model explicitly
- name affected modules
- state tradeoffs and non-goals
- plan before broad implementation when the change is structurally significant

## Verification Expectations

If changes are made, perform the relevant minimum checks available to the repo and task.

At minimum, where applicable, verify:

- imports resolve
- the site loads without immediate startup errors
- the visible shell remains readable
- key controls remain present
- menu or settings open-close behavior still works if part of the current shell
- placeholder or separated content appears from the intended source if content work was part of the pass

If formal automated tests are later added, run the relevant ones after making changes.

## Final Reporting Expectations

After meaningful structural or behavioral edits, report briefly:

- what changed
- which files were affected
- anything removed and why
- anything intentionally deferred
- any verification performed

For larger reorganizations, include:

- a before-and-after structure summary
- an old-to-new file map where useful

## Anti-Patterns to Avoid

Avoid the following unless explicitly requested:

- cleanup plus redesign plus content authoring in one pass
- broad speculative architecture work
- deleting useful shell text during content separation
- adding complexity faster than documentation and structure can support
- changing protected deployment-related files casually

## Bay Orbits Priority Order

When the repo is unstable or under-documented, the default priority is:

1. strengthen repo memory
2. recover stability
3. simplify structure
4. separate content from behavior
5. verify the shell still works
6. resume redesign only after the above are in place

## Closing Rule

For Bay Orbits, better prompts help, but better **repo memory and bounded changes** help more.

When uncertain, choose the path that is:

- simpler
- more recoverable
- easier to hand off
- less likely to introduce scope drift

