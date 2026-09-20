import { Bell, Link2Off, MessageSquare, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/states'
import { PlatformChip } from '@/components/platform/platform-chip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import type { AppNotification, NotificationKind, OrganizationId } from '@/domain'
import { cn } from '@/lib/cn'
import { formatAbsolute, formatCompactTime } from '@/lib/format'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from './use-notifications'

const KIND_ICONS: Record<NotificationKind, typeof Bell> = {
  new_interaction: MessageSquare,
  account_needs_reconnect: Link2Off,
  reply_failed: TriangleAlert,
}

const KIND_TONES: Record<NotificationKind, string> = {
  new_interaction: 'text-ink-faint',
  account_needs_reconnect: 'text-warning',
  reply_failed: 'text-danger',
}

function NotificationRow({
  notification,
  onSelect,
}: {
  notification: AppNotification
  onSelect: (notification: AppNotification) => void
}) {
  const Icon = KIND_ICONS[notification.kind]

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        'flex w-full items-start gap-2.5 border-b border-border-subtle px-3 py-2.5 text-start transition-colors last:border-b-0 hover:bg-surface-subtle',
        !notification.isRead && 'bg-brand-50/40',
      )}
    >
      <span className="relative mt-0.5 shrink-0">
        {notification.provider ? (
          <PlatformChip provider={notification.provider} size="sm" />
        ) : (
          <Icon className={cn('size-4', KIND_TONES[notification.kind])} aria-hidden />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-xs font-medium text-ink">{notification.title}</span>
          <time
            dateTime={notification.createdAt}
            title={formatAbsolute(notification.createdAt)}
            className="tabular shrink-0 text-2xs text-ink-faint"
          >
            {formatCompactTime(notification.createdAt)}
          </time>
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-ink-muted">
          {notification.body}
        </span>
      </span>

      {!notification.isRead ? (
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-label="غير مقروء" />
      ) : null}
    </button>
  )
}

/**
 * Lightweight popover, not a full notification system.
 *
 * Three kinds of event, an unread mark and a jump target — anything more
 * belongs to a later version.
 */
export function NotificationCenter({ organizationId }: { organizationId: OrganizationId }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { data, isPending, isError } = useNotifications(organizationId)
  const markRead = useMarkNotificationRead(organizationId)
  const markAllRead = useMarkAllNotificationsRead(organizationId)

  const notifications = data ?? []
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  function handleSelect(notification: AppNotification) {
    if (!notification.isRead) markRead.mutate(notification.id)
    setOpen(false)

    if (notification.target?.kind === 'interaction') {
      void navigate(`/app/inbox/${notification.target.interactionId}`)
    } else if (notification.target?.kind === 'integration') {
      void navigate('/app/integrations')
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative grid size-8 place-items-center rounded-md text-ink-secondary transition-colors hover:bg-surface-sunken hover:text-ink"
          aria-label={unreadCount > 0 ? `الإشعارات، ${unreadCount} غير مقروء` : 'الإشعارات'}
        >
          <Bell className="size-4" aria-hidden />
          {unreadCount > 0 ? (
            <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-accent ring-2 ring-surface" />
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-xs font-semibold text-ink">الإشعارات</p>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="text-2xs font-medium text-brand-text hover:underline disabled:opacity-50"
            >
              تعليم الكل كمقروء
            </button>
          ) : null}
        </div>

        <div className="scrollbar-thin max-h-80 overflow-y-auto" aria-busy={isPending}>
          {isPending ? (
            <div className="space-y-3 p-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex gap-2.5">
                  <Skeleton className="size-5 rounded-[5px]" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <p className="px-3 py-6 text-center text-xs text-ink-muted">تعذر تحميل الإشعارات.</p>
          ) : notifications.length === 0 ? (
            <EmptyState
              className="py-8"
              title="لا توجد إشعارات"
              description="سننبهك عند وصول تفاعل جديد أو عند وجود مشكلة في أحد الحسابات."
            />
          ) : (
            notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
