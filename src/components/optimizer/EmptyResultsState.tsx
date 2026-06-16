'use client'

import { Sparkles } from 'lucide-react'

export function EmptyResultsState() {
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
      role="status"
      aria-label="Awaiting analysis input"
    >
      <div className="w-24 h-24 rounded-full bg-subtle border border-line flex items-center justify-center mb-6 relative">
        <Sparkles className="h-10 w-10 text-ink-muted" />
      </div>
      <h3 className="text-xl font-bold text-ink-primary mb-2">Ready for Input</h3>
      <p className="text-ink-secondary max-w-sm leading-relaxed">
        Provide your resume and target job description to initiate the AI compatibility analysis engine.
      </p>
    </div>
  )
}
