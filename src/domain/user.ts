import type { OrganizationId, UserId } from './ids'

export interface User {
  id: UserId
  /** The organisation the user is currently acting within. */
  organizationId: OrganizationId
  fullName: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

/**
 * What the client holds after sign-in.
 *
 * There is no token here on purpose: the real backend should issue an
 * httpOnly, SameSite cookie. Nothing in this app should ever read or store a
 * credential from JavaScript.
 */
export interface AuthSession {
  user: User
  organizationId: OrganizationId
  /** Drives the post-login redirect: onboarding vs. inbox. */
  onboardingCompleted: boolean
}

export interface NotificationPreferences {
  newInteractions: boolean
  replyFailures: boolean
  accountIssues: boolean
  /** A daily digest email; delivery is a backend concern. */
  dailyDigest: boolean
}

export interface WorkspacePreferences {
  /** Open the next interaction automatically after resolving one. */
  autoAdvanceAfterResolve: boolean
  /** Mark an interaction read as soon as it is opened. */
  markReadOnOpen: boolean
  /** Default inbox view on sign-in. */
  defaultInboxView: 'all' | 'unread' | 'unreplied'
}
