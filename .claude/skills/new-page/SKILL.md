---
name: new-page
description: Add a brand-new page to the PTSA website (e.g. a fundraising page, volunteer signup page, FAQ). Use when the user wants a page that doesn't exist yet, not for editing existing pages.
---

# Add a new page

## Steps

1. **Create `site/<slug>.njk`** (kebab-case slug; it becomes the URL `/<slug>/`):

   ```njk
   ---
   layout: base.njk
   title: Volunteer FAQ
   permalink: /volunteer-faq/
   ---
   <section class="section">
     <h1>Volunteer FAQ</h1>
     <p>…</p>
   </section>
   ```

   Look at an existing simple page (`site/officers.njk` or `site/minutes.njk`) and copy its structure and CSS classes (`section`, `btn`, `button-row`, `split`, `callout`) — don't invent new styling unless asked. Site-wide values are available as `{{ site.<key> }}` from `site/_data/site.yaml`.

2. **Add it to the nav** in `site/_includes/base.njk` (the `<nav class="mainnav">` block), unless the user wants it unlisted (linked from a flyer/QR code only). Nav space is limited — ask before adding a seventh item; linking from the home page may be better.

3. **If the page needs volunteer-editable data** (a list of things that changes over time), don't hard-code it: add a `site/_data/manual/<thing>.yaml` file, loop over it in the template, **and add a matching form to `.pages.yml`** so volunteers can edit it in Pages CMS. Follow the existing patterns in both files.

4. **Verify:** `npm run build`, check `_site/<slug>/index.html`, click through nav links via `npm run serve`.

5. Commit and push to `main` to deploy (see the `publish-site` skill).

## Conventions

- Warm, family-facing tone; short sections with `<h2>` headings; links to money/membership go through `{{ site.store }}` (Givebacks) — this site never handles payments itself.
- Internal links are absolute and end with `/` (e.g. `/calendar/`) — the HtmlBase plugin rewrites them for the GitHub Pages path prefix; hard-coding the repo name in links breaks local preview.
