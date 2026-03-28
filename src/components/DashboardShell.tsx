'use client'

import { AppShell } from "@/components/AppShell"
import { StatsDashboard } from "@/components/StatsDashboard"

export function DashboardShell() {
  return (
    <AppShell>
      <div className="workspace-shell min-h-0">
        <StatsDashboard />
      </div>
    </AppShell>
  )
}
