# Nujeen.org — Build Brief for Claude Code

> **Read this whole file before writing any code.** You are building a real production website for the Nujeen organization, AND building it so a clean reusable base template can be extracted from it afterward (see §9). Two outcomes, one build.
>
> **Most important workflow rule:** the approved design ALREADY EXISTS as static HTML in `_design-reference/`. Your job is to **PORT** it — translate that existing markup, styling, and content into Astro + Tailwind components. **Do NOT redesign, reinterpret, or regenerate the look, and do NOT invent placeholder copy.** Lift the real markup structure, the exact design values, and the actual text content from those files. Creating fresh designs or dummy content instead of porting what's there is the main failure mode for this build — avoid it.

---

## 0. Folder layout (what's already in this repo)

```
nujeen-site/
├── NUJEEN_BUILD_BRIEF.md        ← this file
├── _design-reference/           ← APPROVED design — the source of truth
│   ├── index.html               ← homepage design + content
│   ├── activities.html          ← listing page design + content
│   ├── activity.html            ← detail page design + content (incl. PDF/reports block)
│   ├── hero.png, 1.png … 4.png  ← sample images
│   └── nujeen_logo.png          ← logo
└── (you build the Astro project around/alongside this)
```

Open and read the three HTML files in `_design-reference/` first. They contain the exact layout, the full design-token CSS (`:root` variables), and the real copy for the site. Everything you build should match them.

---

## 1. What we are building

A trilingual (English / Arabic / Kurdish Sorani) content website for **Nujeen for Family Democratizing Organization** — an NGO in Duhok, Kurdistan Region of Iraq, working on women's rights, family planning, and sexual & reproductive health and rights (SRHR).

Content-managed by a **non-technical editor** (ex-WordPress/Drupal) via a friendly form UI. Mostly static pages plus a few dynamic content types.

### Stack (locked)
| Layer | Choice |
|---|---|
| Framework | **Astro** (latest stable) |
| CMS | **Keystatic** (Git-based; content stored as files in the repo; form-based admin UI) |
| Styling | **Tailwind CSS** — with all design tokens defined in `tailwind.config` using **semantic names** (see §3) |
| Content format | Markdown/MDX + JSON/YAML (Keystatic default) |
| i18n | Astro i18n routing, locale-prefixed URLs, full RTL |
| Output | **Static build (SSG)** — plain HTML/CSS/JS, deployable to cPanel and anywhere |

### Why this stack
Lightweight content sites don't need a server or database. Keystatic keeps content in the repo (zero third-party services); Astro outputs static files that run on cheap/simple hosting including cPanel. This is our house pattern for small NGO/business/portfolio sites going forward.

---

## 2. Design & content source — PORT, don't regenerate (read carefully)

The `_design-reference/` HTML files are the visual AND content source of truth.

- **Markup/layout:** reproduce the structure of each page faithfully in Astro components. Same sections, same hierarchy, same responsive behavior.
- **Design values:** the `:root` CSS variables in those files ARE the design tokens. Move them into `tailwind.config` (§3). Match spacing, font sizes, radii, hover behavior.
- **Content:** the headings, body copy, focus areas, activity titles/descriptions, impact stats, contact info, footer text in those files are the REAL content. **Extract this text and use it to seed the Keystatic content collections and globals.** Do not replace it with lorem ipsum or invented copy.
- Only where the reference is clearly a placeholder (e.g. sample gradient images, illustrative stat numbers) treat it as replaceable — and flag those per §10.

If you find yourself writing new design CSS from scratch or making up page copy, stop — the answer is in `_design-reference/`.

---

## 3. Tailwind + tokens (this is what makes the base reusable — LOAD-BEARING)

We will clone this project to build other clients by reskinning. That only works if styling is centralized:

1. **Define all design tokens in `tailwind.config`** (colors, fontFamily, spacing scale, borderRadius, etc.) using **semantic names** — e.g. `colors: { blue, blueBright, ink, bone, bone2, rose, roseSoft, teal, grey, line }` mapped to the hex values from the reference `:root`. Fonts: `serif: Fraunces`, `sans: Inter`, plus an Arabic family.
2. **Components use semantic utility classes only** — `bg-ink text-bone`, `text-blue`, `font-serif`. **NEVER use arbitrary values like `bg-[#10242E]` in markup.** Arbitrary hex in components pollutes the base and breaks the reskin-by-config plan.
3. Reskinning a future client = editing `tailwind.config` (and fonts), nothing else.
4. Keep components **structure-first / identity-light**: a `Card`, `Hero`, `Gallery`, `DocumentList`, `PageHeader` encode layout+behavior, not Nujeen's specific look. Nujeen's identity comes only from the config tokens + content.

