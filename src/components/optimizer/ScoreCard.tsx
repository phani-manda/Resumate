'use client'

import { ATSScoreGauge, ScoreComparison } from './ATSScoreGauge'
import type { OptimizationResults } from './types'

interface ScoreCardProps {
  results: OptimizationResults
}

export function ScoreCard({ results }: ScoreCardProps) {
  const percentile = Math.max(8, Math.min(97, Math.round(results.atsScore * 0.92)))

  return (
    <div
      className="rounded-xl border border-line bg-surface p-6"
      role="region"
      aria-label="ATS compatibility score"
    >
      <h3 className="mb-6 text-label uppercase text-ink-muted">ATS Score</h3>
      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:justify-start">
          <ATSScoreGauge score={results.atsScore} size="lg" />
        </div>
        <div className="space-y-4">
          <p className="text-body-sm text-ink-secondary">
            A higher score means your resume language is closer to the target role.
          </p>
          <ScoreComparison score={results.atsScore} percentile={percentile} />
        </div>
      </div>
    </div>
  )
}
