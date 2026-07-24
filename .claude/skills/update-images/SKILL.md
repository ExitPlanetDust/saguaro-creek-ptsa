---
name: update-images
description: Replace or add images on the PTSA website — hero banner, logo, join flyer, event flyers, sponsor logos. Use when the user has a new image/flyer/banner to put on the site.
---

# Update site images

Images live in `site/assets/img/` and are copied verbatim to `/assets/img/` at build time (passthrough copy — no resizing or optimization happens).

## The fixed, named images

Replacing these means overwriting the file **keeping the exact same filename**, so no template changes are needed:

| File | Used for |
|---|---|
| `hero-banner.png` | Big banner at the top of the home page |
| `logo.jpg` | Header logo + favicon (`base.njk`) |
| `why-join-ptsa.png` | "Join the PTSA" graphic on the home page |
| `join-flyer.jpg` | Join flyer |

If the new file is a different format (e.g. `.jpg` replacing `.png`), instead update every reference — grep `site/` for the old filename.

## One-off images (event flyers, sponsor logos)

Put volunteer-uploaded images in `site/assets/img/uploads/` (that's the folder Pages CMS uploads to; create it if missing) and reference them as `/assets/img/uploads/<file>` in the relevant YAML (`image:` on an event, `logo:` on a sponsor).

## Before committing

- **Size check:** run `ls -la` on the file. Photos straight off a phone can be 5–10 MB; anything over ~500 KB should be resized/compressed first (macOS: `sips -Z 1600 file.jpg` resizes to max 1600 px). The whole site should stay fast on school-parking-lot cell connections.
- **Alt text:** wherever a template references the image, make sure the `alt=` text describes what the image *says* (many of these images are flyers full of text — the alt text must carry that content).
- `npm run build`, then confirm the file landed in `_site/assets/img/` and looks right via `npm run serve`.
- Commit and push to `main` to deploy (see the `publish-site` skill).
