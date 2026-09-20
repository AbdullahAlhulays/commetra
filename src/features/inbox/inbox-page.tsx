import { MessageSquare } from 'lucide-react'
import { useCallback } from 'react'
import { Outlet, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/states'
import type { Interaction } from '@/domain'
import { useRequiredSession } from '@/features/auth/use-session'
import { useAccountLookup } from '@/features/integrations/use-integrations'
import { useWorkspacePreferences } from '@/features/settings/use-organization'
import { cn } from '@/lib/cn'
import { FilterRail } from './filter-rail'
import { InboxFilterBar } from './filter-bar'
import { hasAnyFilter, toCountsQuery, toInboxQuery, useInboxFilters } from './inbox-filters'
import { InteractionDetail } from './interaction-detail'
import { InteractionList } from './interaction-list'
import { useInboxCounts, useInboxList, useInteraction } from './use-inbox'

/**
 * Three-column inbox, RTL.
 *
 * Right → left: filter rail, interaction list, selected interaction. The rail
 * folds into a sheet below 1280px and the list/detail split collapses to a
 * push navigation below 768px, because a three-pane layout on a phone is a
 * shrunken desktop, not a mobile design.
 */
export function InboxPage() {
  const session = useRequiredSession()
  const navigate = useNavigate()
  const location = useLocation()
  const detailMatch = useMatch('/app/inbox/:interactionId')
  const selectedId = detailMatch?.params.interactionId

  const { filters, setFilters, clearFilters } = useInboxFilters()
  const listQuery = toInboxQuery(filters, session.organizationId)
  const countsQuery = toCountsQuery(filters, session.organizationId)

  const list = useInboxList(listQuery)
  const counts = useInboxCounts(countsQuery)
  const { accounts, byId } = useAccountLookup(session.organizationId)

  const interactions = list.data?.pages.flatMap((page) => page.items) ?? []
  const total = list.data?.pages[0]?.total

  // Filters live in the query string, so carrying `location.search` across
  // navigation is what keeps them applied when an interaction is opened.
  const handleSelect = useCallback(
    (interaction: Interaction) => {
      void navigate({ pathname: `/app/inbox/${interaction.id}`, search: location.search })
    },
    [navigate, location.search],
  )

  return (
    <div className="flex h-full min-h-0">
      <aside
        aria-label="تصفية الصندوق الوارد"
        className="hidden w-52 shrink-0 border-e border-border bg-surface xl:block"
      >
        <FilterRail
          filters={filters}
          counts={counts.data}
          isCountsPending={counts.isPending}
          accounts={accounts}
          onChange={setFilters}
        />
      </aside>

      <div
        className={cn(
          'flex min-h-0 w-full flex-col border-e border-border bg-surface md:w-[21rem] md:shrink-0 lg:w-[23rem]',
          selectedId && 'hidden md:flex',
        )}
      >
        <InboxFilterBar
          filters={filters}
          counts={counts.data}
          isCountsPending={counts.isPending}
          accounts={accounts}
          resultCount={list.isPending ? undefined : total}
          onChange={setFilters}
          onClear={clearFilters}
        />

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
          <InteractionList
            interactions={interactions}
            accountsById={byId}
            selectedId={selectedId}
            onSelect={handleSelect}
            isPending={list.isPending}
            isError={list.isError}
            error={list.error}
            onRetry={() => void list.refetch()}
            hasFilters={hasAnyFilter(filters)}
            onClearFilters={clearFilters}
            hasNextPage={list.hasNextPage}
            isFetchingNextPage={list.isFetchingNextPage}
            onLoadMore={() => void list.fetchNextPage()}
            hasAnyAccount={accounts.length > 0}
            onConnectAccount={() => void navigate('/app/integrations')}
          />
        </div>
      </div>

      <div className={cn('min-h-0 flex-1', selectedId ? 'flex' : 'hidden md:flex')}>
        {selectedId ? (
          <div className="w-full">
            <Outlet />
          </div>
        ) : (
          <div className="grid w-full place-items-center">
            <EmptyState
              icon={MessageSquare}
              title="اختر تفاعلاً لعرضه"
              description="اختر تعليقًا أو رسالة من القائمة لقراءة سياقها والرد عليها."
            />
          </div>
        )}
      </div>
    </div>
  )
}

/** Detail pane on desktop; a full screen with a back action on phones. */
export function InboxDetailRoute() {
  const { interactionId } = useParams<{ interactionId: string }>()
  const session = useRequiredSession()
  const navigate = useNavigate()
  const location = useLocation()

  const interaction = useInteraction(interactionId)
  const { byId } = useAccountLookup(session.organizationId)
  const { data: preferences } = useWorkspacePreferences(session.organizationId)

  const account = interaction.data
    ? byId.get(interaction.data.connectedAccountId)
    : undefined

  return (
    <InteractionDetail
      interaction={interaction.data}
      account={account}
      isPending={interaction.isPending}
      isError={interaction.isError}
      error={interaction.error}
      onRetry={() => void interaction.refetch()}
      onBack={() => void navigate({ pathname: '/app/inbox', search: location.search })}
      markReadOnOpen={preferences?.markReadOnOpen ?? true}
    />
  )
}
