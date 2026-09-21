import { beforeEach, describe, expect, it } from 'vitest'
import { INTERACTION_CATEGORIES, isUnreplied, resolvePublicVisibility } from '@/domain'
import { ServiceError } from '../errors'
import { mockInboxService } from './inbox'
import { getDb, resetDb } from './db'
import { setMockLatency } from './latency'
import { ACCOUNT_IDS, ORG_ID } from './seed-accounts'
import { FLAKY_INTERACTION_ID } from './seed-interactions'

const base = { organizationId: ORG_ID }

beforeEach(() => {
  setMockLatency(0)
  resetDb()
})

describe('inbox filtering', () => {
  it('returns every seeded interaction for the tenant by default', async () => {
    const page = await mockInboxService.list({ ...base, limit: 100 })

    expect(page.items.length).toBeGreaterThan(20)
    expect(page.items.every((item) => item.organizationId === ORG_ID)).toBe(true)
  })

  it('sorts newest first', async () => {
    const page = await mockInboxService.list({ ...base, limit: 100 })
    const timestamps = page.items.map((item) => item.createdAt)
    const sorted = [...timestamps].sort((a, b) => b.localeCompare(a))

    expect(timestamps).toEqual(sorted)
  })

  it('filters by platform', async () => {
    const page = await mockInboxService.list({ ...base, providers: ['tiktok'], limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => item.provider === 'tiktok')).toBe(true)
  })

  it('combines several platforms', async () => {
    const page = await mockInboxService.list({
      ...base,
      providers: ['tiktok', 'x'],
      limit: 100,
    })

    expect(new Set(page.items.map((item) => item.provider))).toEqual(new Set(['tiktok', 'x']))
  })

  it('filters by connected account', async () => {
    const page = await mockInboxService.list({
      ...base,
      connectedAccountIds: [ACCOUNT_IDS.igStore],
      limit: 100,
    })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => item.connectedAccountId === ACCOUNT_IDS.igStore)).toBe(true)
  })

  it('filters by workflow status', async () => {
    const page = await mockInboxService.list({ ...base, statuses: ['resolved'], limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => item.status === 'resolved')).toBe(true)
  })

  it('filters unread', async () => {
    const page = await mockInboxService.list({ ...base, read: 'unread', limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => !item.isRead)).toBe(true)
  })

  it('filters unreplied', async () => {
    const page = await mockInboxService.list({ ...base, replied: 'unreplied', limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every(isUnreplied)).toBe(true)
  })

  it('filters replied', async () => {
    const page = await mockInboxService.list({ ...base, replied: 'replied', limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => !isUnreplied(item))).toBe(true)
  })

  it('filters by interaction type', async () => {
    const page = await mockInboxService.list({ ...base, types: ['direct_message'], limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => item.type === 'direct_message')).toBe(true)
  })

  it('applies filters together rather than as alternatives', async () => {
    const page = await mockInboxService.list({
      ...base,
      providers: ['instagram'],
      read: 'unread',
      limit: 100,
    })

    expect(page.items.every((item) => item.provider === 'instagram' && !item.isRead)).toBe(true)
  })
})

