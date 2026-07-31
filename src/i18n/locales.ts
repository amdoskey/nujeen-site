export const locales = ['en', 'ar', 'ku'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const rtlLocales: Locale[] = ['ar', 'ku'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  ar: 'عربی',
  ku: 'کوردی',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  ku: 'کوردیی ناوەندی',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
