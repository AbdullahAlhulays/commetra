import { Loader2 } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/features/auth/use-session'

function SessionSplash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas" role="status" aria-live="polite">
      <Loader2 className="size-5 animate-spin text-ink-faint" aria-hidden />
      <span className="sr-only">جاري التحميل…</span>
    </div>
  )
}

/**
 * Gate for `/app/*`.
 *
 * Note this is a routing convenience, never a security boundary — the backend
 * must authorise every request on its own. Hiding a route in the client
 * protects nothing.
 */
export function RequireAuth() {
  const { data: session, isPending } = useSession()
  const location = useLocation()

  if (isPending) return <SessionSplash />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!session.onboardingCompleted) return <Navigate to="/onboarding" replace />

  return <Outlet />
}

/** Onboarding needs a session but must not demand a finished one. */
export function RequireOnboarding() {
  const { data: session, isPending } = useSession()

  if (isPending) return <SessionSplash />
  if (!session) return <Navigate to="/login" replace />
  if (session.onboardingCompleted) return <Navigate to="/app/inbox" replace />

  return <Outlet />
}

/** Keeps a signed-in user out of the login and register screens. */
export function RedirectIfAuthenticated() {
  const { data: session, isPending } = useSession()

  if (isPending) return <SessionSplash />
  if (session) {
    return <Navigate to={session.onboardingCompleted ? '/app/inbox' : '/onboarding'} replace />
  }

  return <Outlet />
}
