# Nujeen.org

Trilingual (English / Arabic / Kurdish) website for **Nujeen for Family
Democratizing Organization**, an NGO in Duhok, Kurdistan Region of Iraq. Built
with **Astro + Keystatic + Tailwind**, output as a plain static site.

See [`NUJEEN_BUILD_BRIEF.md`](./NUJEEN_BUILD_BRIEF.md) for the original brief
and [`_design-reference/`](./_design-reference/) for the approved design this
site was ported from.

## Stack

- **Astro** (static output / SSG) — the whole site builds to plain HTML/CSS/JS
- **Keystatic** — Git-based CMS; content lives as YAML files in [`content/`](./content/)
- **Tailwind CSS** — all design tokens centralized in [`tailwind.config.mjs`](./tailwind.config.mjs)

## Local development

```bash
npm install
npm run dev
```

This starts the site **and** the Keystatic admin at `http://localhost:4321/keystatic`.

```bash
npm run build    # production static build -> dist/
npm run preview  # serve the production build locally
```

Note there are **two** Astro configs:

- [`astro.config.mjs`](./astro.config.mjs) — production. Pure static output, no admin, no Node runtime needed.
- [`astro.config.dev.mjs`](./astro.config.dev.mjs) — adds the Keystatic admin UI. Used only by `npm run dev`.

The admin needs server-rendered API routes to write files to disk, which is
incompatible with a plain static build. Since the production site never needs
to serve the admin (see workflow below), it's simply left out of
`astro.config.mjs`/`npm run build` entirely — the deployed site stays 100%
static with no Node runtime required on the host.

## Editing content (for the client / editor)

