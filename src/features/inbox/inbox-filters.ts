import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SOCIAL_PROVIDERS,
  WORKFLOW_STATUSES,
  type InteractionType,
  type OrganizationId,
  type SocialProvider,
  type WorkflowStatus,
} from '@/domain'
import type { DateFilter, InboxQuery } from '@/services'

/** The rail's primary selector. Orthogonal to status, so both can be active. */
export type InboxView = 'all' | 'unread' | 'unreplied'

export interface InboxFilters {
  view: InboxView
  providers: SocialProvider[]
  accountIds: string[]
  statuses: WorkflowStatus[]
  types: InteractionType[]
  date: DateFilter
  search: string
}

export const EMPTY_FILTERS: InboxFilters = {
  view: 'all',
  providers: [],
  accountIds: [],
  statuses: [],
  types: [],
  date: 'any',
  search: '',
}

const VIEWS: InboxView[] = ['all', 'unread', 'unreplied']
const DATES: DateFilter[] = ['any', 'today', 'last7', 'last30']
const TYPES: InteractionType[] = ['comment', 'direct_message']

function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter((value): value is T => (allowed as readonly string[]).includes(value))
}

function parseOne<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(raw ?? '') ? (raw as T) : fallback
}

/**
 * Filters live in the URL.
 *
 * That makes a filtered inbox shareable, survives a refresh, and makes the
 * back button behave — and it keeps filter state out of a global store, where
 * it would have to be synchronised with navigation by hand.
 */
export function useInboxFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<InboxFilters>(
    () => ({
      view: parseOne(searchParams.get('view'), VIEWS, 'all'),
      providers: parseList(searchParams.get('platform'), SOCIAL_PROVIDERS),
      accountIds: (searchParams.get('account') ?? '').split(',').filter(Boolean),
      statuses: parseList(searchParams.get('status'), WORKFLOW_STATUSES),
      types: parseList(searchParams.get('type'), TYPES),
      date: parseOne(searchParams.get('date'), DATES, 'any'),
      search: searchParams.get('q') ?? '',
    }),
    [searchParams],
  )

  const setFilters = useCallback(
    (update: Partial<InboxFilters>) => {
      const next = { ...filters, ...update }
      const params = new URLSearchParams()

      if (next.view !== 'all') params.set('view', next.view)
      if (next.providers.length > 0) params.set('platform', next.providers.join(','))
      if (next.accountIds.length > 0) params.set('account', next.accountIds.join(','))
      if (next.statuses.length > 0) params.set('status', next.statuses.join(','))
      if (next.types.length > 0) params.set('type', next.types.join(','))
      if (next.date !== 'any') params.set('date', next.date)
      if (next.search.trim().length > 0) params.set('q', next.search.trim())

      // `replace` keeps typing in the search box out of the history stack.
      setSearchParams(params, { replace: true })
    },
    [filters, setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return { filters, setFilters, clearFilters }
}

/** Filters that narrow the result beyond the current view. */
export function activeFilterCount(filters: InboxFilters): number {
  return (
    filters.providers.length +
    filters.accountIds.length +
    filters.statuses.length +
    filters.types.length +
    (filters.date === 'any' ? 0 : 1) +
    (filters.search.trim().length > 0 ? 1 : 0)
  )
}

export function hasAnyFilter(filters: InboxFilters): boolean {
  return filters.view !== 'all' || activeFilterCount(filters) > 0
}

/** Maps UI filter state onto the service contract. */
export function toInboxQuery(
  filters: InboxFilters,
  organizationId: OrganizationId,
): Omit<InboxQuery, 'cursor' | 'limit'> {
  return {
    organizationId,
    providers: filters.providers,
    connectedAccountIds: filters.accountIds,
    statuses: filters.statuses,
    types: filters.types,
    read: filters.view === 'unread' ? 'unread' : 'all',
    replied: filters.view === 'unreplied' ? 'unreplied' : 'all',
    date: filters.date,
    search: filters.search.trim(),
  }
}

/**
 * Scope query for the rail counters: the same filters minus the ones the rail
 * itself toggles, so each row can show how many items it would reveal.
 */
export function toCountsQuery(
  filters: InboxFilters,
  organizationId: OrganizationId,
): Omit<InboxQuery, 'cursor' | 'limit'> {
  return {
    organizationId,
    date: filters.date,
    search: filters.search.trim(),
    types: filters.types,
  }
}
