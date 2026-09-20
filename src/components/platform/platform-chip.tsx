import type { SocialProvider } from '@/domain'
import { PLATFORM_LABELS_BY_PROVIDER } from './platform-meta'
import { PLATFORM_GLYPHS } from './platform-glyphs'
import { cn } from '@/lib/cn'

/**
 * Brand surfaces for the chip.
 *
 * Platform colour is confined to this square and nowhere else in the product,
 * which is what keeps a four-network inbox from turning into a colour riot
 * while still making origin obvious at a glance.
 */
const SURFACES: Record<SocialProvider, string> = {
  facebook: 'bg-[#1877F2] text-white',
  // Instagram's identity *is* the gradient; at 16–28px it functions as a mark,
  // not decoration, and nothing else in the UI uses one.
  instagram:
    'bg-[linear-gradient(135deg,#F9CE34_0%,#EE2A7B_55%,#6228D7_100%)] text-white',
  tiktok: 'bg-[#0B0B0B] text-white',
  x: 'bg-[#0F1419] text-white',
}

const SIZES = {
  xs: { box: 'size-4 rounded-[4px]', glyph: 'size-2.5' },
  sm: { box: 'size-5 rounded-[5px]', glyph: 'size-3' },
  md: { box: 'size-7 rounded-md', glyph: 'size-4' },
  lg: { box: 'size-9 rounded-lg', glyph: 'size-5' },
} as const

export type PlatformChipSize = keyof typeof SIZES

/**
 * The single visual primitive for "which network is this?".
 *
 * Decorative by default: rows already state the platform in text, so repeating
 * it for screen readers would be noise. Pass `labelled` where the chip is the
 * only indicator.
 */
export function PlatformChip({
  provider,
  size = 'sm',
  labelled = false,
  className,
}: {
  provider: SocialProvider
  size?: PlatformChipSize
  labelled?: boolean
  className?: string
}) {
  const Glyph = PLATFORM_GLYPHS[provider]
  const dimensions = SIZES[size]

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center',
        dimensions.box,
        SURFACES[provider],
        className,
      )}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? PLATFORM_LABELS_BY_PROVIDER[provider] : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <Glyph className={dimensions.glyph} />
    </span>
  )
}

/**
 * Avatar with the platform chip notched into its bottom-start corner.
 *
 * Author identity and origin end up in one glance-sized unit, which is why the
 * inbox list stays scannable at speed.
 */
export function AvatarWithPlatform({
  children,
  provider,
  chipSize = 'sm',
  className,
}: {
  children: React.ReactNode
  provider: SocialProvider
  /** Use `xs` alongside a small avatar so the chip does not swallow it. */
  chipSize?: Extract<PlatformChipSize, 'xs' | 'sm'>
  className?: string
}) {
  return (
    // `self-start` matters: as a flex child this wrapper would otherwise
    // stretch to the row's height and drag the absolutely positioned chip
    // away from the avatar.
    <span className={cn('relative inline-flex shrink-0 self-start', className)}>
      {children}
      <PlatformChip
        provider={provider}
        size={chipSize}
        className="absolute -bottom-0.5 -start-0.5 ring-2 ring-surface"
      />
    </span>
  )
}
