import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'

/** A direct-link verification page for the production Sentry project. */
export function SentryTestPage() {
  return (
    <main dir="ltr" className="grid min-h-dvh place-items-center bg-canvas px-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
        <Logo className="mb-6" />
        <h1 className="text-xl font-semibold text-ink">Verify Sentry</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Click the button to throw a test error. It should appear in the Sentry project you connected
          to this site.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="danger"
            onClick={() => {
              throw new Error('This is your first error!')
            }}
          >
            Break the world
          </Button>
          <Button asChild>
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
