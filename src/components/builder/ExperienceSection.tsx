'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import type { Experience } from './types'

interface ExperienceSectionProps {
  experiences: Experience[]
  onAdd: () => void
  onRemove: (id: string) => void
  onUpdate: (id: string, field: keyof Experience, value: string) => void
}

export function ExperienceSection({
  experiences,
  onAdd,
  onRemove,
  onUpdate,
}: ExperienceSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      {experiences.map((exp) => (
        <div 
          key={exp.id} 
          className="group relative p-4 rounded-lg bg-white/5 border border-white/5 transition-colors hover:border-white/10"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Company"
              value={exp.company}
              onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="Company name"
            />
            <Input
              placeholder="Position"
              value={exp.position}
              onChange={(e) => onUpdate(exp.id, 'position', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="Job position"
            />
            <Input
              type="month"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) => onUpdate(exp.id, 'startDate', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="Start date"
            />
            <Input
              type="month"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) => onUpdate(exp.id, 'endDate', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="End date"
            />
            <div className="col-span-2">
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => onUpdate(exp.id, 'description', e.target.value)}
                className="bg-black/30 border-white/10 min-h-[80px]"
                aria-label="Job description"
              />
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-opacity"
            onClick={() => onRemove(exp.id)}
            aria-label="Remove experience"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        onClick={onAdd}
        variant="outline"
        size="sm"
        className="w-full border-dashed border-white/20 hover:bg-white/5"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  )
}
