/**
 * The two languages the product ships in.
 *
 * Arabic is the default and the source of truth: the product is built for the
 * Saudi market first, and every string is written in Arabic before it is
 * translated. English exists so a non-Arabic reader can evaluate the product,
 * not as a second primary.
 */
export const LOCALES = ['ar', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ar'

export const LOCALE_DIRECTIONS: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
}

/**
 * The switcher shows codes, which stay short at any width and are read the
 * same way in both languages. The full names are still needed for the
 * accessible label — "EN" on its own tells a screen-reader user nothing.
 */
export const LOCALE_CODES: Record<Locale, string> = {
  ar: 'AR',
  en: 'EN',
}

export const LOCALE_NAMES: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
}

export const LOCALE_STORAGE_KEY = 'comment.locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
