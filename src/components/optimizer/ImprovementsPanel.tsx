'use client'

import { Wand2 } from 'lucide-react'
import type { OptimizationResults } from './types'

interface ImprovementsPanelProps {
  results: OptimizationResults
}

/** Side-by-side before/after rewrites suggested by the AI. */
export function ImprovementsPanel({ results }: ImprovementsPanelProps) {
  if (results.improvements.length === 0) return null

  return (
    <div className="space-y-4" role="region" aria-label="Suggested rewrites">
      <h3 className="flex items-center gap-2 text-label uppercase text-ink-muted">
        <Wand2 className="h-4 w-4 text-accent" />
        Suggested Rewrites
      </h3>

      {results.improvements.map((item, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-xl border border-line bg-surface"
        >
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
            <span className="text-body-md font-medium text-ink-primary">{item.issue}</span>
            <span
              className={
                item.impact === 'high'
                  ? 'rounded-full bg-danger/10 px-3 py-1 text-body-sm text-danger'
                  : item.impact === 'medium'
                    ? 'rounded-full bg-warning/10 px-3 py-1 text-body-sm text-warning'
                    : 'rounded-full bg-accent/10 px-3 py-1 text-body-sm text-accent'
              }
            >
              {item.impact}
            </span>
          </header>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-label uppercase text-ink-muted">Before</h4>
              <p className="whitespace-pre-line rounded-lg bg-subtle p-3 text-body-md text-ink-secondary">
                {item.before}
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-label uppercase text-ink-muted">After</h4>
              <p className="whitespace-pre-line rounded-lg border border-accent/30 bg-accent/5 p-3 text-body-md text-ink-primary">
                {item.after}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}