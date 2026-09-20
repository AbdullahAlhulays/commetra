import { Loader2 } from 'lucide-react'
import {
  CONNECTION_STATUS_LABELS,
  type ConnectionStatus,
  type ProviderCapabilities,
} from '@/domain'
import { cn } from '@/lib/cn'

const TONES: Record<ConnectionStatus, string> = {
  connected: 'border-success-border bg-success-surface text-success-strong',
  syncing: 'border-brand-200 bg-brand-50 text-brand-700',
  connecting: 'border-brand-200 bg-brand-50 text-brand-700',
  needs_reconnect: 'border-warning-border bg-warning-surface text-warning-strong',
  error: 'border-danger-border bg-danger-surface text-danger-strong',
  disconnected: 'border-border bg-surface-sunken text-ink-muted',
}

const DOTS: Record<ConnectionStatus, string> = {
  connected: 'bg-success',
  syncing: 'bg-brand',
  connecting: 'bg-brand',
  needs_reconnect: 'bg-warning',
  error: 'bg-danger',
  disconnected: 'bg-ink-faint',
}

const SPINNING: ConnectionStatus[] = ['connecting', 'syncing']

export function ConnectionStatusBadge({
  status,
  className,
}: {
  status: ConnectionStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-2xs font-medium',
        TONES[status],
        className,
      )}
    >
      {SPINNING.includes(status) ? (
        <Loader2 className="size-2.5 animate-spin" aria-hidden />
      ) : (
        <span className={cn('size-1.5 rounded-full', DOTS[status])} aria-hidden />
      )}
      {CONNECTION_STATUS_LABELS[status]}
    </span>
  )
}

/**
 * Plain-language capability summary.
 *
 * Shown because a business needs to know *before* connecting that, say,
 * TikTok will not let them answer comments from here — discovering that after
 * the fact is how a product loses trust.
 */
export function capabilitySummary(capabilities: ProviderCapabilities): {
  supported: string[]
  unsupported: string[]
} {
  const supported: string[] = []
  const unsupported: string[] = []

  const add = (ok: boolean, label: string) => (ok ? supported : unsupported).push(label)

  add(capabilities.canReadComments, 'قراءة التعليقات')
  add(capabilities.canReplyToComments, 'الرد على التعليقات')
  add(capabilities.canReadDirectMessages, 'قراءة الرسائل')
  add(capabilities.canReplyToDirectMessages, 'الرد على الرسائل')

  return { supported, unsupported }
}
