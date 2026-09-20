import { QueryClient } from '@tanstack/react-query'
import { isServiceError } from '@/services'

/**
 * A single client for the app.
 *
 * Defaults are tuned for an inbox: data goes stale quickly because new
 * interactions arrive constantly, but refetch-on-focus is off so switching
 * windows never reshuffles the list under a reply in progress.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
          // Retrying a permission or not-found failure only delays the error
          // the user needs to see.
          if (isServiceError(error) && !error.retryable) return false
          return failureCount < 2
        },
      },
      mutations: {
        retry: false,
      },
    },
  })
}
