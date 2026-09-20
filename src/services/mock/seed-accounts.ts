import type {
  ConnectedAccount,
  NotificationPreferences,
  Organization,
  User,
  WorkspacePreferences,
} from '@/domain'
import { PROVIDER_CAPABILITIES } from '@/domain'
import { minutesAgo } from './time'

export const ORG_ID = 'org_nawah'
export const USER_ID = 'usr_owner'

/**
 * The demo tenant: a Saudi specialty-coffee retailer with both a physical
 * roastery and an online store. Broad enough to produce plausible questions
 * about stock, delivery, hours, prices and complaints.
 */
export const seedOrganization: Organization = {
  id: ORG_ID,
  name: 'نواة للقهوة المختصة',
  category: 'ecommerce',
  createdAt: minutesAgo(60 * 24 * 120),
  onboardingCompletedAt: minutesAgo(60 * 24 * 119),
}

export const seedUser: User = {
  id: USER_ID,
  organizationId: ORG_ID,
  fullName: 'نورة الحربي',
  email: 'noura@nawah.example',
  avatarUrl: null,
  createdAt: minutesAgo(60 * 24 * 120),
}

/** Stable ids so seeds, notifications and tests can reference accounts. */
export const ACCOUNT_IDS = {
  igCafe: 'acc_ig_cafe',
  igStore: 'acc_ig_store',
  facebook: 'acc_fb_page',
  tiktok: 'acc_tt_main',
  x: 'acc_x_main',
} as const

/**
 * Two Instagram accounts on purpose: the model must never assume one account
 * per provider. One of them needs re-authorisation, which is what drives the
 * disabled-composer and reconnect states in the UI.
 */
export const seedAccounts: ConnectedAccount[] = [
  {
    id: ACCOUNT_IDS.igCafe,
    organizationId: ORG_ID,
    provider: 'instagram',
    displayName: 'نواة | المحمصة',
    handle: 'nawah.roastery',
    avatarUrl: null,
    status: 'connected',
    statusMessage: null,
    connectedAt: minutesAgo(60 * 24 * 118),
    lastSyncedAt: minutesAgo(4),
    capabilities: PROVIDER_CAPABILITIES.instagram,
  },
  {
    id: ACCOUNT_IDS.igStore,
    organizationId: ORG_ID,
    provider: 'instagram',
    displayName: 'نواة | المتجر الإلكتروني',
    handle: 'nawah.store',
    avatarUrl: null,
    status: 'needs_reconnect',
    statusMessage: 'انتهت صلاحية تفويض الحساب. أعد الربط لاستئناف استقبال التعليقات.',
    connectedAt: minutesAgo(60 * 24 * 96),
    lastSyncedAt: minutesAgo(60 * 31),
    capabilities: PROVIDER_CAPABILITIES.instagram,
  },
  {
    id: ACCOUNT_IDS.facebook,
    organizationId: ORG_ID,
    provider: 'facebook',
    displayName: 'نواة للقهوة المختصة',
    handle: 'nawah.sa',
    avatarUrl: null,
    status: 'connected',
    statusMessage: null,
    connectedAt: minutesAgo(60 * 24 * 117),
    lastSyncedAt: minutesAgo(9),
    capabilities: PROVIDER_CAPABILITIES.facebook,
  },
  {
    id: ACCOUNT_IDS.tiktok,
    organizationId: ORG_ID,
    provider: 'tiktok',
    displayName: 'نواة',
    handle: 'nawah.coffee',
    avatarUrl: null,
    status: 'connected',
    statusMessage: null,
    connectedAt: minutesAgo(60 * 24 * 40),
    lastSyncedAt: minutesAgo(26),
    capabilities: PROVIDER_CAPABILITIES.tiktok,
  },
  {
    id: ACCOUNT_IDS.x,
    organizationId: ORG_ID,
    provider: 'x',
    displayName: 'نواة',
    handle: 'nawah_sa',
    avatarUrl: null,
    status: 'connected',
    statusMessage: null,
    connectedAt: minutesAgo(60 * 24 * 74),
    lastSyncedAt: minutesAgo(13),
    capabilities: PROVIDER_CAPABILITIES.x,
  },
]

export const seedNotificationPreferences: NotificationPreferences = {
  newInteractions: true,
  replyFailures: true,
  accountIssues: true,
  dailyDigest: false,
}

export const seedWorkspacePreferences: WorkspacePreferences = {
  autoAdvanceAfterResolve: true,
  markReadOnOpen: true,
  defaultInboxView: 'all',
}
