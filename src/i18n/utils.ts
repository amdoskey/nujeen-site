import { defaultLocale, type Locale } from './locales';

/** Build a locale-prefixed path, e.g. localePath('ar', '/activities') -> '/ar/activities' */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean === '/' ? '' : clean}`;
}

type LocalizedField = { en?: string | null; ar?: string | null; ku?: string | null };

/** Pick a localized field's value for the given locale, falling back to English. */
export function pick(field: LocalizedField | null | undefined, locale: Locale): string {
  if (!field) return '';
  return field[locale] || field[defaultLocale] || '';
}

/** Turn `*word*` into an italicized, brand-blue <em> — used for the handful of
 * pull-quote strings ported verbatim from the design reference. */
export function emphasize(text: string): string {
  return text.replace(/\*(.+?)\*/g, '<em class="font-serif italic text-blue">$1</em>');
}
