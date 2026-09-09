"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  FileText,
  Sparkles,
  Target,
  MessageSquare,
  Pencil,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { fadeUp, staggerContainer } from "@/lib/animation"
import { cn } from "@/lib/utils"
import useSWR from "swr"

interface ResumeSummary {
  id: string
  title: string
  updatedAt: string
  atsScore?: number | null
}

const resumesFetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch resumes")
    return res.json()
  })

function scoreBadgeVariant(score: number): "danger" | "warning" | "success" {
  if (score >= 80) return "success"
  if (score >= 60) return "warning"
  return "danger"
}

function StatCard({
  label,
  value,
  trend,
  trendUp,
  delay = 0,
}: {
  label: string
  value: string
  trend?: string
  trendUp?: boolean
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduceMotion ? 0 : delay }}
      className="rounded-xl border border-line bg-surface p-5 shadow-card"
    >
      <p className="mb-1 text-label uppercase text-ink-muted">{label}</p>
      <p className="text-display-sm font-bold text-ink-primary">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-caption",
            trendUp ? "text-success" : "text-danger"
          )}
        >
          {trendUp ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {trend}
        </p>
      )}
    </motion.div>
  )
}

export function StatsDashboard() {
  const { stats, isLoading, isError } = useDashboardStats()
  const { data: resumesRaw, isLoading: resumesLoading } = useSWR<ResumeSummary[]>(
    "/api/resumes",
    resumesFetcher
  )

  const resumes = Array.isArray(resumesRaw) ? resumesRaw : []

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <p className="text-body-md text-ink-secondary">Could not load dashboard stats.</p>
      </div>
    )
  }

  const avgScoreLabel = stats.avgScore > 0 ? `${stats.avgScore}%` : "—"
  const scoreTrend =
    stats.scoreImprovement !== 0
      ? `${stats.scoreImprovement > 0 ? "↑" : "↓"} ${Math.abs(stats.scoreImprovement)}pts`
      : undefined

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-ink-primary">Dashboard</h1>
          <p className="mt-1 text-body-md text-ink-secondary">
            Your resume activity and optimization overview
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="action" asChild>
            <Link href="/builder">New Resume</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/optimizer">Optimize Existing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/coach">Ask Career Coach</Link>
          </Button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <StatCard
          label="Total Resumes"
          value={String(stats.resumesCount)}
          trend={stats.resumesCount > 0 ? "Active workspace" : "Create your first"}
          trendUp
          delay={0}
        />
        <StatCard
          label="Optimizations Run"
          value={String(stats.optimizationsCount)}
          trend={
            stats.recentOptimizations > 0
              ? `↑ ${stats.recentOptimizations} this month`
              : "Run your first scan"
          }
          trendUp={stats.recentOptimizations > 0}
          delay={0.05}
        />
        <StatCard
          label="Avg ATS Score"
          value={avgScoreLabel}
          trend={scoreTrend}
          trendUp={stats.scoreImprovement >= 0}
          delay={0.1}
        />
        <StatCard
          label="Coach Chats"
          value={String(stats.chatSessionsCount)}
          trend={stats.chatSessionsCount > 0 ? "Sessions saved" : "Start a conversation"}
          trendUp={stats.chatSessionsCount > 0}
          delay={0.15}
        />
      </motion.div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-heading-xl text-ink-primary">Recent Resumes</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/builder">View all</Link>
          </Button>
        </div>

        {resumesLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 w-64 shrink-0 animate-pulse rounded-xl bg-subtle"
              />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-ink-muted" />
            <p className="text-body-md text-ink-secondary">No resumes yet</p>
            <Button variant="action" className="mt-4" asChild>
              <Link href="/builder">Create Resume</Link>
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {resumes.slice(0, 8).map((resume) => {
              const score = resume.atsScore ?? stats.latestScore
              return (
                <div
                  key={resume.id}
                  className="w-64 shrink-0 rounded-xl border border-line bg-surface p-4 shadow-card transition-all hover:cursor-pointer hover:border-line-strong hover:shadow-elevated"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-heading-md text-ink-primary">
                      {resume.title || "Untitled Resume"}
                    </h3>
                    {score > 0 && (
                      <Badge variant={scoreBadgeVariant(score)}>{score}%</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-caption text-ink-muted">
                    Edited {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/builder?id=${resume.id}`} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/builder"
          className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 shadow-card transition-all hover:border-line-strong hover:shadow-elevated"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-subtle">
            <FileText className="h-5 w-5 text-accent-text" />
          </div>
          <div>
            <p className="text-heading-md text-ink-primary">Resume Builder</p>
            <p className="text-caption text-ink-muted">Edit sections & preview</p>
          </div>
        </Link>
        <Link
          href="/optimizer"
          className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 shadow-card transition-all hover:border-line-strong hover:shadow-elevated"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-action-subtle">
            <Target className="h-5 w-5 text-action-text" />
          </div>
          <div>
            <p className="text-heading-md text-ink-primary">ATS Optimizer</p>
            <p className="text-caption text-ink-muted">Match job descriptions</p>
          </div>
        </Link>
        <Link
          href="/coach"
          className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 shadow-card transition-all hover:border-line-strong hover:shadow-elevated"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-info-subtle">
            <MessageSquare className="h-5 w-5 text-info-text" />
          </div>
          <div>
            <p className="text-heading-md text-ink-primary">Career Coach</p>
            <p className="text-caption text-ink-muted">AI career guidance</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
