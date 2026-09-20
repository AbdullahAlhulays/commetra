import { Inbox as InboxIcon, SearchX } from 'lucide-react'
import { EmptyState, ErrorState } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ConnectedAccount, ConnectedAccountId, Interaction } from '@/domain'
import { InteractionListItem } from './interaction-list-item'

function ListSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">جاري تحميل التفاعلات…</span>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="flex gap-3 border-b border-border-subtle px-3 py-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function InteractionList({
  interactions,
  accountsById,
  selectedId,
  onSelect,
  isPending,
  isError,
  error,
  onRetry,
  hasFilters,
  onClearFilters,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  hasAnyAccount,
  onConnectAccount,
}: {
  interactions: Interaction[]
  accountsById: Map<ConnectedAccountId, ConnectedAccount>
  selectedId: string | undefined
  onSelect: (interaction: Interaction) => void
  isPending: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  hasFilters: boolean
  onClearFilters: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  hasAnyAccount: boolean
  onConnectAccount: () => void
}) {
  if (isPending) return <ListSkeleton />

  if (isError) {
    return <ErrorState error={error} title="تعذر تحميل التفاعلات" onRetry={onRetry} />
  }

  if (interactions.length === 0) {
    // Three genuinely different dead ends, each with its own way forward.
    if (!hasAnyAccount) {
      return (
        <EmptyState
          icon={InboxIcon}
          title="لا توجد حسابات مرتبطة بعد"
          description="اربط أول حساب تواصل اجتماعي لتبدأ باستقبال التعليقات والرسائل هنا."
          action={
            <Button variant="primary" size="sm" onClick={onConnectAccount}>
              ربط حساب
            </Button>
          }
        />
      )
    }

    if (hasFilters) {
      return (
        <EmptyState
          icon={SearchX}
          title="لا توجد نتائج مطابقة"
          description="جرّب تعديل عوامل التصفية أو البحث بكلمات أخرى."
          action={
            <Button variant="secondary" size="sm" onClick={onClearFilters}>
              مسح التصفية
            </Button>
          }
        />
      )
    }

    return (
      <EmptyState
        icon={InboxIcon}
        title="لا توجد تفاعلات"
        description="ستظهر التعليقات والرسائل الجديدة هنا فور وصولها من الحسابات المرتبطة."
      />
    )
  }

  return (
    <>
      <ul>
        {interactions.map((interaction) => (
          <InteractionListItem
            key={interaction.id}
            interaction={interaction}
            account={accountsById.get(interaction.connectedAccountId)}
            isSelected={interaction.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </ul>

      {hasNextPage ? (
        <div className="p-3">
          <Button
            variant="subtle"
            size="sm"
            className="w-full"
            onClick={onLoadMore}
            loading={isFetchingNextPage}
          >
            عرض المزيد
          </Button>
        </div>
      ) : (
        <p className="py-4 text-center text-2xs text-ink-faint">لا توجد تفاعلات أقدم</p>
      )}
    </>
  )
}
