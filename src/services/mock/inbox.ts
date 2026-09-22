import type {
  ConnectedAccount,
  Interaction,
  InteractionCategory,
  InteractionId,
  Reply,
  WorkflowStatus,
} from '@/domain'
import { isUnreplied, resolveReplyAvailability } from '@/domain'
import { arabicIncludes } from '@/lib/arabic'
import { ServiceError } from '../errors'
import type { InboxCounts, InboxQuery, InboxService, Page, SendReplyInput } from '../types'
import { getDb, withResolvedCapabilities } from './db'
import { delay } from './latency'
import { FLAKY_INTERACTION_ID } from './seed-interactions'
import { nowIso } from './time'

const DEFAULT_LIMIT = 20

function matchesDate(interaction: Interaction, filter: InboxQuery['date']): boolean {
  if (!filter || filter === 'any') return true
  const created = new Date(interaction.createdAt).getTime()
  const now = Date.now()

  if (filter === 'today') {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    return created >= startOfDay.getTime()
  }

  const days = filter === 'last7' ? 7 : 30
  return created >= now - days * 24 * 60 * 60 * 1000
}

function matchesSearch(interaction: Interaction, accounts: ConnectedAccount[], term: string): boolean {
  const account = accounts.find((candidate) => candidate.id === interaction.connectedAccountId)
  const haystacks = [
    interaction.text,
    interaction.author.displayName,
    interaction.author.handle ?? '',
    account?.displayName ?? '',
    account?.handle ?? '',
    interaction.originalContent?.excerpt ?? '',
  ]
  return haystacks.some((value) => value.length > 0 && arabicIncludes(value, term))
}

/**
 * Applies every filter except pagination.
 *
 * Kept as a pure function so `list` and `counts` can never disagree about what
 * a filter means.
 */
function applyFilters(query: InboxQuery): Interaction[] {
  const db = getDb()
  const search = query.search?.trim() ?? ''

  return db.interactions
    .filter((interaction) => interaction.organizationId === query.organizationId)
    .filter((interaction) => !query.providers?.length || query.providers.includes(interaction.provider))
    .filter(
      (interaction) =>
        !query.connectedAccountIds?.length ||
        query.connectedAccountIds.includes(interaction.connectedAccountId),
    )
    .filter((interaction) => !query.statuses?.length || query.statuses.includes(interaction.status))
    .filter(
      (interaction) => !query.categories?.length || query.categories.includes(interaction.category),
    )
    .filter((interaction) => !query.types?.length || query.types.includes(interaction.type))
    .filter((interaction) => {
      if (!query.read || query.read === 'all') return true
      return query.read === 'read' ? interaction.isRead : !interaction.isRead
    })
    .filter((interaction) => {
      if (!query.replied || query.replied === 'all') return true
      const unreplied = isUnreplied(interaction)
      return query.replied === 'unreplied' ? unreplied : !unreplied
    })
    .filter((interaction) => matchesDate(interaction, query.date))
    .filter((interaction) => search.length === 0 || matchesSearch(interaction, db.accounts, search))
    .map((interaction) => withResolvedCapabilities(interaction, db.accounts))
}

function findOrThrow(id: InteractionId): Interaction {
  const db = getDb()
  const interaction = db.interactions.find((candidate) => candidate.id === id)
  if (!interaction) {
    throw new ServiceError('not_found', 'لم نعثر على هذا التفاعل. ربما تم حذفه من المنصة.')
  }
  return withResolvedCapabilities(interaction, db.accounts)
}

function mutate(id: InteractionId, update: (interaction: Interaction) => Interaction): Interaction {
  const db = getDb()
  const index = db.interactions.findIndex((candidate) => candidate.id === id)
  if (index === -1) {
    throw new ServiceError('not_found', 'لم نعثر على هذا التفاعل. ربما تم حذفه من المنصة.')
  }
  const current = db.interactions[index]
  if (!current) {
    throw new ServiceError('not_found', 'لم نعثر على هذا التفاعل. ربما تم حذفه من المنصة.')
  }
  const next = update(current)
  db.interactions[index] = next
  return withResolvedCapabilities(next, db.accounts)
}

