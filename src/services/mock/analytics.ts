import type {
  DashboardMetrics,
  Interaction,
  MetricRange,
  MetricValue,
  PlatformBreakdownItem,
  TrendPoint,
} from '@/domain'
import { SOCIAL_PROVIDERS, isUnreplied } from '@/domain'
import type { AnalyticsService } from '../types'
import { getDb, withResolvedCapabilities } from './db'
import { delay } from './latency'

const DAYS_IN_RANGE: Record<MetricRange, number> = { '7d': 7, '30d': 30, '90d': 90 }

const DAY_MS = 24 * 60 * 60 * 1000

function firstBusinessReply(interaction: Interaction) {
  return interaction.replies.find((reply) => reply.authorKind === 'business' && reply.state === 'sent')
}

function value(current: number, previous: number | null): MetricValue {
  return { value: current, previousValue: previous }
}

function toDayKey(iso: string): string {
  return iso.slice(0, 10)
}

export const mockAnalyticsService: AnalyticsService = {
  async dashboard({ organizationId, range }) {
    await delay('read')
    const db = getDb()
    const days = DAYS_IN_RANGE[range]
    const now = Date.now()
    const windowStart = now - days * DAY_MS
    const previousStart = windowStart - days * DAY_MS

    const all = db.interactions.filter(
      (interaction) => interaction.organizationId === organizationId,
    )
    const inRange = all.filter((i) => new Date(i.createdAt).getTime() >= windowStart)
    const inPrevious = all.filter((i) => {
      const at = new Date(i.createdAt).getTime()
      return at >= previousStart && at < windowStart
    })

    const repliesIn = (items: Interaction[]) => items.filter((i) => !isUnreplied(i)).length

    const repliedNow = repliesIn(inRange)
    const repliedPrev = repliesIn(inPrevious)

    // Average first-response time, only over interactions that actually have a
    // business reply. Reported as null below a small sample so the dashboard
    // never presents a number built from one data point.
    const responseSamples = inRange
      .map((interaction) => {
        const reply = firstBusinessReply(interaction)
        if (!reply) return null
        const minutes =
          (new Date(reply.createdAt).getTime() - new Date(interaction.createdAt).getTime()) / 60_000
        return minutes >= 0 ? minutes : null
      })
      .filter((minutes): minutes is number => minutes !== null)

    const averageResponseMinutes =
      responseSamples.length >= 3
        ? value(
            Math.round(responseSamples.reduce((sum, n) => sum + n, 0) / responseSamples.length),
            null,
          )
        : null

    const breakdown: PlatformBreakdownItem[] = SOCIAL_PROVIDERS.map((provider) => {
      const items = inRange.filter((interaction) => interaction.provider === provider)
      return {
        provider,
        interactions: items.length,
        unreplied: items.filter(isUnreplied).length,
      }
    })

    const buckets = new Map<string, TrendPoint>()
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = toDayKey(new Date(now - offset * DAY_MS).toISOString())
      buckets.set(date, { date, interactions: 0, replies: 0 })
    }
    for (const interaction of inRange) {
      const bucket = buckets.get(toDayKey(interaction.createdAt))
      if (!bucket) continue
      bucket.interactions += 1
      bucket.replies += interaction.replies.filter(
        (reply) => reply.authorKind === 'business' && reply.state === 'sent',
      ).length
    }

    return {
      range,
      totalInteractions: value(inRange.length, inPrevious.length),
      unrepliedInteractions: value(
        inRange.filter(isUnreplied).length,
        inPrevious.filter(isUnreplied).length,
      ),
      repliesSent: value(repliedNow, repliedPrev),
      replyRate: value(
        inRange.length === 0 ? 0 : repliedNow / inRange.length,
        inPrevious.length === 0 ? null : repliedPrev / inPrevious.length,
      ),
      averageResponseMinutes,
      breakdown,
      trend: [...buckets.values()],
    } satisfies DashboardMetrics
  },

  async recentInteractions({ organizationId, limit }) {
    await delay('read')
    const db = getDb()
    return db.interactions
      .filter((interaction) => interaction.organizationId === organizationId)
      .slice(0, limit)
      .map((interaction) => withResolvedCapabilities(interaction, db.accounts))
  },
}
