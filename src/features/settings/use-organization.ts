import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/query-keys'
import type { NotificationPreferences, OrganizationId, WorkspacePreferences } from '@/domain'
import { api, type OnboardingInput } from '@/services'

export function useOrganization(organizationId: OrganizationId) {
  return useQuery({
    queryKey: queryKeys.organization.detail(organizationId),
    queryFn: () => api.organizations.get(organizationId),
    staleTime: 5 * 60_000,
  })
}

export function useUpdateOrganization(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: OnboardingInput) => api.organizations.updateProfile(organizationId, input),
    onSuccess: (organization) => {
      queryClient.setQueryData(queryKeys.organization.detail(organizationId), organization)
    },
  })
}

export function useCompleteOnboarding(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.organizations.completeOnboarding(organizationId),
    onSuccess: (organization) => {
      queryClient.setQueryData(queryKeys.organization.detail(organizationId), organization)
      // The session carries the onboarding flag that the route guard reads.
      void queryClient.invalidateQueries({ queryKey: queryKeys.session })
    },
  })
}

export function useNotificationPreferences(organizationId: OrganizationId) {
  return useQuery({
    queryKey: queryKeys.organization.notificationPreferences(organizationId),
    queryFn: () => api.organizations.getNotificationPreferences(organizationId),
  })
}

export function useUpdateNotificationPreferences(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NotificationPreferences) =>
      api.organizations.updateNotificationPreferences(organizationId, input),
    onSuccess: (preferences) => {
      queryClient.setQueryData(
        queryKeys.organization.notificationPreferences(organizationId),
        preferences,
      )
    },
  })
}

export function useWorkspacePreferences(organizationId: OrganizationId) {
  return useQuery({
    queryKey: queryKeys.organization.workspacePreferences(organizationId),
    queryFn: () => api.organizations.getWorkspacePreferences(organizationId),
  })
}

export function useUpdateWorkspacePreferences(organizationId: OrganizationId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: WorkspacePreferences) =>
      api.organizations.updateWorkspacePreferences(organizationId, input),
    onSuccess: (preferences) => {
      queryClient.setQueryData(
        queryKeys.organization.workspacePreferences(organizationId),
        preferences,
      )
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { fullName: string; email: string }) => api.auth.updateProfile(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.session })
    },
  })
}
