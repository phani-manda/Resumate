'use client'

import { TrendingUp, CheckCircle2, XCircle, Lightbulb, ListChecks } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { ScoreCard } from './ScoreCard'
import { ReviewPanel } from './ReviewPanel'
import { ImprovementsPanel } from './ImprovementsPanel'
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
            {/* 1. ATS Score */}
            <ScoreCard results={results} />

            {/* 2. Overall Review */}
            <ReviewPanel results={results} />

            <hr className="border-line" />

            {/* 3. Required Keywords */}
            <RequiredKeywordsSection results={results} />

            <hr className="border-line" />

            {/* 4. Resume Points (before/after rewrites) */}
            <ImprovementsPanel results={results} />

            <hr className="border-line" />

            {/* 5. Additional Suggestions */}
            <SuggestionsSection results={results} />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

function RequiredKeywordsSection({ results }: { results: OptimizationResults }) {
  const matched = results.matchedKeywords ?? []
  const missing = results.missingKeywords ?? []
  const total = matched.length + missing.length
  const coverage = total > 0 ? Math.round((matched.length / total) * 100) : 0

  return (
    <div role="region" aria-label="Required keywords">
      <h3 className="mb-4 flex items-center gap-2 text-label uppercase text-ink-muted">
        <ListChecks className="h-4 w-4 text-accent" />
        Required Keywords
        <span className="ml-auto text-caption normal-case font-normal text-ink-muted">
          {coverage}% coverage
        </span>
      </h3>

      {/* Coverage bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-subtle">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${coverage}%` }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Present in resume */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-label-sm text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Present in Your Resume ({matched.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {matched.length > 0 ? (
              matched.map((keyword) => (
                <Badge key={keyword} variant="success">
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-body-sm text-ink-muted">None detected yet.</p>
            )}
          </div>
        </div>

        {/* Missing from resume */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-label-sm text-danger">
            <XCircle className="h-3.5 w-3.5" />
            Missing from Your Resume ({missing.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {missing.length > 0 ? (
              missing.map((keyword) => (
                <Badge key={keyword} variant="danger">
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-body-sm text-ink-muted">
                All required keywords are present.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SuggestionsSection({ results }: { results: OptimizationResults }) {
  const suggestions = results.suggestions ?? []
  if (suggestions.length === 0) return null

  return (
    <div role="region" aria-label="Suggestions">
      <h3 className="mb-3 flex items-center gap-2 text-label uppercase text-ink-muted">
        <Lightbulb className="h-4 w-4 text-action" />
        Additional Suggestions
      </h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex gap-3 rounded-lg border border-line bg-subtle p-3 text-body-md text-ink-primary"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-action/10 text-xs font-medium text-action">
              {index + 1}
            </span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
