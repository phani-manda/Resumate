'use client'

import { AppShell } from "@/components/AppShell"
import { CareerCoachChat } from "@/components/CareerCoachChat"

export function CoachShell() {
  return (
    <AppShell>
      <div className="flex flex-col h-full px-8 py-6">
        <CareerCoachChat />
      </div>
    </AppShell>
  )
}
