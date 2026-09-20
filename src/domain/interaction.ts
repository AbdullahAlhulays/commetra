import type { ConnectedAccountId, InteractionId, OrganizationId, ReplyId } from './ids'
import type { ConnectedAccount, ProviderCapabilities, SocialProvider } from './provider'

/**
 * What kind of inbound item this is.
 *
 * A customer's follow-up inside a thread is *not* a third type — it is a
 * `Reply` with `authorKind: 'customer'` hanging off the interaction. Keeping
 * only two top-level types means list rendering, filtering and counting never
 * have to special-case a thread continuation.
 */
export type InteractionType = 'comment' | 'direct_message'

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  comment: 'تعليق',
  direct_message: 'رسالة',
}

export const WORKFLOW_STATUSES = ['new', 'open', 'pending', 'resolved'] as const

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number]

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  new: 'جديد',
  open: 'مفتوح',
  pending: 'بانتظار',
  resolved: 'تم الحل',
}

/** Outcome of the business's own replies on this interaction. */
export type ReplyState = 'none' | 'sending' | 'sent' | 'failed'

export interface InteractionAuthor {
  /** Provider-scoped id; unique per provider, not globally. */
  providerUserId: string
  displayName: string
  handle: string | null
  avatarUrl: string | null
}

export type MediaKind = 'image' | 'video'

export interface MediaAttachment {
  kind: MediaKind
  url: string | null
  /** Small preview used in the detail panel; may exist without a full url. */
  thumbnailUrl: string | null
  alt: string
  /** Seconds. Only meaningful for video. */
  durationSeconds: number | null
}

/**
 * The post, video or story the customer reacted to.
 *
 * Null when the provider will not give us context, or when the interaction is
 * a direct message and has none. The UI must handle both.
 */
export interface OriginalContent {
  providerContentId: string
  /** Caption or post body, trimmed by the provider. */
  excerpt: string
  publishedAt: string
  media: MediaAttachment[]
  /** Canonical link on the source network. Treated as untrusted; see lib/url. */
  permalink: string | null
}

export interface Reply {
  id: ReplyId
  interactionId: InteractionId
  /** Who wrote it: the business, or the customer continuing the thread. */
  authorKind: 'business' | 'customer'
  /** Present for customer replies; business replies render as the workspace. */
  author: InteractionAuthor | null
  text: string
  createdAt: string
  state: ReplyState
  /** User-facing reason when `state` is 'failed'. */
  failureReason: string | null
}

/**
 * Provider-specific fields, quarantined behind a discriminated union.
 *
 * Nothing outside `lib/provider-links.ts` and the mock layer should need to
 * branch on this. Shared models never grow `instagramX` / `tiktokY` fields.
 */
export type ProviderMetadata =
  | { provider: 'facebook'; pageId: string; postId: string | null }
  | { provider: 'instagram'; mediaId: string | null; isStoryReply: boolean }
  | { provider: 'tiktok'; videoId: string | null }
  | { provider: 'x'; tweetId: string | null; isQuote: boolean }

/**
 * The normalised inbound interaction — one shape for all four networks.
 *
 * Provider differences live in exactly two places: `metadata` (identifiers)
 * and `capabilities` (what we may do). Everything else is network-agnostic so
 * the inbox can sort, filter and render a mixed feed without branching.
 */
export interface Interaction {
  id: InteractionId
  organizationId: OrganizationId
  provider: SocialProvider
  connectedAccountId: ConnectedAccountId
  /** The provider's own id — the idempotency key when syncing. */
  providerInteractionId: string
  type: InteractionType
  author: InteractionAuthor
  text: string
  createdAt: string
  isRead: boolean
  status: WorkflowStatus
  replyState: ReplyState
  replies: Reply[]
  originalContent: OriginalContent | null
  media: MediaAttachment[]
  /**
   * Resolved at read time from the owning account, and denormalised onto the
   * interaction so the list can show capability affordances without joining.
   */
  capabilities: ProviderCapabilities
  metadata: ProviderMetadata
}

/** Whether replying is possible, and if not, why — in user-facing Arabic. */
export type ReplyAvailability =
  | { canReply: true }
  | { canReply: false; reason: string; kind: 'capability' | 'connection' }

/**
 * Single source of truth for "can the business answer this?".
 *
 * Both the composer and the list badge call this, so a provider limitation can
 * never be presented one way in one place and another way elsewhere.
 */
export function resolveReplyAvailability(
  interaction: Interaction,
  account: ConnectedAccount | undefined,
): ReplyAvailability {
  if (!account) {
    return {
      canReply: false,
      kind: 'connection',
      reason: 'الحساب المرتبط بهذا التفاعل لم يعد متاحًا.',
    }
  }

  if (account.status === 'needs_reconnect') {
    return {
      canReply: false,
      kind: 'connection',
      reason: `يحتاج حساب ${account.displayName} إلى إعادة الربط قبل إرسال أي رد.`,
    }
  }

  if (account.status === 'error' || account.status === 'disconnected') {
    return {
      canReply: false,
      kind: 'connection',
      reason: `حساب ${account.displayName} غير متصل حاليًا، لذلك لا يمكن إرسال رد.`,
    }
  }

  const capable =
    interaction.type === 'comment'
      ? interaction.capabilities.canReplyToComments
      : interaction.capabilities.canReplyToDirectMessages

  if (!capable) {
    return {
      canReply: false,
      kind: 'capability',
      reason:
        interaction.type === 'comment'
          ? 'لا تتيح واجهة هذه المنصة الرد على التعليقات حاليًا. يمكنك الرد من تطبيق المنصة مباشرة.'
          : 'لا تتيح واجهة هذه المنصة قراءة الرسائل المباشرة والرد عليها حاليًا.',
    }
  }

  return { canReply: true }
}

/** True when the business has never answered. Drives the "غير مردود" filter. */
export function isUnreplied(interaction: Interaction): boolean {
  return !interaction.replies.some((reply) => reply.authorKind === 'business' && reply.state === 'sent')
}
