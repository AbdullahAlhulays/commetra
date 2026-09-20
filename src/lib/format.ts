/**
 * Arabic formatting helpers.
 *
 * Numerals are forced to Latin digits (`-u-nu-latn`) and the calendar to
 * Gregorian, because that is what Saudi digital products use — the `ar-SA`
 * defaults would otherwise give Arabic-Indic digits and Hijri dates.
 */
const LOCALE = 'ar-u-nu-latn'
const DATE_LOCALE = 'ar-SA-u-nu-latn-ca-gregory'

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })
const number = new Intl.NumberFormat(LOCALE)
const dayMonth = new Intl.DateTimeFormat(DATE_LOCALE, { day: 'numeric', month: 'long' })
const fullDate = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeOnly = new Intl.DateTimeFormat(DATE_LOCALE, { hour: 'numeric', minute: '2-digit' })

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatNumber(value: number): string {
  return number.format(value)
}

/** Percent without Intl's bidi control characters, which leak into layouts. */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

/**
 * Compact stamp for dense rows: "الآن", "5 د", "3 س", "2 ي", then a date.
 * Pair with `formatAbsolute` in a `title` so the exact time stays reachable.
 */
export function formatCompactTime(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime()

  if (elapsed < MINUTE) return 'الآن'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} د`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)} س`
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)} ي`
  return dayMonth.format(new Date(iso))
}

/** Conversational stamp for detail views: "قبل 3 ساعات", "أمس". */
export function formatRelativeTime(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime()

  if (elapsed < MINUTE) return 'الآن'
  if (elapsed < HOUR) return relative.format(-Math.floor(elapsed / MINUTE), 'minute')
  if (elapsed < DAY) return relative.format(-Math.floor(elapsed / HOUR), 'hour')
  if (elapsed < 7 * DAY) return relative.format(-Math.floor(elapsed / DAY), 'day')
  return fullDate.format(new Date(iso))
}

export function formatAbsolute(iso: string): string {
  const date = new Date(iso)
  return `${fullDate.format(date)} — ${timeOnly.format(date)}`
}

export function formatDayMonth(iso: string): string {
  return dayMonth.format(new Date(iso))
}

/** Response-time durations: "12 دقيقة", "3 ساعات", "يومان". */
export function formatDuration(minutes: number): string {
  if (minutes < 1) return 'أقل من دقيقة'
  if (minutes < 60) {
    const value = Math.round(minutes)
    if (value === 1) return 'دقيقة'
    if (value === 2) return 'دقيقتان'
    return value <= 10 ? `${value} دقائق` : `${value} دقيقة`
  }
  if (minutes < 24 * 60) {
    const hours = Math.round(minutes / 60)
    if (hours === 1) return 'ساعة'
    if (hours === 2) return 'ساعتان'
    return hours <= 10 ? `${hours} ساعات` : `${hours} ساعة`
  }
  const days = Math.round(minutes / (24 * 60))
  if (days === 1) return 'يوم'
  if (days === 2) return 'يومان'
  return days <= 10 ? `${days} أيام` : `${days} يومًا`
}

/** Video length as m:ss, isolated so it does not reorder inside RTL text. */
export function formatClipLength(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

/** Two-letter monogram for avatars built from an Arabic display name. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '؟'
  const [first, second] = parts
  if (parts.length === 1) return (first ?? '').slice(0, 2)
  return `${(first ?? '').charAt(0)}${(second ?? '').charAt(0)}`
}
