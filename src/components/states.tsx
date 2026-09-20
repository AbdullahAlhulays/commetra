import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { isRetryable, toUserMessage } from '@/services'

/**
 * Empty state.
 *
 * The icon is small and monochrome on purpose — an oversized illustration
 * makes an empty screen feel like a dead end rather than a next step.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto max-w-sm px-6 py-12 text-center', className)}>
      {Icon ? (
        <span className="mx-auto mb-3 grid size-9 place-items-center rounded-lg border border-border bg-surface-subtle text-ink-faint">
          <Icon className="size-4" />
        </span>
      ) : null}
      <p className="text-md font-medium text-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}

/**
 * Error state.
 *
 * Says what failed and offers the retry only when the failure is actually
 * retryable — a retry button on a permanent error just wastes a click.
 */
export function ErrorState({
  error,
  title = 'تعذر تحميل البيانات',
  onRetry,
  className,
}: {
  error: unknown
  title?: string
  onRetry?: () => void
  className?: string
}) {
  const canRetry = Boolean(onRetry) && isRetryable(error)

  return (
    <div className={cn('mx-auto max-w-sm px-6 py-12 text-center', className)} role="alert">
      <span className="mx-auto mb-3 grid size-9 place-items-center rounded-lg border border-danger-border bg-danger-surface text-danger">
        <AlertTriangle className="size-4" aria-hidden />
      </span>
      <p className="text-md font-medium text-ink">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{toUserMessage(error)}</p>
      {canRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw aria-hidden />
          إعادة المحاولة
        </Button>
      ) : null}
    </div>
  )
}

/** Inline error for a panel that should not take over the whole screen. */
export function InlineError({
  error,
  onRetry,
  className,
}: {
  error: unknown
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-surface p-3',
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
      <div className="flex-1 space-y-1.5">
        <p className="text-sm text-danger-strong">{toUserMessage(error)}</p>
        {onRetry && isRetryable(error) ? (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-medium text-danger-strong underline underline-offset-4 hover:no-underline"
          >
            إعادة المحاولة
          </button>
        ) : null}
      </div>
    </div>
  )
}
