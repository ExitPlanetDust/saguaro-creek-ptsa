# Automation guide — running this website with (almost) zero maintenance

The website is designed so that **nobody has to "maintain the website."**
Volunteers keep doing what they already do — putting events on a Google
Calendar, keeping a spreadsheet, dropping documents in Drive — and the
website updates itself from those sources every hour.

This guide explains the least-work setup, what happens automatically, and
the easiest way to change every image on the site.

---

## 1. The least-maintenance setup (do once, ~30 minutes)

After this one-time setup, routine upkeep drops to roughly **zero minutes
per month** — the only required touch is a 10-minute checklist once a year
(section 5).

1. **Create one Google Spreadsheet** called *PTSA Website* with four tabs.
   The first row of each tab must be exactly these column headers:

   | Tab | Columns |
   |---|---|
   | Events | `Title`, `Date`, `End Date`, `Time`, `Location`, `Details`, `Link`, `Image` |
   | Officers | `Name`, `Title`, `Email` |
   | Sponsors | `Name`, `Tier`, `Located In`, `Address`, `Phone`, `Website`, `Logo` |
   | Minutes | `Date`, `Title`, `Link` |

   Dates must look like `2026-10-23` (in Sheets: select the column →
   Format → Number → Custom date). Only `Title`/`Name` and `Date` are
   required per row — leave the rest blank when they don't apply.

2. **Share the spreadsheet read-only**: Share → *Anyone with the link* →
   *Viewer*. The robot then reads each tab live at
   `https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=<TAB_GID>`
   (the sheet id is in the sheet's URL; each tab's gid is in the URL when
   that tab is open). Live reads mean edits reach the website robot
   immediately — no "Publish to web" republish lag.

3. **(Optional but nicest) Make a public PTSA Google Calendar** and copy
   its ICS address: calendar Settings → *Make available to public* → then
   under *Integrate calendar* copy the **Public address in iCal format**.
   With this connected, putting an event on the calendar **is** putting it
   on the website.

4. **Give the URLs to the website** (this is the only technical step):
   GitHub repo → Settings → *Secrets and variables* → *Actions* →
   *Variables* → add whichever you have:

   - `SHEET_EVENTS_CSV_URL`, `SHEET_OFFICERS_CSV_URL`,
     `SHEET_SPONSORS_CSV_URL`, `SHEET_MINUTES_CSV_URL`
   - `GCAL_ICS_URL`

   Rule of thumb: **a connected sheet replaces the matching file in the
   repo; the calendar is merged in on top** (duplicate date+title entries
   are dropped automatically).

---

## 2. What happens automatically (no action needed, ever)

| Every… | The robots… |
|---|---|
| night (~4 am Arizona) | fetch the Calendar + Sheets, save the data into GitHub (so there's a full history and the site works even if Google is down), and republish the site **only if something changed** |
| edit (Pages CMS, GitHub, or a robot commit) | rebuild and republish the site within ~2 minutes |
| day | expired events vanish from the Calendar page on the next rebuild — no cleanup |
| run | the nightly robot resets GitHub's 60-day inactivity timer on itself, so the schedule survives quiet stretches like summer break |

**If a robot ever fails**, GitHub emails the repository owner automatically.
There is nothing to monitor day-to-day.

**Impatient?** After editing a sheet or the calendar, anyone with repo
access can publish immediately: repo → *Actions* → *Refresh data from
Google* → *Run workflow*.

---

## 3. Changing images (easiest method for each)

Two universal options work for **any** image:

- **In a Google Sheet** (`Image` or `Logo` column): upload the picture to
  Google Drive, set it to *Anyone with the link → Viewer*, and paste the
  ordinary share link into the cell. The robot converts it to a
  displayable image automatically overnight — no other steps.
- **In Pages CMS** (app.pagescms.org): image fields have an upload button;
  uploads are stored in the repo under `site/assets/img/uploads/`.

Per image:

| Image | Where it lives | Easiest way to change it |
|---|---|---|
| Event flyers | `Image` column of the Events sheet (or the event form in Pages CMS) | Paste a Drive share link in the sheet |
| Sponsor logos | `Logo` column of the Sponsors sheet (or the sponsor form) | Paste a Drive share link in the sheet |
| Home-page hero banner | `site/assets/img/hero-banner.png` | Replace the file with a new one **using the same filename**: on GitHub open the `site/assets/img` folder → *Add file* → *Upload files* → drop the new `hero-banner.png` → Commit. Nothing else to edit. |
| Circle logo (header + browser tab) | `site/assets/img/logo.jpg` | Same same-filename upload trick |
| "Why join the PTSA?" graphic | `site/assets/img/why-join-ptsa.png` | Same same-filename upload trick — or delete that image tag from `site/index.njk`; the same points are written next to it as real text, so the page works without the graphic |

Tips that avoid future work:

- Keeping the **same filename** means zero edits anywhere else, and the
  site republishes itself from the upload commit.
- Prefer images under ~1 MB (photos as `.jpg`) so pages stay fast on phones.
- Anything text-heavy (dates, prices, names) should be typed into the site
  or sheet rather than baked into an image — text takes 10 seconds to
  change next year; a graphic has to be redesigned.

---

## 4. Where each kind of content comes from (precedence)

```
Google Sheet tab (if connected and non-empty)
      ▼ otherwise
site/_data/manual/*.yaml  (edit via Pages CMS or GitHub)

Google Calendar events are ALWAYS added on top of whichever won above.
```

Sponsorship tier prices/benefits (`site/_data/tiers.yaml`) and site-wide
settings (`site/_data/site.yaml` — school year, emails, links, motto) are
deliberately repo-only: they change rarely and shouldn't be one stray
spreadsheet edit away from breaking.

---

## 5. The once-a-year checklist (~10 minutes, each July)

1. Update **School year** in Site settings (Pages CMS → *Site settings*, or
   `site/_data/site.yaml`) — every page updates from this one value.
2. Update the **Officers** tab/list for the new board.
3. Skim the **Sponsors** tab/list — remove lapsed sponsors.
4. If tier prices changed, edit `site/_data/tiers.yaml`.

That's the entire annual maintenance.

---

## 6. When people change (handoff checklist)

- The repo should live in a GitHub **organization** owned by the PTA
  (`saguarocreekptsa`), not a personal account, so no single person's
  departure strands the site.
- New board? Add their GitHub accounts as repo collaborators (that alone
  grants Pages CMS editing) and share the *PTSA Website* spreadsheet and
  PTSA calendar with them.
- Everything about how the site works is in this repo: `README.md`
  (technical overview), `VOLUNTEER-GUIDE.md` (for editors), and this file.
