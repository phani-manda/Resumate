'use client'

import { AppShell } from "@/components/AppShell"
import { AIOptimizer } from "@/components/AIOptimizer"

export function OptimizerShell() {
  return (
    <AppShell>
      <div className="workspace-shell min-h-0 overflow-hidden">
        <AIOptimizer />
      </div>
    </AppShell>
  )
}
