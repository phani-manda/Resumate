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
      <Label htmlFor="jobDescription" className="text-zinc-300 font-medium flex items-center gap-2">
        <Target className="h-4 w-4 text-purple-400" /> Target Job Description
      </Label>
      <div className="relative group/input">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition duration-500" />
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="relative bg-black/40 border-white/10 focus:border-purple-500/50 text-white placeholder:text-zinc-500 resize-none rounded-2xl p-4"
          aria-label="Job description input"
        />
      </div>
    </div>
  )
}
