import { Languages } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useLocale } from './locale-provider'
import { LOCALE_NAMES, LOCALES } from './locale'

/**
 * Two languages, so this is a toggle rather than a menu: one tap, no dropdown
 * to open and nothing to read before choosing. Each language is written in
 * itself — someone looking for English should not have to read Arabic to
 * find it.
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
          className={cn(
            'rounded-sm px-2 py-1 text-2xs font-medium transition-colors',
            locale === option
              ? 'bg-surface-sunken text-ink'
              : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
          )}
        >
          {LOCALE_NAMES[option]}
        </button>
      ))}
    </div>
  )
}
