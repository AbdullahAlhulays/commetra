import { AlertTriangle } from 'lucide-react'
import { Link, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toUserMessage } from '@/services'

/**
 * Last-resort boundary for a route that threw or failed to load.
 *
 * The raw error goes to the console for developers; the user gets a plain
 * sentence and a way out.
 */
export function RouteError() {
  const error = useRouteError()

  if (import.meta.env.DEV) {
    console.error('Route error:', error)
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-6">
      <div className="max-w-sm text-center">
        <span className="mx-auto mb-4 grid size-10 place-items-center rounded-lg border border-danger-border bg-danger-surface text-danger">
          <AlertTriangle className="size-5" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-ink">حدث خطأ غير متوقع</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {toUserMessage(error, 'تعذر عرض هذه الصفحة. حاول تحديث الصفحة أو العودة للصندوق الوارد.')}
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="primary" onClick={() => window.location.reload()}>
            تحديث الصفحة
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/app/inbox">الصندوق الوارد</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