Content is edited through the Keystatic admin at `/keystatic` when running
`npm run dev` on your own machine (or a teammate's) — there is no
always-on hosted admin for this static-storage setup.

1. Run `npm run dev` and open `http://localhost:4321/keystatic`.
2. Edit Activities, Projects, Home, About, Contact, or Site settings.
3. Click **Save** — Keystatic writes the change to files under `content/`
   and `public/uploads/` on your machine.
4. Commit and push those file changes to Git as you would any other change.
5. Whoever deploys the site runs `npm run build` and uploads the new
   `dist/` folder (see **Deployment** below).

**This is the one thing that's different from WordPress:** saving in
Keystatic does *not* publish instantly. A save updates the content files;
the site only reflects that change after the next `npm run build` +
redeploy. Plan a short delay between "save" and "live."

### The shared content pattern

Activities and Projects are both instances of the same shape (see
`keystatic.config.ts` → `sharedContentSchema()`): title, summary, body,
featured image, gallery, date, category, documents, status, SEO fields — all
localized to en/ar/ku where relevant. Adding a third collection (e.g. "News")
means copying that function's call, nothing more.

## Internationalization

- Locales: `en` (LTR), `ar` (RTL), `ku` — Kurdish (RTL, Arabic script).
  **Dialect note:** the seeded `ku` content is currently written in Sorani.
  Nujeen is based in Duhok (Badini-speaking region), so it should be
  **Kurmanji/Badini** in Arabic script instead — see "Known placeholders"
  and the translation export/import workflow below.
- Every page lives under `/en/...`, `/ar/...`, `/ku/...` via
  `src/pages/[locale]/`.
- `ar`/`ku` pages render with `dir="rtl"` and the Arabic webfont
  (IBM Plex Sans Arabic, applied to both body text and headings — Fraunces,
  the Latin display serif, has no Arabic glyphs); layout uses Tailwind
  logical properties (`ps-`, `me-`, `start-`, `rtl:`) so mirroring is
  automatic, not hand-patched per page.
- UI chrome strings (nav labels, buttons, "Download", etc.) live in
  `src/i18n/ui.ts`. Editorial content is localized directly in Keystatic.

## Known placeholders — replace before launch

Per the build brief's "placeholder honesty" rule, these are illustrative and
must be swapped for the client's real material before going live:

- **Activities photography is now real** (from `_client-content/nuj-activities/`).
  Featured images live flat at `public/uploads/activities/<slug>.jpg`
  (matching the `directory`/`publicPath` configured in
  `keystatic.config.ts`); gallery photos live at
  `public/uploads/activities/gallery/<slug>-N.jpg`. Seven of the eight
  activities have a populated gallery (`ifmsa-golden-sponsorship` only had
  one source photo, so its gallery is empty by design). The home
  hero image (`public/uploads/home/hero.jpeg`) is still the design
  mockup's sample photo; replace it via Keystatic's Home → Hero image
  field. `public/uploads/activities/placeholder.svg` is only a fallback
  shown if an entry has no featured image set — not used by any real entry.
- **Activity dates are not set — launch blocker.** The client's source
  material for all 8 real activities had no dates, and none were invented
  (see build brief's "don't fabricate" principle). Each entry's `date`
  field is empty in Keystatic → Activities → (entry) → Date; the listing
  and detail pages already degrade gracefully (no date shown, no "Invalid
  Date", stable sort with undated entries sorting last), but real dates
  must be filled in before launch for the dates and sort order to be
  meaningful.
- **Impact numbers** on the homepage (8+ years, 50+ workers, etc.) — carried
  over from the design mockup as illustrative figures. Editable in
  Keystatic → Home → Impact stats; the client should supply real figures.
- **Projects collection is intentionally empty.** No real Projects content
  has been supplied yet — the collection, schema, listing, and detail
  pages are fully built and ready for the editor to populate.
- **Arabic and Kurdish translations on all real Activities (and the rest of
  the site) are machine-translated (LLM-authored), not reviewed by a native
  speaker.** Each of the 8 real Activities carries a `# TRANSLATION STATUS`
  comment at the top of its YAML file saying so explicitly. **The Kurdish
  is Sorani, filled in only for site-wide consistency — the client's actual
  dialect is Kurmanji/Badini in Arabic script** (Duhok is a Badini-speaking
  area). This is a launch blocker: use the export/import workflow below to
  send `translations-export.json` to a native speaker/translator for real
  Arabic review and Badini re-translation, then re-import.

## Contact form

The Contact page (`src/components/ContactForm.astro`) sends messages via
[Web3Forms](https://web3forms.com) — a plain `fetch()` POST from the
browser, no server or API route needed, so it works unchanged on a static
host.

**Setup before launch:**

1. Get a free access key at https://web3forms.com (just verify an email —
   no account/dashboard required).
2. Copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_ACCESS_KEY`.
3. Rebuild (`npm run build`). Until this is set, the form renders a visible
   warning banner and won't send — this is intentional so a missing key is
   obvious rather than silently failing.

The key is a `PUBLIC_`-prefixed env var by design: Astro inlines it into the
client bundle, and Web3Forms access keys are meant to be public (same idea
as a reCAPTCHA site key) — never put a real secret in a `PUBLIC_` var.
The form has success/error states and is fully localized (en/ar/ku) via
`src/i18n/ui.ts`. A direct `mailto:` link is shown alongside it as a
fallback.

## Translation export / import

`translations-export.json` (repo root) holds every translatable string —
both UI chrome (`src/i18n/ui.ts`) and localized Keystatic content (Home,
About, Contact, Site settings, Activities) — as flat `key: { en, ar, ku }`
entries. Phone numbers, emails, and proper nouns (IFMSA, PDF) are excluded;
see the file's own `_meta` block for the full convention.

**To get new translations:** send `translations-export.json` to a
translator, asking them to fill/correct the `ar` and `ku` values against
the same keys (the `ku` values should be **Kurmanji/Badini** in Arabic
script, not Sorani — see "Known placeholders" above). Do not add, remove,
or rename keys.

**To import it back:** hand the filled-in file back to whoever maintains
this repo (or ask Claude Code) to write the `ar`/`ku` values into
`src/i18n/ui.ts` and the corresponding `content/*.yaml` files, matched by
each entry's key. Re-run `npm run build` afterward.

## Deployment

Primary target is **static hosting on cPanel** (Verpex) — no Node runtime or
database required on the host:

```bash
npm run build
# upload the contents of dist/ to the host's public_html (or equivalent)
```

Also works unchanged on Vercel/Netlify/Coolify as a static site. Set the
`SITE_URL` environment variable to override the default site URL used for
canonical/OG tags.

## Project structure

```
keystatic.config.ts        Keystatic collections/singletons + shared content schema
tailwind.config.mjs         Design tokens (colors, fonts, radii) — edit this to reskin
content/                    Keystatic-managed content (YAML)
public/uploads/             Keystatic-managed media (images, PDFs)
src/
  components/               Structure-first components (Card, Gallery, DocumentList, Hero, PageHeader, Header, Footer, LangSwitcher)
  i18n/                     Locale list, UI-string dictionary, pick()/localePath() helpers
  layouts/BaseLayout.astro  <html> shell, fonts, header/footer wiring
  lib/                      Keystatic reader wrapper, markdown renderer, content helpers
  pages/[locale]/           All routed pages (home, activities, projects, about, contact)
  pages/404.astro           Not-found page (not locale-prefixed)
  styles/global.css         Tailwind layers + the handful of shared component classes (.btn, .chip, .article-body, ...)
```

## Reusable base (phase 2)

This project was built "token-centralized" per the brief: every color and
font lives in `tailwind.config.mjs`, components use only semantic Tailwind
classes (`bg-ink`, `text-blue`, `font-serif` — never raw hex), and the
Activities/Projects pattern is copy-paste reusable. To spin up a new client
from this base: reset the tokens in `tailwind.config.mjs`, swap the fonts,
and replace the seeded `content/` with the new client's real copy.
