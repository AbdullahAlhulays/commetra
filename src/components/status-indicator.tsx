import { WORKFLOW_STATUS_LABELS, type WorkflowStatus } from '@/domain'
import { cn } from '@/lib/cn'

/**
 * Status colours, kept quiet.
 *
 * A list where every row wears a bright badge stops communicating, so the
 * default rendering is a 6px dot plus plain text. The tinted badge is reserved
 * for the detail header, where exactly one status is on screen.
 */
const DOT_COLORS: Record<WorkflowStatus, string> = {
  new: 'bg-brand',
  open: 'bg-slate-400',
  pending: 'bg-warning',
  resolved: 'bg-success',
}

const BADGE_COLORS: Record<WorkflowStatus, string> = {
  new: 'border-brand-200 bg-brand-50 text-brand-700',
  open: 'border-border bg-surface-sunken text-ink-secondary',
  pending: 'border-warning-border bg-warning-surface text-warning-strong',
  resolved: 'border-success-border bg-success-surface text-success-strong',
}

export function StatusDot({ status, className }: { status: WorkflowStatus; className?: string }) {
  return (
    <span
      className={cn('inline-block size-1.5 shrink-0 rounded-full', DOT_COLORS[status], className)}
      aria-hidden
    />
  )
}

export function StatusBadge({ status, className }: { status: WorkflowStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-2xs font-medium',
        BADGE_COLORS[status],
        className,
      )}
    >
      <StatusDot status={status} />
      {WORKFLOW_STATUS_LABELS[status]}
    </span>
  )
}
