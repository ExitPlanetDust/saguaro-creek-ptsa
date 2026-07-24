// Pulls events, officers, sponsors, and meeting-minutes rows from Google
// Sheets published as CSV, and writes them to site/_data/fetched/*.json.
// When a fetched list has rows, it replaces the matching manual YAML list.
//
// To publish a sheet tab as CSV: Google Sheets → File → Share → Publish to
// web → pick the tab → "Comma-separated values (.csv)" → copy the URL.
// Set the URLs as GitHub Actions repository variables:
//   SHEET_EVENTS_CSV_URL    columns: Title, Date, End Date, Time, Location, Details, Link
//   SHEET_OFFICERS_CSV_URL  columns: Name, Title, Email
//   SHEET_SPONSORS_CSV_URL  columns: Name, Tier, Located In, Address, Phone, Website, Logo
//   SHEET_MINUTES_CSV_URL   columns: Date, Title, Link
// Dates must be YYYY-MM-DD (in Sheets: Format → Number → Custom date).
//
// Unset URLs are skipped; failed fetches keep the previous JSON.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FETCHED_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "site",
  "_data",
  "fetched",
);

// header-name → JSON key
const KEY_MAP = {
  "title": "title",
  "date": "date",
  "end date": "endDate",
  "enddate": "endDate",
  "time": "time",
  "location": "location",
  "details": "details",
  "description": "details",
  "link": "link",
  "url": "link",
  "name": "name",
  "email": "email",
  "email address": "email",
  "tier": "tier",
  "located in": "locatedIn",
  "locatedin": "locatedIn",
  "address": "address",
  "phone": "phone",
  "website": "website",
  "logo": "logo",
};

// Sheets' "Title" column means different things per sheet; officers use it as
// their role, events as the event name. The map above handles both since both
// serialize to sensible keys ("title"); officers.njk reads o.title.

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

function rowsToItems(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => KEY_MAP[h.trim().toLowerCase()] || null);
  return rows.slice(1).map((r) => {
    const item = {};
    headers.forEach((key, i) => {
      const val = (r[i] || "").trim();
      if (key && val) item[key] = val;
    });
    return item;
  }).filter((item) => Object.keys(item).length > 0);
}

const SOURCES = {
  events: process.env.SHEET_EVENTS_CSV_URL,
  officers: process.env.SHEET_OFFICERS_CSV_URL,
  sponsors: process.env.SHEET_SPONSORS_CSV_URL,
  minutes: process.env.SHEET_MINUTES_CSV_URL,
};

for (const [name, url] of Object.entries(SOURCES)) {
  if (!url) {
    console.log(`SHEET_${name.toUpperCase()}_CSV_URL not set — skipping ${name}.`);
    continue;
  }
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = rowsToItems(parseCSV(await res.text()));
    const out = path.join(FETCHED_DIR, `${name}.json`);
    fs.writeFileSync(
      out,
      JSON.stringify({ source: "google-sheet", fetchedAt: new Date().toISOString(), items }, null, 2) + "\n",
    );
    console.log(`Wrote ${items.length} ${name} rows.`);
  } catch (err) {
    console.error(`${name} sheet fetch failed (keeping previous data): ${err.message}`);
  }
}
