---
name: add-event
description: Add, change, or remove an event on the PTSA website (meetings, spirit days, restaurant nights, book fairs). Use whenever the user mentions putting something on the calendar or events page.
---

# Add or edit an event

Events shown on `/calendar/` come from three sources, merged and deduplicated by date+title:

1. `site/_data/fetched/events.json` — nightly pull from the events Google Sheet
2. `site/_data/fetched/gcalEvents.json` — nightly pull from Google Calendar
3. `site/_data/manual/events.yaml` — the manual fallback list

**Precedence rule:** if `fetched/events.json` has any rows (`items` non-empty), it **wins** and the manual YAML is ignored (Calendar events are always merged in additionally). Check that file first. If the Sheet is connected and populated, tell the user the real source of truth is the Google Sheet — editing the YAML will have no effect — and offer to draft the row for them to paste into the Sheet instead.

## Editing the manual list

Edit `site/_data/manual/events.yaml`. Entry format (only `title` and `date` are required):

```yaml
items:
  - title: Welcome Back Pizza Night
    date: 2026-07-31            # YYYY-MM-DD, bare (unquoted) is fine
    endDate: 2026-08-02         # only for multi-day events (book fairs etc.)
    time: 5:00–8:00 pm          # free text; use an en dash – between times
    location: Peter Piper Pizza | 9545 E Old Spanish Trail, Tucson, AZ 85748
    details: >-
      Optional longer description shown on the calendar page.
    link: https://…             # optional flyer/signup link
    image: /assets/img/uploads/… # optional flyer image
```

Keep the list roughly in date order for human readability (the build sorts anyway).

## Behavior to remember (and tell the user)

- **Past events disappear automatically** — never delete an entry just because it happened; only delete mistakes. Dates compare in America/Phoenix time.
- A manual entry with the **same date and title** as a Calendar event is deduplicated, so double-listing is harmless.
- Recurring events (e.g. monthly Spirit Shirt Day) are just repeated entries with different dates — add each occurrence.

## Verify and publish

1. `npm run build`, then check the event renders in `_site/calendar/index.html` (grep for the title).
2. Commit and push to `main` — the *Deploy site* GitHub Action publishes automatically (see the `publish-site` skill).
