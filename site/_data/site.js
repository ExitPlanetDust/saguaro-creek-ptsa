// Site settings = siteDefaults.yaml, overridden by the Settings tab of the
// Google Sheet (fetched into fetched/settings.json by scripts/fetch-sheets.mjs).
// Only the whitelisted keys below can be overridden from the sheet, so a typo
// or stray row there can never break links or inject unexpected fields.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const DIR = path.dirname(fileURLToPath(import.meta.url));

// Keys volunteers may override from the sheet; numbers are coerced.
const SHEET_KEYS = new Set([
  "schoolYear",
  "membershipCount",
  "membershipGoal",
  "membershipPrice",
  "volunteerForm",
  "email",
  "facebook",
  "motto",
  "mission",
  "firstYearMembers",
  "firstYearFundraisers",
  "firstYearRaised",
]);
const NUMBER_KEYS = new Set(["membershipCount", "membershipGoal"]);

export default function () {
  const site = yaml.load(fs.readFileSync(path.join(DIR, "siteDefaults.yaml"), "utf8"));
  try {
    const fetched = JSON.parse(fs.readFileSync(path.join(DIR, "fetched", "settings.json"), "utf8"));
    for (const row of fetched.items || []) {
      const key = (row.setting || "").trim();
      const val = (row.value || "").trim();
      if (!SHEET_KEYS.has(key) || !val) continue;
      site[key] = NUMBER_KEYS.has(key) ? Number(val.replace(/[^0-9.]/g, "")) : val;
    }
  } catch {
    // No fetched settings yet — defaults apply.
  }
  return site;
}
