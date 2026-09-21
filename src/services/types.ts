import type {
  AppNotification,
  AuthSession,
  BusinessCategory,
  ConnectedAccount,
  ConnectedAccountId,
  DashboardMetrics,
  Interaction,
  InteractionCategory,
  InteractionId,
  InteractionType,
  MetricRange,
  NotificationPreferences,
  Organization,
  OrganizationId,
  Reply,
  SocialProvider,
  User,
  WorkflowStatus,
  WorkspacePreferences,
} from '@/domain'

/**
 * Cursor pagination. Chosen over offsets because an inbox receives new items
 * at the head constantly, and offsets would shift rows under the user.
 */
export interface Page<T> {
  items: T[]
  nextCursor: string | null
  total: number
}

export type ReadFilter = 'all' | 'read' | 'unread'
export type RepliedFilter = 'all' | 'replied' | 'unreplied'
export type DateFilter = 'any' | 'today' | 'last7' | 'last30'

/**
 * The full inbox query, shaped so it can be serialised straight into a request.
 *
 * Search sits here rather than in a client-side filter on purpose: the server
 * will own it, and the UI should already be written as if it does.
 */
export interface InboxQuery {
  organizationId: OrganizationId
  providers?: SocialProvider[]
  connectedAccountIds?: ConnectedAccountId[]
  statuses?: WorkflowStatus[]
  categories?: InteractionCategory[]
  types?: InteractionType[]
  read?: ReadFilter
  replied?: RepliedFilter
  date?: DateFilter
  search?: string
  cursor?: string | null
  limit?: number
}

/** Sidebar counters. Server-computed so the client never counts a partial page. */
export interface InboxCounts {
  all: number
  unread: number
  unreplied: number
  byStatus: Record<WorkflowStatus, number>
  byCategory: Record<InteractionCategory, number>
  byProvider: Record<SocialProvider, number>
  byAccount: Record<ConnectedAccountId, number>
}

export interface SendReplyInput {
  interactionId: InteractionId
  text: string
}

export interface InboxService {
  list(query: InboxQuery): Promise<Page<Interaction>>
  counts(query: Omit<InboxQuery, 'cursor' | 'limit'>): Promise<InboxCounts>
  get(id: InteractionId): Promise<Interaction>
  setRead(id: InteractionId, isRead: boolean): Promise<Interaction>
  setStatus(id: InteractionId, status: WorkflowStatus): Promise<Interaction>
  reply(input: SendReplyInput): Promise<Reply>
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpInput {
  fullName: string
  email: string
  password: string
}

export interface AuthService {
  /** Resolves null when nobody is signed in. Never throws for that case. */
  getSession(): Promise<AuthSession | null>
  signIn(input: SignInInput): Promise<AuthSession>
  signUp(input: SignUpInput): Promise<AuthSession>
  signOut(): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  resetPassword(input: { token: string; password: string }): Promise<void>
  updateProfile(input: { fullName: string; email: string }): Promise<User>
}

export interface OnboardingInput {
  name: string
  category: BusinessCategory
}

export interface OrganizationService {
  get(id: OrganizationId): Promise<Organization>
  updateProfile(id: OrganizationId, input: OnboardingInput): Promise<Organization>
  completeOnboarding(id: OrganizationId): Promise<Organization>
  getNotificationPreferences(id: OrganizationId): Promise<NotificationPreferences>
  updateNotificationPreferences(
    id: OrganizationId,
    input: NotificationPreferences,
  ): Promise<NotificationPreferences>
  getWorkspacePreferences(id: OrganizationId): Promise<WorkspacePreferences>
  updateWorkspacePreferences(
    id: OrganizationId,
    input: WorkspacePreferences,
  ): Promise<WorkspacePreferences>
}

export interface IntegrationsService {
  listAccounts(organizationId: OrganizationId): Promise<ConnectedAccount[]>
  /**
   * Stands in for the provider OAuth round-trip.
   *
   * The real implementation returns an authorisation URL for the browser to
   * visit; the mock resolves with the account it just linked. See
   * `services/mock/integrations.ts` for the exact replacement boundary.
   */
  connect(input: { organizationId: OrganizationId; provider: SocialProvider }): Promise<ConnectedAccount>
  reconnect(id: ConnectedAccountId): Promise<ConnectedAccount>
  disconnect(id: ConnectedAccountId): Promise<void>
  sync(id: ConnectedAccountId): Promise<ConnectedAccount>
}

export interface NotificationsService {
  list(organizationId: OrganizationId): Promise<AppNotification[]>
  markRead(id: string): Promise<AppNotification>
  markAllRead(organizationId: OrganizationId): Promise<void>
}

export interface AnalyticsService {
  dashboard(input: { organizationId: OrganizationId; range: MetricRange }): Promise<DashboardMetrics>
  recentInteractions(input: { organizationId: OrganizationId; limit: number }): Promise<Interaction[]>
}

/**
 * The single surface the UI talks to.
 *
 * Swapping the mock for a real backend means providing another object of this
 * shape in `services/index.ts`. No component, hook or test imports a concrete
 * implementation directly.
 */
export interface ApiClient {
  auth: AuthService
  organizations: OrganizationService
  inbox: InboxService
  integrations: IntegrationsService
  notifications: NotificationsService
  analytics: AnalyticsService
}
