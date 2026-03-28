'use client'

import { AppShell } from "@/components/AppShell"
import { ResumeBuilder } from "@/components/ResumeBuilder"

export function BuilderShell() {
  return (
    <AppShell>
      <div className="workspace-shell min-h-0 overflow-hidden">
        <ResumeBuilder />
      </div>
    </AppShell>
  )
}
