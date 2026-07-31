import { Marked } from 'marked';

// Renders markdown `body` fields from Keystatic. Images use their alt text
// as a figure caption, matching the "inline figure" pull-image treatment
// from the approved design (_design-reference/activity.html .inline-fig).
const marked = new Marked({
  renderer: {
    image(token) {
      const caption = token.text ? `<figcaption>${token.text}</figcaption>` : '';
      return `<figure class="inline-fig"><div class="im"><img src="${token.href}" alt="${token.text}" loading="lazy" /></div>${caption}</figure>`;
    },
  },
});

export function renderMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  return marked.parse(markdown, { async: false }) as string;
}
