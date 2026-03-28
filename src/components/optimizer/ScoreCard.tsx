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
      className="surface-soft rounded-[26px] p-6 md:p-7"
      role="region"
      aria-label="ATS compatibility score"
    >
      <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        ATS Compatibility Score
      </h3>
      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:justify-start">
          <ATSScoreGauge score={results.atsScore} size="md" />
        </div>
        <div className="space-y-4">
          <p className="text-sm leading-7 text-muted-foreground">
            A higher score usually means your resume language is closer to the wording and priorities in the target role.
          </p>
          <ScoreComparison score={results.atsScore} percentile={percentile} />
        </div>
      </div>
    </div>
  )
}
