// Generates translations-export.json at the repo root: every translatable
// string (UI chrome + localized Keystatic content) as flat
// `"key": { en, ar, ku }` entries, for handing to an external translator.
//
// Run with: npm run i18n:export
// (requires Node's --experimental-strip-types to import the .ts dictionary
// directly, so the export can never drift from the real source of truth)

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { ui } from '../src/i18n/ui.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const strings = {};

function loadYaml(relPath) {
  return parseYaml(readFileSync(path.join(root, relPath), 'utf8'));
}

/** Add a `{en, ar, ku}` localized-text field under `<prefix>.<fieldName>`, skipping anything that isn't actually localized (plain strings, missing fields). */
function addField(prefix, fieldName, value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'en' in value) {
    strings[`${prefix}.${fieldName}`] = {
      en: value.en ?? '',
      ar: value.ar ?? '',
      ku: value.ku ?? '',
    };
  }
}

// ---------------------------------------------------------------------------
// 1. UI chrome dictionary (src/i18n/ui.ts)
// ---------------------------------------------------------------------------
for (const key of Object.keys(ui.en)) {
  strings[`ui.${key}`] = {
    en: ui.en[key],
    ar: ui.ar[key] ?? '',
    ku: ui.ku[key] ?? '',
  };
}

// ---------------------------------------------------------------------------
// 2. Home singleton
// ---------------------------------------------------------------------------
const home = loadYaml('content/home.yaml');
[
  'eyebrow',
  'headlinePlain',
  'headlineEmphasis',
  'dek',
  'heroQuote',
  'heroQuoteAttribution',
  'missionHeading',
  'missionText',
  'visionHeading',
  'visionText',
  'focusEyebrow',
  'focusHeading',
  'focusIntro',
  'recentEyebrow',
  'recentHeading',
  'quoteBand',
  'quoteBandSource',
  'impactEyebrow',
  'impactHeading',
  'ctaHeading',
  'ctaText',
].forEach((f) => addField('home', f, home[f]));

(home.heroStats ?? []).forEach((s, i) => addField('home', `heroStats.${i}.label`, s.label));
(home.impactStats ?? []).forEach((s, i) => addField('home', `impactStats.${i}.label`, s.label));

// ---------------------------------------------------------------------------
// 3. Site settings (phone/email/brandName excluded — not translatable)
// ---------------------------------------------------------------------------
const siteSettings = loadYaml('content/siteSettings.yaml');
[
  'tagline',
  'locationLine',
  'addressLine',
  'officeHoursDays',
  'officeHoursClosedNote',
  'footerBlurb',
  'copyrightLine',
].forEach((f) => addField('siteSettings', f, siteSettings[f]));

// ---------------------------------------------------------------------------
// 4. About / Contact singletons
// ---------------------------------------------------------------------------
const about = loadYaml('content/about.yaml');
['eyebrow', 'heading', 'intro', 'body'].forEach((f) => addField('about', f, about[f]));

const contact = loadYaml('content/contact.yaml');
['eyebrow', 'heading', 'intro'].forEach((f) => addField('contact', f, contact[f]));

// ---------------------------------------------------------------------------
// 5. Activities (Projects follows the identical shared-content shape —
//    re-run against content/projects/*.yaml once entries exist there)
// ---------------------------------------------------------------------------
function exportCollection(name, dir) {
  let files = [];
  try {
    files = readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.yaml'));
  } catch {
    return; // collection directory doesn't exist yet (e.g. empty Projects)
  }
  for (const file of files) {
    const slug = file.replace(/\.yaml$/, '');
    const entry = loadYaml(`${dir}/${file}`);
    const prefix = `${name}.${slug}`;
    // title/titleAr/titleKu are plain sibling fields in Keystatic (fields.slug
    // can't itself be localized) — flattened back into one {en,ar,ku} unit here.
    strings[`${prefix}.title`] = {
      en: entry.title ?? '',
      ar: entry.titleAr ?? '',
      ku: entry.titleKu ?? '',
    };
    addField(prefix, 'summary', entry.summary);
    addField(prefix, 'body', entry.body);
    addField(prefix, 'seoTitle', entry.seoTitle);
    addField(prefix, 'seoDescription', entry.seoDescription);
    (entry.documents ?? []).forEach((d, i) => addField(prefix, `documents.${i}.label`, d.label));
  }
}

exportCollection('activities', 'content/activities');
exportCollection('projects', 'content/projects');

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
const output = {
  _meta: {
    description:
      'Every translatable string on nujeen.org, keyed by a stable dotted path. English is the source of truth (source column); fill in / correct ar and ku.',
    dialectNote:
      'ku values must be Kurmanji/Badini written in Arabic script (Duhok is a Badini-speaking area) — NOT Sorani. The seed content currently in this file is Sorani and needs re-translating.',
    doNotTranslate:
      'Proper nouns and technical tokens embedded inside a string (e.g. "IFMSA", "SRHR", "Domiz 2", "PDF") should be left as-is by the translator. Phone numbers, emails, dates, slugs, and file paths are not included in this export at all — they are not localized fields.',
    keyFormat:
      'Dotted path: "<collection/singleton>.<slug-if-any>.<field>[.<arrayIndex>.<subfield>]". "ui.*" keys map 1:1 to src/i18n/ui.ts. Everything else maps to a field in the matching content/*.yaml file (title/titleAr/titleKu are the one exception — see keystatic.config.ts comment).',
    roundTrip:
      'Do not add, remove, or rename keys — the import step matches purely by key. See README.md "Translation export / import" for the full workflow.',
    generatedBy: 'scripts/export-translations.mjs',
    generatedAt: new Date().toISOString().slice(0, 10),
  },
  strings,
};

writeFileSync(path.join(root, 'translations-export.json'), JSON.stringify(output, null, 2) + '\n');
console.log(`Exported ${Object.keys(strings).length} translatable strings to translations-export.json`);
