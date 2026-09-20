import type { ApiClient } from '../types'
import { mockAnalyticsService } from './analytics'
import { mockAuthService } from './auth'
import { mockInboxService } from './inbox'
import { mockIntegrationsService } from './integrations'
import { mockNotificationsService } from './notifications'
import { mockOrganizationService } from './organization'

/**
 * The mock backend, assembled into the same shape a real client must provide.
 *
 * Everything under `services/mock/` is development-only. See
 * `services/index.ts` for the single place where the implementation is chosen.
 */
export const mockApiClient: ApiClient = {
  auth: mockAuthService,
  organizations: mockOrganizationService,
  inbox: mockInboxService,
  integrations: mockIntegrationsService,
  notifications: mockNotificationsService,
  analytics: mockAnalyticsService,
}

export { DEMO_CREDENTIALS } from './auth'
export { resetDb } from './db'
export { setMockLatency } from './latency'
