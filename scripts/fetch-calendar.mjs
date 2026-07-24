// Pulls upcoming events from a public Google Calendar (ICS feed) and writes
// them to site/_data/fetched/gcalEvents.json, where the calendar page merges
// them with manually-entered events.
//
// Configure via the GCAL_ICS_URL environment variable (set as a GitHub
// Actions repository variable). To find the URL: Google Calendar → Settings →
// [your calendar] → "Integrate calendar" → "Public address in iCal format".
// The calendar must be public ("Make available to public").
//
// If GCAL_ICS_URL is unset or the fetch fails, the previous JSON is left
// untouched so the site keeps working.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ical from "node-ical";

const TZ = process.env.SITE_TZ || "America/Phoenix";
const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "site",
  "_data",
  "fetched",
  "gcalEvents.json",
);

const url = process.env.GCAL_ICS_URL;
if (!url) {
  console.log("GCAL_ICS_URL not set — skipping Google Calendar fetch.");
  process.exit(0);
}

const fmtDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const fmtTime = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});

const day = (d) => fmtDay.format(d); // YYYY-MM-DD
const time = (d) => fmtTime.format(d).toLowerCase().replace(" ", " ");

function toItem(title, start, end, ev) {
  const allDay = ev.datetype === "date";
  const item = { title, date: day(start) };
  if (end) {
    // ICS all-day DTEND is exclusive; pull back one day.
    const endAdj = allDay ? new Date(end.getTime() - 24 * 3600 * 1000) : end;
    const endDay = day(endAdj);
    if (endDay > item.date) item.endDate = endDay;
  }
  if (!allDay && end) item.time = `${time(start)}–${time(end)}`;
  else if (!allDay) item.time = time(start);
  if (ev.location) item.location = String(ev.location);
  if (ev.description) item.details = String(ev.description).replace(/\\n/g, " ").trim().slice(0, 500);
  if (ev.url) item.link = String(ev.url.val || ev.url);
  return item;
}

try {
  const data = await ical.async.fromURL(url);
  const now = new Date();
  const horizon = new Date(now.getTime() + 400 * 24 * 3600 * 1000);
  const past = new Date(now.getTime() - 2 * 24 * 3600 * 1000);
  const items = [];

  for (const ev of Object.values(data)) {
    if (ev.type !== "VEVENT") continue;
    const durationMs =
      ev.end && ev.start ? ev.end.getTime() - ev.start.getTime() : 0;

    if (ev.rrule) {
      const dates = ev.rrule.between(past, horizon, true);
      const exdates = new Set(
        Object.values(ev.exdate || {}).map((d) => day(d)),
      );
      for (const d of dates) {
        if (exdates.has(day(d))) continue;
        const override = Object.values(ev.recurrences || {}).find(
          (r) => day(r.start) === day(d),
        );
        const source = override || ev;
        const start = override ? override.start : d;
        const end = durationMs ? new Date(start.getTime() + durationMs) : source.end;
        items.push(toItem(String(source.summary || ev.summary), start, end, source));
      }
    } else if (ev.start >= past && ev.start <= horizon) {
      items.push(toItem(String(ev.summary || "Event"), ev.start, ev.end, ev));
    }
  }

  items.sort((a, b) => a.date.localeCompare(b.date));
  fs.writeFileSync(
    OUT,
    JSON.stringify({ source: "google-calendar", fetchedAt: now.toISOString(), items }, null, 2) + "\n",
  );
  console.log(`Wrote ${items.length} events to ${path.relative(process.cwd(), OUT)}`);
} catch (err) {
  console.error(`Calendar fetch failed (keeping previous data): ${err.message}`);
  process.exit(0);
}
