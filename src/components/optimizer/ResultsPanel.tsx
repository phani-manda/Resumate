'use client'

import { TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { ScoreCard } from './ScoreCard'
import { KeywordsPanel } from './KeywordsPanel'
import { SuggestionsPanel } from './SuggestionsPanel'
import { EmptyResultsState } from './EmptyResultsState'
import type { OptimizationResults } from './types'

interface ResultsPanelProps {
  results: OptimizationResults | null
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Optimal'
    if (score >= 60) return 'Moderate'
    return 'Critical'
  }

  const badgeVariant = (score: number): 'success' | 'warning' | 'danger' => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="flex shrink-0 items-center justify-between border-b border-line p-5">
        <h2 className="flex items-center gap-2 text-heading-lg text-ink-primary">
          <TrendingUp className="h-5 w-5 text-accent" />
          Analysis Report
        </h2>
        {results && (
          <Badge variant={badgeVariant(results.atsScore)}>
            {getScoreLabel(results.atsScore)} Match
          </Badge>
        )}
      </div>

      {!results ? (
        <EmptyResultsState />
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-5">
            <ScoreCard results={results} />
            <KeywordsPanel results={results} />
            <SuggestionsPanel results={results} />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