export const mockInboxService: InboxService = {
  async list(query: InboxQuery): Promise<Page<Interaction>> {
    await delay('read')

    const filtered = applyFilters(query)
    const limit = query.limit ?? DEFAULT_LIMIT
    const start = query.cursor ? filtered.findIndex((item) => item.id === query.cursor) + 1 : 0
    const items = filtered.slice(start, start + limit)
    const nextIndex = start + items.length
    const last = items.at(-1)

    return {
      items,
      nextCursor: nextIndex < filtered.length && last ? last.id : null,
      total: filtered.length,
    }
  },

  async counts(query): Promise<InboxCounts> {
    await delay('fast')
    const db = getDb()

    // Counts ignore read/replied/status so the rail can show what *would*
    // match if the user switched view, while still respecting the scope
    // filters (provider, account, date, search).
    const scoped = applyFilters({
      ...query,
      read: 'all',
      replied: 'all',
      statuses: [],
      categories: [],
    })

    const byStatus = { new: 0, open: 0, pending: 0, resolved: 0 } satisfies Record<WorkflowStatus, number>
    const byCategory = {
      sales_intent: 0,
      customer_service: 0,
      negative: 0,
      positive: 0,
      spam: 0,
      other: 0,
    } satisfies Record<InteractionCategory, number>
    const byProvider = { instagram: 0, facebook: 0, tiktok: 0, x: 0 }
    const byAccount: Record<string, number> = {}
    for (const account of db.accounts) byAccount[account.id] = 0

    for (const interaction of scoped) {
      byStatus[interaction.status] += 1
      byCategory[interaction.category] += 1
      byProvider[interaction.provider] += 1
      byAccount[interaction.connectedAccountId] = (byAccount[interaction.connectedAccountId] ?? 0) + 1
    }

    return {
      all: scoped.length,
      unread: scoped.filter((interaction) => !interaction.isRead).length,
      unreplied: scoped.filter(isUnreplied).length,
      byStatus,
      byCategory,
      byProvider,
      byAccount,
    }
  },

  async get(id) {
    await delay('read')
    return findOrThrow(id)
  },

  async setRead(id, isRead) {
    await delay('fast')
    return mutate(id, (interaction) => ({ ...interaction, isRead }))
  },

  async setStatus(id, status) {
    await delay('write')
    return mutate(id, (interaction) => ({ ...interaction, status }))
  },

  async reply({ interactionId, text }: SendReplyInput): Promise<Reply> {
    await delay('write')
    const db = getDb()
    const interaction = findOrThrow(interactionId)
    const account = db.accounts.find((candidate) => candidate.id === interaction.connectedAccountId)

    // The same rule the composer uses, enforced again here: a real backend
    // must never trust the client to have checked.
    const availability = resolveReplyAvailability(interaction, account)
    if (!availability.canReply) {
      throw new ServiceError(
        availability.kind === 'capability' ? 'capability_unsupported' : 'account_needs_reconnect',
        availability.reason,
        { retryable: false },
      )
    }

    const trimmed = text.trim()
    if (trimmed.length === 0) {
      throw new ServiceError('validation', 'اكتب نص الرد قبل الإرسال.', { retryable: false })
    }

    // One interaction fails on its first attempt so the retry path is
    // reachable in the demo without changing code.
    if (interactionId === FLAKY_INTERACTION_ID && !db.failedReplyAttempts.has(interactionId)) {
      db.failedReplyAttempts.add(interactionId)
      throw new ServiceError(
        'provider_unavailable',
        'تعذر إرسال الرد — لم تستجب المنصة. حاول مرة أخرى.',
        { retryable: true },
      )
    }

    const reply: Reply = {
      id: `rep_${interactionId}_${Date.now()}`,
      interactionId,
      authorKind: 'business',
      author: null,
      text: trimmed,
      createdAt: nowIso(),
      state: 'sent',
      failureReason: null,
    }

    mutate(interactionId, (current) => ({
      ...current,
      isRead: true,
      replyState: 'sent',
      status: current.status === 'new' ? 'open' : current.status,
      replies: [...current.replies, reply],
    }))

    return reply
  },
}
