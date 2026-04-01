# Bay Orbits — Particle Text Demo

A polished HTML5 canvas particle-text splash page with:

- Title: **Bay Orbits**
- Default text: **"It's never just black or white."**
- Black background + white text visual direction
- Responsive, high-DPI aware rendering
- Manual text wrapping + centered multiline layout
- Interactive pointer/touch repulsion and smooth settle-back animation
- Reduced-motion mode and non-JS fallback content

## Run locally

Because this is a static site, you can open `index.html` directly, or run a local server:

```bash
python3 -m http.server 8080
```

Then visit: `http://localhost:8080`

## Files

- `index.html` — semantic shell, controls, canvas, and fallback content
- `styles.css` — visual design and responsive layout
- `script.js` — particle pipeline, interaction, animation, and rebuild logic
