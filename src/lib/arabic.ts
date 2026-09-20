const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g
const TATWEEL = /ـ/g

/**
 * Folds the orthographic variations Arabic writers use interchangeably so a
 * search for "احمد" also matches "أحمد", and "قهوه" matches "قهوة".
 *
 * A real backend would do this in the index; the mock mirrors it so the UI is
 * developed against realistic matching behaviour from the start.
 */
export function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(DIACRITICS, '')
    .replace(TATWEEL, '')
    .replace(/[آأإٱ]/g, 'ا') // آ أ إ ٱ -> ا
    .replace(/ى/g, 'ي') // ى -> ي
    .replace(/ة/g, 'ه') // ة -> ه
    .replace(/[ؤ]/g, 'و') // ؤ -> و
    .replace(/[ئ]/g, 'ي') // ئ -> ي
    .replace(/\s+/g, ' ')
    .trim()
}

/** Case- and orthography-insensitive substring test. */
export function arabicIncludes(haystack: string, needle: string): boolean {
  return normalizeArabic(haystack).includes(normalizeArabic(needle))
}
