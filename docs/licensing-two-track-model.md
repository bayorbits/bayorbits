# Two-Track Licensing System Definition (Bay Orbits)

## 1) System Overview

Bay Orbits should use a **single-copyright-holder dual-license model** with two explicit tracks:

- **Public Track (default):** AGPLv3 copyleft license.
- **Commercial Track (paid):** separate proprietary commercial license agreement.

This is best described as **dual licensing** (not a mere exception/waiver), because users get a real choice between two complete licensing paths from the same rightsholder.

Why this is simpler here:

- Bay Orbits has **no external contributors**, so there is no fragmented copyright ownership.
- A single owner can grant both copyleft and proprietary rights cleanly.
- No CLAs are needed because there are no outside assignment/permission gaps.

For this browser-based simulation, **AGPLv3 is preferred over GPLv3** because AGPLv3 is clearer for network-delivered software where users interact through a hosted web interface.

## 2) Public Track Definition (Copyleft Layer)

### Chosen license: AGPLv3

AGPLv3 should be the public track because this project is a browser-facing educational simulation that is likely to be modified and hosted.

### Public track obligations

Under AGPLv3, users can:

- use,
- copy,
- modify,
- and redistribute.

But they must satisfy AGPLv3 conditions, including preserving notices and providing corresponding source as required by AGPLv3 terms when distributing or offering network interaction with modified versions.

### Distribution, modification, and hosting treatment

- **Distribution:** standard AGPLv3 copyleft obligations apply.
- **Modification:** modified versions remain under AGPLv3 unless a separate commercial agreement applies.
- **Hosting/network use:** AGPLv3 is designed to cover this scenario, reducing ambiguity for web-based deployment.

### Distribution vs network interaction ambiguity

Using AGPLv3 minimizes ambiguity in this repository context: users interacting with a hosted modified simulation are treated under AGPLv3’s network-use framework rather than relying only on classic distribution triggers.

## 3) Commercial Track Definition (Exception Layer)

### Recommended structure

Use a **separate proprietary commercial license file** plus a clear selector statement in top-level docs.

Recommended implementation form:

1. Public AGPLv3 text in `LICENSE`.
2. Commercial terms in `COMMERCIAL_LICENSE.md` (or `COMMERCIAL_LICENSE.txt`).
3. Human-readable selector in `LICENSE.md` that explains the two-track choice.

### Why this form is best

- Cleaner than appending custom exceptions into AGPL text.
- Easier to read than embedding commercial logic in one complex file.
- Strongly enforceable because each track is distinct and explicit.

### Commercial rights and restrictions

Commercial license should grant rights needed for proprietary/internal/commercial deployment without AGPL reciprocity obligations, subject to negotiated terms (scope, fee, warranty/liability limits, termination, etc.).

The commercial license should **replace AGPL obligations for licensed commercial users** for the granted scope, not merely partially waive random clauses.

## 4) License Interaction Model

Define interaction rules explicitly:

1. **Default if no purchase/agreement:** AGPLv3 applies.
2. **Commercial track applies only if explicit agreement exists** with Bay Orbits.
3. Users do not need to “click choose” in the repo; legal choice is made by conduct/contract:
   - use under AGPLv3 by default, or
   - execute a commercial agreement for alternative terms.

Ambiguity prevention:

- Use a short, unambiguous statement in `LICENSE.md` and `README.md` that AGPL is default and commercial use requires separate written license.
- Keep file names standard and obvious.

## 5) Repository Implementation Structure

Minimal, standard-compliant layout:

- `LICENSE` → full AGPLv3 text (canonical public license file).
- `COMMERCIAL_LICENSE.md` → commercial license terms or “Commercial licensing available at …” plus contact path.
- `LICENSE.md` → short selector/overview document explaining the two tracks and default behavior.
- `README.md` → brief licensing section linking to `LICENSE.md` and `COMMERCIAL_LICENSE.md`.

Optional (only if needed later):

- `NOTICE` for attribution/notice housekeeping, if Bay Orbits wants centralized notice language.

Avoid additional layers unless operationally required.

## 6) Developer and User Experience

### First-contact clarity (GitHub landing)

A developer should immediately see in `README.md`:

- “Default license: AGPLv3.”
- “Commercial license available from Bay Orbits.”
- links to both files.

### Commercial user path

Commercial users should get a direct path:

- one contact endpoint (email or form URL),
- one sentence stating that commercial terms are available by agreement.

### Friction minimization

- Public/open usage stays simple under AGPLv3.
- Commercial adoption stays simple via explicit contract.
- Enforcement remains strong through clear default and clear alternative.

## 7) Enforcement and Risk Considerations

Practical risks in dual-track systems:

- users ignoring AGPL obligations,
- users assuming “commercial intent” alone grants proprietary rights,
- downstream confusion if files are unclear.

Mitigations:

- explicit default rule (AGPL unless separately licensed),
- separate commercial file,
- consistent wording in README + LICENSE selector.

AGPL generally provides stronger practical leverage than GPL for hosted web software because hosting modified instances is directly in scope of AGPL’s model.

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

- **Copyleft track:** AGPLv3 (default, in `LICENSE`).
- **Commercial track:** separate proprietary agreement documented in `COMMERCIAL_LICENSE.md`.
- **Selector doc:** `LICENSE.md` describing both tracks and default rule.
- **README update:** short licensing summary + links + commercial contact path.

### Plain-language README paragraph (ready to use)

> Bay Orbits is available under a dual-license model: by default, this repository is licensed under the GNU Affero General Public License v3.0 (AGPLv3). If you want to use Bay Orbits under non-AGPL terms (for example, proprietary or closed-source commercial use), you must obtain a separate commercial license from Bay Orbits.
