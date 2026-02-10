'use client'

import { AppShell } from "@/components/AppShell"
import { AIOptimizer } from "@/components/AIOptimizer"

export function OptimizerShell() {
  return (
    <AppShell>
      <div className="flex flex-col h-full px-8 py-6">
        <AIOptimizer />
      </div>
    </AppShell>
  )
}
