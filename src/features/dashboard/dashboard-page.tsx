import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AvatarWithPlatform } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER } from '@/components/platform/platform-meta'
import { EmptyState, ErrorState } from '@/components/states'
import { StatusDot } from '@/components/status-indicator'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  METRIC_RANGES,
  METRIC_RANGE_LABELS,
  WORKFLOW_STATUS_LABELS,
  isUnreplied,
  type MetricRange,
  type MetricValue,
} from '@/domain'
import { useRequiredSession } from '@/features/auth/use-session'
import { cn } from '@/lib/cn'
import {
  formatCompactTime,
  formatDuration,
  formatNumber,
  formatPercent,
} from '@/lib/format'
import { PlatformBreakdown, TrendChart } from './charts'
import { useDashboard, useDashboardRange, useRecentInteractions } from './use-dashboard'

function Delta({
  metric,
  higherIsBetter = true,
  format,
}: {
  metric: MetricValue
  higherIsBetter?: boolean
  format: (value: number) => string
}) {
  if (metric.previousValue === null) {
    return <span className="text-2xs text-ink-faint">لا توجد فترة سابقة للمقارنة</span>
  }

  const difference = metric.value - metric.previousValue
  if (Math.abs(difference) < 0.0001) {
    return (
      <span className="flex items-center gap-1 text-2xs text-ink-muted">
        <Minus className="size-3" aria-hidden />
        دون تغيير
      </span>
    )
  }

  const improved = higherIsBetter ? difference > 0 : difference < 0
  const Icon = difference > 0 ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-2xs',
        improved ? 'text-success-strong' : 'text-accent-strong',
      )}
    >
      <Icon className="size-3" aria-hidden />
      <span className="tabular">{format(Math.abs(difference))}</span>
      <span className="text-ink-faint">مقارنة بالفترة السابقة</span>
    </span>
  )
}

function Stat({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children?: React.ReactNode
}) {
  return (
    <div className="bg-surface px-4 py-3.5">
      <p className="text-2xs text-ink-muted">{label}</p>
      <p className="tabular mt-1 text-2xl font-semibold text-ink">{value}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-xl border border-border bg-surface', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function RangeSelector({
  value,
  onChange,
}: {
  value: MetricRange
  onChange: (range: MetricRange) => void
}) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5"
      role="group"
      aria-label="الفترة الزمنية"
    >
      {METRIC_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          aria-pressed={value === range}
          className={cn(
            'rounded-md px-2.5 py-1 text-2xs font-medium transition-colors',
            value === range
              ? 'bg-surface-sunken text-ink'
              : 'text-ink-muted hover:text-ink-secondary',
          )}
        >
          {METRIC_RANGE_LABELS[range]}
        </button>
      ))}
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4"
      aria-busy
    >
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="space-y-2 bg-surface px-4 py-3.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  )
}

/**
 * Deliberately small: four figures, one trend, one breakdown, and a way back
 * into the inbox. The inbox is the product — this page exists to tell the
 * owner whether anything is being missed, not to be a BI tool.
 */
export function DashboardPage() {
  const session = useRequiredSession()
  const [range, setRange] = useDashboardRange()
  const { data, isPending, isError, error, refetch } = useDashboard(session.organizationId, range)
  const recent = useRecentInteractions(session.organizationId, 6)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink">لوحة المعلومات</h1>
          <p className="mt-1 text-sm text-ink-muted">نظرة سريعة على حجم التفاعلات وسرعة الرد.</p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </header>

      {isError ? (
        <div className="rounded-xl border border-border bg-surface">
          <ErrorState error={error} title="تعذر تحميل المؤشرات" onRetry={() => void refetch()} />
        </div>
      ) : isPending ? (
        <div className="space-y-4">
          <StatsSkeleton />
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-56 rounded-xl lg:col-span-2" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
            <Stat label="إجمالي التفاعلات" value={formatNumber(data.totalInteractions.value)}>
              <Delta metric={data.totalInteractions} format={formatNumber} />
            </Stat>

            <Stat label="غير مردود" value={formatNumber(data.unrepliedInteractions.value)}>
              <Delta
                metric={data.unrepliedInteractions}
                higherIsBetter={false}
                format={formatNumber}
              />
            </Stat>

            <Stat label="الردود المُرسلة" value={formatNumber(data.repliesSent.value)}>
              <Delta metric={data.repliesSent} format={formatNumber} />
            </Stat>

            <Stat label="نسبة الرد" value={formatPercent(data.replyRate.value)}>
              <Delta metric={data.replyRate} format={formatPercent} />
            </Stat>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="التفاعلات اليومية"
              className="lg:col-span-2"
              action={
                <span className="text-2xs text-ink-muted">
                  متوسط زمن الرد:{' '}
                  <span className="font-medium text-ink-secondary">
                    {data.averageResponseMinutes
                      ? formatDuration(data.averageResponseMinutes.value)
                      : 'غير متاح'}
                  </span>
                </span>
              }
            >
              <TrendChart points={data.trend} />
            </Panel>

            <Panel title="التوزيع حسب المنصة">
              <PlatformBreakdown items={data.breakdown} />
            </Panel>
          </div>

          <Panel
            title="أحدث التفاعلات"
            action={
              <Link
                to="/app/inbox"
                className="text-2xs font-medium text-brand-text hover:underline"
              >
                فتح الصندوق الوارد
              </Link>
            }
          >
            {recent.isPending ? (
              <div className="space-y-3" aria-busy>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex gap-3">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (recent.data?.length ?? 0) === 0 ? (
              <EmptyState
                className="py-6"
                title="لا توجد تفاعلات بعد"
                description="ستظهر أحدث التعليقات والرسائل هنا."
              />
            ) : (
              <ul className="divide-y divide-border-subtle">
                {recent.data?.map((interaction) => (
                  <li key={interaction.id}>
                    <Link
                      to={`/app/inbox/${interaction.id}`}
                      className="-mx-2 flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-surface-subtle"
                    >
                      <AvatarWithPlatform provider={interaction.provider} chipSize="xs">
                        <Avatar name={interaction.author.displayName} size="sm" />
                      </AvatarWithPlatform>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-xs font-medium text-ink">
                            {interaction.author.displayName}
                          </span>
                          <span className="text-2xs text-ink-faint">
                            {PLATFORM_LABELS_BY_PROVIDER[interaction.provider]}
                          </span>
                          <span className="tabular ms-auto shrink-0 text-2xs text-ink-faint">
                            {formatCompactTime(interaction.createdAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 line-clamp-1 block text-xs text-ink-muted">
                          {interaction.text}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-1 text-2xs text-ink-muted">
                        <StatusDot status={interaction.status} />
                        <span className="hidden sm:inline">
                          {isUnreplied(interaction)
                            ? WORKFLOW_STATUS_LABELS[interaction.status]
                            : 'تم الرد'}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </div>
  )
}
