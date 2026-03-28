'use client'

import { Sparkles } from 'lucide-react'

export function EmptyResultsState() {
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/20 relative z-10"
      role="status"
      aria-label="Awaiting analysis input"
    >
      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <Sparkles className="h-10 w-10 text-zinc-500 relative z-10" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Ready for Input</h3>
      <p className="text-zinc-400 max-w-sm leading-relaxed">
        Provide your resume and target job description to initiate the AI compatibility analysis engine.
      </p>
    </div>
  )
}
