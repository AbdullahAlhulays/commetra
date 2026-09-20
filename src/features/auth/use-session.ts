import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/query-keys'
import type { AuthSession } from '@/domain'
import { api, type SignInInput, type SignUpInput } from '@/services'

/**
 * Auth state lives in the query cache, not in a Context.
 *
 * The session is server state like anything else, so it gets the same
 * caching, invalidation and loading semantics — and no provider has to wrap
 * the tree to share it.
 */
export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () => api.auth.getSession(),
    staleTime: 5 * 60_000,
    retry: false,
  })
}

/** Throws if used outside an authenticated route; the guard runs first. */
export function useRequiredSession(): AuthSession {
  const { data } = useSession()
  if (!data) {
    throw new Error('useRequiredSession used outside an authenticated route')
  }
  return data
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SignInInput) => api.auth.signIn(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.session, session)
      // The tenant changed: nothing cached from before this point is valid.
      void queryClient.invalidateQueries()
    },
  })
}

export function useSignUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SignUpInput) => api.auth.signUp(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.session, session)
      void queryClient.invalidateQueries()
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.auth.signOut(),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => api.auth.requestPasswordReset(email),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: { token: string; password: string }) => api.auth.resetPassword(input),
  })
}
