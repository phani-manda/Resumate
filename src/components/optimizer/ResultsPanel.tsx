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

  return (
    <div className="h-full glass-panel rounded-3xl overflow-hidden border-white/10 shadow-2xl flex flex-col relative group">
      <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/10 to-transparent pointer-events-none" />
      <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between relative z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-300" /> Analysis Report
        </h2>
        {results && (
          <Badge 
            variant={results.atsScore >= 80 ? 'default' : 'secondary'} 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            {getScoreLabel(results.atsScore)} Match
          </Badge>
        )}
      </div>

      {!results ? (
        <EmptyResultsState />
      ) : (
        <ScrollArea className="flex-1 bg-black/20 relative z-10">
          <div className="p-6 space-y-6">
            <ScoreCard results={results} />
            <KeywordsPanel results={results} />
            <SuggestionsPanel results={results} />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
