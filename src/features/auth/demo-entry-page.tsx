import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useLocale } from '@/i18n/locale-provider'
import { DEMO_CREDENTIALS } from '@/services/mock'
import { useSession, useSignIn } from './use-session'

/**
 * Opens the populated demo tenant and drops the visitor straight into the
 * inbox.
 *
 * The landing page can describe a unified inbox at length, or it can show one
 * with sixty interactions already in it. This is the second thing: no form to
 * fill, no account to create, just the product with the seeded data.
 *
 * It signs in with the same credentials the login screen offers, so there is
 * one demo tenant rather than a second private path into the app. A visitor
 * who is already signed in is sent on rather than signed in again, and a
 * failed sign-in falls back to the login screen instead of spinning.
 */
export function DemoEntryPage() {
  const { t } = useLocale()
  const { data: session, isPending } = useSession()
  const { mutate: signIn, isError } = useSignIn()
  const attempted = useRef(false)

  useEffect(() => {
    if (isPending || session || attempted.current) return
    attempted.current = true
    signIn(DEMO_CREDENTIALS)
  }, [isPending, session, signIn])

  if (session) {
    return <Navigate to={session.onboardingCompleted ? '/app/inbox' : '/onboarding'} replace />
  }

  if (isError) return <Navigate to="/login" replace />

  return (
    <div
      className="grid min-h-dvh place-items-center gap-3 bg-canvas px-6"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-5 animate-spin text-ink-faint" aria-hidden />
      <p className="text-sm text-ink-muted">{t.demo.opening}</p>
    </div>
  )
}
