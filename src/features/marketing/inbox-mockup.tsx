import { EyeOff, Inbox, MailOpen, Search, SendHorizonal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryBadge } from '@/components/category-badge'
import { AvatarWithPlatform, PlatformChip } from '@/components/platform/platform-chip'
import {
  PLATFORM_LABELS_BY_PROVIDER,
  PLATFORM_ORDER,
} from '@/components/platform/platform-meta'
import { StatusBadge, StatusDot } from '@/components/status-indicator'
import { Avatar } from '@/components/ui/avatar'
import {
  PROVIDER_CAPABILITIES,
  resolvePublicVisibility,
  type InteractionCategory,
  type SocialProvider,
  type WorkflowStatus,
} from '@/domain'
import { useLocale } from '@/i18n/locale-provider'
import { cn } from '@/lib/cn'
import { useCycledIndex } from './use-cycled-index'

/**
 * A static replica of the Unified Inbox for the marketing page.
 *
 * Built from the same primitives as the real screens — platform chips,
 * avatars, status badges, tokens — so the landing page shows the product
 * rather than an illustration of it.
 *
 * Kept deliberately sparse: this is the first thing a visitor sees, so it
 * carries one row per platform and nothing else. The only motion is the
 * selection advancing through the list, which is what makes the point that
 * four networks land in one place; it pauses on hover and does not run for
 * visitors who asked for reduced motion.
 *
 * `aria-hidden`, because the surrounding copy carries the same meaning for
 * assistive tech and a fake inbox would only add noise.
 */

interface RowShape {
  id: string
  provider: SocialProvider
  /** The connected business account that received the interaction. */
  account: string
  /** Minutes before now, rendered through the dictionary in both forms. */
  minutes: number
  status: WorkflowStatus
  unread?: boolean
  /** Assigned on arrival, exactly as the product does it. */
  category: InteractionCategory
}

/**
 * Whether the row shows as taken off the post.
 *
 * Read from the same domain resolver the product uses, so the marketing
 * mockup cannot claim a comment was hidden on a network that gives us no way
 * to hide it — TikTok and X rows will never show the badge.
 */
function isHidden(row: RowShape): boolean {
  return (
    resolvePublicVisibility(row.category, 'comment', PROVIDER_CAPABILITIES[row.provider]) ===
    'hidden'
  )
}

/**
 * Pinned by the product-showcase section, and the fallback the hero starts
 * from — declared on its own so it is statically known to exist.
 */
/**
 * The rows, minus their words.
 *
 * Names, message text and post excerpts live in the dictionary so the mockup
 * reads in whichever language the visitor picked. What stays here is the part
 * that does not translate: which network, which account, how long ago, and
 * how the classifier filed it.
 */
const ROW_SHAPES: RowShape[] = [
  {
    id: '1',
    provider: 'instagram',
    account: 'nawah.roastery',
    minutes: 6,
    status: 'new',
    unread: true,
    category: 'sales_intent',
  },
  {
    id: '2',
    provider: 'instagram',
    account: 'nawah.roastery',
    minutes: 9,
    status: 'new',
    category: 'spam',
  },
  {
    id: '3',
    provider: 'tiktok',
    account: 'nawah.coffee',
    minutes: 15,
    status: 'new',
    unread: true,
    category: 'customer_service',
  },
  {
    id: '4',
    provider: 'facebook',
    account: 'nawah.sa',
    minutes: 28,
    status: 'new',
    unread: true,
    category: 'negative',
  },
  {
    id: '5',
    provider: 'x',
    account: 'nawah_sa',
    minutes: 34,
    status: 'open',
    category: 'positive',
  },
]

interface MockRowCopy {
  name: string
  text: string
  post: string
}

type MockRow = RowShape & MockRowCopy

/**
 * Joins each row's shape to its words in the active language.
 *
 * The dictionary is the only thing that changes between locales, so a missing
 * translation falls back to the first row rather than rendering blank —
 * a gap in the demo should look like a repeat, not like a broken page.
 */
function useRows(): MockRow[] {
  const { t } = useLocale()

  return useMemo(() => {
    const [first] = t.mockup.rows
    return ROW_SHAPES.map((shape, index) => ({
      ...shape,
      ...(t.mockup.rows[index] ?? first ?? { name: '', text: '', post: '' }),
    }))
  }, [t])
}

const RAIL_ROWS = [
  { key: 'all' as const, count: 32, icon: Inbox, active: true },
  { key: 'unread' as const, count: 13, icon: MailOpen, active: false },
]

/** Long enough to read the conversation before it moves on. */
const CYCLE_MS = 4800

function MockListRow({ row, selected }: { row: MockRow; selected: boolean }) {
  const { t } = useLocale()

  return (
    <div
      className={cn(
        'relative flex gap-3 border-b border-border-subtle px-3 py-2.5 transition-colors duration-200',
        selected ? 'bg-brand-50' : row.unread ? 'bg-brand-50/30' : 'bg-surface',
      )}
    >
      <span
        className={cn(
          'absolute inset-y-0 start-0 w-0.5 bg-brand transition-opacity duration-200',
          selected ? 'opacity-100' : 'opacity-0',
        )}
      />

      <AvatarWithPlatform provider={row.provider} chipSize="xs">
        <Avatar name={row.name} size="sm" />
      </AvatarWithPlatform>

      <div className="min-w-0 flex-1">
        {/* The handle sits with the name, where a reader looks for "who is
            this": the person, then the account they reached. */}
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'min-w-0 truncate text-sm',
              row.unread ? 'font-semibold text-ink' : 'font-medium text-ink-secondary',
            )}
          >
            {row.name}
          </span>
          <span className="latin min-w-0 truncate text-2xs text-ink-faint">@{row.account}</span>
          {row.unread ? <span className="size-1.5 shrink-0 rounded-full bg-brand" /> : null}
          <span className="tabular ms-auto shrink-0 text-2xs text-ink-faint">
            {t.mockup.minutesShort(row.minutes)}
          </span>
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">{row.text}</p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-2xs text-ink-muted">
          <PlatformChip provider={row.provider} size="xs" />
          <CategoryBadge category={row.category} />
          {isHidden(row) ? (
            <span className="flex items-center gap-1 text-ink-secondary">
              <EyeOff className="size-3" />
              {t.mockup.hidden}
            </span>
          ) : null}
          <StatusDot status={row.status} className="ms-auto" />
        </div>
      </div>
    </div>
  )
}

