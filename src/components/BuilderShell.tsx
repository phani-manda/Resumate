'use client'

import { AppShell } from "@/components/AppShell"
import { ResumeBuilderRefactored } from "@/components/ResumeBuilderRefactored"

export function BuilderShell() {
  return (
    <AppShell>
      <div className="-m-6 flex h-[calc(100vh-3.5rem)] min-h-0 flex-col overflow-hidden p-6">
        <ResumeBuilderRefactored />
      </div>
    </AppShell>
  )
}
