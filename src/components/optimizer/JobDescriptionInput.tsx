'use client'

import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Target } from 'lucide-react'

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="jobDescription" className="text-ink-primary font-medium flex items-center gap-2">
        <Target className="h-4 w-4 text-accent-text" /> Target Job Description
      </Label>
      <Textarea
        id="jobDescription"
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="resize-none"
        aria-label="Job description input"
      />
    </div>
  )
}
