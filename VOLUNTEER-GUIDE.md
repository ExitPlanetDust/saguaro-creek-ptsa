# How to update the PTSA website (no coding needed!)

This guide is for PTSA volunteers. You can update the website in three ways —
pick whichever feels most comfortable. Every change is saved with your name
and can always be undone, so **you cannot break anything permanently**.

## Option 1: Google Sheets & Calendar (easiest — if connected)

If the board has connected the Google Sheet / Calendar (ask whoever set up
the site), then:

- **Add an event** → add it to the PTSA Google Calendar, or add a row to the
  *Events* tab of the PTSA website spreadsheet.
- **Post meeting minutes** → upload the document to the PTSA Google Drive
  folder, copy its link, and add a row (date + link) to the *Minutes* tab.
- **Add or change a sponsor or officer** → edit the matching tab.

The website checks Google **every hour** and updates itself. Don't want to
wait? Ask anyone with GitHub access to press one button (Actions → *Refresh
data from Google* → Run workflow).

Formatting tips:
- Dates must look like `2026-10-23` (year-month-day).
- Don't rename or reorder the header row of the spreadsheet tabs.
- **Pictures (flyers, sponsor logos):** upload the image to Google Drive,
  set sharing to "Anyone with the link → Viewer", and paste the share link
  into the `Image`/`Logo` column — the website converts it automatically.
  More image tricks are in `AUTOMATION-GUIDE.md`.

## Option 2: Pages CMS (friendly web editor)

1. Ask the site admin to add your GitHub account to the repository.
2. Go to **https://app.pagescms.org** and sign in with GitHub.
3. Open the site, and you'll see simple forms: **Events**, **Meeting agendas
   & minutes**, **Executive officers**, **Community sponsors**, and **Site
   settings** (school year, contact email, links).
4. Make your change and hit **Save**. The website rebuilds and publishes
   itself automatically — your change is live in about two minutes.

## Option 3: Directly on GitHub (for the curious)

Every list on the website is a small text file you can edit in your browser:
go to the repository → `site/_data/manual/` → pick a file (for example
`events.yaml`) → pencil icon → edit → **Commit changes**. Copy the format of
the entries already in the file.

## Things that update themselves

- **Past events disappear** from the calendar page automatically — no cleanup needed.
- **The school year** shown across the site comes from one setting (Site
  settings → School year). Change it once a year and every page updates.
- **Membership, shop, and sponsor payments** all happen on Givebacks — the
  website just links there. Nothing to maintain.

## Questions?

Email the PTSA at saguarocreekptsa@gmail.com, or open an "Issue" on the
GitHub repository describing what you'd like changed.
