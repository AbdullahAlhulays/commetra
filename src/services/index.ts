import { mockApiClient } from './mock'
import type { ApiClient } from './types'

/**
 * ===================== THE BACKEND SWAP POINT ============================
 *
 * Every screen and hook in the app reaches data through this one object.
 * Introducing a real backend means writing an `ApiClient` backed by fetch and
 * returning it here — no component, hook, query key or test changes.
 *
 *   const httpClient = createHttpApiClient({ baseUrl: import.meta.env.VITE_API_URL })
 *   export const api: ApiClient = import.meta.env.DEV ? mockApiClient : httpClient
 *
 * Today there is only the mock, and it is labelled as such in the UI so the
 * product is never presented as having live provider integrations.
 * =========================================================================
 */
export const api: ApiClient = mockApiClient

/** True while the app is running against mock data. Drives the demo banner. */
export const IS_MOCK_BACKEND = true

export * from './errors'
export type * from './types'
