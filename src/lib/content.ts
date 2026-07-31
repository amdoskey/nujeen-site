import { reader } from './reader';

type CollectionName = 'activities' | 'projects';

/**
 * Keystatic's `fields.slug` (used for `title`) only stores a single plain
 * string — Arabic/Kurdish titles live in sibling `titleAr` / `titleKu`
 * fields. This reshapes a raw reader entry so page code can treat `title`
 * like every other localized field (`{ en, ar, ku }`) via `pick()`.
 */
function normalizeEntry<T extends { title: string; titleAr: string; titleKu: string }>(
  entry: T
) {
  const { titleAr, titleKu, ...rest } = entry;
  return {
    ...rest,
    title: { en: entry.title, ar: titleAr, ku: titleKu },
  };
}

export async function getPublished(collectionName: CollectionName) {
  const all = await reader.collections[collectionName].all();
  return all
    .filter((item) => item.entry.status === 'published')
    .sort((a, b) => (a.entry.date < b.entry.date ? 1 : -1))
    .map((item) => ({ slug: item.slug, entry: normalizeEntry(item.entry) }));
}

export async function getEntry(collectionName: CollectionName, slug: string) {
  const entry = await reader.collections[collectionName].read(slug);
  if (!entry) return null;
  return normalizeEntry(entry);
}

export function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const localeTag = locale === 'ar' ? 'ar' : locale === 'ku' ? 'ckb' : 'en-GB';
  try {
    return new Intl.DateTimeFormat(localeTag, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  }
}
