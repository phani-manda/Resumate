"use client"

import useSWR from "swr"

export interface DashboardStats {
  resumesCount: number
  optimizationsCount: number
  chatSessionsCount: number
  latestScore: number
  avgScore: number
  scoreImprovement: number
  recentOptimizations: number
}

interface DashboardAPIResponse {
  stats: DashboardStats
}

const fetcher = async (url: string): Promise<DashboardAPIResponse> => {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error || `Request failed (${res.status})`)
  }
  return res.json()
}

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard/stats", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  })

  return {
    stats: data?.stats ?? null,
    isLoading,
    isError: !!error,
    errorMessage: error instanceof Error ? error.message : undefined,
    refresh: mutate,
  }
}
