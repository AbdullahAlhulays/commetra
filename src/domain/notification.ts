import type { ConnectedAccountId, InteractionId, NotificationId, OrganizationId } from './ids'
import type { SocialProvider } from './provider'

/**
 * MVP notification types. Deliberately three: anything else belongs to a
 * later, larger notification system.
 */
export type NotificationKind = 'new_interaction' | 'account_needs_reconnect' | 'reply_failed'

/**
 * Where clicking a notification should take the user. Modelled as data rather
 * than a URL string so routing stays owned by the router, not the mock layer.
 */
export type NotificationTarget =
  | { kind: 'interaction'; interactionId: InteractionId }
  | { kind: 'integration'; connectedAccountId: ConnectedAccountId }

export interface AppNotification {
  id: NotificationId
  organizationId: OrganizationId
  kind: NotificationKind
  title: string
  body: string
  createdAt: string
  isRead: boolean
  provider: SocialProvider | null
  target: NotificationTarget | null
}
