import { DirectionProvider } from '@radix-ui/react-direction'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { AuthSession } from '@/domain'
import { resetDb, setMockLatency } from '@/services/mock'
import { ORG_ID, seedUser } from '@/services/mock/seed-accounts'

/**
 * Test harness.
 *
 * Latency is zeroed and the mock store reset per test, so cases never depend
 * on timers or leak state into each other.
 */
export function prepareMocks(): void {
  setMockLatency(0)
  resetDb()
}

export const testSession: AuthSession = {
  user: seedUser,
  organizationId: ORG_ID,
  onboardingCompleted: true,
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(
  ui: ReactNode,
  options: { route?: string; session?: AuthSession | null } = {},
): RenderResult & { queryClient: QueryClient; user: ReturnType<typeof userEvent.setup> } {
  const queryClient = createTestQueryClient()
  const session = options.session === undefined ? testSession : options.session

  // Seeding the session cache directly keeps every test from having to sign in
  // before it can assert on the screen under test.
  queryClient.setQueryData(['session'], session)

  const result = render(
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir="rtl">
        <TooltipProvider>
          <MemoryRouter initialEntries={[options.route ?? '/']}>{ui}</MemoryRouter>
        </TooltipProvider>
      </DirectionProvider>
    </QueryClientProvider>,
  )

  return { ...result, queryClient, user: userEvent.setup() }
}
