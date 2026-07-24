---
name: set-theme
description: Switch the PTSA website's seasonal theme (halloween, thanksgiving, back-to-school, winter, spring-fling, trunk-or-treat) or return it to automatic date-based switching. Use for "set the theme to X", "turn on the Halloween look", "preview a theme", or "go back to the normal colors".
---

# Switch the seasonal theme

The active theme is controlled by `site/_data/theme.yaml`:

- `active: auto` — picked from the `calendar` date ranges in that file (America/Phoenix); the nightly rebuild flips themes on the right day. Dates not covered by any range get the default desert theme.
- `active: <name>` — forces that theme until changed back. This is the only way to turn on **manual-only themes** (ones with no calendar entry, e.g. `spring-fling`, `trunk-or-treat`).
- `active: default` — pins the normal Sidewinder desert look, seasonal switching off.

Valid names are the keys under `themes:` in that file. If the user asks for a theme that doesn't exist, don't guess — offer to create it (see the `add-theme` skill).

## Previewing (no effect on the live site)

```bash
THEME=<name> npm run serve     # http://localhost:8080
```

The `THEME` env var overrides everything for that build only. Use this — not an `active:` edit — when the user just wants to *see* a theme; take a screenshot with the browser tools if they want a look without leaving the terminal.

## Changing the live site

1. Edit `active:` in `site/_data/theme.yaml`.
2. `npm run build` — confirm the log line `[theme] Active theme: <name>` and that `_site/index.html` has `<body class="theme-<name>">`.
3. Commit (e.g. `Switch theme to trunk-or-treat`) and push to `main`; the deploy workflow publishes it (see the `publish-site` skill).

**Always remind the user when leaving a forced theme on:** it stays until someone sets it back, so after a one-off event (Trunk-or-Treat night), set `active: auto` again. Offer to do that follow-up commit when the event date has passed.
