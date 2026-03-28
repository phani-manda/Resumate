'use client'

import { Progress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'
import type { OptimizationResults } from './types'

interface ScoreCardProps {
  results: OptimizationResults
}

export function ScoreCard({ results }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div 
      className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden"
      role="region"
      aria-label="ATS compatibility score"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2" />
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
        ATS Compatibility Score
      </h3>
      <div className="flex items-end gap-3 mb-2">
        <span 
          className={cn("text-6xl font-black tracking-tighter", getScoreColor(results.atsScore))}
          aria-label={`Score: ${results.atsScore} out of 100`}
        >
          {results.atsScore}
        </span>
        <span className="text-xl text-zinc-500 font-light mb-3">/ 100</span>
      </div>
      <Progress 
        value={results.atsScore} 
        className="h-2 bg-white/10" 
        indicatorClassName={getProgressColor(results.atsScore)} 
      />
    </div>
  )
}
