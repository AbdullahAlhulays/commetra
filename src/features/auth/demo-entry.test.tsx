import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { prepareMocks, renderWithProviders } from '@/test/utils'
import { DemoEntryPage } from './demo-entry-page'

function renderDemo() {
  return renderWithProviders(
    <Routes>
      <Route path="/demo" element={<DemoEntryPage />} />
      <Route path="/app/inbox" element={<p>صندوق الوارد التجريبي</p>} />
      <Route path="/login" element={<p>شاشة الدخول</p>} />
    </Routes>,
    { route: '/demo', session: null },
  )
}

beforeEach(prepareMocks)

describe('DemoEntryPage', () => {
  it('signs the visitor into the seeded tenant and opens the inbox', async () => {
    renderDemo()

    // The point of the route: no form, no credentials typed, straight in.
    expect(await screen.findByText('صندوق الوارد التجريبي')).toBeInTheDocument()
    expect(screen.queryByText('شاشة الدخول')).not.toBeInTheDocument()
  })

  it('sends an already-signed-in visitor straight on, without signing in again', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/demo" element={<DemoEntryPage />} />
        <Route path="/app/inbox" element={<p>صندوق الوارد التجريبي</p>} />
      </Routes>,
      { route: '/demo' },
    )

    await waitFor(() =>
      expect(screen.getByText('صندوق الوارد التجريبي')).toBeInTheDocument(),
    )
  })
})
