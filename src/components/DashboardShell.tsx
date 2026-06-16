'use client'

import { AppShell } from "@/components/AppShell"
import { StatsDashboard } from "@/components/StatsDashboard"

export function DashboardShell() {
  return (
    <AppShell>
      <StatsDashboard />
    </AppShell>
  )
}
