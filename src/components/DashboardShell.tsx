'use client'

import { AppShell } from "@/components/AppShell"
import { StatsDashboard } from "@/components/StatsDashboard"

export function DashboardShell() {
  return (
    <AppShell>
      <div className="flex flex-col h-full px-8 py-6">
        <StatsDashboard />
      </div>
    </AppShell>
  )
}
