import yaml from "js-yaml";
import { HtmlBasePlugin } from "@11ty/eleventy";

const TZ = "America/Phoenix";

function toDayString(value) {
  // YAML parses bare dates into Date objects (UTC midnight); Sheets/JSON give
  // strings. Normalize both to "YYYY-MM-DD".
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function parseLocalDate(day) {
  // "2026-07-16" -> Date at local noon (avoids UTC off-by-one)
  return new Date(`${toDayString(day)}T12:00:00`);
}

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));
  eleventyConfig.addPassthroughCopy({ "site/assets": "assets" });
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Prefer the Google-Sheet-fetched list when it has rows, else the manual YAML list.
  eleventyConfig.addFilter("preferItems", (fetched, manual) => {
    const f = fetched && fetched.items;
    if (Array.isArray(f) && f.length > 0) return f;
    return (manual && manual.items) || [];
  });

  // Merge event lists, dedupe by date+title, drop past events, sort ascending.
  eleventyConfig.addFilter("upcomingEvents", (lists) => {
    const merged = [];
    const seen = new Set();
    for (const list of lists) {
      for (const raw of list || []) {
        if (!raw || !raw.date || !raw.title) continue;
        const e = {
          ...raw,
          date: toDayString(raw.date),
          endDate: raw.endDate ? toDayString(raw.endDate) : undefined,
        };
        const key = `${e.date}|${String(e.title).trim().toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(e);
      }
    }
    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: TZ }),
    );
    today.setHours(0, 0, 0, 0);
    return merged
      .filter((e) => parseLocalDate(e.endDate || e.date) >= today)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  });

  eleventyConfig.addFilter("readableDate", (isoDay) =>
    parseLocalDate(isoDay).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  );

  eleventyConfig.addFilter("mon", (isoDay) =>
    parseLocalDate(isoDay)
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase(),
  );

  eleventyConfig.addFilter("dayNum", (isoDay) => parseLocalDate(isoDay).getDate());

  eleventyConfig.addFilter("byTier", (sponsors, tierName) =>
    (sponsors || []).filter(
      (s) => String(s.tier || "").toLowerCase() === String(tierName).toLowerCase(),
    ),
  );

  // "Add to Google Calendar" link for an all-day event (end date is exclusive).
  eleventyConfig.addFilter("gcalLink", (e) => {
    const compact = (day) => toDayString(day).replaceAll("-", "");
    const end = parseLocalDate(e.endDate || e.date);
    end.setDate(end.getDate() + 1);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: e.title,
      dates: `${compact(e.date)}/${compact(end.toISOString())}`,
      details: [e.time, e.details].filter(Boolean).join(" — "),
      location: e.location || "",
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  });

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return {
    dir: {
      input: "site",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
