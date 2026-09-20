import { CornerDownLeft, Inbox, MailOpen, Search, SendHorizonal } from 'lucide-react'
import { AvatarWithPlatform, PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER } from '@/components/platform/platform-meta'
import { StatusDot } from '@/components/status-indicator'
import { Avatar } from '@/components/ui/avatar'
import type { SocialProvider, WorkflowStatus } from '@/domain'
import { cn } from '@/lib/cn'

/**
 * A static replica of the Unified Inbox for the marketing page.
 *
 * Built from the same primitives as the real screens — platform chips,
 * avatars, status dots, tokens — so the landing page shows the product rather
 * than an illustration of it. It is presentational only: no data layer, no
 * interactivity, and `aria-hidden` because the surrounding copy carries the
 * meaning for assistive tech.
 */

interface MockRow {
  id: string
  name: string
  provider: SocialProvider
  account: string
  text: string
  time: string
  status: WorkflowStatus
  unread?: boolean
  replied?: boolean
}

const ROWS: MockRow[] = [
  {
    id: '1',
    name: 'منيرة القحطاني',
    provider: 'instagram',
    account: 'nawah.roastery',
    text: 'حبوب الإثيوبي المذكورة في الفيديو متوفرة الحين؟ أبي أطلب كيلو.',
    time: '6 د',
    status: 'new',
    unread: true,
  },
  {
    id: '2',
    name: 'وليد العمري',
    provider: 'tiktok',
    account: 'nawah.coffee',
    text: 'وش اسم الطاحونة المستخدمة في الفيديو؟',
    time: '15 د',
    status: 'new',
    unread: true,
  },
  {
    id: '3',
    name: 'سلمان الفهد',
    provider: 'x',
    account: 'nawah_sa',
    text: 'طلبت أمس ووصل اليوم الصباح. سرعة ممتازة 👌',
    time: '28 د',
    status: 'new',
    unread: true,
  },
  {
    id: '4',
    name: 'نوف الشمري',
    provider: 'facebook',
    account: 'nawah.sa',
    text: 'هل يمكن الطلب واستلامه من الفرع بدون توصيل؟',
    time: '34 د',
    status: 'open',
  },
  {
    id: '5',
    name: 'فهد العنزي',
    provider: 'instagram',
    account: 'nawah.roastery',
    text: 'مساء الخير، طلبي رقم ٤٨٢١ صار له ثلاثة أيام ولا وصلني تحديث.',
    time: '21 د',
    status: 'open',
    replied: true,
  },
]

const RAIL_ROWS = [
  { label: 'الكل', count: 32, icon: Inbox, active: true },
  { label: 'غير مقروء', count: 13, icon: MailOpen, active: false },
]

function MockListRow({ row, selected }: { row: MockRow; selected: boolean }) {
  return (
    <div
      className={cn(
        'relative flex gap-2.5 border-b border-border-subtle px-2.5 py-2.5',
        selected ? 'bg-brand-50' : row.unread ? 'bg-brand-50/30' : 'bg-surface',
      )}
    >
      {selected ? <span className="absolute inset-y-0 start-0 w-0.5 bg-brand" /> : null}

      <AvatarWithPlatform provider={row.provider} chipSize="xs">
        <Avatar name={row.name} size="sm" />
      </AvatarWithPlatform>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-2xs',
              row.unread ? 'font-semibold text-ink' : 'font-medium text-ink-secondary',
            )}
          >
            {row.name}
          </span>
          {row.unread ? <span className="size-1 shrink-0 rounded-full bg-brand" /> : null}
          <span className="tabular shrink-0 text-[0.625rem] text-ink-faint">{row.time}</span>
        </div>

        <p className="mt-0.5 line-clamp-2 text-[0.6875rem] leading-relaxed text-ink-muted">
          {row.text}
        </p>

        <div className="mt-1 flex items-center gap-1.5 text-[0.625rem] text-ink-muted">
          <PlatformChip provider={row.provider} size="xs" />
          <span>{PLATFORM_LABELS_BY_PROVIDER[row.provider]}</span>
          <span className="text-border-strong">·</span>
          <span className="latin truncate">@{row.account}</span>
          <span className="ms-auto flex items-center gap-1">
            {row.replied ? (
              <span className="flex items-center gap-0.5 text-success-strong">
                <CornerDownLeft className="size-2.5" />
                تم الرد
              </span>
            ) : null}
            <StatusDot status={row.status} />
          </span>
        </div>
      </div>
    </div>
  )
}

