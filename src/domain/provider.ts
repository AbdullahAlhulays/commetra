import type { ConnectedAccountId, OrganizationId } from './ids'

/** The four networks supported in this version. Google Reviews is out of scope. */
export const SOCIAL_PROVIDERS = ['instagram', 'facebook', 'tiktok', 'x'] as const

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number]

/**
 * What a provider actually lets us do on behalf of a connected account.
 *
 * The UI must read capabilities instead of assuming parity between networks —
 * a reply box that posts nowhere is worse than no reply box at all.
 */
export interface ProviderCapabilities {
  canReadComments: boolean
  canReadDirectMessages: boolean
  canReplyToComments: boolean
  canReplyToDirectMessages: boolean
  /** Whether the post/video a comment belongs to can be fetched for context. */
  canReadPostContext: boolean
  /** Push/webhook delivery vs. scheduled polling. */
  supportsRealtimeUpdates: boolean
}

/**
 * Development placeholder matrix.
 *
 * !! Not verified against live provider APIs. Each entry must be re-confirmed
 * against the provider's current API tier and app review status before launch,
 * because capabilities differ by access level, not just by network.
 */
export const PROVIDER_CAPABILITIES: Record<SocialProvider, ProviderCapabilities> = {
  facebook: {
    canReadComments: true,
    canReadDirectMessages: true,
    canReplyToComments: true,
    canReplyToDirectMessages: true,
    canReadPostContext: true,
    supportsRealtimeUpdates: true,
  },
  instagram: {
    canReadComments: true,
    canReadDirectMessages: true,
    canReplyToComments: true,
    canReplyToDirectMessages: true,
    canReadPostContext: true,
    supportsRealtimeUpdates: true,
  },
  tiktok: {
    canReadComments: true,
    canReadDirectMessages: false,
    // TikTok does not expose comment replies on the access tier we target.
    canReplyToComments: false,
    canReplyToDirectMessages: false,
    canReadPostContext: true,
    supportsRealtimeUpdates: false,
  },
  x: {
    canReadComments: true,
    canReadDirectMessages: true,
    canReplyToComments: true,
    canReplyToDirectMessages: true,
    canReadPostContext: true,
    supportsRealtimeUpdates: false,
  },
}

export const PROVIDER_LABELS: Record<SocialProvider, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  x: 'X',
}

/**
 * Connection lifecycle of one account.
 * `connecting` and `syncing` are transient; the rest are resting states.
 */
export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'needs_reconnect'
  | 'error'
  | 'syncing'

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  disconnected: 'غير متصل',
  connecting: 'جاري الربط',
  connected: 'متصل',
  needs_reconnect: 'يحتاج إعادة ربط',
  error: 'خطأ',
  syncing: 'جاري المزامنة',
}

/**
 * A single social account a business has linked.
 *
 * An organisation may link several accounts per provider, so nothing keys off
 * `provider` alone.
 */
export interface ConnectedAccount {
  id: ConnectedAccountId
  organizationId: OrganizationId
  provider: SocialProvider
  /** Display name of the page/profile, e.g. "متجر نواة". */
  displayName: string
  /** Public handle without the @, e.g. "nawah.store". */
  handle: string
  avatarUrl: string | null
  status: ConnectionStatus
  /** Present when status is `error` or `needs_reconnect`. */
  statusMessage: string | null
  connectedAt: string | null
  lastSyncedAt: string | null
  capabilities: ProviderCapabilities
}

/** True when the account can currently serve data or accept replies. */
export function isAccountActive(account: ConnectedAccount): boolean {
  return account.status === 'connected' || account.status === 'syncing'
}