function MockDetail({ row }: { row: MockRow }) {
  const { t } = useLocale()
  const firstName = row.name.split(' ')[0] ?? row.name

  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="flex items-start gap-3 border-b border-border bg-surface px-4 py-3">
        <Avatar name={row.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{row.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-muted">
            <PlatformChip provider={row.provider} size="xs" />
            <span className="latin">{PLATFORM_LABELS_BY_PROVIDER[row.provider]}</span>
            <CategoryBadge category={row.category} />
          </div>
        </div>
        <StatusBadge status={row.status} className="shrink-0" />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-4">
        <div
          // Remounting on selection change replays the entrance, so the pane
          // reads as "this conversation opened" rather than as text swapping.
          key={row.id}
          className="space-y-3 motion-safe:animate-content-in"
        >
          {isHidden(row) ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-sunken px-3 py-2.5">
              <EyeOff className="mt-0.5 size-3 shrink-0 text-ink-muted" />
              <p className="text-2xs leading-relaxed text-ink-secondary">
                {t.mockup.hiddenNote}
              </p>
            </div>
          ) : null}

          <div className="rounded-lg border border-border bg-surface-subtle p-3">
            <p className="text-2xs font-medium text-ink-muted">{t.mockup.relatedPost}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
              {row.post}
            </p>
          </div>

          <div>
            <p className="px-0.5 text-2xs text-ink-faint">{t.mockup.minutesAgo(row.minutes)}</p>
            <div className="mt-1 max-w-[88%] rounded-xl rounded-ss-sm border border-border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-ink">
              {row.text}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-surface p-3">
        <div className="rounded-lg border border-border bg-surface">
          <div className="px-3 py-2.5 text-xs text-ink-faint">{t.mockup.replyTo(firstName)}</div>
          <div className="flex justify-end border-t border-border-subtle px-2 py-1.5">
            <span className="flex items-center gap-1.5 rounded-md bg-brand-solid px-2.5 py-1.5 text-2xs font-medium text-white">
              {t.mockup.send}
              <SendHorizonal className="size-3 rotate-180" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InboxMockup({ className }: { className?: string }) {
  const { t } = useLocale()
  const rows = useRows()
  const [paused, setPaused] = useState(false)
  const selected = useCycledIndex(rows.length, { paused, intervalMs: CYCLE_MS })
  const active = rows[selected] ?? rows[0]

  return (
    <div
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
        className,
      )}
    >
      {/* Application top bar */}
      <div className="flex h-11 items-center gap-2.5 border-b border-border bg-surface px-4">
        <span className="grid size-5 place-items-center rounded-md bg-brand-solid">
          <span className="size-2 rounded-full bg-white/90" />
        </span>
        <span className="text-xs font-semibold text-ink">{t.mockup.org}</span>
        <span className="ms-auto flex items-center gap-2">
          <span className="h-5 w-24 rounded-sm border border-border bg-surface-subtle" />
          <span className="size-5 rounded-full bg-surface-sunken" />
        </span>
      </div>

      <div className="flex h-[24rem] sm:h-[26rem] lg:h-[28rem]">
        {/* Filter rail — right column in RTL */}
        <div className="hidden w-40 shrink-0 border-e border-border bg-surface p-2 lg:block">
          {RAIL_ROWS.map((item) => (
            <div
              key={item.key}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-2xs',
                item.active ? 'bg-brand-50 font-medium text-brand-700' : 'text-ink-secondary',
              )}
            >
              <item.icon
                className={cn('size-3.5', item.active ? 'text-brand-600' : 'text-ink-faint')}
              />
              {t.mockup[item.key]}
              <span className="tabular ms-auto text-ink-faint">{item.count}</span>
            </div>
          ))}

          <p className="px-2 pt-4 pb-1.5 text-2xs font-medium text-ink-faint">{t.mockup.platforms}</p>
          {PLATFORM_ORDER.map((provider) => (
            <div
              key={provider}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-2xs text-ink-secondary"
            >
              <PlatformChip provider={provider} size="xs" />
              <span className="latin">{PLATFORM_LABELS_BY_PROVIDER[provider]}</span>
            </div>
          ))}
        </div>

        {/* Interaction list — centre column */}
        <div className="relative flex w-full shrink-0 flex-col border-e border-border bg-surface sm:w-[16rem] lg:w-[17.5rem]">
          <div className="flex items-center gap-2 border-b border-border p-2.5">
            <span className="relative flex h-7 flex-1 items-center rounded-md border border-border bg-surface px-2.5">
              <Search className="size-3.5 text-ink-faint" />
              <span className="ms-2 text-2xs text-ink-faint">{t.mockup.search}</span>
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {rows.map((row, index) => (
              <MockListRow key={row.id} row={row} selected={index === selected} />
            ))}
          </div>

          {/* Signals that the list continues past the frame. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
        </div>

        {/* Selected interaction — left column */}
        <div className="hidden min-w-0 flex-1 sm:block">
          {active ? <MockDetail row={active} /> : null}
        </div>
      </div>
    </div>
  )
}