describe('inbox search', () => {
  it('matches interaction text', async () => {
    const page = await mockInboxService.list({
      ...base,
      search: 'الطاحونة المستخدمة',
      limit: 100,
    })

    expect(page.items).toHaveLength(1)
    expect(page.items[0]?.text).toContain('الطاحونة')
  })

  it('matches the author name', async () => {
    const page = await mockInboxService.list({ ...base, search: 'منيرة', limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items[0]?.author.displayName).toContain('منيرة')
  })

  it('matches the connected account handle', async () => {
    const page = await mockInboxService.list({ ...base, search: 'nawah.coffee', limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => item.connectedAccountId === ACCOUNT_IDS.tiktok)).toBe(true)
  })

  it('matches the original post context', async () => {
    const page = await mockInboxService.list({ ...base, search: 'يرغاتشيف', limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
  })

  it('ignores Arabic orthographic variation', async () => {
    // "القهوه" (ha) should still find text written with "القهوة" (ta marbuta).
    const withTaMarbuta = await mockInboxService.list({ ...base, search: 'قهوة', limit: 100 })
    const withHa = await mockInboxService.list({ ...base, search: 'قهوه', limit: 100 })

    expect(withHa.items.map((item) => item.id)).toEqual(withTaMarbuta.items.map((item) => item.id))
  })

  it('returns an empty page for a term nothing matches', async () => {
    const page = await mockInboxService.list({ ...base, search: 'زجزجزج', limit: 100 })

    expect(page.items).toHaveLength(0)
    expect(page.total).toBe(0)
  })
})

describe('inbox pagination', () => {
  it('walks pages with a cursor without repeating items', async () => {
    const first = await mockInboxService.list({ ...base, limit: 10 })
    expect(first.items).toHaveLength(10)
    expect(first.nextCursor).not.toBeNull()

    const second = await mockInboxService.list({ ...base, limit: 10, cursor: first.nextCursor })
    const ids = new Set([...first.items, ...second.items].map((item) => item.id))

    expect(ids.size).toBe(first.items.length + second.items.length)
  })

  it('stops paginating at the end of the result set', async () => {
    const page = await mockInboxService.list({ ...base, limit: 500 })
    expect(page.nextCursor).toBeNull()
  })
})

describe('inbox counts', () => {
  it('counts independently of the read and replied views', async () => {
    const counts = await mockInboxService.counts({ ...base, read: 'unread' })
    const all = await mockInboxService.list({ ...base, limit: 500 })

    // Counts describe the whole scope so the rail can show what each view holds.
    expect(counts.all).toBe(all.total)
    expect(counts.unread).toBeLessThan(counts.all)
    expect(counts.byProvider.instagram).toBeGreaterThan(0)
    expect(counts.byProvider.tiktok).toBeGreaterThan(0)
  })

  it('narrows counts by search', async () => {
    const counts = await mockInboxService.counts({ ...base, search: 'الطاحونة المستخدمة' })
    expect(counts.all).toBe(1)
  })
})

describe('inbox mutations', () => {
  it('marks an interaction read and back to unread', async () => {
    const page = await mockInboxService.list({ ...base, read: 'unread', limit: 1 })
    const target = page.items[0]
    if (!target) throw new Error('expected an unread interaction in the seed data')

    const read = await mockInboxService.setRead(target.id, true)
    expect(read.isRead).toBe(true)

    const unread = await mockInboxService.setRead(target.id, false)
    expect(unread.isRead).toBe(false)
  })

  it('changes workflow status', async () => {
    const updated = await mockInboxService.setStatus('int_ig_01', 'resolved')
    expect(updated.status).toBe('resolved')
  })

  it('rejects an unknown interaction', async () => {
    await expect(mockInboxService.get('does_not_exist')).rejects.toBeInstanceOf(ServiceError)
  })
})

describe('reply capability enforcement', () => {
  it('refuses a comment reply on a provider that does not support it', async () => {
    // TikTok comment replies are outside the access tier we model.
    await expect(
      mockInboxService.reply({ interactionId: 'int_tt_01', text: 'شكراً لك' }),
    ).rejects.toMatchObject({ code: 'capability_unsupported', retryable: false })
  })

  it('refuses a reply on an account that needs re-authorisation', async () => {
    await expect(
      mockInboxService.reply({ interactionId: 'int_igs_01', text: 'أهلاً' }),
    ).rejects.toMatchObject({ code: 'account_needs_reconnect' })
  })

  it('refuses an empty reply', async () => {
    await expect(
      mockInboxService.reply({ interactionId: 'int_ig_01', text: '   ' }),
    ).rejects.toMatchObject({ code: 'validation' })
  })

  it('appends the reply and advances the interaction when allowed', async () => {
    const reply = await mockInboxService.reply({
      interactionId: 'int_ig_01',
      text: 'نعم متوفرة، تفضل بالطلب من المتجر.',
    })

    expect(reply.authorKind).toBe('business')
    expect(reply.state).toBe('sent')

    const updated = await mockInboxService.get('int_ig_01')
    expect(isUnreplied(updated)).toBe(false)
    expect(updated.isRead).toBe(true)
    // A new interaction becomes open once answered, rather than staying "new".
    expect(updated.status).toBe('open')
  })

  it('keeps a non-new status unchanged after replying', async () => {
    await mockInboxService.reply({ interactionId: 'int_igs_02', text: 'نعتذر عن ذلك' }).catch(() => {
      // That account needs reconnect; use a healthy pending one instead.
    })

    await mockInboxService.reply({ interactionId: 'int_fb_05', text: 'نعتذر عن التأخير' })
    const updated = await mockInboxService.get('int_fb_05')

    expect(updated.status).toBe('pending')
  })
})

describe('transient reply failure', () => {
  it('fails once with a retryable error, then succeeds', async () => {
    await expect(
      mockInboxService.reply({ interactionId: FLAKY_INTERACTION_ID, text: 'قريبًا' }),
    ).rejects.toMatchObject({ code: 'provider_unavailable', retryable: true })

    const reply = await mockInboxService.reply({
      interactionId: FLAKY_INTERACTION_ID,
      text: 'قريبًا',
    })

    expect(reply.state).toBe('sent')
    expect(getDb().failedReplyAttempts.has(FLAKY_INTERACTION_ID)).toBe(true)
  })
})

describe('category filtering', () => {
  it('narrows the list to the requested categories', async () => {
    const page = await mockInboxService.list({ ...base, categories: ['spam'], limit: 100 })

    expect(page.items.length).toBeGreaterThan(0)
    expect(page.items.every((item) => item.category === 'spam')).toBe(true)
  })

  it('seeds every category, so the rail is never a column of zeros', async () => {
    const counts = await mockInboxService.counts(base)

    for (const category of INTERACTION_CATEGORIES) {
      expect(counts.byCategory[category]).toBeGreaterThan(0)
    }
  })

  it('counts across categories add up to the unfiltered total', async () => {
    const counts = await mockInboxService.counts(base)
    const summed = INTERACTION_CATEGORIES.reduce(
      (total, category) => total + counts.byCategory[category],
      0,
    )

    expect(summed).toBe(counts.all)
  })

  it('ignores the category filter when counting, so the rail shows what a filter would reveal', async () => {
    const counts = await mockInboxService.counts({ ...base, categories: ['spam'] })

    expect(counts.byCategory.sales_intent).toBeGreaterThan(0)
  })

  it('stores a visibility that matches what the provider can actually do', async () => {
    const page = await mockInboxService.list({ ...base, limit: 100 })

    for (const item of page.items) {
      expect(item.publicVisibility).toBe(
        resolvePublicVisibility(item.category, item.type, item.capabilities),
      )
    }
  })

  it('hides flagged comments on Meta and flags them as unhideable elsewhere', async () => {
    const page = await mockInboxService.list({ ...base, categories: ['spam'], limit: 100 })

    const meta = page.items.filter((item) => item.provider === 'instagram' || item.provider === 'facebook')
    const others = page.items.filter((item) => item.provider === 'tiktok' || item.provider === 'x')

    expect(meta.length).toBeGreaterThan(0)
    expect(others.length).toBeGreaterThan(0)
    expect(meta.every((item) => item.publicVisibility === 'hidden')).toBe(true)
    expect(others.every((item) => item.publicVisibility === 'cannot_hide')).toBe(true)
  })
})
