import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { queryKeys } from '@/app/query-keys'
import { METRIC_RANGES, type MetricRange, type OrganizationId } from '@/domain'
import { api } from '@/services'

/** Range lives in the URL so a dashboard view can be shared or bookmarked. */
export function useDashboardRange(): [MetricRange, (range: MetricRange) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const raw = searchParams.get('range')
  const range = (METRIC_RANGES as readonly string[]).includes(raw ?? '')
    ? (raw as MetricRange)
    : '30d'

  const setRange = useCallback(
    (next: MetricRange) => {
      const params = new URLSearchParams(searchParams)
      params.set('range', next)
      setSearchParams(params, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  return [range, setRange]
}

export function useDashboard(organizationId: OrganizationId, range: MetricRange) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(organizationId, range),
    queryFn: () => api.analytics.dashboard({ organizationId, range }),
    // Keeps the previous range's numbers on screen while the new ones load,
    // so switching ranges does not blank the page.
    placeholderData: (previous) => previous,
  })
}

export function useRecentInteractions(organizationId: OrganizationId, limit: number) {
  return useQuery({
    queryKey: queryKeys.analytics.recent(organizationId, limit),
    queryFn: () => api.analytics.recentInteractions({ organizationId, limit }),
  })
}
