import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { prepareMocks, renderWithProviders } from '@/test/utils'
import { IntegrationsPage } from './integrations-page'

/** Scopes queries to one provider's section via its heading. */
function section(name: string): HTMLElement {
  const heading = screen.getByRole('heading', { name, level: 2 })
  const element = heading.closest('section')
  if (!element) throw new Error(`section for ${name} not found`)
  return element
}

beforeEach(prepareMocks)

describe('integrations page', () => {
  it('groups connected accounts under their provider', async () => {
    renderWithProviders(<IntegrationsPage />)
    await screen.findByRole('heading', { name: 'Instagram', level: 2 })

    const instagram = section('Instagram')
    // Two Instagram accounts prove the model is not one-account-per-provider.
    expect(within(instagram).getByText('نواة | المحمصة')).toBeInTheDocument()
    expect(within(instagram).getByText('نواة | المتجر الإلكتروني')).toBeInTheDocument()
    expect(within(instagram).getByText('حسابات مرتبطة', { exact: false })).toBeInTheDocument()
  })

  it('states which capabilities a provider does not offer', async () => {
    renderWithProviders(<IntegrationsPage />)
    await screen.findByRole('heading', { name: 'TikTok', level: 2 })

    expect(within(section('TikTok')).getByText(/لا يدعم/)).toHaveTextContent(
      /الرد على التعليقات/,
    )
  })

  it('flags an account whose authorisation expired and offers a reconnect', async () => {
    renderWithProviders(<IntegrationsPage />)
    await screen.findByText('نواة | المتجر الإلكتروني')

    const instagram = section('Instagram')
    expect(within(instagram).getByText('يحتاج إعادة ربط')).toBeInTheDocument()
    expect(within(instagram).getByText(/انتهت صلاحية تفويض الحساب/)).toBeInTheDocument()

    const reconnect = within(instagram).getByRole('button', { name: /إعادة الربط/ })
    expect(reconnect).toBeInTheDocument()
  })

  it('restores an account through the reconnect action', async () => {
    const { user } = renderWithProviders(<IntegrationsPage />)
    await screen.findByText('نواة | المتجر الإلكتروني')

    await user.click(within(section('Instagram')).getByRole('button', { name: /إعادة الربط/ }))

    await waitFor(() => {
      expect(within(section('Instagram')).queryByText('يحتاج إعادة ربط')).not.toBeInTheDocument()
    })
  })
})

describe('connect flow', () => {
  it('explains capabilities and that no live connection is made', async () => {
    const { user } = renderWithProviders(<IntegrationsPage />)
    await screen.findByRole('heading', { name: 'TikTok', level: 2 })

    await user.click(within(section('TikTok')).getByRole('button', { name: /ربط حساب/ }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/لن يتم فتح صفحة تفويض حقيقية/)).toBeInTheDocument()
    expect(within(dialog).getByText('الرد على التعليقات')).toBeInTheDocument()
    expect(within(dialog).getAllByText('(غير مدعوم حاليًا)').length).toBeGreaterThan(0)
  })

  it('adds the account once the connection is confirmed', async () => {
    const { user } = renderWithProviders(<IntegrationsPage />)
    await screen.findByRole('heading', { name: 'X', level: 2 })

    const before = within(section('X')).getAllByText(/^@/).length

    await user.click(within(section('X')).getByRole('button', { name: /ربط حساب/ }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'متابعة الربط' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => {
      expect(within(section('X')).getAllByText(/^@/).length).toBe(before + 1)
    })
  })

  it('can be dismissed without connecting', async () => {
    const { user } = renderWithProviders(<IntegrationsPage />)
    await screen.findByRole('heading', { name: 'Facebook', level: 2 })

    await user.click(within(section('Facebook')).getByRole('button', { name: /ربط حساب/ }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'إلغاء' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(within(section('Facebook')).getAllByText(/^@/)).toHaveLength(1)
  })
})

describe('disconnect flow', () => {
  it('requires confirmation and explains the consequence', async () => {
    const { user } = renderWithProviders(<IntegrationsPage />)
    await screen.findByRole('heading', { name: 'TikTok', level: 2 })

    await user.click(within(section('TikTok')).getByRole('button', { name: /^إجراءات/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'إلغاء الربط' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByText(/ستُزال تفاعلاته من الصندوق الوارد/)).toBeInTheDocument()

    // Backing out must leave the account in place.
    await user.click(within(dialog).getByRole('button', { name: 'تراجع' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(within(section('TikTok')).getByText('نواة')).toBeInTheDocument()
  })

  it('removes the account when confirmed', async () => {
    const { user } = renderWithProviders(<IntegrationsPage />)
    await screen.findByRole('heading', { name: 'TikTok', level: 2 })

    await user.click(within(section('TikTok')).getByRole('button', { name: /^إجراءات/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'إلغاء الربط' }))

    const dialog = await screen.findByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'إلغاء الربط' }))

    await waitFor(() => {
      expect(within(section('TikTok')).getByText(/لا توجد حسابات مرتبطة/)).toBeInTheDocument()
    })
  })
})
