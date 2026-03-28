'use client'

import { Sparkles } from 'lucide-react'
import type { OptimizationResults } from './types'

interface SuggestionsPanelProps {
  results: OptimizationResults
}

export function SuggestionsPanel({ results }: SuggestionsPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-400" /> Optimization Protocol
      </h3>
      <div className="space-y-3" role="list" aria-label="Optimization suggestions">
        {results.suggestions && results.suggestions.length > 0 ? (
          results.suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              role="listitem"
              className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                {index + 1}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{suggestion}</p>
            </div>
          ))
        ) : (
          <p className="text-zinc-500 text-sm">No suggestions available.</p>
        )}
      </div>
    </div>
  )
}
