import { EyeOff, Inbox, MailOpen, Search, SendHorizonal } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { cn } from '@/lib/cn'

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

interface MockRow {
  id: string
  name: string
  provider: SocialProvider
  /** The connected business account that received the interaction. */
  account: string
  accountName: string
  text: string
  /** Compact form for the list row. */
  time: string
  /** Long form for the conversation. */
  sentAt: string
  status: WorkflowStatus
  unread?: boolean
  /** Assigned on arrival, exactly as the product does it. */
  category: InteractionCategory
  /** The post or video the customer was replying to. */
  post: string
}

/**
 * Whether the row shows as taken off the post.
 *
 * Read from the same domain resolver the product uses, so the marketing
 * mockup cannot claim a comment was hidden on a network that gives us no way
 * to hide it — TikTok and X rows will never show the badge.
 */
function isHidden(row: MockRow): boolean {
  return (
    resolvePublicVisibility(row.category, 'comment', PROVIDER_CAPABILITIES[row.provider]) ===
    'hidden'
  )
}

/**
 * Pinned by the product-showcase section, and the fallback the hero starts
 * from — declared on its own so it is statically known to exist.
 */
const FEATURED_ROW: MockRow = {
  id: '1',
  name: 'منيرة القحطاني',
  provider: 'instagram',
  account: 'nawah.roastery',
  accountName: 'نواة | المحمصة',
  text: 'حبوب الإثيوبي المذكورة في الفيديو متوفرة الحين؟ أبي أطلب كيلو.',
  time: '6 د',
  sentAt: 'قبل 6 دقائق',
  status: 'new',
  unread: true,
  category: 'sales_intent',
  post: 'وصلتنا دفعة جديدة من إثيوبيا — يرغاتشيف، تحميص فاتح. متوفرة الآن في المحمصة وأونلاين.',
}

/**
 * Ordered newest first, like the real list.
 *
 * The mix is chosen so the first four rows — the ones above the fold — carry
 * the whole story: a buying question, junk already off the post, a service
 * question, and a complaint that was hidden too.
 */
const ROWS: MockRow[] = [
  FEATURED_ROW,
  {
    id: '2',
    name: 'متجر المتابعين',
    provider: 'instagram',
    account: 'nawah.roastery',
    accountName: 'نواة | المحمصة',
    text: 'متابعين حقيقيين وتفاعل مضمون بأرخص الأسعار 🔥 تواصل معنا خاص.',
    time: '9 د',
    sentAt: 'قبل 9 دقائق',
    status: 'new',
    category: 'spam',
    post: 'وصلتنا دفعة جديدة من إثيوبيا — يرغاتشيف، تحميص فاتح. متوفرة الآن في المحمصة وأونلاين.',
  },
  {
    id: '3',
    name: 'وليد العمري',
    provider: 'tiktok',
    account: 'nawah.coffee',
    accountName: 'نواة | القهوة',
    text: 'وش اسم الطاحونة المستخدمة في الفيديو؟',
    time: '15 د',
    sentAt: 'قبل 15 دقيقة',
    status: 'new',
    unread: true,
    category: 'customer_service',
    post: 'ثلاث خطوات لضبط درجة الطحن قبل تحضير الإسبريسو.',
  },
  {
    id: '4',
    name: 'نوف الشمري',
    provider: 'facebook',
    account: 'nawah.sa',
    accountName: 'نواة | السعودية',
    text: 'الطلب تأخر يومين وما وصلني أي إشعار. هذي ثاني مرة تصير.',
    time: '28 د',
    sentAt: 'قبل 28 دقيقة',
    status: 'new',
    unread: true,
    category: 'negative',
    post: 'فرع النخيل مفتوح من ٧ صباحًا إلى ١١ مساءً طوال أيام الأسبوع.',
  },
  {
    id: '5',
    name: 'سلمان الفهد',
    provider: 'x',
    account: 'nawah_sa',
    accountName: 'نواة',
    text: 'طلبت أمس ووصل اليوم الصباح. سرعة ممتازة 👌',
    time: '34 د',
    sentAt: 'قبل 34 دقيقة',
    status: 'open',
    category: 'other',
    post: 'الطلبات قبل الساعة ٢ ظهرًا تُشحن في نفس اليوم داخل الرياض.',
  },
]

const RAIL_ROWS = [
  { label: 'الكل', count: 32, icon: Inbox, active: true },
  { label: 'غير مقروء', count: 13, icon: MailOpen, active: false },
]

