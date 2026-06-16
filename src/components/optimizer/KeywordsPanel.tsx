'use client'

import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { OptimizationResults } from './types'

interface KeywordsPanelProps {
  results: OptimizationResults
}

export function KeywordsPanel({ results }: KeywordsPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <h4 className="mb-3 text-label uppercase text-ink-muted">Matched Keywords</h4>
        <div className="flex flex-wrap gap-2 rounded-lg border border-line bg-surface p-4">
          {results.matchedKeywords && results.matchedKeywords.length > 0 ? (
            results.matchedKeywords.map((keyword) => (
              <Badge key={keyword} variant="success">
                {keyword}
              </Badge>
            ))
          ) : (
            <p className="text-body-sm text-ink-muted">No matches yet</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-label uppercase text-ink-muted">Missing Keywords</h4>
        <div className="flex flex-wrap gap-2 rounded-lg border border-line bg-surface p-4">
          {results.missingKeywords && results.missingKeywords.length > 0 ? (
            results.missingKeywords.map((keyword) => (
              <Badge key={keyword} variant="danger">
                {keyword}
              </Badge>
            ))
          ) : (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-body-sm">All critical keywords present</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
