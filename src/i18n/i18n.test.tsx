import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LandingPage } from '@/features/marketing/landing-page'
import { renderWithProviders } from '@/test/utils'
import { ar } from './ar'
import { en } from './en'

/**
 * TypeScript already guarantees English has every key Arabic has. What it
 * cannot check is list length: a dictionary array typed as `T[]` will compile
 * with three entries against Arabic's five, and the page would silently drop
 * two rows in one language only.
 */
describe('dictionary parity', () => {
  it('matches list lengths between the two languages', () => {
    expect(en.steps.items).toHaveLength(ar.steps.items.length)
    expect(en.comparison.items).toHaveLength(ar.comparison.items.length)
    expect(en.faq.items).toHaveLength(ar.faq.items.length)
    expect(en.pricing.plans).toHaveLength(ar.pricing.plans.length)
    expect(en.mockup.rows).toHaveLength(ar.mockup.rows.length)
  })

  it('matches the feature list length inside every plan', () => {
    ar.pricing.plans.forEach((plan, index) => {
      expect(en.pricing.plans[index]?.features).toHaveLength(plan.features.length)
    })
  })

  it('covers every interaction category in both languages', () => {
    for (const dictionary of [ar, en]) {
      const keys = Object.keys(dictionary.categories.labels).sort()
      expect(Object.keys(dictionary.categories.descriptions).sort()).toEqual(keys)
      expect(Object.keys(dictionary.categories.samples).sort()).toEqual(keys)
    }
  })
})

describe('switching language', () => {
  it('starts in Arabic', () => {
    renderWithProviders(<LandingPage />)

    expect(screen.getByRole('heading', { level: 1, name: ar.hero.title })).toBeInTheDocument()
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
  })

  it('swaps the copy and flips the document direction', async () => {
    const { user } = renderWithProviders(<LandingPage />)

    await user.click(screen.getAllByRole('button', { name: 'English' })[0]!)

    expect(await screen.findByRole('heading', { level: 1, name: en.hero.title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: ar.hero.title })).not.toBeInTheDocument()

    // Direction lives on the document, not in React: CSS logical properties and
    // the browser's own bidi handling both read it from there.
    await waitFor(() => expect(document.documentElement.dir).toBe('ltr'))
    expect(document.documentElement.lang).toBe('en')
  })

  it('translates the inbox mockup along with the page around it', async () => {
    const { user } = renderWithProviders(<LandingPage />)

    await user.click(screen.getAllByRole('button', { name: 'English' })[0]!)

    expect(await screen.findByText(en.mockup.org)).toBeInTheDocument()
    // The first row's name shows twice: in the list and in the open detail pane.
    expect(screen.getAllByText(en.mockup.rows[0]!.name).length).toBeGreaterThan(0)
  })
})
