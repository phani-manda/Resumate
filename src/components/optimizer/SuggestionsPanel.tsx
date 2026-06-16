'use client'

import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { OptimizationResults } from './types'

interface SuggestionsPanelProps {
  results: OptimizationResults
}

function priorityVariant(index: number): 'warning' | 'info' | 'secondary' {
  if (index === 0) return 'warning'
  if (index === 1) return 'info'
  return 'secondary'
}

function priorityLabel(index: number): string {
  if (index === 0) return 'High'
  if (index === 1) return 'Medium'
  return 'Low'
}

export function SuggestionsPanel({ results }: SuggestionsPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-label uppercase text-ink-muted">
        <Sparkles className="h-4 w-4 text-accent" />
        Suggestions
      </h3>
      <div className="space-y-3" role="list" aria-label="Optimization suggestions">
        {results.suggestions && results.suggestions.length > 0 ? (
          results.suggestions.map((suggestion, index) => (
            <div
              key={index}
              role="listitem"
              className="mb-3 rounded-lg border border-line bg-surface p-4"
            >
              <Badge variant={priorityVariant(index)} className="mb-2">
                {priorityLabel(index)}
              </Badge>
              <p className="text-body-md text-ink-primary">{suggestion}</p>
            </div>
          ))
        ) : (
          <p className="text-body-sm text-ink-muted">No suggestions available.</p>
        )}
      </div>
    </div>
  )
}
