import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { prepareMocks, renderWithProviders } from '@/test/utils'
import { InboxDetailRoute, InboxPage } from './inbox-page'

function renderInbox(route = '/app/inbox') {
  return renderWithProviders(
    <Routes>
      <Route path="/app/inbox" element={<InboxPage />}>
        <Route path=":interactionId" element={<InboxDetailRoute />} />
      </Route>
    </Routes>,
    { route },
  )
}

/** The filter rail, scoped so its rows never collide with list-row buttons. */
function rail() {
  return within(screen.getByRole('complementary', { name: 'تصفية الصندوق الوارد' }))
}

/** The list renders each row as a button; this reads their accessible text. */
function listRowTexts(): string[] {
  const list = screen.getByRole('list')
  return within(list)
    .getAllByRole('button')
    .map((button) => button.textContent ?? '')
}

beforeEach(prepareMocks)

describe('inbox list', () => {
  it('shows interactions from all four platforms', async () => {
    renderInbox()
    await screen.findByText('منيرة القحطاني')

    const rows = listRowTexts().join(' ')

    // Platform origin must be readable without opening anything.
    expect(rows).toContain('Instagram')
    expect(rows).toContain('Facebook')
    expect(rows).toContain('TikTok')
    expect(rows).toContain('X')
  })

  it('labels each row with its receiving account and unread state', async () => {
    renderInbox()
    const firstRow = (await screen.findByText('منيرة القحطاني')).closest('button')

    expect(firstRow).not.toBeNull()
    expect(firstRow?.textContent).toContain('nawah.roastery')
    expect(within(firstRow as HTMLElement).getByLabelText('غير مقروء')).toBeInTheDocument()
  })

  it('shows a replied marker only on answered interactions', async () => {
    renderInbox()
    await screen.findByText('فهد العنزي')

    const replied = screen.getByText('فهد العنزي').closest('button')
    const unreplied = screen.getByText('منيرة القحطاني').closest('button')

    expect(replied?.textContent).toContain('تم الرد')
    expect(unreplied?.textContent).not.toContain('تم الرد')
  })
})

describe('inbox filtering', () => {
  it('narrows the list to one platform', async () => {
    const { user } = renderInbox()
    await screen.findByText('منيرة القحطاني')

    await user.click(rail().getByRole('button', { name: /^TikTok/ }))

    await waitFor(() => {
      const rows = listRowTexts()
      expect(rows.length).toBeGreaterThan(0)
      expect(rows.every((text) => text.includes('TikTok'))).toBe(true)
    })
  })

  it('shows an active filter chip that can be removed', async () => {
    const { user } = renderInbox()
    await screen.findByText('منيرة القحطاني')

    await user.click(rail().getByRole('button', { name: /^TikTok/ }))
    await waitFor(() => expect(screen.getByText('مسح الكل')).toBeInTheDocument())

    await user.click(screen.getByText('مسح الكل'))

    await waitFor(() => {
      expect(listRowTexts().some((text) => text.includes('Instagram'))).toBe(true)
    })
  })

  it('filters to unread only', async () => {
    const { user } = renderInbox()
    await screen.findByText('منيرة القحطاني')

    await user.click(rail().getByRole('button', { name: /^غير مقروء/ }))

    await waitFor(() => {
      const list = screen.getByRole('list')
      const rows = within(list).getAllByRole('button')
      expect(rows.length).toBeGreaterThan(0)
      for (const row of rows) {
        expect(within(row).getByLabelText('غير مقروء')).toBeInTheDocument()
      }
    })
  })

  it('offers a way out when a search matches nothing', async () => {
    const { user } = renderInbox()
    await screen.findByText('منيرة القحطاني')

    await user.type(screen.getByRole('searchbox', { name: 'البحث في التفاعلات' }), 'زجزجزج')

    expect(await screen.findByText('لا توجد نتائج مطابقة')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'مسح التصفية' }))

    await waitFor(() => expect(screen.getByText('منيرة القحطاني')).toBeInTheDocument())
  })

  it('finds an interaction by author name', async () => {
    const { user } = renderInbox()
    await screen.findByText('منيرة القحطاني')

    await user.type(screen.getByRole('searchbox', { name: 'البحث في التفاعلات' }), 'وليد')

    await waitFor(() => {
      const rows = listRowTexts()
      expect(rows).toHaveLength(1)
      expect(rows[0]).toContain('وليد العمري')
    })
  })
})