Treat rules 1–2 as hard requirements. They are the whole reason the base will be reusable.

### Tokens (from `_design-reference` `:root`)
```
blue #13526E · blueBright #1B6CA8 · ink #10242E · bone #FAF8F4 · bone2 #F2EEE7
rose #C97E76 · roseSoft #F0E2DE · teal #2F8E78 · grey #52606A · line rgba(16,36,46,.10)
```
Fonts: **Fraunces** (serif, display), **Inter** (sans, body/UI), **IBM Plex Sans Arabic** or **Noto Sans Arabic** (ar/ku).

---

## 4. The shared content-type pattern (the reusable core)

~80% of our clients' dynamic content follows ONE shape. Define it once, reuse it. **Every dynamic collection uses this same field structure:**

- `title` — text, **localized**, required
- `slug` — string, unique, from title
- `summary` — short text, localized (cards + meta description)
- `body` — rich text (Markdown/MDX), localized — main content
- `featuredImage` — image, required
- `gallery` — array of images (optional)
- `date` — date
- `category` — optional select/tag
- `documents` — optional array of `{ file (PDF), label (localized), language }` — powers the **Reports & Documents** download block seen in `activity.html`
- `status` — draft / published
- `seo` — optional `{ metaTitle, metaDescription }`, localized

### Nujeen's dynamic collections (max 3)
1. **Activities** — awareness sessions, trainings, outreach, camp work
2. **Projects** — larger programs/initiatives
3. **News** — optional, only if wanted later

All three are instances of the shared pattern. Define the pattern once as a copyable shape; don't invent divergent schemas.

### Globals / static content (editable in Keystatic, not hardcoded)
- **Home** — hero headline, dek, hero image, quote, impact stats (array of `{number, label}`), all localized — seed from `index.html`
- **SiteSettings** — nav, contact info (phones, email, address), office hours, socials, footer text — seed from the reference footer/topbar
- **About** — rich-text page(s)
- **Contact** — contact details (+ optional mailto/simple form)

---

## 5. Internationalization + RTL (get this right)

- Locales: **en (LTR)**, **ar (RTL)**, **ku Sorani (RTL)**.
- Locale-prefixed routes (`/en/…`, `/ar/…`, `/ku/…`); language switcher already in the design (topbar EN / عربی / کوردی).
- For ar/ku: set `dir="rtl"` on `<html>`, mirror layout, use the Arabic webfont. Use Tailwind's **logical properties and `rtl:` variant** so mirroring is systematic, not per-page hacks. The old Nujeen site's biggest failure was Arabic/Kurdish in a Latin LTR layout — do not repeat that.
- Content fields localized in Keystatic. UI strings ("Read more", "Download", nav labels) come from a small per-locale dictionary, not hardcoded English.

---

## 6. Pages to build (match `_design-reference/`)

1. **Home** (`/[locale]/`) — port `index.html`: hero, focus areas (hairline list), recent Activities (dynamic), quote, impact stats, CTA, footer
2. **Activities listing** (`/[locale]/activities`) — port `activities.html`: card grid, category chips (real filtering), search, pagination
3. **Activity detail** (`/[locale]/activities/[slug]`) — port `activity.html`: feature image, rich-text body, inline figure, gallery, **documents/PDF block**, related items
4. **Projects listing + detail** — same pattern
5. **(Optional) News** — same pattern
6. **About** (`/[locale]/about`)
7. **Contact** (`/[locale]/contact`)
8. **404** + per-locale SEO metadata + Open Graph

---

## 7. Deployment

