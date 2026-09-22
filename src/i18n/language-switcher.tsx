import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocale } from './locale-provider'
import { LOCALE_CODES, LOCALE_NAMES } from './locale'

/**
 * With exactly two languages there is no state worth displaying: the only
 * useful action is "switch", so this is one button showing the language you
 * would get rather than a segmented control showing the one you already have.
 *
 * Built from `Button` rather than styled by hand, so it inherits the exact
 * height and padding of the controls beside it. A bespoke box next to real
 * buttons is what made the previous one sit off the line.
 *
 * `secondary` rather than `ghost`: the outline is what makes it findable next
 * to a ghost sign-in link, and it still reads as quieter than the primary
 * call to action, which is the order of importance these three have.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()
  const next = locale === 'ar' ? 'en' : 'ar'

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={() => setLocale(next)}
      aria-label={t.nav.switchLanguage(LOCALE_NAMES[next])}
      className={className}
    >
      <Languages aria-hidden />
      <span className="latin font-semibold">{LOCALE_CODES[next]}</span>
    </Button>
  )
}
