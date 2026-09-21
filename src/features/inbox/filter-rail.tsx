import { CircleSlash, Inbox as InboxIcon, MailOpen } from 'lucide-react'
import { CategoryIcon } from '@/components/category-badge'
import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER, PLATFORM_ORDER } from '@/components/platform/platform-meta'
import { StatusDot } from '@/components/status-indicator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  INTERACTION_CATEGORIES,
  INTERACTION_CATEGORY_LABELS,
  INTERACTION_TYPE_LABELS,
  WORKFLOW_STATUSES,
  WORKFLOW_STATUS_LABELS,
  type ConnectedAccount,
  type InteractionCategory,
  type InteractionType,
  type SocialProvider,
  type WorkflowStatus,
} from '@/domain'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import type { DateFilter, InboxCounts } from '@/services'
import type { InboxFilters, InboxView } from './inbox-filters'

const TYPE_ORDER: InteractionType[] = ['comment', 'direct_message']

export const DATE_LABELS: Record<DateFilter, string> = {
  any: 'كل الفترات',
  today: 'اليوم',
  last7: 'آخر 7 أيام',
  last30: 'آخر 30 يومًا',
}

function RailRow({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count?: number | undefined
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-xs transition-colors',
        active
          ? 'bg-brand-50 font-medium text-brand-700'
          : 'text-ink-secondary hover:bg-surface-sunken hover:text-ink',
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">{children}</span>
      {count !== undefined ? (
        <span
          className={cn(
            'tabular shrink-0 text-2xs',
            active ? 'text-brand-600' : 'text-ink-faint',
          )}
        >
          {formatNumber(count)}
        </span>
      ) : null}
    </button>
  )
}

function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="px-2 pt-3 pb-1 text-2xs font-medium text-ink-faint">{title}</p>
      {children}
    </div>
  )
}

const VIEW_META: Record<InboxView, { label: string; icon: typeof InboxIcon }> = {
  all: { label: 'الكل', icon: InboxIcon },
  unread: { label: 'غير مقروء', icon: MailOpen },
  unreplied: { label: 'غير مردود', icon: CircleSlash },
}

/**
 * The inbox's own navigation column.
 *
 * Views, statuses, platforms and accounts each toggle independently, and every
 * row carries its count so the user can see what a filter would reveal before
 * committing to it.
 */
export function FilterRail({
  filters,
  counts,
  isCountsPending,
  accounts,
  onChange,
}: {
  filters: InboxFilters
  counts: InboxCounts | undefined
  isCountsPending: boolean
  accounts: ConnectedAccount[]
  onChange: (update: Partial<InboxFilters>) => void
}) {
  function toggleStatus(status: WorkflowStatus) {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((value) => value !== status)
      : [...filters.statuses, status]
    onChange({ statuses: next })
  }

  function toggleCategory(category: InteractionCategory) {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((value) => value !== category)
      : [...filters.categories, category]
    onChange({ categories: next })
  }

  function toggleProvider(provider: SocialProvider) {
    const next = filters.providers.includes(provider)
      ? filters.providers.filter((value) => value !== provider)
      : [...filters.providers, provider]
    onChange({ providers: next })
  }

  function toggleAccount(id: string) {
    const next = filters.accountIds.includes(id)
      ? filters.accountIds.filter((value) => value !== id)
      : [...filters.accountIds, id]
    onChange({ accountIds: next })
  }

  const countOf = (value: number | undefined) => (isCountsPending ? undefined : value)

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-thin p-2">
      <div className="space-y-0.5">
        {(Object.keys(VIEW_META) as InboxView[]).map((view) => {
          const meta = VIEW_META[view]
          const count =
            view === 'all' ? counts?.all : view === 'unread' ? counts?.unread : counts?.unreplied
          return (
            <RailRow
              key={view}
              active={filters.view === view}
              onClick={() => onChange({ view })}
              count={countOf(count)}
            >
              <meta.icon
                className={cn(
                  'size-3.5 shrink-0',
                  filters.view === view ? 'text-brand-600' : 'text-ink-faint',
                )}
                aria-hidden
              />
              {meta.label}
            </RailRow>
          )
        })}
      </div>

      <RailSection title="التصنيف">
        {INTERACTION_CATEGORIES.map((category) => (
          <RailRow
            key={category}
            active={filters.categories.includes(category)}
            onClick={() => toggleCategory(category)}
            count={countOf(counts?.byCategory[category])}
          >
            <CategoryIcon
              category={category}
              className={cn(
                'size-3.5 shrink-0',
                filters.categories.includes(category) ? 'text-brand-600' : 'text-ink-faint',
              )}
            />
            {INTERACTION_CATEGORY_LABELS[category]}
          </RailRow>
        ))}
      </RailSection>

      <RailSection title="الحالة">
        {WORKFLOW_STATUSES.map((status) => (
          <RailRow
            key={status}
            active={filters.statuses.includes(status)}
            onClick={() => toggleStatus(status)}
            count={countOf(counts?.byStatus[status])}
          >
            <StatusDot status={status} />
            {WORKFLOW_STATUS_LABELS[status]}
          </RailRow>
        ))}
      </RailSection>

      <RailSection title="المنصات">
        {PLATFORM_ORDER.map((provider) => (
          <RailRow
            key={provider}
            active={filters.providers.includes(provider)}
            onClick={() => toggleProvider(provider)}
            count={countOf(counts?.byProvider[provider])}
          >
            <PlatformChip provider={provider} size="xs" />
            {PLATFORM_LABELS_BY_PROVIDER[provider]}
          </RailRow>
        ))}
      </RailSection>

      <RailSection title="النوع">
        {TYPE_ORDER.map((type) => (
          <RailRow
            key={type}
            active={filters.types.includes(type)}
            onClick={() =>
              onChange({
                types: filters.types.includes(type)
                  ? filters.types.filter((value) => value !== type)
                  : [...filters.types, type],
              })
            }
          >
            {INTERACTION_TYPE_LABELS[type]}
          </RailRow>
        ))}
      </RailSection>

      <RailSection title="التاريخ">
        {(Object.keys(DATE_LABELS) as DateFilter[]).map((date) => (
          <RailRow key={date} active={filters.date === date} onClick={() => onChange({ date })}>
            {DATE_LABELS[date]}
          </RailRow>
        ))}
      </RailSection>

      {accounts.length > 0 ? (
        <RailSection title="الحسابات">
          {accounts.map((account) => (
            <RailRow
              key={account.id}
              active={filters.accountIds.includes(account.id)}
              onClick={() => toggleAccount(account.id)}
              count={countOf(counts?.byAccount[account.id])}
            >
              <PlatformChip provider={account.provider} size="xs" />
              <span className="truncate" title={account.displayName}>
                {account.displayName}
              </span>
              {account.status === 'needs_reconnect' ? (
                <span
                  className="size-1.5 shrink-0 rounded-full bg-warning"
                  aria-label="يحتاج إعادة ربط"
                />
              ) : null}
            </RailRow>
          ))}
        </RailSection>
      ) : accounts.length === 0 && isCountsPending ? (
        <RailSection title="الحسابات">
          <Skeleton className="mx-2 h-6" />
        </RailSection>
      ) : null}
    </div>
  )
}
