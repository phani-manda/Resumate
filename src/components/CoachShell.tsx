'use client'

import { AppShell } from "@/components/AppShell"
import { CareerCoachChat } from "@/components/CareerCoachChat"

export function CoachShell() {
  return (
    <AppShell>
      <div className="workspace-shell min-h-0 overflow-hidden">
        <CareerCoachChat />
      </div>
    </AppShell>
  )
}
