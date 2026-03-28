'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import type { Education } from './types'

interface EducationSectionProps {
  education: Education[]
  onAdd: () => void
  onRemove: (id: string) => void
  onUpdate: (id: string, field: keyof Education, value: string) => void
}

export function EducationSection({
  education,
  onAdd,
  onRemove,
  onUpdate,
}: EducationSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      {education.map((edu) => (
        <div 
          key={edu.id} 
          className="group relative p-4 rounded-lg bg-white/5 border border-white/5 transition-colors hover:border-white/10"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => onUpdate(edu.id, 'institution', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="Institution name"
            />
            <Input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="Degree"
            />
            <Input
              placeholder="Field of Study"
              value={edu.field}
              onChange={(e) => onUpdate(edu.id, 'field', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="Field of study"
            />
            <Input
              type="month"
              placeholder="Graduation Date"
              value={edu.graduationDate}
              onChange={(e) => onUpdate(edu.id, 'graduationDate', e.target.value)}
              className="bg-black/30 border-white/10 h-9"
              aria-label="Graduation date"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-opacity"
            onClick={() => onRemove(edu.id)}
            aria-label="Remove education"
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
        <Plus className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  )
}
