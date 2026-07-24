---
name: update-sponsors
description: Add, change, or remove a community sponsor, or change sponsorship tiers/prices/benefits on the PTSA website. Use for anything about sponsors, the Sidewinder Strong program, or the sponsor-us page.
---

# Update sponsors and sponsorship tiers

Two different files, two different pages:

- **Who sponsors us** (`/community-sponsors/`): `site/_data/manual/sponsors.yaml` — unless the sponsors Google Sheet is connected and has rows, in which case `site/_data/fetched/sponsors.json` wins and the YAML is ignored. Check `fetched/sponsors.json` first; if it has items, the real source is the Google Sheet — offer to draft the row for the user to paste there.
- **The tier offerings** (`/sponsor-us/`): `site/_data/tiers.yaml` — always this file; there is no Sheet for tiers.

## Adding a sponsor

Entry format in `site/_data/manual/sponsors.yaml`:

```yaml
items:
  - name: Cold Stone Creamery
    tier: Diamond               # MUST match a tier name in site/_data/tiers.yaml
    locatedIn: Houghton Town Center   # optional
    address: 9210 S Houghton Rd Ste 140, Tucson, AZ 85747
    phone: (520) 849-5902
    website: https://www.coldstonecreamery.com
    logo: /assets/img/uploads/…       # optional
```

**Tier names are matched case-insensitively but must exist** in `tiers.yaml` (currently Titanium, Diamond, Platinum, Gold, Silver, Bronze) — the community-sponsors page groups sponsors with the `byTier` filter, so a typo'd tier silently hides the sponsor. After editing, verify the sponsor appears in the built page.

## Changing tiers, prices, or benefits

Edit `site/_data/tiers.yaml`. Each tier has `name`, `price`, `label`, `tagline`, and a `benefits` list. If you **rename or remove a tier**, grep `sponsors.yaml` (and warn about the Google Sheet) for sponsors still referencing the old name — they'd vanish from the page.

## Verify and publish

1. `npm run build`, then grep `_site/community-sponsors/index.html` (or `_site/sponsor-us/index.html`) for the change.
2. Commit and push to `main` to deploy (see the `publish-site` skill).
