---
name: site-settings
description: Change site-wide PTSA website settings — school year, motto, mission, membership price, contact email, Facebook/store/district links, or page wording and styling. Use for "update the year", "change the motto", "fix a link", or text/CSS tweaks.
---

# Change site-wide settings, page text, and styling

## Site-wide values — `site/_data/site.yaml`

One file drives every page that mentions these (edit here, never hard-code in templates):

`name`, `school`, `tagline`, `schoolYear`, `motto`, `email`, `facebook`, `store` (Givebacks shop), `givebacks`, `districtPage`, `membershipPrice`, `membershipCount`/`membershipGoal` (home-page goal bar; count 0 hides it), `volunteerForm` (signup form URL; blank falls back to email), `goatcounter` (analytics code; blank disables), `minutesFolder`, `mission`.

Typical yearly rollover: bump `schoolYear` (e.g. `2027–2028` — use an en dash), review `membershipPrice`, and reset `membershipCount` to 0. Update `membershipCount` whenever the user mentions a new member total (the number comes from the Givebacks dashboard).

Templates reference these as `{{ site.<key> }}`. Before removing or renaming a key, grep `site/*.njk` and `site/_includes/` for usages.

## Page wording — `site/*.njk`

Each page is one Nunjucks template: `index.njk` (home, incl. the hero and next-event card), `calendar.njk`, `volunteer.njk`, `about.njk` (mission + officers + how-we-run), `sponsor-us.njk`, `community-sponsors.njk`, `officers.njk`, `minutes.njk` (the last two are off the nav but their URLs still work). The shared header/nav/footer live in `site/_includes/base.njk`. Edit prose in place; keep links to Givebacks going through `{{ site.store }}`/`{{ site.givebacks }}` rather than raw URLs.

Tone: warm, family-facing, exclamation-friendly ("Sidewinders", "Sidewinder Strong"). Match it.

## Look & feel — `site/assets/css/style.css`

All styling is this one plain-CSS file. No build step for CSS — edit and rebuild.

## Verify and publish

1. `npm run build` and spot-check the affected pages in `_site/` (or `npm run serve` → http://localhost:8080).
2. Commit and push to `main` to deploy (see the `publish-site` skill).
