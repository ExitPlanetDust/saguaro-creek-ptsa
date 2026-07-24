// Resolves which seasonal theme is active for this build.
// Priority: THEME env var (local testing) > `active:` in theme.yaml (when not
// "auto") > the date calendar in theme.yaml > default.
// Templates use it as {{ activeTheme.name }} / {{ activeTheme.banner }}.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const configPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "theme.yaml");

function todayMonthDay() {
  // "YYYY-MM-DD" in Arizona time, regardless of where the build runs
  const iso = new Date().toLocaleDateString("en-CA", { timeZone: "America/Phoenix" });
  return iso.slice(5); // "MM-DD"
}

function inRange(day, from, to) {
  // Inclusive MM-DD range; from > to means the range wraps the year end
  if (from <= to) return day >= from && day <= to;
  return day >= from || day <= to;
}

export default function () {
  const config = yaml.load(fs.readFileSync(configPath, "utf8")) || {};
  const themes = config.themes || {};

  const pick = (name, source) => {
    if (!themes[name]) {
      console.warn(`[theme] ${source} names unknown theme "${name}" — using default. Known: ${Object.keys(themes).join(", ")}`);
      return null;
    }
    return { name, ...themes[name] };
  };

  let theme =
    (process.env.THEME && pick(process.env.THEME, "THEME env var")) ||
    (config.active && config.active !== "auto" && pick(config.active, "theme.yaml `active`")) ||
    null;

  if (!theme) {
    const day = todayMonthDay();
    const match = (config.calendar || []).find((r) => inRange(day, r.from, r.to));
    if (match) theme = pick(match.theme, "calendar entry");
  }

  theme = theme || { name: "default", ...(themes.default || {}) };
  console.log(`[theme] Active theme: ${theme.name}`);
  return theme;
}
