import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { AuthSession } from '@/domain'
import { api } from '@/services'
import { prepareMocks, renderWithProviders } from '@/test/utils'
import { OnboardingPage } from './onboarding-page'

/**
 * Onboarding runs against a genuinely new tenant, so the flow is exercised
 * against the empty state a real sign-up produces rather than the demo data.
 */
async function newTenantSession(): Promise<AuthSession> {
  return api.auth.signUp({
    fullName: 'سارة المطيري',
    email: 'sara@example.com',
    password: 'testing1234',
  })
}

beforeEach(prepareMocks)

describe('onboarding progression', () => {
  it('walks welcome → business → connect → ready', async () => {
    const session = await newTenantSession()
    const { user } = renderWithProviders(<OnboardingPage />, { session })

    // Step 1 — welcome, greeting the new user by first name.
    expect(screen.getByText(/أهلاً سارة/)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
    await user.click(screen.getByRole('button', { name: 'لنبدأ' }))

    // Step 2 — business details.
    expect(await screen.findByRole('heading', { name: 'عرّفنا على نشاطك' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')

    await user.type(screen.getByLabelText('اسم النشاط'), 'مخبز الحي')
    await user.click(screen.getByRole('button', { name: 'متابعة' }))

    // Step 3 — connect the first account.
    expect(await screen.findByRole('heading', { name: 'اربط أول حساب' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
    expect(screen.getByText(/يمكنك التخطي والربط لاحقًا/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'متابعة' }))

    // Step 4 — ready.
    expect(await screen.findByRole('heading', { name: 'كل شيء جاهز' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4')
  })

  it('saves the business name to the organisation', async () => {
    const session = await newTenantSession()
    const { user } = renderWithProviders(<OnboardingPage />, { session })

    await user.click(screen.getByRole('button', { name: 'لنبدأ' }))
    await user.type(await screen.findByLabelText('اسم النشاط'), 'مخبز الحي')
    await user.click(screen.getByRole('button', { name: 'متابعة' }))

    await screen.findByRole('heading', { name: 'اربط أول حساب' })

    const organization = await api.organizations.get(session.organizationId)
    expect(organization.name).toBe('مخبز الحي')
  })

  it('can go back to edit the business step', async () => {
    const session = await newTenantSession()
    const { user } = renderWithProviders(<OnboardingPage />, { session })

    await user.click(screen.getByRole('button', { name: 'لنبدأ' }))
    await screen.findByRole('heading', { name: 'عرّفنا على نشاطك' })
    await user.click(screen.getByRole('button', { name: 'رجوع' }))

    expect(await screen.findByText(/أهلاً سارة/)).toBeInTheDocument()
  })

  it('connects a first account and reflects it in the step', async () => {
    const session = await newTenantSession()
    const { user } = renderWithProviders(<OnboardingPage />, { session })

    await user.click(screen.getByRole('button', { name: 'لنبدأ' }))
    await user.type(await screen.findByLabelText('اسم النشاط'), 'مخبز الحي')
    await user.click(screen.getByRole('button', { name: 'متابعة' }))
    await screen.findByRole('heading', { name: 'اربط أول حساب' })

    const instagramRow = screen.getByText('Instagram').closest('li')
    expect(instagramRow).not.toBeNull()

    await user.click(
      within(instagramRow as HTMLElement).getByRole('button', { name: 'ربط' }),
    )

    await waitFor(() => {
      expect(within(instagramRow as HTMLElement).getByText('تم الربط')).toBeInTheDocument()
    })

    const accounts = await api.integrations.listAccounts(session.organizationId)
    expect(accounts).toHaveLength(1)
    expect(accounts[0]?.provider).toBe('instagram')
  })

  it('starts the new tenant with an empty inbox until an account is connected', async () => {
    const session = await newTenantSession()
    const page = await api.inbox.list({ organizationId: session.organizationId })

    expect(page.items).toHaveLength(0)

    await api.integrations.connect({
      organizationId: session.organizationId,
      provider: 'facebook',
    })

    // Connecting performs the initial history sync, so the inbox fills.
    const after = await api.inbox.list({ organizationId: session.organizationId, limit: 100 })
    expect(after.items.length).toBeGreaterThan(0)
    expect(after.items.every((item) => item.provider === 'facebook')).toBe(true)
  })
})
