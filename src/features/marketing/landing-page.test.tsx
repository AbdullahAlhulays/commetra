import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import { LandingPage } from './landing-page'

describe('LandingPage', () => {
  it('renders the hero with its supporting line', () => {
    renderWithProviders(<LandingPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /كل تعليقات ورسائل عملائك في مكان واحد/ }),
    ).toBeInTheDocument()
    expect(screen.getByText(/فتقرأ وترد من منصة واحدة ومكان واحد/)).toBeInTheDocument()
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

  it('names the supported platforms for assistive tech, outside the ticker', () => {
    renderWithProviders(<LandingPage />)

    const names = screen.getByText(/المنصات المدعومة:/)
    expect(names).toHaveTextContent('Instagram')
    expect(names).toHaveTextContent('Facebook')
    expect(names).toHaveTextContent('TikTok')
    expect(names).toHaveTextContent('X')
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
})