/** Long enough to read the conversation before it moves on. */
const CYCLE_MS = 4800

/**
 * Advances the selected row on a timer, unless the visitor is hovering the
 * mockup or has asked for reduced motion.
 */
function useCycledSelection(length: number, paused: boolean): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused || length < 2) return
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = setInterval(() => setIndex((current) => (current + 1) % length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [length, paused])

  return index
}

function MockListRow({ row, selected }: { row: MockRow; selected: boolean }) {
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
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-sm',
              row.unread ? 'font-semibold text-ink' : 'font-medium text-ink-secondary',
            )}
          >
            {row.name}
          </span>
          {row.unread ? <span className="size-1.5 shrink-0 rounded-full bg-brand" /> : null}
          <span className="tabular shrink-0 text-2xs text-ink-faint">{row.time}</span>
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">{row.text}</p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-2xs text-ink-muted">
          <CategoryBadge category={row.category} />
          <PlatformChip provider={row.provider} size="xs" />
          {isHidden(row) ? (
            <span className="flex items-center gap-1 text-ink-secondary">
              <EyeOff className="size-3" />
              مخفي
            </span>
          ) : (
            <span className="latin truncate">@{row.account}</span>
          )}
          <StatusDot status={row.status} className="ms-auto" />
        </div>
      </div>
    </div>
  )
}

function MockDetail({ row }: { row: MockRow }) {
  const firstName = row.name.split(' ')[0]

  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="flex items-start gap-3 border-b border-border bg-surface px-4 py-3">
        <Avatar name={row.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{row.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-muted">
            <PlatformChip provider={row.provider} size="xs" />
            <span className="latin">{PLATFORM_LABELS_BY_PROVIDER[row.provider]}</span>
            <span className="text-border-strong">·</span>
            <span className="truncate">{row.accountName}</span>
          </div>
          <div className="mt-1.5">
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
                أُخفي عن المنشور — لا يراه بقية المتابعين، ويبقى هنا لك.
              </p>
            </div>
          ) : null}

          <div className="rounded-lg border border-border bg-surface-subtle p-3">
            <p className="text-2xs font-medium text-ink-muted">المنشور المرتبط</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
              {row.post}
            </p>
          </div>

          <div>
            <p className="px-0.5 text-2xs text-ink-faint">{row.sentAt}</p>
            <div className="mt-1 max-w-[88%] rounded-xl rounded-ss-sm border border-border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-ink">
              {row.text}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-surface p-3">
        <div className="rounded-lg border border-border bg-surface">
          <div className="px-3 py-2.5 text-xs text-ink-faint">اكتب ردك على {firstName}…</div>
          <div className="flex justify-end border-t border-border-subtle px-2 py-1.5">
            <span className="flex items-center gap-1.5 rounded-md bg-brand-solid px-2.5 py-1.5 text-2xs font-medium text-white">
              إرسال
              <SendHorizonal className="size-3 rotate-180" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** The detail pane on its own, for the product-showcase section. */
export function DetailMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'h-[23rem] overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
        className,
      )}
    >
      <MockDetail row={FEATURED_ROW} />
    </div>
  )
}

export function InboxMockup({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false)
  const selected = useCycledSelection(ROWS.length, paused)
  const active = ROWS[selected] ?? FEATURED_ROW

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
        <span className="text-xs font-semibold text-ink">نواة للقهوة المختصة</span>
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
              key={item.label}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-2xs',
                item.active ? 'bg-brand-50 font-medium text-brand-700' : 'text-ink-secondary',
              )}
            >
              <item.icon
                className={cn('size-3.5', item.active ? 'text-brand-600' : 'text-ink-faint')}
              />
              {item.label}
              <span className="tabular ms-auto text-ink-faint">{item.count}</span>
            </div>
          ))}

          <p className="px-2 pt-4 pb-1.5 text-2xs font-medium text-ink-faint">المنصات</p>
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
              <span className="ms-2 text-2xs text-ink-faint">ابحث…</span>
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {ROWS.map((row, index) => (
              <MockListRow key={row.id} row={row} selected={index === selected} />
            ))}
          </div>

          {/* Signals that the list continues past the frame. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
        </div>

        {/* Selected interaction — left column */}
        <div className="hidden min-w-0 flex-1 sm:block">
          <MockDetail row={active} />
        </div>
      </div>
    </div>
  )
}
