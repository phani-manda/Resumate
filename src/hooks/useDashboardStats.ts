"use client";

import useSWR from "swr";

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

// ============================================================================
// TYPES
// ============================================================================

export interface DashboardStats {
  // Resume metrics
  totalResumes: number;
  activeResumes: number;
  completionRate: number; // Average completion % across resumes

  // Optimization metrics
  totalOptimizations: number;
  averageAtsScore: number;
  bestAtsScore: number;
  scoreImprovement: number; // Delta from first to latest

  // Activity metrics
  chatSessions: number;
  messagesThisWeek: number;
  exportsCount: number;

  // Time-series data
  atsScoreHistory: Array<{
    date: string;
    score: number;
  }>;

  // Common missing keywords
  topMissingKeywords: Array<{
    keyword: string;
    count: number;
  }>;

  // Skills distribution
  skillsDistribution: Array<{
    skill: string;
    count: number;
  }>;

  // Weekly activity
  weeklyActivity: Array<{
    week: string;
    optimizations: number;
    chats: number;
    exports: number;
  }>;

  // Recent activity
  recentActivity: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>;
}

// ============================================================================
// useDashboardStats Hook
// ============================================================================

interface UseDashboardStatsOptions {
  dateRange?: "7d" | "30d" | "90d" | "all";
}

export function useDashboardStats(options: UseDashboardStatsOptions = {}) {
  const { dateRange = "30d" } = options;
  const url = `/api/dashboard/stats?range=${dateRange}`;

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<DashboardStats>(url, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // Refresh every minute
      dedupingInterval: 30000, // Dedupe for 30s
    });

  // Default stats when loading or error
  const defaultStats: DashboardStats = {
    totalResumes: 0,
    activeResumes: 0,
    completionRate: 0,
    totalOptimizations: 0,
    averageAtsScore: 0,
    bestAtsScore: 0,
    scoreImprovement: 0,
    chatSessions: 0,
    messagesThisWeek: 0,
    exportsCount: 0,
    atsScoreHistory: [],
    topMissingKeywords: [],
    skillsDistribution: [],
    weeklyActivity: [],
    recentActivity: [],
  };

  return {
    stats: data ?? defaultStats,
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(),
    isEmpty:
      !data ||
      (data.totalResumes === 0 && data.totalOptimizations === 0),
  };
}

// ============================================================================
// useOptimizationReports Hook
// ============================================================================

export interface OptimizationReport {
  id: string;
  resumeId?: string;
  jobTitle?: string;
  companyName?: string;
  atsScore: number;
  keywords: {
    matched: string[];
    missing: string[];
    partial?: string[];
  };
  suggestions: string[];
  improvements?: Record<string, unknown>;
  createdAt: string;
}

interface UseOptimizationReportsOptions {
  limit?: number;
  resumeId?: string;
}

export function useOptimizationReports(
  options: UseOptimizationReportsOptions = {}
) {
  const { limit = 20, resumeId } = options;

  let url = `/api/optimization/reports?limit=${limit}`;
  if (resumeId) url += `&resumeId=${resumeId}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    OptimizationReport[]
  >(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  return {
    reports: data ?? [],
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(),
    latestReport: data?.[0],
    averageScore: data?.length
      ? Math.round(
          data.reduce((sum, r) => sum + r.atsScore, 0) / data.length
        )
      : 0,
  };
}

// ============================================================================
// useChatHistory Hook
// ============================================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sessionId?: string;
  reaction?: "thumbsUp" | "thumbsDown";
}

export interface ChatSession {
  id: string | null;
  messageCount: number;
  lastActivity: string;
}

interface UseChatHistoryOptions {
  limit?: number;
  sessionId?: string;
}

export function useChatHistory(options: UseChatHistoryOptions = {}) {
  const { limit = 100, sessionId } = options;

  let url = `/api/ai/chat/history?limit=${limit}`;
  if (sessionId) url += `&sessionId=${sessionId}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{
    messages: ChatMessage[];
    sessions: ChatSession[];
  }>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  // Add reaction to a message
  const addReaction = async (
    messageId: string,
    reaction: "thumbsUp" | "thumbsDown"
  ) => {
    const previous = data;

    // Optimistic update
    if (data) {
      const updated = {
        ...data,
        messages: data.messages.map((m) =>
          m.id === messageId ? { ...m, reaction } : m
        ),
      };
      mutate(updated, false);
    }

    try {
      await fetch(`/api/ai/chat/messages/${messageId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction }),
      });
    } catch (error) {
      mutate(previous);
      throw error;
    }
  };

  // Clear chat history
  const clearHistory = async (sessionIdToClear?: string) => {
    let deleteUrl = "/api/ai/chat/history";
    if (sessionIdToClear) deleteUrl += `?sessionId=${sessionIdToClear}`;

    await fetch(deleteUrl, { method: "DELETE" });
    mutate();
  };

  return {
    messages: data?.messages ?? [],
    sessions: data?.sessions ?? [],
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(),
    addReaction,
    clearHistory,
    hasMessages: (data?.messages?.length ?? 0) > 0,
  };
}

export default useDashboardStats;
