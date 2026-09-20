import type {
  AppNotification,
  ConnectedAccount,
  Interaction,
  NotificationPreferences,
  Organization,
  User,
  WorkspacePreferences,
} from '@/domain'
import {
  ORG_ID,
  seedAccounts,
  seedNotificationPreferences,
  seedOrganization,
  seedUser,
  seedWorkspacePreferences,
} from './seed-accounts'
import { assertSeedIntegrity, buildSeedInteractions } from './seed-interactions'
import { minutesAgo } from './time'

/**
 * In-memory store behind the mock services.
 *
 * Data mutations (read state, replies, statuses) live for the lifetime of the
 * tab. Only the session is persisted, so signing in and reloading behaves the
 * way a real app does while seed timestamps stay fresh on every load.
 */
export interface MockDb {
  organization: Organization
  user: User
  accounts: ConnectedAccount[]
  interactions: Interaction[]
  notifications: AppNotification[]
  notificationPreferences: NotificationPreferences
  workspacePreferences: WorkspacePreferences
  /** Ids of interactions whose reply has already failed once. */
  failedReplyAttempts: Set<string>
}

function buildNotifications(interactions: Interaction[], accounts: ConnectedAccount[]): AppNotification[] {
  const unread = interactions.filter((interaction) => !interaction.isRead).slice(0, 3)
  const stale = accounts.find((account) => account.status === 'needs_reconnect')

  const notifications: AppNotification[] = unread.map((interaction, index) => ({
    id: `ntf_new_${index + 1}`,
    organizationId: ORG_ID,
    kind: 'new_interaction',
    title: interaction.type === 'comment' ? 'تعليق جديد' : 'رسالة جديدة',
    body: `${interaction.author.displayName}: ${interaction.text}`,
    createdAt: interaction.createdAt,
    isRead: false,
    provider: interaction.provider,
    target: { kind: 'interaction', interactionId: interaction.id },
  }))

  if (stale) {
    notifications.push({
      id: 'ntf_reconnect',
      organizationId: ORG_ID,
      kind: 'account_needs_reconnect',
      title: 'يحتاج حساب إلى إعادة ربط',
      body: `انتهت صلاحية تفويض ${stale.displayName}. أعد الربط لاستئناف استقبال التعليقات.`,
      createdAt: minutesAgo(60 * 31),
      isRead: false,
      provider: stale.provider,
      target: { kind: 'integration', connectedAccountId: stale.id },
    })
  }

  return notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

function createDb(): MockDb {
  assertSeedIntegrity()
  const interactions = buildSeedInteractions()
  const accounts = seedAccounts.map((account) => ({ ...account }))

  return {
    organization: { ...seedOrganization },
    user: { ...seedUser },
    accounts,
    interactions,
    notifications: buildNotifications(interactions, accounts),
    notificationPreferences: { ...seedNotificationPreferences },
    workspacePreferences: { ...seedWorkspacePreferences },
    failedReplyAttempts: new Set(),
  }
}

let db: MockDb | null = null

export function getDb(): MockDb {
  db ??= createDb()
  return db
}

/** Used by tests, and by sign-in, to return to the populated demo tenant. */
export function resetDb(): void {
  db = createDb()
}

/**
 * Replaces the store with a brand-new, genuinely empty tenant.
 *
 * Registration goes through here so a new account sees real empty states, and
 * the inbox only fills once an account is connected and "synced".
 */
export function createEmptyTenant(input: { fullName: string; email: string }): MockDb {
  const id = `org_${Date.now().toString(36)}`
  db = {
    organization: {
      id,
      name: '',
      category: 'other',
      createdAt: new Date().toISOString(),
      onboardingCompletedAt: null,
    },
    user: {
      id: `usr_${Date.now().toString(36)}`,
      organizationId: id,
      fullName: input.fullName,
      email: input.email,
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    },
    accounts: [],
    interactions: [],
    notifications: [],
    notificationPreferences: { ...seedNotificationPreferences },
    workspacePreferences: { ...seedWorkspacePreferences },
    failedReplyAttempts: new Set(),
  }
  return db
}

/**
 * Capabilities are stored on the account and denormalised onto interactions at
 * read time, so re-connecting an account with different permissions updates
 * every interaction it owns without a migration.
 */
export function withResolvedCapabilities(interaction: Interaction, accounts: ConnectedAccount[]): Interaction {
  const account = accounts.find((candidate) => candidate.id === interaction.connectedAccountId)
  if (!account) return interaction
  return { ...interaction, capabilities: account.capabilities }
}