function MockDetail() {
  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="flex items-start gap-2.5 border-b border-border bg-surface px-3 py-2.5">
        <Avatar name="منيرة القحطاني" size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-2xs font-semibold text-ink">منيرة القحطاني</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[0.625rem] text-ink-muted">
            <PlatformChip provider="instagram" size="xs" />
            Instagram
            <span className="text-border-strong">·</span>
            <span className="truncate">نواة | المحمصة</span>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-sm border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[0.625rem] font-medium text-brand-700">
          <StatusDot status="new" />
          جديد
        </span>
      </div>

      <div className="flex-1 space-y-2.5 overflow-hidden p-3">
        <div className="rounded-lg border border-border bg-surface-subtle p-2.5">
          <p className="text-[0.625rem] font-medium text-ink-muted">المنشور المرتبط</p>
          <p className="mt-1 text-[0.6875rem] leading-relaxed text-ink-secondary">
            وصلتنا دفعة جديدة من إثيوبيا — يرغاتشيف، تحميص فاتح. متوفرة الآن في المحمصة وأونلاين.
          </p>
        </div>

        <div>
          <p className="px-0.5 text-[0.625rem] text-ink-faint">قبل 6 دقائق</p>
          <div className="mt-1 max-w-[88%] rounded-xl rounded-ss-sm border border-border bg-surface px-3 py-2 text-[0.6875rem] leading-relaxed text-ink">
            حبوب الإثيوبي المذكورة في الفيديو متوفرة الحين؟ أبي أطلب كيلو.
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-surface p-2.5">
        <div className="rounded-lg border border-border">
          <div className="px-2.5 py-2 text-[0.6875rem] text-ink-faint">
            اكتب ردك على منيرة…
          </div>
          <div className="flex justify-end border-t border-border-subtle px-2 py-1.5">
            <span className="flex items-center gap-1 rounded-md bg-brand-solid px-2 py-1 text-[0.625rem] font-medium text-white">
              إرسال
              <SendHorizonal className="size-2.5 rotate-180" />
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
        'h-[21rem] overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
        className,
      )}
    >
      <MockDetail />
    </div>
  )
}

export function InboxMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
        className,
      )}
    >
      {/* Application top bar */}
      <div className="flex h-9 items-center gap-2 border-b border-border bg-surface px-3">
        <span className="grid size-4 place-items-center rounded-[5px] bg-brand-solid">
          <span className="size-1.5 rounded-full bg-white/90" />
        </span>
        <span className="text-[0.625rem] font-semibold text-ink">نواة للقهوة المختصة</span>
        <span className="ms-auto flex items-center gap-1.5">
          <span className="h-4 w-20 rounded-sm border border-border bg-surface-subtle" />
          <span className="size-4 rounded-full bg-surface-sunken" />
        </span>
      </div>

      <div className="flex h-[19rem] sm:h-[22rem]">
        {/* Filter rail — right column in RTL */}
        <div className="hidden w-32 shrink-0 border-e border-border bg-surface p-1.5 lg:block">
          {RAIL_ROWS.map((item) => (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[0.625rem]',
                item.active ? 'bg-brand-50 font-medium text-brand-700' : 'text-ink-secondary',
              )}
            >
              <item.icon
                className={cn('size-3', item.active ? 'text-brand-600' : 'text-ink-faint')}
              />
              {item.label}
              <span className="tabular ms-auto text-ink-faint">{item.count}</span>
            </div>
          ))}

          <p className="px-1.5 pt-3 pb-1 text-[0.625rem] font-medium text-ink-faint">المنصات</p>
          {(['instagram', 'facebook', 'tiktok', 'x'] as SocialProvider[]).map((provider) => (
            <div
              key={provider}
              className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[0.625rem] text-ink-secondary"
            >
              <PlatformChip provider={provider} size="xs" />
              {PLATFORM_LABELS_BY_PROVIDER[provider]}
            </div>
          ))}
        </div>

        {/* Interaction list — centre column */}
        <div className="flex w-full shrink-0 flex-col border-e border-border bg-surface sm:w-[15rem] lg:w-[16rem]">
          <div className="flex items-center gap-1.5 border-b border-border p-2">
            <span className="relative flex h-6 flex-1 items-center rounded-md border border-border bg-surface px-2">
              <Search className="size-3 text-ink-faint" />
              <span className="ms-1.5 text-[0.625rem] text-ink-faint">ابحث…</span>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            {ROWS.map((row, index) => (
              <MockListRow key={row.id} row={row} selected={index === 0} />
            ))}
          </div>
        </div>

        {/* Selected interaction — left column */}
        <div className="hidden min-w-0 flex-1 sm:block">
          <MockDetail />
        </div>
      </div>
    </div>
  )
}
