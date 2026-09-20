import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { queryKeys } from '@/app/query-keys'
import type { Interaction, InteractionId, Reply, WorkflowStatus } from '@/domain'
import { api, type InboxQuery, type Page } from '@/services'

const PAGE_SIZE = 25

/**
 * Finds an interaction already held by any cached list page.
 *
 * Opening an item the user just clicked should not show a skeleton for data
 * that is already in memory, so the detail query starts from this.
 */
function findCachedInteraction(
  queryClient: QueryClient,
  id: InteractionId,
): Interaction | undefined {
  const pages = queryClient.getQueriesData<{ pages: Page<Interaction>[] }>({
    queryKey: ['inbox', 'list'],
  })

  for (const [, data] of pages) {
    for (const page of data?.pages ?? []) {
      const found = page.items.find((item) => item.id === id)
      if (found) return found
    }
  }
  return undefined
}

export function useInboxList(query: Omit<InboxQuery, 'cursor' | 'limit'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.inbox.list(query),
    queryFn: ({ pageParam }) =>
      api.inbox.list({ ...query, cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}

export function useInboxCounts(query: Omit<InboxQuery, 'cursor' | 'limit'>) {
  return useQuery({
    queryKey: queryKeys.inbox.counts(query),
    queryFn: () => api.inbox.counts(query),
  })
}

export function useInteraction(id: InteractionId | undefined) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: queryKeys.inbox.detail(id ?? ''),
    queryFn: () => api.inbox.get(id as InteractionId),
    enabled: Boolean(id),
    initialData: () => (id ? findCachedInteraction(queryClient, id) : undefined),
    // Treat the seeded copy as stale so the full record is still fetched.
    initialDataUpdatedAt: 0,
  })
}

/** Writes an updated interaction into both the detail cache and every list page. */
function writeInteraction(queryClient: QueryClient, next: Interaction) {
  queryClient.setQueryData(queryKeys.inbox.detail(next.id), next)
  queryClient.setQueriesData<{ pages: Page<Interaction>[]; pageParams: unknown[] }>(
    { queryKey: ['inbox', 'list'] },
    (data) => {
      if (!data) return data
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map((item) => (item.id === next.id ? next : item)),
        })),
      }
    },
  )
}

export function useSetRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isRead }: { id: InteractionId; isRead: boolean }) =>
      api.inbox.setRead(id, isRead),
    onMutate: async ({ id, isRead }) => {
      // Read state must flip instantly; a spinner on a row would be absurd.
      const previous = queryClient.getQueryData<Interaction>(queryKeys.inbox.detail(id))
      const current = previous ?? findCachedInteraction(queryClient, id)
      if (current) writeInteraction(queryClient, { ...current, isRead })
      return { current }
    },
    onError: (_error, _variables, context) => {
      if (context?.current) writeInteraction(queryClient, context.current)
    },
    onSuccess: (interaction) => {
      writeInteraction(queryClient, interaction)
      void queryClient.invalidateQueries({ queryKey: ['inbox', 'counts'] })
    },
  })
}

export function useSetStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: InteractionId; status: WorkflowStatus }) =>
      api.inbox.setStatus(id, status),
    onMutate: async ({ id, status }) => {
      const current =
        queryClient.getQueryData<Interaction>(queryKeys.inbox.detail(id)) ??
        findCachedInteraction(queryClient, id)
      if (current) writeInteraction(queryClient, { ...current, status })
      return { current }
    },
    onError: (_error, _variables, context) => {
      if (context?.current) writeInteraction(queryClient, context.current)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['inbox', 'counts'] })
    },
  })
}

/**
 * Sends a reply, showing it in the thread while it is in flight.
 *
 * On failure the optimistic entry is rolled back and the error surfaces in the
 * composer, where the text is still available to retry.
 */
export function useSendReply() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, text }: { id: InteractionId; text: string }) =>
      api.inbox.reply({ interactionId: id, text }),
    onMutate: async ({ id, text }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.inbox.detail(id) })

      const current =
        queryClient.getQueryData<Interaction>(queryKeys.inbox.detail(id)) ??
        findCachedInteraction(queryClient, id)
      if (!current) return { current: undefined }

      const optimistic: Reply = {
        id: `optimistic_${Date.now()}`,
        interactionId: id,
        authorKind: 'business',
        author: null,
        text,
        createdAt: new Date().toISOString(),
        state: 'sending',
        failureReason: null,
      }

      writeInteraction(queryClient, {
        ...current,
        replyState: 'sending',
        replies: [...current.replies, optimistic],
      })

      return { current }
    },
    onError: (_error, _variables, context) => {
      if (context?.current) writeInteraction(queryClient, context.current)
    },
    onSuccess: (reply, { id }, context) => {
      const base = context?.current
      if (base) {
        writeInteraction(queryClient, {
          ...base,
          isRead: true,
          replyState: 'sent',
          status: base.status === 'new' ? 'open' : base.status,
          replies: [...base.replies, reply],
        })
      } else {
        void queryClient.invalidateQueries({ queryKey: queryKeys.inbox.detail(id) })
      }
      void queryClient.invalidateQueries({ queryKey: ['inbox', 'counts'] })
    },
  })
}
