import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/locale-provider'

/**
 * The identity.
 *
 * Both files are transparent PNGs cropped from the supplied artwork, with the
 * ink un-premultiplied off its white card so the anti-aliased edges carry no
 * halo. Every surface the logo appears on today is light; a light-on-dark
 * variant would need its own file rather than a CSS filter.
 *
 * Intrinsic dimensions are declared on each `img` so the row does not reflow
 * once the file loads.
 */

/** The speech-bubble alone, for places too narrow for the wordmark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      width={96}
      height={96}
      className={cn('size-7 shrink-0 object-contain', className)}
      aria-hidden
    />
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { locale } = useLocale()

  if (compact) {
    return (
      <span className={cn('inline-flex items-center', className)}>
        <LogoMark />
        <span className="sr-only">Comment</span>
      </span>
    )
  }

  const isArabic = locale === 'ar'

  return (
    <img
      src={isArabic ? '/logo-ar.png' : '/logo.png'}
      alt={isArabic ? 'كومنت' : 'Comment'}
      width={isArabic ? 2160 : 640}
      height={isArabic ? 728 : 146}
      className={cn('h-7 w-auto shrink-0 object-contain', className)}
    />
  )
}
