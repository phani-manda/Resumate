"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base Skeleton Component with shimmer animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-white/5 via-white/10 to-white/5",
        "bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "shimmer 1.5s infinite",
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Resume Builder Skeleton
 */
export function BuilderSkeleton() {
  return (
    <div
      className="flex h-full gap-6 p-6"
      role="status"
      aria-label="Loading resume builder"
    >
      {/* Left Panel - Editor */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Experience Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        {/* Education Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Skills Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-16" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="hidden w-[45%] lg:block">
        <div className="sticky top-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          {/* Resume Preview Area */}
          <div className="aspect-[8.5/11] rounded-lg bg-white/5 p-8 space-y-4">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
            <div className="pt-6 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="pt-4 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading resume builder...</span>
    </div>
  );
}

/**
 * AI Optimizer Skeleton
 */
export function OptimizerSkeleton() {
  return (
    <div
      className="space-y-6 p-6"
      role="status"
      aria-label="Loading AI optimizer"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Input Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Resume Selector */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Job Description */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <Skeleton className="h-12 w-48 rounded-full" />
      </div>

      {/* Results Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-6 w-24 mt-4" />
        </div>

        {/* Keywords Panel */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">Loading AI optimizer...</span>
    </div>
  );
}

/**
 * Dashboard Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div
      className="space-y-6 p-6"
      role="status"
      aria-label="Loading dashboard"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-8 w-24 mt-4" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>

      {/* Activity List */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32 mt-1" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading dashboard...</span>
    </div>
  );
}

/**
 * Resume List Skeleton
 */
export function ResumeListSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading resumes"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
      ))}

      <span className="sr-only">Loading resumes...</span>
    </div>
  );
}

/**
 * Chat Skeleton
 */
export function ChatSkeleton() {
  return (
    <div
      className="flex h-full flex-col"
      role="status"
      aria-label="Loading chat"
    >
      {/* Chat Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {/* Assistant Message */}
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="max-w-[70%] space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 flex-row-reverse">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="max-w-[70%]">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
        </div>

        {/* Assistant Message */}
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="max-w-[70%] space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>

      <span className="sr-only">Loading chat...</span>
    </div>
  );
}

export {
  Skeleton as SkeletonBase,
};
