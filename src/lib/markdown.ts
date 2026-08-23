import { Marked } from 'marked';
import { slugify } from './slugify';

// Renders markdown `body` fields from Keystatic. Images use their alt text
// as a figure caption, matching the "inline figure" pull-image treatment
// from the approved design (_design-reference/activity.html .inline-fig).
// Headings get an `id` so pages can deep-link/anchor-nav into long body
// content (see About page's sticky section nav). A heading may end with an
// explicit `{#stable-id}` marker to pin its id independent of the heading
// text — required for headings that get translated per-locale (the id
// would otherwise shift with the translated text and break the shared,
// locale-agnostic nav anchors). Without a marker, the id falls back to a
// slug of the heading text, as before.
const HEADING_ID_MARKER = /\s*\{#([a-z0-9-]+)\}\s*$/i;

const marked = new Marked({
  renderer: {
    image(token) {
      const caption = token.text ? `<figcaption>${token.text}</figcaption>` : '';
      return `<figure class="inline-fig"><div class="im"><img src="${token.href}" alt="${token.text}" loading="lazy" /></div>${caption}</figure>`;
    },
    heading(token) {
      const marker = token.text.match(HEADING_ID_MARKER);
      const text = marker ? token.text.slice(0, marker.index) : token.text;
      const id = marker ? marker[1] : slugify(token.text);
      return `<h${token.depth} id="${id}" class="scroll-mt-[140px]">${text}</h${token.depth}>`;
    },
  },
});

export function renderMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  return marked.parse(markdown, { async: false }) as string;
}
