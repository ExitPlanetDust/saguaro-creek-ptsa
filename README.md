# Saguaro Creek PTSA Website

The website for the Saguaro Creek K-8 PTSA (Vail School District, Arizona),
built to replace the hand-maintained Givebacks site with something that is
**free to host, easy to update, and largely updates itself**.

- **Live site:** GitHub Pages (see the repo's *Settings → Pages* for the URL)
- **Guides:** [`AUTOMATION-GUIDE.md`](AUTOMATION-GUIDE.md) — the
  least-maintenance setup, what runs itself, and how to change images;
  [`VOLUNTEER-GUIDE.md`](VOLUNTEER-GUIDE.md) — for content editors
- **Membership, store & payments:** stay on
  [Givebacks](https://saguarocreekptsa.givebacks.com/) — this site links to it.
  Givebacks handles money; this site handles information.

## How it works (and why)

| Piece | What it is | Why |
|---|---|---|
| [Eleventy](https://www.11ty.dev/) | A "static site generator": it turns the templates in `site/` plus the data files in `site/_data/` into plain HTML pages | Plain HTML is free to host, fast, and can't break or get hacked the way a database-backed site can |
| GitHub Pages | Free web hosting that serves whatever the build produces | $0/year, no server to maintain, and the site's entire history is in git |
| GitHub Actions | Robots that run on GitHub's servers | One robot rebuilds & publishes the site on every edit; another checks Google Calendar/Sheets nightly |
| [Pages CMS](https://pagescms.org) | A free, friendly editing screen on top of this repo (config: `.pages.yml`) | Volunteers get web forms ("Add event", "Add sponsor") instead of editing code |
| Google Calendar / Sheets (optional) | Where volunteers already keep information | The site pulls from them automatically, so updating the calendar *is* updating the website |

**Everything is version-controlled in GitHub.** Even data fetched from Google
is committed into `site/_data/fetched/` by the nightly robot, so the site
never depends on Google being up, and every change — who, what, when — is in
the git history and can be undone.

## Where content lives

| To change… | Edit… |
|---|---|
| Events | The events Google Sheet or Calendar (if connected), else `site/_data/manual/events.yaml` |
| Meeting minutes links | Minutes Sheet, else `site/_data/manual/minutes.yaml` |
| Officers | Officers Sheet, else `site/_data/manual/officers.yaml` |
| Sponsors | Sponsors Sheet, else `site/_data/manual/sponsors.yaml` |
| Sponsorship tiers & prices | `site/_data/tiers.yaml` |
| School year, emails, links, motto | `site/_data/site.yaml` |
| Page text | `site/*.njk` |
| Look & feel | `site/assets/css/style.css` |

Rule of precedence: **if a Google Sheet is connected and has rows, it wins**
over the matching `manual/*.yaml` file. Google Calendar events are always
merged in additionally (duplicates by date+title are dropped). Past events
disappear automatically.

## One-time setup (checklist)

1. **Repo home.** Create a free GitHub **organization** named
   `saguarocreekptsa` (so the PTA owns the site and the URL becomes
   `https://saguarocreekptsa.github.io/<repo>/`), and transfer this repo
   there — or keep it on a personal account to start; nothing else changes.
2. **Enable Pages.** Repo *Settings → Pages → Source: GitHub Actions*.
   Push to `main` (or run the *Deploy site* action) and the site goes live.
3. **Connect Google (optional but recommended).** Repo *Settings → Secrets
   and variables → Actions → Variables*, add any of:
   - `GCAL_ICS_URL` — Google Calendar → Settings → *Integrate calendar* →
     "Public address in iCal format" (calendar must be public)
   - `SHEET_EVENTS_CSV_URL`, `SHEET_OFFICERS_CSV_URL`,
     `SHEET_SPONSORS_CSV_URL`, `SHEET_MINUTES_CSV_URL` — each from Google
     Sheets *File → Share → Publish to web → (tab) → CSV*. Column headers are
     documented in `scripts/fetch-sheets.mjs`.
4. **Invite editors.** Give volunteers write access to the repo, and point
   them at [app.pagescms.org](https://app.pagescms.org) + `VOLUNTEER-GUIDE.md`.
5. **Point the district page here.** Ask the school webmaster to update the
   "PTA LINK" on <https://scs.vailschooldistrict.org/page/pta> to the new URL.
6. **Fix the Drive folder sharing.** The meeting-documents folder currently
   requires per-person access; set it to "Anyone with the link → Viewer" if
   minutes are meant to be public.

## Local development

```bash
npm install
npm run serve        # http://localhost:8080, rebuilds on save
npm run build        # writes the site to _site/
npm run fetch:calendar   # needs GCAL_ICS_URL set
npm run fetch:sheets     # needs SHEET_*_CSV_URL set
```
