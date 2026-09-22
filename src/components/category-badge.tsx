import {
  Ban,
  EyeOff,
  Frown,
  LifeBuoy,
  Smile,
  MessageSquare,
  ShieldAlert,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import {
  INTERACTION_CATEGORY_LABELS,
  PUBLIC_VISIBILITY_LABELS,
  type InteractionCategory,
  type PublicVisibility,
} from '@/domain'
import { cn } from '@/lib/cn'

/**
 * Category colour, spent sparingly.
 *
 * Only the categories that change what someone does today carry a tint: a
 * buying question is money on the table, a complaint is a fire, and praise is
 * worth answering while it is warm. The rest stay neutral and are told apart
 * by icon and label, which is what keeps a mixed list from turning into six
 * competing colours.
 */
const STYLES: Record<InteractionCategory, { icon: LucideIcon; tone: string }> = {
  sales_intent: { icon: ShoppingBag, tone: 'border-brand-200 bg-brand-50 text-brand-700' },
  customer_service: {
    icon: LifeBuoy,
    tone: 'border-border bg-surface-sunken text-ink-secondary',
  },
  negative: { icon: Frown, tone: 'border-warning-border bg-warning-surface text-warning-strong' },
  positive: { icon: Smile, tone: 'border-success-border bg-success-surface text-success-strong' },
  spam: { icon: Ban, tone: 'border-border bg-surface-sunken text-ink-muted' },
  other: { icon: MessageSquare, tone: 'border-border bg-surface-sunken text-ink-muted' },
}

export function CategoryIcon({
  category,
  className,
}: {
  category: InteractionCategory
  className?: string
}) {
  const Icon = STYLES[category].icon
  return <Icon className={cn('size-3', className)} aria-hidden />
}

export function CategoryBadge({
  category,
  label,
  className,
}: {
  category: InteractionCategory
  /**
   * Overrides the Arabic label from the domain. The marketing page is
   * bilingual and passes the translated one; the app, which is Arabic-only
   * for now, leaves it off and gets the domain label.
   */
  label?: string
  className?: string
}) {
  const { icon: Icon, tone } = STYLES[category]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-2xs font-medium',
        tone,
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label ?? INTERACTION_CATEGORY_LABELS[category]}
    </span>
  )
}

/**
 * Says what happened to the comment on the post it came from.
 *
 * Renders nothing when the comment is simply public or when there is no post
 * to be visible on — a badge on every row would be noise. `cannot_hide` is
 * the one that matters: the business flagged it, and it is still live.
 */
export function VisibilityBadge({
  visibility,
  className,
}: {
  visibility: PublicVisibility
  className?: string
}) {
  if (visibility === 'public' || visibility === 'not_applicable') return null

  const hidden = visibility === 'hidden'
  const Icon = hidden ? EyeOff : ShieldAlert

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-2xs font-medium',
        hidden
          ? 'border-border bg-surface-sunken text-ink-secondary'
          : 'border-warning-border bg-warning-surface text-warning-strong',
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {PUBLIC_VISIBILITY_LABELS[visibility]}
    </span>
  )
}
