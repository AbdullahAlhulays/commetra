import type { MetricRange, OrganizationId } from '@/domain'
import type { InboxQuery } from '@/services'

/**
 * Central key factory.
 *
 * Keys are hierarchical so a mutation can invalidate a whole area
 * (`inbox.all()`) without listing every filter combination in use.
 *
 * Organisation id is part of every tenant-scoped key: switching workspaces
 * later must not serve another tenant's cached rows.
 */
export const queryKeys = {
  session: ['session'] as const,

  organization: {
    detail: (id: OrganizationId) => ['organization', id] as const,
    notificationPreferences: (id: OrganizationId) =>
      ['organization', id, 'notification-preferences'] as const,
    workspacePreferences: (id: OrganizationId) =>
      ['organization', id, 'workspace-preferences'] as const,
  },

  inbox: {
    all: () => ['inbox'] as const,
    list: (query: InboxQuery) => ['inbox', 'list', query] as const,
    counts: (query: Omit<InboxQuery, 'cursor' | 'limit'>) => ['inbox', 'counts', query] as const,
    detail: (id: string) => ['inbox', 'detail', id] as const,
  },

  integrations: {
    all: () => ['integrations'] as const,
    accounts: (id: OrganizationId) => ['integrations', 'accounts', id] as const,
  },

  notifications: {
    all: () => ['notifications'] as const,
    list: (id: OrganizationId) => ['notifications', 'list', id] as const,
  },

  analytics: {
    all: () => ['analytics'] as const,
    dashboard: (id: OrganizationId, range: MetricRange) =>
      ['analytics', 'dashboard', id, range] as const,
    recent: (id: OrganizationId, limit: number) => ['analytics', 'recent', id, limit] as const,
  },
} as const
