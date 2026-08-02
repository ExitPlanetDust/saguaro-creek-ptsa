---
name: preview-site
description: Build or run the PTSA website locally and verify changes before publishing. Use for "preview the site", "does it build", "show me my change", or as the check step after any content edit.
---

# Preview and verify the site locally

## Commands

```bash
npm install          # once, or after dependency changes
npm run build        # writes static HTML to _site/
npm run serve        # live server at http://localhost:8020, rebuilds on save
THEME=halloween npm run serve   # preview a seasonal theme (see set-theme skill)
```

Run `npm run serve` in the background so you can keep working; stop it when done.

## What to verify after an edit

1. **Build succeeds.** Eleventy fails loudly on YAML syntax errors — the most common volunteer mistake (bad indentation, unquoted strings containing `:`). If the build fails, read the error's file/line and fix the YAML.
2. **The change actually renders.** Grep the built page in `_site/` for the new text (e.g. `grep -r "Pizza Night" _site/calendar/`). Remember the data-precedence rule: if a `site/_data/fetched/*.json` file has rows, it overrides the matching `site/_data/manual/*.yaml` — an edit that "doesn't show up" is usually this.
3. **Dates behave.** Events strictly before today (America/Phoenix) are hidden by design — a "missing" event may just be past, and previewing near midnight can differ from what parents see.
4. **No broken links** for anything you touched: check `href`s in the built HTML exist (internal pages end in `/`, e.g. `/calendar/`).

## Fetch scripts (optional)

`npm run fetch:calendar` / `npm run fetch:sheets` refresh `site/_data/fetched/*.json`, but need `GCAL_ICS_URL` / `SHEET_*_CSV_URL` env vars (normally only set in GitHub Actions). Locally they're rarely needed — the committed fetched files are used as-is.

## Screenshots

If the user wants to *see* the result, use the Chrome browser tools against `http://localhost:8020` while `npm run serve` runs.
