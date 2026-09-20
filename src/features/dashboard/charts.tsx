import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER } from '@/components/platform/platform-meta'
import type { PlatformBreakdownItem, TrendPoint } from '@/domain'
import { cn } from '@/lib/cn'
import { formatDayMonth, formatNumber } from '@/lib/format'

/**
 * Daily interaction volume.
 *
 * One series, so no legend — the heading names what is plotted. Built from
 * HTML columns rather than SVG because a percentage-height div stays crisp and
 * responsive at any container width, where a scaled viewBox would distort the
 * rounded caps.
 */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  const max = Math.max(1, ...points.map((point) => point.interactions))
  const peak = points.reduce(
    (best, point) => (point.interactions > best.interactions ? point : best),
    points[0] ?? { date: '', interactions: 0, replies: 0 },
  )

  const first = points[0]
  const middle = points[Math.floor(points.length / 2)]
  const last = points.at(-1)

  return (
    <figure className="m-0">
      <div className="flex items-stretch gap-3">
        {/* Axis ticks carry the values the columns are not labelled with. */}
        <div className="flex w-6 shrink-0 flex-col justify-between py-0.5 text-end">
          <span className="tabular text-2xs text-ink-faint">{formatNumber(max)}</span>
          <span className="tabular text-2xs text-ink-faint">0</span>
        </div>

        <div className="relative min-w-0 flex-1">
          <span className="absolute inset-x-0 top-0 h-px bg-border-subtle" aria-hidden />
          <span className="absolute inset-x-0 bottom-0 h-px bg-border" aria-hidden />

          <div className="flex h-32 items-end gap-[2px]" role="presentation">
            {points.map((point) => {
              const ratio = point.interactions / max
              return (
                <div
                  key={point.date}
                  className="group flex h-full min-w-0 flex-1 items-end"
                  title={`${formatDayMonth(point.date)} — ${formatNumber(point.interactions)} تفاعل`}
                >
                  <div
                    className={cn(
                      'w-full rounded-t-[4px] transition-colors',
                      point.interactions === 0
                        ? 'bg-border-subtle'
                        : 'bg-brand-600 group-hover:bg-brand-800',
                    )}
                    style={{ height: `${Math.max(ratio * 100, point.interactions > 0 ? 6 : 2)}%` }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/*
        Columns are laid out with flex, so under RTL the oldest day sits on the
        right and time runs right-to-left. The axis labels follow that order —
        oldest first in the DOM — rather than contradicting the bars.
      */}
      <div className="mt-2 flex justify-between ps-9 text-2xs text-ink-faint">
        <span>{first ? formatDayMonth(first.date) : ''}</span>
        <span className="hidden sm:inline">{middle ? formatDayMonth(middle.date) : ''}</span>
        <span>{last ? formatDayMonth(last.date) : ''}</span>
      </div>

      {peak.interactions > 0 ? (
        <figcaption className="mt-2 text-2xs text-ink-muted">
          أعلى يوم: {formatDayMonth(peak.date)} بـ {formatNumber(peak.interactions)} تفاعل.
        </figcaption>
      ) : null}

      {/* Table view: the same numbers, reachable without reading the chart. */}
      <table className="sr-only">
        <caption>التفاعلات اليومية</caption>
        <thead>
          <tr>
            <th scope="col">التاريخ</th>
            <th scope="col">التفاعلات</th>
            <th scope="col">الردود</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <th scope="row">{formatDayMonth(point.date)}</th>
              <td>{formatNumber(point.interactions)}</td>
              <td>{formatNumber(point.replies)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/**
 * Volume per platform.
 *
 * Bars grow from the inline-start baseline (the right, in RTL) and all share
 * one hue: the chip and the platform name beside each row carry identity, so
 * colour is never the only channel.
 */
export function PlatformBreakdown({ items }: { items: PlatformBreakdownItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.interactions))
  const total = items.reduce((sum, item) => sum + item.interactions, 0)

  if (total === 0) {
    return (
      <p className="py-6 text-center text-xs text-ink-muted">
        لا توجد تفاعلات في هذه الفترة.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.provider}>
          <div className="flex items-center gap-2">
            <PlatformChip provider={item.provider} size="xs" />
            <span className="text-xs font-medium text-ink-secondary">
              {PLATFORM_LABELS_BY_PROVIDER[item.provider]}
            </span>
            <span className="tabular ms-auto text-xs font-medium text-ink">
              {formatNumber(item.interactions)}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-sunken">
              <div
                className="h-full rounded-full bg-brand-600"
                style={{ width: `${(item.interactions / max) * 100}%` }}
              />
            </div>
            {item.unreplied > 0 ? (
              <span className="tabular shrink-0 text-2xs text-accent-strong">
                {formatNumber(item.unreplied)} غير مردود
              </span>
            ) : (
              <span className="shrink-0 text-2xs text-ink-faint">تم الرد على الكل</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
