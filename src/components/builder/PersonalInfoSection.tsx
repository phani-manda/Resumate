'use client'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import type { PersonalInfo } from './types'

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo
  summary: string
  onPersonalInfoChange: (field: keyof PersonalInfo, value: string) => void
  onSummaryChange: (value: string) => void
}

const personalFields: { id: keyof PersonalInfo; label: string; type?: string }[] = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'phone', label: 'Phone' },
  { id: 'location', label: 'Location' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'portfolio', label: 'Portfolio' },
]

export function PersonalInfoSection({
  personalInfo,
  summary,
  onPersonalInfoChange,
  onSummaryChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 pt-4">
      {personalFields.map((field) => (
        <div key={field.id} className="space-y-1">
          <Label htmlFor={`personal-${field.id}`} className="text-zinc-400 text-xs">
            {field.label}
          </Label>
          <Input
            id={`personal-${field.id}`}
            type={field.type || 'text'}
            value={personalInfo[field.id]}
            onChange={(e) => onPersonalInfoChange(field.id, e.target.value)}
            className="bg-black/30 border-white/10 focus:border-primary/50 text-white h-9"
          />
        </div>
      ))}
      <div className="col-span-2 space-y-1">
        <Label htmlFor="summary" className="text-zinc-400 text-xs">
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          rows={3}
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Write a brief professional summary..."
          className="bg-black/30 border-white/10 focus:border-primary/50 text-white resize-none"
        />
      </div>
    </div>
  )
}