- **Primary target: static output on cPanel** (Verpex). `astro build` → deploy `dist/`. No Node runtime or database needed on the host because the site is static — this is the main reason for the stack.
- Also fine on Vercel/Netlify or a future Coolify VPS.
- **Keystatic editing workflow:** editor uses the Keystatic admin; saves commit to Git and trigger a rebuild/redeploy. Document clearly in the README that "save = publish after a short rebuild," which differs from WordPress's instant save. This is the one unfamiliar concept for the client.
- Keep config (base URL etc.) in config/env, not hardcoded, so clones adapt easily.

---

## 8. Build order

1. Scaffold Astro + Keystatic + Tailwind. Get the Keystatic admin running with one example collection.
2. **Set up `tailwind.config` tokens FIRST** (from §3), before styling anything — this enforces the centralized-token rule. Wire up the three fonts.
3. Read `_design-reference/` and define the shared content-type pattern; implement **Activities** fully as the reference collection; duplicate the shape for **Projects**.
4. Add Home / SiteSettings / About / Contact globals; **seed them with the real content extracted from the reference HTML** (§2).
5. Implement i18n routing + RTL + Arabic font + UI-string dictionaries.
6. Build structure-first components (Hero, Card, Gallery, DocumentList, PageHeader, Footer, LangSwitcher…) using semantic Tailwind classes.
7. Build the pages by **porting** each reference HTML file into Astro components.
8. Seed sample Activities/Projects from the reference content so the site shows populated.
9. Verify: static build deploys cleanly; ar/ku render RTL correctly; the design matches `_design-reference/`.
10. Write the README: local dev, the Keystatic editing workflow for the client, build/deploy steps.

---

## 9. Phase 2 — extract the reusable base (after Nujeen works)

Once Nujeen is complete/approved, create a clean base for future clients:

- Separate tagged state (own repo `astro-keystatic-base` or a tagged branch). Note in Nujeen's README which base version it derives from.
- **Keep** all architecture: content-type pattern, i18n/RTL, Keystatic config, components, page logic, deploy setup, Tailwind structure.
- **Reset** `tailwind.config` tokens to a neutral palette + system/neutral fonts (strip Nujeen's blue/rose/Fraunces).
- **Replace** Nujeen content with ONE neutral example entry per collection; neutralize globals (placeholder nav/contact/home).
- Add `HOW_TO_CLONE.md`: how to start a new client — clone → edit `tailwind.config` tokens + fonts → rename/duplicate collections → drop in the client's design/content.

Because Nujeen was built token-centralized (§3) and structure-first, this is light: reset config + swap content, not a refactor.

---

## 10. Watch-outs

- **Port, don't regenerate** (§2) — the design and copy exist in `_design-reference/`; translate them, don't reinvent.
- **No arbitrary hex in components** (§3) — tokens live in `tailwind.config`; this is what makes the base reusable.
- **RTL / Arabic** — test explicitly with real Arabic + Kurdish text; use logical properties / `rtl:` variant.
- **Editor workflow clarity** — explain Git-based save→rebuild plainly in the README; it's the one thing that differs from WordPress.
- **Placeholder honesty** — impact stats (8+ years, 50+ workers, etc.) and the sample gradient/`.png` images in the reference are illustrative. Make stats editable in Keystatic; the client will supply real figures + real photography. Don't present placeholders as fact.
- **Keep it lightweight** — no heavy UI kits; the appeal of this stack is that it stays small and fast.

---

## 11. Reference summary

| Item | Value |
|---|---|
| Design source | `_design-reference/` (index.html, activities.html, activity.html + images) |
| Live concept | https://amdoskey.github.io/nujeen-site/ |
| Repo | https://github.com/amdoskey/nujeen-site |
| Org | Nujeen for Family Democratizing Organization |
| Location | Duhok, Kurdistan Region of Iraq |
| Languages | English (LTR), Arabic (RTL), Kurdish Sorani (RTL) |
| Stack | Astro + Keystatic + Tailwind, static output |
| Content types | Activities, Projects (+ optional News) — shared pattern: title, summary, body, image, gallery, documents |
| Deploy target | Static on cPanel (Verpex); also Vercel/Netlify/Coolify |
| Dual goal | Finished Nujeen site + extractable neutral base (§9) |

---

*End of brief. PORT the existing design and content from `_design-reference/`; build on Astro + Keystatic + Tailwind with tokens centralized in config; keep it trilingual/RTL and static; and leave a clean base behind (§9).*
