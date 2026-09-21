import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { INTERACTION_CATEGORIES, INTERACTION_CATEGORY_LABELS, PROVIDER_CAPABILITIES } from '@/domain'
import { renderWithProviders } from '@/test/utils'
import { LandingPage } from './landing-page'

describe('LandingPage', () => {
  it('renders the hero with its supporting line', () => {
    renderWithProviders(<LandingPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /كل تعليقات ورسائل عملائك في مكان واحد/ }),
    ).toBeInTheDocument()
    expect(screen.getByText(/في صندوق واحد، مصنّفة لك تلقائيًا/)).toBeInTheDocument()
  })

  it('shows every revealed block when IntersectionObserver is unavailable', () => {
    // jsdom has no IntersectionObserver, which is the same situation as an old
    // browser: the page must arrive complete rather than stuck at opacity 0.
    expect(globalThis.IntersectionObserver).toBeUndefined()

    const { container } = renderWithProviders(<LandingPage />)
    const blocks = [...container.querySelectorAll('[data-reveal]')]

    expect(blocks.length).toBeGreaterThan(0)
    expect(blocks.every((block) => block.getAttribute('data-reveal') === 'true')).toBe(true)
  })

  it('gives every supported platform a channel card', () => {
    renderWithProviders(<LandingPage />)

    for (const platform of ['Instagram', 'Facebook', 'TikTok', 'X']) {
      expect(screen.getByRole('heading', { level: 3, name: platform })).toBeInTheDocument()
    }
  })

  it('contrasts today against the product, line for line', () => {
    renderWithProviders(<LandingPage />)

    expect(
      screen.getByRole('heading', { name: /من الفوضى إلى صندوق واحد منظّم/ }),
    ).toBeInTheDocument()
    expect(screen.getByText(/تنقّل بين أربعة تطبيقات طوال اليوم/)).toBeInTheDocument()
    expect(screen.getByText(/صندوق وارد واحد لكل المنصات/)).toBeInTheDocument()
  })

  it('answers the sizing question without limiting the product to small businesses', () => {
    renderWithProviders(<LandingPage />)

    expect(
      screen.getByRole('heading', { name: /مصمّم للمتاجر والأنشطة على اختلاف أحجامها/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /هل المنصة مناسبة لحجم نشاطي؟/ })).toBeInTheDocument()
    expect(screen.queryByText(/هل المنصة مناسبة للشركات الصغيرة؟/)).not.toBeInTheDocument()
  })

  it('leaves out the copy that was cut', () => {
    renderWithProviders(<LandingPage />)

    expect(screen.queryByText(/يمكنك ربط أكثر من حساب لكل منصة/)).not.toBeInTheDocument()
    expect(screen.queryByText(/سبب واضح إن لم تتح المنصة قراءته/)).not.toBeInTheDocument()
    expect(screen.queryByText(/هل أستطيع ربط أكثر من حساب؟/)).not.toBeInTheDocument()
  })

  it('lists the same category taxonomy the product uses, not a paraphrase', () => {
    renderWithProviders(<LandingPage />)

    for (const category of INTERACTION_CATEGORIES) {
      expect(
        screen.getAllByText(INTERACTION_CATEGORY_LABELS[category]).length,
      ).toBeGreaterThan(0)
    }
  })

  it('keeps the platform limitation on the page, in the FAQ', async () => {
    // The cards no longer spell capabilities out — the page is deliberately
    // simpler now — so the FAQ is the one place that still has to be honest
    // about the two networks that cannot hide a comment at all.
    expect(PROVIDER_CAPABILITIES.tiktok.canHideComments).toBe(false)
    expect(PROVIDER_CAPABILITIES.x.canHideComments).toBe(false)

    const { user } = renderWithProviders(<LandingPage />)
    await user.click(screen.getByRole('button', { name: /ماذا يحدث للتعليقات السلبية والسبام؟/ }))

    expect(
      await screen.findByText(/لا تتيحان إخفاء التعليقات من خارج تطبيقهما/),
    ).toBeInTheDocument()
  })

  it('draws attention to the hiding claim without the caveat crowding it', () => {
    renderWithProviders(<LandingPage />)

    expect(
      screen.getByRole('heading', { name: /السلبي والسبام يختفي عن منشورك، لا عن صندوقك/ }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/الإخفاء متاح على Instagram و Facebook/)).not.toBeInTheDocument()
  })

  it('shows the three plans with a trial-first CTA', () => {
    renderWithProviders(<LandingPage />)

    for (const plan of ['تجربة مجانية', 'أساسي', 'احترافي']) {
      expect(screen.getByRole('heading', { level: 3, name: plan })).toBeInTheDocument()
    }
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.getByText(/كل الخطط تبدأ بتجربة مجانية/)).toBeInTheDocument()
  })
})
