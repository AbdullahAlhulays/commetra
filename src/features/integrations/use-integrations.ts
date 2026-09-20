import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/query-keys'
import type { ConnectedAccount, ConnectedAccountId, OrganizationId, SocialProvider } from '@/domain'
import { api } from '@/services'

export function useConnectedAccounts(organizationId: OrganizationId) {
  return useQuery({
    queryKey: queryKeys.integrations.accounts(organizationId),
    queryFn: () => api.integrations.listAccounts(organizationId),
    staleTime: 60_000,
  })
}

/** Index by id for the many places that resolve an interaction's account. */
export function useAccountLookup(organizationId: OrganizationId) {
  const { data, ...rest } = useConnectedAccounts(organizationId)

  const byId = new Map<ConnectedAccountId, ConnectedAccount>()
  for (const account of data ?? []) byId.set(account.id, account)

  return { accounts: data ?? [], byId, ...rest }
}

export function useConnectAccount(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (provider: SocialProvider) =>
      api.integrations.connect({ organizationId, provider }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() })
      // A new account brings history with it, so the inbox and metrics change.
      void queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all() })
    },
  })
}

export function useReconnectAccount(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: ConnectedAccountId) => api.integrations.reconnect(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.integrations.accounts(organizationId) })
      // Capabilities are resolved from the account, so open interactions need
      // to re-read them before the composer decides what to allow.
      void queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
    },
  })
}

export function useDisconnectAccount(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: ConnectedAccountId) => api.integrations.disconnect(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.integrations.accounts(organizationId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all() })
    },
  })
}

export function useSyncAccount(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: ConnectedAccountId) => api.integrations.sync(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.integrations.accounts(organizationId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all() })
    },
  })
}
