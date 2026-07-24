---
name: publish-site
description: Publish PTSA website changes to the live site — commit, push, and watch the GitHub Pages deploy — or trigger/troubleshoot the nightly Google Calendar/Sheets data refresh. Use for "make it live", "deploy", "the site didn't update", or "refresh the calendar data now".
---

# Publish changes / manage deploys

Deployment is fully automatic: **every push to `main` triggers the *Deploy site* workflow** (`.github/workflows/deploy.yml`), which builds with Eleventy and publishes to GitHub Pages. There is no manual upload step and no server.

## Publishing an edit

1. Make sure `npm run build` passes locally (see the `preview-site` skill).
2. Show the user the diff (`git diff`) before committing anything.
3. Commit with a plain-English message a volunteer can read in the history, e.g. `Add Fall Book Fair to events` — the git log is the site's audit trail of who changed what.
4. Push to `main`, then watch the deploy:
   ```bash
   gh run watch $(gh run list --workflow "Deploy site" --limit 1 --json databaseId -q '.[0].databaseId')
   ```
5. Tell the user the change is live (allow a minute or two for Pages/CDN), and where: the URL is in repo *Settings → Pages* (`gh api repos/{owner}/{repo}/pages -q .html_url`).

## The nightly data refresh

`.github/workflows/refresh-data.yml` runs nightly: it pulls Google Calendar (`GCAL_ICS_URL`) and the Sheets (`SHEET_*_CSV_URL` — all set as **Actions repository variables**), commits the results into `site/_data/fetched/`, and that commit itself triggers a deploy. To refresh immediately instead of waiting for tonight:

```bash
gh workflow run "refresh-data.yml"
```

## Troubleshooting "the site didn't update"

Check in this order:

1. `gh run list --limit 5` — did a deploy run and did it succeed? Read the log of a failed run (`gh run view <id> --log-failed`); YAML syntax errors from a Pages CMS edit are the usual culprit.
2. Data precedence — a `manual/*.yaml` edit is ignored whenever the matching `site/_data/fetched/*.json` has rows (the Google Sheet wins). Sheet/Calendar edits only reach the site after the nightly refresh (or a manual `gh workflow run "refresh-data.yml"`).
3. Past events are hidden by design.
4. Browser/CDN cache — hard-refresh.

## Cautions

- Never force-push `main` — the history is the PTA's audit trail.
- Don't commit `_site/` or `node_modules/` (gitignored; keep it that way).
- Secrets/variables live in GitHub repo settings, never in the repo.
