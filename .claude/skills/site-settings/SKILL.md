---
name: site-settings
description: Change site-wide PTSA website settings — school year, motto, mission, membership price, contact email, Facebook/store/district links, or page wording and styling. Use for "update the year", "change the motto", "fix a link", or text/CSS tweaks.
---

# Change site-wide settings, page text, and styling

## Site-wide values — `site/_data/site.yaml`

One file drives every page that mentions these (edit here, never hard-code in templates):

`name`, `school`, `tagline`, `schoolYear`, `motto`, `email`, `facebook`, `store` (Givebacks shop), `givebacks`, `districtPage`, `membershipPrice`, `minutesFolder`, `mission`.

Typical yearly rollover: bump `schoolYear` (e.g. `2027–2028` — use an en dash) and review `membershipPrice`.

Templates reference these as `{{ site.<key> }}`. Before removing or renaming a key, grep `site/*.njk` and `site/_includes/` for usages.

## Page wording — `site/*.njk`

Each page is one Nunjucks template: `index.njk` (home), `calendar.njk`, `sponsor-us.njk`, `community-sponsors.njk`, `officers.njk`, `minutes.njk`. The shared header/nav/footer live in `site/_includes/base.njk`. Edit prose in place; keep links to Givebacks going through `{{ site.store }}`/`{{ site.givebacks }}` rather than raw URLs.

Tone: warm, family-facing, exclamation-friendly ("Sidewinders", "Sidewinder Strong"). Match it.

## Look & feel — `site/assets/css/style.css`

All styling is this one plain-CSS file. No build step for CSS — edit and rebuild.

## Verify and publish

1. `npm run build` and spot-check the affected pages in `_site/` (or `npm run serve` → http://localhost:8080).
2. Commit and push to `main` to deploy (see the `publish-site` skill).
