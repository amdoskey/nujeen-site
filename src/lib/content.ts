import { execFileSync } from 'node:child_process';
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

/**
 * When each content file was first committed (`YYYY-MM-DD`), keyed by repo
 * path. Used only as a sort fallback for entries without a `date`: Keystatic
 * stores no created-at timestamp, and git history is the one honest record
 * of when an entry was added. Read once per process; if git is unavailable
 * (or the clone is shallow) entries are simply missing from the map.
 */
let addedDatesCache: Map<string, string> | undefined;

function getAddedDates(): Map<string, string> {
  if (addedDatesCache) return addedDatesCache;
  const added = new Map<string, string>();
  try {
    const log = execFileSync(
      'git',
      ['log', '--diff-filter=A', '--format=@%cs', '--name-only', '--', 'content'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    let commitDate = '';
    for (const line of log.split('\n')) {
      if (line.startsWith('@')) commitDate = line.slice(1);
      // Log is newest-first, so the first hit is the latest (re-)add.
      else if (line && !added.has(line)) added.set(line, commitDate);
    }
  } catch {
    // No git at build time — undated entries fall back to "newest" below.
  }
  addedDatesCache = added;
  return added;
}

/** Sorts after any real date, so not-yet-committed (brand-new) entries lead. */
const NOT_YET_COMMITTED = '9999-12-31';

/**
 * Newest first. An entry's recency is its `date`; until the client sets one,
 * it's the date the entry was added to the repo — so a freshly added, undated
 * activity surfaces at the top instead of sinking among older content.
 * Ties break on slug so the order is stable across builds.
 */
function recencyKey(collectionName: CollectionName, slug: string, date: string | null) {
  return date ?? getAddedDates().get(`content/${collectionName}/${slug}.yaml`) ?? NOT_YET_COMMITTED;
}

export async function getPublished(collectionName: CollectionName) {
  const all = await reader.collections[collectionName].all();
  return all
    .filter((item) => item.entry.status === 'published')
    .map((item) => ({ item, key: recencyKey(collectionName, item.slug, item.entry.date) }))
    .sort((a, b) =>
      a.key === b.key ? a.item.slug.localeCompare(b.item.slug) : a.key < b.key ? 1 : -1
    )
    .map(({ item }) => ({ slug: item.slug, entry: normalizeEntry(item.entry) }));
}

export async function getEntry(collectionName: CollectionName, slug: string) {
  const entry = await reader.collections[collectionName].read(slug);
  if (!entry) return null;
  return normalizeEntry(entry);
}

// Intl has no Badini (Kurmanji, Arabic script) locale — `ckb` is Sorani and
// `ku` is Latin-script Kurmanji — so Kurdish dates use the Badini month names
// customary in Duhok (Syriac/Arabic-derived, as in About's "ئیلونا سالا 2003").
const BADINI_MONTHS = [
  'کانوونا دووێ', 'شوبات', 'ئادار', 'نیسان', 'گولان', 'حزیران',
  'تیرمەه', 'تەباخ', 'ئیلون', 'چریا ئێکێ', 'چریا دووێ', 'کانوونا ئێکێ',
] as const;

export function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  if (locale === 'ku') {
    return `${d.getUTCDate()} ${BADINI_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
  const localeTag = locale === 'ar' ? 'ar' : 'en-GB';
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
