# Two-Track Licensing System Definition (Bay Orbits)

## 1) System Overview

Bay Orbits should use a **single-copyright-holder dual-license model** with two explicit tracks:

- **Public Track (default):** GPLv3 copyleft license.
- **Commercial Track (paid):** separate proprietary commercial license agreement.

This is best described as **dual licensing** (not a mere exception/waiver), because users get a real choice between two complete licensing paths from the same rightsholder.

Why this is simpler here:

- Bay Orbits has **no external contributors**, so there is no fragmented copyright ownership.
- A single owner can grant both copyleft and proprietary rights cleanly.
- No CLAs are needed because there are no outside assignment/permission gaps.

For this browser-based simulation, **GPLv3 is the preferred copyleft baseline** because it fits a static, client-side distribution model and keeps redistribution obligations clear.

## 2) Public Track Definition (Copyleft Layer)

### Chosen license: GPLv3

GPLv3 should be the public track because this project is a browser-facing educational simulation that is likely to be modified and hosted.

### Public track obligations

Under GPLv3, users can:

- use,
- copy,
- modify,
- and redistribute.

But they must satisfy GPLv3 conditions, including preserving notices and providing corresponding source as required by GPLv3 terms when distributing or offering network interaction with modified versions.

### Distribution, modification, and hosting treatment

- **Distribution:** standard GPLv3 copyleft obligations apply.
- **Modification:** modified versions remain under GPLv3 unless a separate commercial agreement applies.
- **Hosting/network use:** GPLv3 is designed to cover this scenario, reducing ambiguity for web-based deployment.

### Distribution vs network interaction scope

Using GPLv3 keeps this repository aligned with distribution-based copyleft obligations. Hosted use can still be handled through separate contractual terms under the commercial track when needed.

## 3) Commercial Track Definition (Exception Layer)

### Recommended structure

Use a **separate proprietary commercial license file** plus a clear selector statement in top-level docs.

Recommended implementation form:

1. Public GPLv3 text in `LICENSE`.
2. Commercial terms in `COMMERCIAL_LICENSE.md` (or `COMMERCIAL_LICENSE.txt`).
3. Human-readable selector in `LICENSE.md` that explains the two-track choice.

### Why this form is best

- Cleaner than appending custom exceptions into GPL text.
- Easier to read than embedding commercial logic in one complex file.
- Strongly enforceable because each track is distinct and explicit.

### Commercial rights and restrictions

Commercial license should grant rights needed for proprietary/internal/commercial deployment without GPL reciprocity obligations, subject to negotiated terms (scope, fee, warranty/liability limits, termination, etc.).

The commercial license should **replace GPL obligations for licensed commercial users** for the granted scope, not merely partially waive random clauses.

## 4) License Interaction Model

Define interaction rules explicitly:

1. **Default if no purchase/agreement:** GPLv3 applies.
2. **Commercial track applies only if explicit agreement exists** with Bay Orbits.
3. Users do not need to “click choose” in the repo; legal choice is made by conduct/contract:
   - use under GPLv3 by default, or
   - execute a commercial agreement for alternative terms.

Ambiguity prevention:

- Use a short, unambiguous statement in `LICENSE.md` and `README.md` that GPL is default and commercial use requires separate written license.
- Keep file names standard and obvious.

## 5) Repository Implementation Structure

Minimal, standard-compliant layout:

- `LICENSE` → full GPLv3 text (canonical public license file).
- `COMMERCIAL_LICENSE.md` → commercial license terms or “Commercial licensing available at …” plus contact path.
- `LICENSE.md` → short selector/overview document explaining the two tracks and default behavior.
- `README.md` → brief licensing section linking to `LICENSE.md` and `COMMERCIAL_LICENSE.md`.

Optional (only if needed later):

- `NOTICE` for attribution/notice housekeeping, if Bay Orbits wants centralized notice language.

Avoid additional layers unless operationally required.

## 6) Developer and User Experience

### First-contact clarity (GitHub landing)

A developer should immediately see in `README.md`:

- “Default license: GPLv3.”
- “Commercial license available from Bay Orbits.”
- links to both files.

### Commercial user path

Commercial users should get a direct path:

- one contact endpoint (email or form URL),
- one sentence stating that commercial terms are available by agreement.

### Friction minimization

- Public/open usage stays simple under GPLv3.
- Commercial adoption stays simple via explicit contract.
- Enforcement remains strong through clear default and clear alternative.

## 7) Enforcement and Risk Considerations

Practical risks in dual-track systems:

- users ignoring GPL obligations,
- users assuming “commercial intent” alone grants proprietary rights,
- downstream confusion if files are unclear.

Mitigations:

- explicit default rule (GPL unless separately licensed),
- separate commercial file,
- consistent wording in README + LICENSE selector.

GPL provides a clear and widely understood copyleft baseline for distributed derivatives in this static-site repository.

This system depends mainly on:

- legal clarity in repository text,
- visibility of track boundaries,
- and Bay Orbits’ willingness to enforce when needed.

## 8) Constraints and Non-Goals

This model deliberately avoids:

- external contributor governance mechanisms,
- CLAs,
- backend license enforcement tooling,
- custom legal infrastructure,
- licensing-related feature creep.

It is lightweight, static-repo-compatible, and maintainable by one copyright holder.

## 9) Final Recommended Model (Decisive)

### Recommended choice

- **Copyleft track:** GPLv3 (default, in `LICENSE`).
- **Commercial track:** separate proprietary agreement documented in `COMMERCIAL_LICENSE.md`.
- **Selector doc:** `LICENSE.md` describing both tracks and default rule.
- **README update:** short licensing summary + links + commercial contact path.

### Plain-language README paragraph (ready to use)

> Bay Orbits is available under a dual-license model: by default, this repository is licensed under the GNU General Public License v3.0 (GPLv3). If you want to use Bay Orbits under non-GPL terms (for example, proprietary or closed-source commercial use), you must obtain a separate commercial license from Bay Orbits.
