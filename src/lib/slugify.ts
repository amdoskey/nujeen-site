/** Turn heading text into a stable, URL-safe anchor id (e.g. "Our mission" -> "our-mission"). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
