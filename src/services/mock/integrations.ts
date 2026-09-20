import type { ConnectedAccount, SocialProvider } from '@/domain'
import { PROVIDER_CAPABILITIES, PROVIDER_LABELS } from '@/domain'
import { ServiceError } from '../errors'
import type { IntegrationsService } from '../types'
import { getDb } from './db'
import { delay } from './latency'
import { buildInteractionsForProvider } from './seed-interactions'
import { nowIso } from './time'

/**
 * ====================== MOCK PROVIDER CONNECTION =========================
 *
 * This file simulates the OAuth round-trip. Nothing here touches a provider.
 *
 * The real implementation replaces `connect`/`reconnect` with:
 *   1. POST /integrations/{provider}/authorize  -> { authorizationUrl, state }
 *   2. Browser navigates to the provider's consent screen.
 *   3. Provider redirects back to our server-side callback with a code.
 *   4. The *server* exchanges the code for tokens and stores them.
 *   5. The client re-fetches the account list.
 *
 * No client id, secret, token or provider URL belongs in this bundle — step 4
 * is the reason the exchange must stay server-side.
 * =========================================================================
 */

const SUGGESTED_HANDLES: Record<SocialProvider, string> = {
  instagram: 'nawah.official',
  facebook: 'nawah.page',
  tiktok: 'nawah.clips',
  x: 'nawah_support',
}

function findAccount(id: string): ConnectedAccount {
  const account = getDb().accounts.find((candidate) => candidate.id === id)
  if (!account) {
    throw new ServiceError('not_found', 'لم نعثر على هذا الحساب.')
  }
  return account
}

function replaceAccount(next: ConnectedAccount): ConnectedAccount {
  const db = getDb()
  db.accounts = db.accounts.map((account) => (account.id === next.id ? next : account))
  return next
}

export const mockIntegrationsService: IntegrationsService = {
  async listAccounts(organizationId) {
    await delay('read')
    return getDb().accounts.filter((account) => account.organizationId === organizationId)
  },

  async connect({ organizationId, provider }) {
    // Longer delay on purpose: this stands in for a provider round-trip and
    // the "جاري الربط" state should be genuinely visible.
    await delay('provider')

    const db = getDb()
    const existingForProvider = db.accounts.filter((account) => account.provider === provider)
    const account: ConnectedAccount = {
      id: `acc_${provider}_${Date.now().toString(36)}`,
      organizationId,
      provider,
      displayName:
        existingForProvider.length > 0
          ? `${db.organization.name || 'حسابي'} — ${PROVIDER_LABELS[provider]} ${existingForProvider.length + 1}`
          : db.organization.name || PROVIDER_LABELS[provider],
      handle: SUGGESTED_HANDLES[provider],
      avatarUrl: null,
      status: 'connected',
      statusMessage: null,
      connectedAt: nowIso(),
      lastSyncedAt: nowIso(),
      capabilities: PROVIDER_CAPABILITIES[provider],
    }

    db.accounts = [...db.accounts, account]

    // Initial history sync: only for a provider with no data yet, so
    // connecting a second account does not duplicate the first one's items.
    const hasHistory = db.interactions.some((interaction) => interaction.provider === provider)
    if (!hasHistory) {
      const backfill = buildInteractionsForProvider({
        provider,
        accountId: account.id,
        organizationId,
      })
      db.interactions = [...db.interactions, ...backfill].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      )
    }

    return account
  },

  async reconnect(id) {
    await delay('provider')
    const account = findAccount(id)
    return replaceAccount({
      ...account,
      status: 'connected',
      statusMessage: null,
      connectedAt: nowIso(),
      lastSyncedAt: nowIso(),
    })
  },

  async disconnect(id) {
    await delay('write')
    const db = getDb()
    findAccount(id)
    db.accounts = db.accounts.filter((account) => account.id !== id)
    // Interactions belonging to the account go with it — matching what a real
    // backend does when access is revoked.
    db.interactions = db.interactions.filter(
      (interaction) => interaction.connectedAccountId !== id,
    )
  },

  async sync(id) {
    await delay('provider')
    const account = findAccount(id)
    if (account.status === 'needs_reconnect' || account.status === 'error') {
      throw new ServiceError(
        'account_needs_reconnect',
        `تعذرت المزامنة. يحتاج حساب ${account.displayName} إلى إعادة الربط.`,
        { retryable: false },
      )
    }
    return replaceAccount({ ...account, status: 'connected', lastSyncedAt: nowIso() })
  },
}
