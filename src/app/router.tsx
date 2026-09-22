import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RedirectIfAuthenticated, RequireAuth, RequireOnboarding } from './guards'
import { RouteError } from './route-error'

/**
 * Route-level code splitting.
 *
 * The split is per screen rather than per component: a visitor landing on the
 * marketing page should not download the inbox, and vice versa. Finer-grained
 * splitting than this costs more in requests than it saves in bytes.
 */
export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      {
        path: '/',
        lazy: async () => ({
          Component: (await import('@/features/marketing/landing-page')).LandingPage,
        }),
      },
      {
        path: '/privacy',
        lazy: async () => ({
          Component: (await import('@/features/legal/legal-page')).PrivacyPage,
        }),
      },
      {
        path: '/terms',
        lazy: async () => ({
          Component: (await import('@/features/legal/legal-page')).TermsPage,
        }),
      },
      {
        path: '/data-deletion',
        lazy: async () => ({
          Component: (await import('@/features/legal/legal-page')).DataDeletionPage,
        }),
      },
      {
        // Outside RedirectIfAuthenticated on purpose: the page decides where an
        // already-signed-in visitor goes rather than bouncing them to login.
        path: '/demo',
        lazy: async () => ({
          Component: (await import('@/features/auth/demo-entry-page')).DemoEntryPage,
        }),
      },
      {
        element: <RedirectIfAuthenticated />,
        children: [
          {
            path: '/login',
            lazy: async () => ({ Component: (await import('@/features/auth/login-page')).LoginPage }),
          },
          {
            path: '/register',
            lazy: async () => ({
              Component: (await import('@/features/auth/register-page')).RegisterPage,
            }),
          },
          {
            path: '/forgot-password',
            lazy: async () => ({
              Component: (await import('@/features/auth/forgot-password-page')).ForgotPasswordPage,
            }),
          },
          {
            path: '/reset-password',
            lazy: async () => ({
              Component: (await import('@/features/auth/reset-password-page')).ResetPasswordPage,
            }),
          },
        ],
      },
      {
        element: <RequireOnboarding />,
        children: [
          {
            path: '/onboarding',
            lazy: async () => ({
              Component: (await import('@/features/onboarding/onboarding-page')).OnboardingPage,
            }),
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: '/app',
            lazy: async () => ({ Component: (await import('@/app/app-shell')).AppShell }),
            children: [
              { index: true, element: <Navigate to="/app/inbox" replace /> },
              {
                path: 'inbox',
                lazy: async () => ({
                  Component: (await import('@/features/inbox/inbox-page')).InboxPage,
                }),
                children: [
                  {
                    path: ':interactionId',
                    lazy: async () => ({
                      Component: (await import('@/features/inbox/inbox-page')).InboxDetailRoute,
                    }),
                  },
                ],
              },
              {
                path: 'dashboard',
                lazy: async () => ({
                  Component: (await import('@/features/dashboard/dashboard-page')).DashboardPage,
                }),
              },
              {
                path: 'integrations',
                lazy: async () => ({
                  Component: (await import('@/features/integrations/integrations-page'))
                    .IntegrationsPage,
                }),
              },
              {
                path: 'settings',
                lazy: async () => ({
                  Component: (await import('@/features/settings/settings-page')).SettingsPage,
                }),
              },
            ],
          },
        ],
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/app/not-found')).NotFoundPage }),
      },
    ],
  },
])
