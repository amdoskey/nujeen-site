import { Marked } from 'marked';
import { slugify } from './slugify';

// Renders markdown `body` fields from Keystatic. Images use their alt text
// as a figure caption, matching the "inline figure" pull-image treatment
// from the approved design (_design-reference/activity.html .inline-fig).
// Headings get a slugified `id` so pages can deep-link/anchor-nav into
// long body content (see About page's sticky section nav).
const marked = new Marked({
  renderer: {
    image(token) {
      const caption = token.text ? `<figcaption>${token.text}</figcaption>` : '';
      return `<figure class="inline-fig"><div class="im"><img src="${token.href}" alt="${token.text}" loading="lazy" /></div>${caption}</figure>`;
    },
    heading(token) {
      const id = slugify(token.text);
      return `<h${token.depth} id="${id}" class="scroll-mt-[140px]">${token.text}</h${token.depth}>`;
    },
  },
});

export function renderMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  return marked.parse(markdown, { async: false }) as string;
}
