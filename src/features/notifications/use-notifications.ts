import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/query-keys'
import type { OrganizationId } from '@/domain'
import { api } from '@/services'

export function useNotifications(organizationId: OrganizationId) {
  return useQuery({
    queryKey: queryKeys.notifications.list(organizationId),
    queryFn: () => api.notifications.list(organizationId),
    // An inbox product should surface new activity without a manual refresh;
    // polling stands in for the websocket a real backend would provide.
    refetchInterval: 60_000,
  })
}

export function useMarkNotificationRead(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.notifications.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list(organizationId) })
    },
  })
}

export function useMarkAllNotificationsRead(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.notifications.markAllRead(organizationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list(organizationId) })
    },
  })
}
