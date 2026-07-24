---
name: add-minutes
description: Add a meeting agenda or minutes link to the PTSA website's Agendas & Minutes page. Use after a PTSA meeting when the user wants the minutes/agenda posted.
---

# Add meeting agendas & minutes

The `/minutes/` page reads `site/_data/manual/minutes.yaml` — unless the minutes Google Sheet is connected and has rows, in which case `site/_data/fetched/minutes.json` wins and the YAML is ignored. Check `fetched/minutes.json` first; if it has items, the real source is the Google Sheet — offer to draft the row for the user to paste there.

## Format

```yaml
items:
  - date: 2026-08-06            # YYYY-MM-DD meeting date
    title: PTSA Meeting — Agenda & Minutes
    link: https://drive.google.com/…    # Drive folder or specific doc
```

- The page sorts by date **descending**, so entry order in the file doesn't matter.
- Existing entries all link to the shared Drive folder (`site.minutesFolder` in `site/_data/site.yaml`); a link to the specific document is better when available.
- **Sharing gotcha:** Drive links are only useful if the file/folder is shared as "Anyone with the link → Viewer". If the user pastes a Drive link, remind them to check this — the site can't verify it.

## Verify and publish

1. `npm run build`, then check `_site/minutes/index.html`.
2. Commit and push to `main` to deploy (see the `publish-site` skill).
