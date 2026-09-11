'use client'

import { FileSearch } from 'lucide-react'
import type { OptimizationResults } from './types'

interface ReviewPanelProps {
  results: OptimizationResults
}

/** The AI's overall assessment of the resume against the job description. */
export function ReviewPanel({ results }: ReviewPanelProps) {
  if (!results.review) return null

  return (
    <div
      className="rounded-xl border border-line bg-surface p-6"
      role="region"
      aria-label="Overall review"
    >
      <h3 className="mb-3 flex items-center gap-2 text-label uppercase text-ink-muted">
        <FileSearch className="h-4 w-4 text-accent" />
        Overall Review
      </h3>
      <p className="whitespace-pre-line text-body-md leading-relaxed text-ink-primary">
        {results.review}
      </p>
    </div>
  )
}