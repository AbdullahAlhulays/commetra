import type { SocialProvider } from './provider'

/** Windows the dashboard can be scoped to. */
export const METRIC_RANGES = ['7d', '30d', '90d'] as const

export type MetricRange = (typeof METRIC_RANGES)[number]

export const METRIC_RANGE_LABELS: Record<MetricRange, string> = {
  '7d': 'آخر 7 أيام',
  '30d': 'آخر 30 يومًا',
  '90d': 'آخر 90 يومًا',
}

export interface TrendPoint {
  /** ISO date, day granularity. */
  date: string
  interactions: number
  replies: number
}

export interface PlatformBreakdownItem {
  provider: SocialProvider
  interactions: number
  unreplied: number
}

/**
 * A metric that may legitimately be unavailable.
 *
 * Average response time needs reply timestamps the provider may not return, so
 * the contract admits "not computable" instead of silently reporting zero.
 */
export interface MetricValue {
  value: number
  /** Same metric over the preceding window, for the delta. Null when unknown. */
  previousValue: number | null
}

export interface DashboardMetrics {
  range: MetricRange
  totalInteractions: MetricValue
  unrepliedInteractions: MetricValue
  repliesSent: MetricValue
  /** 0–1. */
  replyRate: MetricValue
  /** Minutes. Null when there is not enough data to compute it. */
  averageResponseMinutes: MetricValue | null
  breakdown: PlatformBreakdownItem[]
  trend: TrendPoint[]
}
