import { describe, expect, it } from 'vitest'
import { PROVIDER_CAPABILITIES, type ConnectedAccount, type Interaction } from '@/domain'
import { isHiddenCategory, isUnreplied, resolvePublicVisibility, resolveReplyAvailability } from './interaction'

function makeAccount(overrides: Partial<ConnectedAccount> = {}): ConnectedAccount {
  return {
    id: 'acc_1',
    organizationId: 'org_1',
    provider: 'instagram',
    displayName: 'متجر تجريبي',
    handle: 'demo.store',
    avatarUrl: null,
    status: 'connected',
    statusMessage: null,
    connectedAt: '2026-01-01T00:00:00.000Z',
    lastSyncedAt: '2026-01-01T00:00:00.000Z',
    capabilities: PROVIDER_CAPABILITIES.instagram,
    ...overrides,
  }
}

function makeInteraction(overrides: Partial<Interaction> = {}): Interaction {
  return {
    id: 'int_1',
    organizationId: 'org_1',
    provider: 'instagram',
    connectedAccountId: 'acc_1',
    providerInteractionId: 'ig_1',
    type: 'comment',
    author: {
      providerUserId: 'u1',
      displayName: 'عميل',
      handle: 'customer',
      avatarUrl: null,
    },
    text: 'سؤال',
    createdAt: '2026-01-01T00:00:00.000Z',
    isRead: false,
    status: 'new',
    category: 'customer_service',
    publicVisibility: 'public',
    replyState: 'none',
    replies: [],
    originalContent: null,
    media: [],
    capabilities: PROVIDER_CAPABILITIES.instagram,
    metadata: { provider: 'instagram', mediaId: null, isStoryReply: false },
    ...overrides,
  }
}

describe('resolveReplyAvailability', () => {
  it('allows replying on a healthy account with the capability', () => {
    expect(resolveReplyAvailability(makeInteraction(), makeAccount())).toEqual({ canReply: true })
  })

  it('blocks replying when the provider does not support comment replies', () => {
    const result = resolveReplyAvailability(
      makeInteraction({ provider: 'tiktok', capabilities: PROVIDER_CAPABILITIES.tiktok }),
      makeAccount({ provider: 'tiktok', capabilities: PROVIDER_CAPABILITIES.tiktok }),
    )

    expect(result.canReply).toBe(false)
    if (!result.canReply) {
      expect(result.kind).toBe('capability')
      expect(result.reason).toContain('لا تتيح')
    }
  })

  it('blocks replying when the account needs re-authorisation', () => {
    const result = resolveReplyAvailability(
      makeInteraction(),
      makeAccount({ status: 'needs_reconnect' }),
    )

    expect(result.canReply).toBe(false)
    if (!result.canReply) {
      expect(result.kind).toBe('connection')
      expect(result.reason).toContain('إعادة الربط')
    }
  })

  it('reports connection trouble before a capability limit', () => {
    // A disconnected TikTok account fails both checks; the actionable one wins.
    const result = resolveReplyAvailability(
      makeInteraction({ provider: 'tiktok', capabilities: PROVIDER_CAPABILITIES.tiktok }),
      makeAccount({
        provider: 'tiktok',
        capabilities: PROVIDER_CAPABILITIES.tiktok,
        status: 'needs_reconnect',
      }),
    )

    expect(result.canReply).toBe(false)
    if (!result.canReply) expect(result.kind).toBe('connection')
  })

  it('blocks replying when the owning account is missing', () => {
    const result = resolveReplyAvailability(makeInteraction(), undefined)
    expect(result.canReply).toBe(false)
  })

  it('separates direct-message capability from comment capability', () => {
    const result = resolveReplyAvailability(
      makeInteraction({
        type: 'direct_message',
        provider: 'tiktok',
        capabilities: PROVIDER_CAPABILITIES.tiktok,
      }),
      makeAccount({ provider: 'tiktok', capabilities: PROVIDER_CAPABILITIES.tiktok }),
    )

    expect(result.canReply).toBe(false)
    if (!result.canReply) expect(result.reason).toContain('الرسائل المباشرة')
  })
})

describe('isUnreplied', () => {
  it('is true when only the customer has written', () => {
    expect(isUnreplied(makeInteraction())).toBe(true)
  })

  it('is false once a business reply has been sent', () => {
    const interaction = makeInteraction({
      replies: [
        {
          id: 'r1',
          interactionId: 'int_1',
          authorKind: 'business',
          author: null,
          text: 'أهلاً بك',
          createdAt: '2026-01-01T01:00:00.000Z',
          state: 'sent',
          failureReason: null,
        },
      ],
    })

    expect(isUnreplied(interaction)).toBe(false)
  })

  it('stays true while a reply is still sending', () => {
    const interaction = makeInteraction({
      replies: [
        {
          id: 'r1',
          interactionId: 'int_1',
          authorKind: 'business',
          author: null,
          text: 'أهلاً بك',
          createdAt: '2026-01-01T01:00:00.000Z',
          state: 'sending',
          failureReason: null,
        },
      ],
    })

    expect(isUnreplied(interaction)).toBe(true)
  })

  it('does not count a customer follow-up as a business reply', () => {
    const interaction = makeInteraction({
      replies: [
        {
          id: 'r1',
          interactionId: 'int_1',
          authorKind: 'customer',
          author: null,
          text: 'هل من جديد؟',
          createdAt: '2026-01-01T01:00:00.000Z',
          state: 'sent',
          failureReason: null,
        },
      ],
    })

    expect(isUnreplied(interaction)).toBe(true)
  })
})

describe('resolvePublicVisibility', () => {
  const meta = PROVIDER_CAPABILITIES.instagram
  const tiktok = PROVIDER_CAPABILITIES.tiktok

  it('leaves ordinary comments on the post', () => {
    expect(resolvePublicVisibility('sales_intent', 'comment', meta)).toBe('public')
    expect(resolvePublicVisibility('customer_service', 'comment', meta)).toBe('public')
    expect(resolvePublicVisibility('other', 'comment', meta)).toBe('public')
  })

  it('takes spam and complaints off the post where the network allows it', () => {
    expect(resolvePublicVisibility('spam', 'comment', meta)).toBe('hidden')
    expect(resolvePublicVisibility('negative', 'comment', meta)).toBe('hidden')
  })

  it('never claims a comment was hidden on a network that cannot hide it', () => {
    // The whole point of the third state: saying "hidden" here would tell a
    // business its post is clean while the comment is still live on TikTok.
    expect(tiktok.canHideComments).toBe(false)
    expect(resolvePublicVisibility('spam', 'comment', tiktok)).toBe('cannot_hide')
    expect(resolvePublicVisibility('negative', 'comment', tiktok)).toBe('cannot_hide')
  })

  it('does not apply to direct messages, which were never public', () => {
    expect(resolvePublicVisibility('spam', 'direct_message', meta)).toBe('not_applicable')
  })

  it('agrees with isHiddenCategory about which categories are flagged', () => {
    expect(isHiddenCategory('spam')).toBe(true)
    expect(isHiddenCategory('negative')).toBe(true)
    expect(isHiddenCategory('sales_intent')).toBe(false)
    expect(isHiddenCategory('customer_service')).toBe(false)
    expect(isHiddenCategory('other')).toBe(false)
  })
})
