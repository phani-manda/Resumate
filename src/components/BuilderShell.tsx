'use client'

import { AppShell } from "@/components/AppShell"
import { ResumeBuilder } from "@/components/ResumeBuilder"

export function BuilderShell() {
  return (
    <AppShell>
      <div className="flex flex-col h-full px-8 py-6">
        <ResumeBuilder />
      </div>
    </AppShell>
  )
}
