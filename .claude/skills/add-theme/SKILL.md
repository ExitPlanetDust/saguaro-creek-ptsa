---
name: add-theme
description: Create a new seasonal or event theme for the PTSA website (e.g. teacher appreciation week, field day, book fair). Use when the user wants a themed look that doesn't exist yet; use set-theme to switch between existing ones.
---

# Add a new theme

A theme is three small things, nothing more: a registry entry, a CSS variable block, and (only if it should turn on automatically every year) a calendar entry.

## 1. Register it — `site/_data/theme.yaml`

Add under `themes:` (kebab-case name):

```yaml
  teacher-appreciation:
    label: Teacher Appreciation Week
    banner: "🍎 Thank you, Saguaro Creek teachers and staff!"   # optional strip under the nav
```

**Only add a `calendar:` entry if it should recur automatically every year** (MM-DD ranges, inclusive; may wrap year-end; first match wins). Skip the calendar entry for manual-only themes — those activate only via `set-theme`.

## 2. Style it — `site/assets/css/style.css`

Copy an existing `.theme-*` block at the bottom of the file and change the colors:

```css
/* 🍎 Teacher Appreciation (manual only) — … */
.theme-teacher-appreciation {
  --green: …;        /* header, buttons, event date chips, table headers */
  --green-dark: …;   /* headings, footer */
  --brown: …;        /* nav bar */
  --copper: …;       /* link/button hover, event card accent */
  --cream: …;        /* card + banner tint */
  --line: …;         /* borders */
}
```

Rules that keep themes safe and tasteful:

- **Only override the variables above.** Never `--ink`/`--paper`, and never add layout/selector rules inside a theme — themes re-tint, they don't restructure.
- `--green` and `--brown` carry **white bold text** — keep them dark (aim ≥ 4.5:1 contrast vs white; when unsure, go darker).
- `--cream` and `--line` are backgrounds/borders behind dark text — keep them pale.
- The fixed logo (desert green snake) sits on `--green` in the header — sanity-check the pairing.

## 3. Verify

```bash
THEME=<name> npm run build   # log should say: [theme] Active theme: <name>
THEME=<name> npm run serve   # eyeball every page, or screenshot via browser tools
```

Also run a plain `npm run build` to confirm the default still resolves. Then commit and push to `main` (see the `publish-site` skill). Themes are inert until activated, so shipping a new theme never changes the live look by itself — unless you also gave it a calendar range that covers today; call that out to the user.