describe('interaction detail', () => {
  it('prompts for a selection before one is made', async () => {
    renderInbox()
    expect(await screen.findByText('اختر تفاعلاً لعرضه')).toBeInTheDocument()
  })

  it('opens an interaction with its original post context', async () => {
    const { user } = renderInbox()
    await user.click(await screen.findByText('منيرة القحطاني'))

    expect(await screen.findByRole('region', { name: 'المنشور المرتبط' })).toBeInTheDocument()
    expect(screen.getByText(/يرغاتشيف/)).toBeInTheDocument()
  })

  it('opens directly from a deep link', async () => {
    renderInbox('/app/inbox/int_fb_02')
    expect(await screen.findByText(/تجهيز قهوة لمناسبة/)).toBeInTheDocument()
  })
})

describe('reply capability', () => {
  it('offers a composer when the provider allows replying', async () => {
    const { user } = renderInbox()
    await user.click(await screen.findByText('منيرة القحطاني'))

    expect(await screen.findByLabelText(/اكتب ردك على منيرة القحطاني/)).toBeInTheDocument()
  })

  it('replaces the composer with an explanation on TikTok', async () => {
    const { user } = renderInbox()
    await user.click(await screen.findByText('وليد العمري'))

    expect(await screen.findByText(/لا تتيح واجهة هذه المنصة الرد على التعليقات/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'إرسال' })).not.toBeInTheDocument()
  })

  it('explains that an account needing re-authorisation cannot reply', async () => {
    renderInbox('/app/inbox/int_igs_01')

    expect(await screen.findByText(/يحتاج حساب .* إلى إعادة الربط/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'إدارة الحسابات المرتبطة' })).toBeInTheDocument()
  })
})

describe('sending a reply', () => {
  it('adds the reply to the thread and marks the interaction answered', async () => {
    const { user } = renderInbox()
    await user.click(await screen.findByText('منيرة القحطاني'))

    const composer = await screen.findByLabelText(/اكتب ردك على منيرة القحطاني/)
    await user.type(composer, 'نعم متوفرة، تفضل بالطلب من المتجر.')
    await user.click(screen.getByRole('button', { name: 'إرسال' }))

    expect(await screen.findByText('نعم متوفرة، تفضل بالطلب من المتجر.')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('ردّك')).toBeInTheDocument())
  })

  it('surfaces a provider failure and keeps a retry available', async () => {
    // int_x_04 is seeded to fail its first send, then succeed.
    const { user } = renderInbox('/app/inbox/int_x_04')

    const composer = await screen.findByLabelText(/اكتب ردك على إبراهيم الدوسري/)
    await user.type(composer, 'يرجع الأسبوع القادم.')
    await user.click(screen.getByRole('button', { name: 'إرسال' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/تعذر إرسال الرد/)

    await user.click(within(alert).getByRole('button', { name: 'إعادة المحاولة' }))
    expect(await screen.findByText('يرجع الأسبوع القادم.')).toBeInTheDocument()
  })

  it('will not send an empty reply', async () => {
    const { user } = renderInbox()
    await user.click(await screen.findByText('منيرة القحطاني'))
    await screen.findByLabelText(/اكتب ردك على منيرة القحطاني/)

    expect(screen.getByRole('button', { name: 'إرسال' })).toBeDisabled()
  })

  it('filters the list by category from the rail', async () => {
    const { user } = renderInbox()
    await waitFor(() => expect(listRowTexts().length).toBeGreaterThan(0))

    await user.click(rail().getByRole('button', { name: /^إزعاج وسبام/ }))

    await waitFor(() => {
      const rows = listRowTexts()
      expect(rows.length).toBeGreaterThan(0)
      expect(rows.every((text) => text.includes('إزعاج وسبام'))).toBe(true)
    })
  })

  it('marks a flagged comment as off the post, and as still live where it cannot be hidden', async () => {
    const { user } = renderInbox()
    await waitFor(() => expect(listRowTexts().length).toBeGreaterThan(0))

    await user.click(rail().getByRole('button', { name: /^إزعاج وسبام/ }))

    await waitFor(() => {
      const rows = listRowTexts()
      // Meta rows report the comment taken down; TikTok and X cannot, so they
      // must not carry the badge that says it was.
      expect(rows.some((text) => text.includes('مخفي عن المنشور'))).toBe(true)
      expect(rows.some((text) => text.includes('لا تتيح المنصة إخفاءه'))).toBe(true)
    })
  })
})
