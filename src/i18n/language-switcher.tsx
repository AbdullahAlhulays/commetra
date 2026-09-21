import { Languages } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useLocale } from './locale-provider'
import { LOCALE_CODES, LOCALE_NAMES, LOCALES } from './locale'

/**
 * Two languages, so this is a toggle rather than a menu: one tap, no dropdown
 * to open and nothing to read before choosing. The buttons carry codes rather
 * than language names — they stay the same width in both directions and read
 * the same to everyone — with the full name on the accessible label.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md border border-border bg-surface p-0.5',
        className,
      )}
    >
      <Languages className="mx-1 size-3.5 shrink-0 text-ink-faint" aria-hidden />
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          aria-label={LOCALE_NAMES[option]}
          className={cn(
            'latin rounded-sm px-2 py-1 text-2xs font-semibold transition-colors',
            locale === option
              ? 'bg-surface-sunken text-ink'
              : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
          )}
        >
          {LOCALE_CODES[option]}
        </button>
      ))}
    </div>
  )
}
