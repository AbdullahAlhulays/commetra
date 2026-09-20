import {
  ArrowRight,
  Check,
  Mail,
  MailOpen,
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { EmptyState, ErrorState } from '@/components/states'
import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER } from '@/components/platform/platform-meta'
import { StatusBadge, StatusDot } from '@/components/status-indicator'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  INTERACTION_TYPE_LABELS,
  WORKFLOW_STATUSES,
  WORKFLOW_STATUS_LABELS,
  type ConnectedAccount,
  type Interaction,
  type Reply,
} from '@/domain'
import { cn } from '@/lib/cn'
import { formatAbsolute, formatRelativeTime } from '@/lib/format'
import { MediaPreview } from './media-preview'
import { OriginalContentPanel } from './original-content'
import { ReplyComposer } from './reply-composer'
import { useSetRead, useSetStatus } from './use-inbox'

function MessageBubble({
  align,
  author,
  timestamp,
  children,
  tone,
  footer,
}: {
  align: 'start' | 'end'
  author: string
  timestamp: string
  children: React.ReactNode
  tone: 'customer' | 'business'
  footer?: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1', align === 'end' ? 'items-end' : 'items-start')}>
      <div className="flex items-baseline gap-2 px-0.5">
        <span className="text-2xs font-medium text-ink-secondary">{author}</span>
        <time
          dateTime={timestamp}
          title={formatAbsolute(timestamp)}
          className="text-2xs text-ink-faint"
        >
          {formatRelativeTime(timestamp)}
        </time>
      </div>
      <div
        className={cn(
          'max-w-[min(34rem,88%)] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
          tone === 'business'
            ? 'rounded-se-sm bg-brand-50 text-brand-900'
            : 'rounded-ss-sm border border-border bg-surface text-ink',
        )}
      >
        {children}
      </div>
      {footer}
    </div>
  )
}

function ThreadReply({ reply }: { reply: Reply }) {
  const isBusiness = reply.authorKind === 'business'

  return (
    <div className={cn(reply.state === 'sending' && 'opacity-60')}>
      <MessageBubble
        align={isBusiness ? 'end' : 'start'}
        tone={isBusiness ? 'business' : 'customer'}
        author={isBusiness ? 'ردّك' : (reply.author?.displayName ?? 'العميل')}
        timestamp={reply.createdAt}
        footer={
          reply.state === 'sending' ? (
            <span className="px-0.5 text-2xs text-ink-faint">جاري الإرسال…</span>
          ) : reply.state === 'failed' && reply.failureReason ? (
            <span className="px-0.5 text-2xs text-danger-strong">{reply.failureReason}</span>
          ) : null
        }
      >
        {reply.text}
      </MessageBubble>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex h-full flex-col" aria-busy="true">
      <span className="sr-only">جاري تحميل التفاعل…</span>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-16 w-4/5 rounded-xl" />
        <Skeleton className="ms-auto h-12 w-3/5 rounded-xl" />
      </div>
    </div>
  )
}

/**
 * Marks an opened interaction as read.
 *
 * This is one of the few places an effect is the right tool: it synchronises
 * with the server on open, which is an external system. The ref keeps it to a
 * single request per interaction even under StrictMode's double invocation.
 */
function useMarkReadOnOpen(interaction: Interaction | undefined, enabled: boolean) {
  const setRead = useSetRead()
  const handled = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled || !interaction || interaction.isRead) return
    if (handled.current === interaction.id) return
    handled.current = interaction.id
    setRead.mutate({ id: interaction.id, isRead: true })
  }, [enabled, interaction, setRead])
}

export function InteractionDetail({
  interaction,
  account,
  isPending,
  isError,
  error,
  onRetry,
  onBack,
  markReadOnOpen,
}: {
  interaction: Interaction | undefined
  account: ConnectedAccount | undefined
  isPending: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  onBack?: () => void
  markReadOnOpen: boolean
}) {
  const setStatus = useSetStatus()
  const setRead = useSetRead()

  useMarkReadOnOpen(interaction, markReadOnOpen)

  if (isPending) return <DetailSkeleton />

  if (isError) {
    return (
      <div className="grid h-full place-items-center">
        <ErrorState error={error} title="تعذر تحميل التفاعل" onRetry={onRetry} />
      </div>
    )
  }

  if (!interaction) {
    return (
      <div className="grid h-full place-items-center">
        <EmptyState
          icon={MessageSquare}
          title="اختر تفاعلاً لعرضه"
          description="اختر تعليقًا أو رسالة من القائمة لقراءة سياقها والرد عليها."
        />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <header className="flex shrink-0 items-start gap-3 border-b border-border bg-surface px-3 py-3 sm:px-4">
        {onBack ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={onBack}
            aria-label="العودة للقائمة"
          >
            <ArrowRight aria-hidden />
          </Button>
        ) : null}

        <Avatar
          name={interaction.author.displayName}
          src={interaction.author.avatarUrl}
          className="mt-0.5"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-sm font-semibold text-ink">
              {interaction.author.displayName}
            </p>
            {interaction.author.handle ? (
              <span className="latin truncate text-2xs text-ink-muted">
                @{interaction.author.handle}
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs text-ink-muted">
            <span className="flex items-center gap-1">
              <PlatformChip provider={interaction.provider} size="xs" />
              {PLATFORM_LABELS_BY_PROVIDER[interaction.provider]}
            </span>
            {account ? (
              <>
                <span aria-hidden className="text-border-strong">
                  ·
                </span>
                <span className="truncate">{account.displayName}</span>
              </>
            ) : null}
            <span aria-hidden className="text-border-strong">
              ·
            </span>
            <span>{INTERACTION_TYPE_LABELS[interaction.type]}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="rounded-sm" aria-label="تغيير الحالة">
                <StatusBadge status={interaction.status} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>حالة المتابعة</DropdownMenuLabel>
              {WORKFLOW_STATUSES.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onSelect={() => setStatus.mutate({ id: interaction.id, status })}
                >
                  <StatusDot status={status} />
                  <span className="flex-1">{WORKFLOW_STATUS_LABELS[status]}</span>
                  {interaction.status === status ? (
                    <Check className="size-3.5 text-brand-text" aria-hidden />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="إجراءات أخرى">
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => setRead.mutate({ id: interaction.id, isRead: !interaction.isRead })}
              >
                {interaction.isRead ? <Mail aria-hidden /> : <MailOpen aria-hidden />}
                {interaction.isRead ? 'تعليم كغير مقروء' : 'تعليم كمقروء'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setStatus.mutate({ id: interaction.id, status: 'resolved' })}
                disabled={interaction.status === 'resolved'}
              >
                <Check aria-hidden />
                تعليم كتم الحل
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-4">
        <OriginalContentPanel interaction={interaction} />

        <MessageBubble
          align="start"
          tone="customer"
          author={interaction.author.displayName}
          timestamp={interaction.createdAt}
        >
          {interaction.text}
          <MediaPreview media={interaction.media} className="mt-2.5" />
        </MessageBubble>

        {interaction.replies.map((reply) => (
          <ThreadReply key={reply.id} reply={reply} />
        ))}
      </div>

      <ReplyComposer key={interaction.id} interaction={interaction} account={account} />
    </div>
  )
}
