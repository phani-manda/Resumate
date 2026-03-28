'use client'

import { AppShell } from "@/components/AppShell"
import { ResumeBuilder } from "@/components/ResumeBuilder"

export function BuilderShell() {
  return (
    <AppShell>
      <div className="flex flex-col h-full min-h-0 px-4 md:px-8 py-4 md:py-6 overflow-hidden">
        <ResumeBuilder />
      </div>
    </AppShell>
  )
}
