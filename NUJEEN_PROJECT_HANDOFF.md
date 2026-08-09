# Nujeen.org — Project Handoff / Status

> **What this file is:** a plain-English "where things actually stand" tracker,
> updated at the end of each working session so the next session (or the next
> person) doesn't have to reconstruct state from git log. For the original
> build spec see [`NUJEEN_BUILD_BRIEF.md`](./NUJEEN_BUILD_BRIEF.md); for
> developer setup, the editing workflow, and the technical launch-blocker
> checklist see [`README.md`](./README.md) → "Known placeholders." This doc
> is the narrative version of the same honesty rule: **pushed is not the
> same as done** — nothing below is marked complete unless it actually is.

Last updated: 2026-08-08.

---

## What's live and working

### Activities — 8 of 8 real, content-complete (English)
`content/activities/` holds all eight real entries (five from the original
content pass, three added this session: the Ramadan Bazar outreach, the
Ararat Institute sessions, and the family-planning provider training). Each
has a real featured image + gallery pulled from the client's source photos.
Raw source material (original client text + full photo sets) is archived at
`_client-content/nuj-activities/act-1` through `act-8` for provenance/
reprocessing.

- **act-7 and act-8's source photos included some overlay-corrupted images**
  (a visible slideshow-viewer UI — page-number badges like "9/16" — baked
  into the JPEG itself). Those specific shots were excluded from the site
  rather than shipped looking broken. The client needs to send clean
  originals if they want those particular photos in the galleries.
- All 8 carry Arabic + Kurdish **Sorani** machine-translation drafts (see
  "Kurdish dialect" below — this is a known gap, not finished translation).

### Home page — restructured
- **Founding year corrected: 2003** (was wrongly showing 2016 everywhere —
  hero stat, About intro, translations export). Verified zero remaining
  "2016" references anywhere in the built site.
- **Real impact stats**: 23 years of work, 60+ projects delivered, 10,000+
  people reached — replacing the old invented placeholder figures (8+
  years, 20+ programs, 50+ workers, 10+ partners), shown consistently in
  both the hero stat row and the "Our reach" section.
- **New Mission & Vision section** — a calm two-column block (mission /
  vision) between the hero and "What we do."
- **"What we do" changed from a closed 5-item list to a single open,
  full-width statement.** The client felt the fixed five-row list implied
  those five things were *all* Nujeen does. It's now one expansive
  paragraph spanning the section width — the `focusAreas` schema field was
  removed entirely (not just hidden) since nothing else referenced it.

### About page — new, built from the client's org profile
Full rewrite: mission, vision, goals (8 items), how we work, structure,
partners. **English only for now** (see "Translation is the last step"
below for why). Laid out as an editorial two-column page with two images,
both swappable via Keystatic → About without touching code:
- **Hero image** (top, beside the intro) — client-supplied photo
  (`about-hero.jpg`, a project-signing event photo).
- **Body image** (lower, beside the goals/partners text) — **placeholder**,
  reusing the Domiz-2 clinic activity photo (`about-clinic-domiz-2.jpg`).
  Needs client confirmation or a replacement photo.

### Mobile navigation — new
Previously the site had **no navigation at all below ~980px** — the header
nav was simply hidden with nothing replacing it. Added a hamburger menu:
full-screen overlay, focus-trapped, closes on Esc/backdrop/link-click,
`aria-expanded` wired up. Confirmed working and correctly mirroring in `en`,
`ar`, and `ku` (RTL: button and overlay both flip sides automatically via
the existing logical-property/flex layout, no special-casing needed).

---

## Known gaps — confirmed launch blockers

### Kurdish dialect — now CONFIRMED, not a guess
**The client has confirmed in writing that Kurdish must be Badini (Kurmanji,
Arabic script), not Sorani.** Every `ku` string on the site right now —
UI chrome and content alike — is machine-translated Sorani, kept only for
site-wide placeholder consistency while the site was being built. A full
Badini re-translation pass, with native-speaker review, is a **confirmed
hard requirement** before launch. This was previously flagged as a probable
issue based on Duhok being a Badini-speaking region; it is no longer a
probable issue, it's a decided one.

### Translation is the LAST step — do it once, after English is locked
Translation policy going forward: **translate once, at the very end, after
all English copy is finalized** — not incrementally per feature. This
session's Phase 1 work added a meaningful amount of new, unfinished-copy
English (Home's Mission & Vision + "What we do" statement, the entire new
About page) that has **not** been translated yet. That's why `/ar` and
`/ku` currently render partially in English fallback on the home and about
pages — this is the **expected interim state**, not a bug (the `pick()`
i18n helper falls back to English gracefully by design; verified no
crashes/empty sections on any locale). The final Badini + Arabic pass (with
native review) needs to cover: this new copy, plus all 8 activities'
existing Sorani drafts.

### Other confirmed gaps
- **Activity dates are not set.** No dates were invented for any of the 8
  activities — the client's source material didn't include them. Listing/
  sort/detail pages already degrade gracefully without them.
- **Activity categories need client confirmation.** Categories were
  assigned using best judgment during content entry (e.g. the Ararat
  Institute sessions were called `youth` rather than `awareness` per an
  explicit client decision), but the full set across all 8 activities
  hasn't had a dedicated client review pass.
- **Contact form isn't wired up** — `PUBLIC_WEB3FORMS_ACCESS_KEY` is unset.
  Blocked on the client's domain not being ready yet (Web3Forms ties a key
  to a verified sender). Until set, the form shows a visible "not
  configured" warning instead of silently failing.
- **About body image is a placeholder** (see above) — pending client
  confirmation or a replacement photo.

---

## Not started yet

### Projects collection
Schema, listing page, and detail page are fully built and ready — zero
real content has been entered. Needs populating from the client's org
profile and whatever's recoverable from the old nujeen.org site.

### Integrations — none of these are built
- **Social share buttons** on activity detail pages are currently
  non-functional placeholders (`href="#"`) — the Facebook/LinkedIn/
  copy-link icons render but don't do anything yet.
- **No Open Graph image.** Pages set `og:title` and `og:description` but
  there's no `og:image` meta tag anywhere — link previews (Slack, FB,
  WhatsApp) will show no image.
- **No photo lightbox.** Activity galleries show a hover-zoom grid with a
  pointer cursor that implies clickability, but clicking a photo currently
  does nothing — no click-to-enlarge modal exists.
- **No "latest 3 YouTube videos" feed** — not built.
- **Recommendation on social feeds (not yet acted on):** avoid embedding a
  live Facebook/Instagram feed widget directly on this static-hosted site.
  Those widgets typically need a backend proxy or a heavy client-side SDK
  to work reliably, which fights the whole point of this stack (cheap,
  static, no server). A lighter approach — periodically-updated manual
  links, or a small scheduled build-time fetch — would fit the hosting
  model much better if a live feed is genuinely wanted.

---

## Where things live

| Doc | Purpose |
|---|---|
| [`NUJEEN_BUILD_BRIEF.md`](./NUJEEN_BUILD_BRIEF.md) | Original build spec — stack, architecture, design-token rules. Historical, still accurate. |
| [`README.md`](./README.md) | Developer setup, Keystatic editing workflow, deployment, and the technical "Known placeholders" checklist. |
| This file | Plain-status handoff — update at the end of each session. |
