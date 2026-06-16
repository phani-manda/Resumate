'use client'

import { AppShell } from "@/components/AppShell"
import { AIOptimizerRefactored } from "@/components/AIOptimizerRefactored"

export function OptimizerShell() {
  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] min-h-0 overflow-hidden">
        <AIOptimizerRefactored />
      </div>
    </AppShell>
  )
}
