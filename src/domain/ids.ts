/**
 * Identifier aliases.
 *
 * These are plain string aliases rather than branded types: they document
 * intent at call sites without forcing casts through every mock, test and
 * serialisation boundary. When a real API arrives the aliases are the single
 * place to tighten (e.g. to branded types or UUID validation).
 */
export type OrganizationId = string
export type UserId = string
export type ConnectedAccountId = string
export type InteractionId = string
export type ReplyId = string
export type NotificationId = string
