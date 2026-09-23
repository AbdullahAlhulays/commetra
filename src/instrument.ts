import * as Sentry from '@sentry/react'

// Keep this module as the first import in main.tsx so errors during app setup
// are captured too. The browser DSN identifies the Sentry project; it is not
// an authentication secret.
Sentry.init({
  dsn: 'https://af7286928a9b049638861b92ef0acb26@o4512137498918912.ingest.de.sentry.io/4512137554952272',
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [window.location.origin],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
