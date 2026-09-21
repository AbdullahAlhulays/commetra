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

/**
 * What the interaction is *about*, assigned automatically as it arrives.
 *
 * Status answers "have we dealt with it"; category answers "what is it".
 * The two are orthogonal on purpose: a sales question can be new or resolved,
 * and a complaint is still a complaint after it is answered.
 *
 * Order matters — it is the order the rail lists them in, and it runs from the
 * interactions that cost the most to miss down to the ones that cost nothing.
 */
export const INTERACTION_CATEGORIES = [
  'sales_intent',
  'customer_service',
  'negative',
  'spam',
  'other',
] as const

export type InteractionCategory = (typeof INTERACTION_CATEGORIES)[number]

export const INTERACTION_CATEGORY_LABELS: Record<InteractionCategory, string> = {
  sales_intent: 'فرصة بيع',
  customer_service: 'خدمة عملاء',
  negative: 'تعليق سلبي',
  spam: 'إزعاج وسبام',
  other: 'أخرى',
}

export const INTERACTION_CATEGORY_DESCRIPTIONS: Record<InteractionCategory, string> = {
  sales_intent: 'سؤال عن سعر أو توفر أو طلب — عميل قريب من الشراء.',
  customer_service: 'سؤال عن طلب قائم أو شحن أو إرجاع أو فرع.',
  negative: 'شكوى أو انتقاد يحتاج معالجة قبل أن يكبر.',
  spam: 'إعلانات وروابط وتعليقات مسيئة لا علاقة لها بنشاطك.',
  other: 'شكر ومجاملات وتعليقات عامة لا تنتظر ردًا عاجلًا.',
}

/**
 * The categories kept off the public post.
 *
 * Hiding never deletes and never blocks a reply: the interaction stays in the
 * inbox, readable and answerable. It only stops being visible to everyone else
 * under the post.
 */
export function isHiddenCategory(category: InteractionCategory): boolean {
  return category === 'negative' || category === 'spam'
}

/**
 * Whether this interaction still shows publicly under the post.
 *
 * `cannot_hide` is deliberately not folded into `public`: it means the network
 * gives us no way to take the comment down, and a business that thinks a
 * comment was hidden when it is still live has been misled by its own tool.
 */
export type PublicVisibility = 'public' | 'hidden' | 'cannot_hide' | 'not_applicable'

export const PUBLIC_VISIBILITY_LABELS: Record<PublicVisibility, string> = {
  public: 'ظاهر للجميع',
  hidden: 'مخفي عن المنشور',
  cannot_hide: 'لا تتيح المنصة إخفاءه',
  not_applicable: 'رسالة خاصة',
}

/**
 * Resolves what the platform actually did with a flagged interaction.
 *
 * Single source of truth, so the list badge, the detail banner and the mock
 * ingest can never disagree about whether a comment is off the post.
 */
export function resolvePublicVisibility(
  category: InteractionCategory,
  type: InteractionType,
  capabilities: ProviderCapabilities,
): PublicVisibility {
  if (type === 'direct_message') return 'not_applicable'
  if (!isHiddenCategory(category)) return 'public'
  return capabilities.canHideComments ? 'hidden' : 'cannot_hide'
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
  /** Assigned on arrival. Never blocks reading or replying. */
  category: InteractionCategory
  /** Whether the comment still shows under the post for everyone else. */
  publicVisibility: PublicVisibility
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
