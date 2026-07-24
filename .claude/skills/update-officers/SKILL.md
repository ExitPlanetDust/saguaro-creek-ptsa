---
name: update-officers
description: Add, change, or remove PTSA executive officers (president, treasurer, secretary, etc.) shown on the website's officers page. Use when board members change or their contact info updates.
---

# Update executive officers

The `/officers/` page reads `site/_data/manual/officers.yaml` — unless the officers Google Sheet is connected and has rows, in which case `site/_data/fetched/officers.json` wins and the YAML is ignored. Check `fetched/officers.json` first; if it has items, the real source is the Google Sheet — offer to draft the row for the user to paste there.

## Format

```yaml
items:
  - name: Jane Doe
    title: President            # President, Vice President, Treasurer, Secretary, …
    email: saguarocreekptsapresident@gmail.com   # optional
```

List order is display order — keep President first, then the rest in rank order.

The role emails (`saguarocreekptsa<role>@gmail.com`) belong to the *position*, not the person, so a board turnover usually only changes `name`.

## Verify and publish

1. `npm run build`, then check `_site/officers/index.html`.
2. Commit and push to `main` to deploy (see the `publish-site` skill).
