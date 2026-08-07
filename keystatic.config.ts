import { config, fields, collection, singleton } from '@keystatic/core';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
// Keystatic has no built-in i18n field, so every "localized" piece of
// content is a small object with one sub-field per site locale. Every
// dynamic collection (Activities, Projects, ...) is built from the SAME
// shape below (see NUJEEN_BUILD_BRIEF.md §4) — duplicating a new content
// type means copying `sharedContentSchema()` and swapping the label/dir.

function localizedText({
  label,
  multiline = false,
}: {
  label: string;
  multiline?: boolean;
}) {
  return fields.object(
    {
      en: fields.text({ label: 'English', multiline }),
      ar: fields.text({ label: 'Arabic', multiline }),
      ku: fields.text({ label: 'Kurdish Sorani', multiline }),
    },
    { label }
  );
}

const CATEGORY_OPTIONS = [
  { label: 'Awareness', value: 'awareness' },
  { label: 'Training', value: 'training' },
  { label: 'Outreach', value: 'outreach' },
  { label: 'Camps', value: 'camps' },
  { label: 'Youth', value: 'youth' },
];

const DOC_LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Kurdish Sorani', value: 'ku' },
];

// The shared dynamic content-type pattern. `kind` is only used to namespace
// where uploaded assets land on disk (public/uploads/<kind>/...).
function sharedContentSchema(kind: string) {
  return {
    // fields.slug doubles as the entry's display title (English) AND the
    // source for its URL slug — Keystatic derives + lets editors tweak the
    // slug from this field's "name". Arabic/Kurdish titles are plain
    // sibling fields since only one field per collection can be `slug`.
    title: fields.slug({ name: { label: 'Title (English)' } }),
    titleAr: fields.text({ label: 'Title (Arabic)' }),
    titleKu: fields.text({ label: 'Title (Kurdish Sorani)' }),
    summary: localizedText({ label: 'Summary', multiline: true }),
    body: localizedText({ label: 'Body (Markdown)', multiline: true }),
    featuredImage: fields.image({
      label: 'Featured image',
      directory: `public/uploads/${kind}`,
      publicPath: `/uploads/${kind}/`,
    }),
    gallery: fields.array(
      fields.image({
        label: 'Image',
        directory: `public/uploads/${kind}/gallery`,
        publicPath: `/uploads/${kind}/gallery/`,
      }),
      { label: 'Gallery', itemLabel: () => 'Image' }
    ),
    date: fields.date({ label: 'Date' }),
    category: fields.select({
      label: 'Category',
      options: CATEGORY_OPTIONS,
      defaultValue: 'awareness',
    }),
    documents: fields.array(
      fields.object(
        {
          file: fields.file({
            label: 'PDF file',
            directory: `public/uploads/${kind}/documents`,
            publicPath: `/uploads/${kind}/documents/`,
          }),
          label: localizedText({ label: 'Label' }),
          language: fields.select({
            label: 'Document language',
            options: DOC_LANGUAGE_OPTIONS,
            defaultValue: 'en',
          }),
        },
        { label: 'Document' }
      ),
      { label: 'Reports & documents', itemLabel: () => 'Document' }
    ),
    status: fields.select({
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'published',
    }),
    seoTitle: localizedText({ label: 'SEO meta title' }),
    seoDescription: localizedText({ label: 'SEO meta description', multiline: true }),
  };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export default config({
  storage: { kind: 'local' },

  collections: {
    activities: collection({
      label: 'Activities',
      slugField: 'title',
      path: 'content/activities/*',
      format: { data: 'yaml' },
      columns: ['title', 'date', 'category', 'status'],
      schema: sharedContentSchema('activities'),
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: { data: 'yaml' },
      columns: ['title', 'date', 'category', 'status'],
      schema: sharedContentSchema('projects'),
    }),
  },

  singletons: {
    home: singleton({
      label: 'Home',
      path: 'content/home',
      schema: {
        eyebrow: localizedText({ label: 'Hero eyebrow' }),
        headlinePlain: localizedText({ label: 'Hero headline (plain part)' }),
        headlineEmphasis: localizedText({ label: 'Hero headline (emphasized part)' }),
        dek: localizedText({ label: 'Hero dek', multiline: true }),
        heroImage: fields.image({
          label: 'Hero image',
          directory: 'public/uploads/home',
          publicPath: '/uploads/home/',
        }),
        heroQuote: localizedText({ label: 'Hero card quote', multiline: true }),
        heroQuoteAttribution: localizedText({ label: 'Hero card quote attribution' }),
        heroStats: fields.array(
          fields.object(
            {
              number: fields.text({ label: 'Number / value' }),
              label: localizedText({ label: 'Label', multiline: true }),
            },
            { label: 'Hero stat' }
          ),
          { label: 'Hero meta stats', itemLabel: (p) => p.fields.number.value || 'Stat' }
        ),
        missionHeading: localizedText({ label: 'Mission label (e.g. "Our mission")' }),
        missionText: localizedText({ label: 'Mission statement', multiline: true }),
        visionHeading: localizedText({ label: 'Vision label (e.g. "Our vision")' }),
        visionText: localizedText({ label: 'Vision statement', multiline: true }),
        focusEyebrow: localizedText({ label: 'Focus section eyebrow' }),
        focusHeading: localizedText({ label: 'Focus section heading' }),
        focusIntro: localizedText({ label: 'Focus section intro', multiline: true }),
        recentEyebrow: localizedText({ label: 'Recent activities eyebrow' }),
        recentHeading: localizedText({ label: 'Recent activities heading' }),
        quoteBand: localizedText({ label: 'Quote band text', multiline: true }),
        quoteBandSource: localizedText({ label: 'Quote band source line' }),
        impactEyebrow: localizedText({ label: 'Impact eyebrow' }),
        impactHeading: localizedText({ label: 'Impact heading' }),
        impactStats: fields.array(
          fields.object(
            {
              number: fields.text({ label: 'Number' }),
              suffix: fields.text({ label: 'Suffix (e.g. "+")', defaultValue: '+' }),
              label: localizedText({ label: 'Label', multiline: true }),
            },
            { label: 'Impact stat' }
          ),
          { label: 'Impact stats' }
        ),
        ctaHeading: localizedText({ label: 'CTA heading' }),
        ctaText: localizedText({ label: 'CTA text', multiline: true }),
      },
    }),

    siteSettings: singleton({
      label: 'Site settings',
      path: 'content/siteSettings',
      schema: {
        brandName: fields.text({ label: 'Brand name (plain)', defaultValue: 'nujeen' }),
        tagline: localizedText({ label: 'Tagline (under logo)' }),
        locationLine: localizedText({ label: 'Topbar location line' }),
        phone1: fields.text({ label: 'Phone 1' }),
        phone2: fields.text({ label: 'Phone 2' }),
        email: fields.text({ label: 'Email' }),
        addressLine: localizedText({ label: 'Address line' }),
        officeHoursDays: localizedText({ label: 'Office hours — days' }),
        officeHoursTime: fields.text({ label: 'Office hours — time' }),
        officeHoursClosedNote: localizedText({ label: 'Office hours — closed note' }),
        footerBlurb: localizedText({ label: 'Footer blurb', multiline: true }),
        copyrightLine: localizedText({ label: 'Footer copyright line' }),
      },
    }),

    about: singleton({
      label: 'About',
      path: 'content/about',
      schema: {
        eyebrow: localizedText({ label: 'Eyebrow' }),
        heading: localizedText({ label: 'Heading' }),
        intro: localizedText({ label: 'Intro', multiline: true }),
        heroImage: fields.image({
          label: 'Top hero image (beside intro)',
          directory: 'public/uploads/about',
          publicPath: '/uploads/about/',
        }),
        bodyImage: fields.image({
          label: 'Body image (beside mission/goals text)',
          directory: 'public/uploads/about',
          publicPath: '/uploads/about/',
        }),
        body: localizedText({ label: 'Body (Markdown)', multiline: true }),
      },
    }),

    contact: singleton({
      label: 'Contact',
      path: 'content/contact',
      schema: {
        eyebrow: localizedText({ label: 'Eyebrow' }),
        heading: localizedText({ label: 'Heading' }),
        intro: localizedText({ label: 'Intro', multiline: true }),
      },
    }),
  },

  ui: {
    brand: { name: 'Nujeen' },
    navigation: {
      Content: ['activities', 'projects'],
      Pages: ['home', 'about', 'contact'],
      Settings: ['siteSettings'],
    },
  },
});
