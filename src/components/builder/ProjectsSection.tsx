'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Plus, Trash2 } from 'lucide-react'

import type { Project } from './types'

interface ProjectsSectionProps {
  projects: Project[]
  onAdd: () => void
  onRemove: (id: string) => void
  onUpdate: (id: string, field: keyof Project, value: string | string[]) => void
}

export function ProjectsSection({
  projects,
  onAdd,
  onRemove,
  onUpdate,
}: ProjectsSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="surface-soft group relative rounded-[22px] p-4 transition-all duration-150 ease-out hover:-translate-y-0.5"
        >
          <div className="grid gap-3">
            <Input
              placeholder="Project name"
              value={project.name}
              onChange={(event) => onUpdate(project.id, 'name', event.target.value)}
              className="h-10 bg-card/80"
              aria-label="Project name"
            />
            <Textarea
              placeholder="Describe the project impact and what you built..."
              value={project.description}
              onChange={(event) => onUpdate(project.id, 'description', event.target.value)}
              className="min-h-[96px] bg-card/80"
              aria-label="Project description"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Technologies (comma separated)"
                value={project.technologies.join(', ')}
                onChange={(event) =>
                  onUpdate(
                    project.id,
                    'technologies',
                    event.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
                className="h-10 bg-card/80"
                aria-label="Project technologies"
              />
              <Input
                placeholder="Project link"
                value={project.link ?? ''}
                onChange={(event) => onUpdate(project.id, 'link', event.target.value)}
                className="h-10 bg-card/80"
                aria-label="Project link"
              />
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-3 top-3 h-8 w-8 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-destructive/15 hover:text-destructive"
            onClick={() => onRemove(project.id)}
            aria-label="Remove project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        onClick={onAdd}
        variant="outline"
        size="sm"
        className="w-full rounded-2xl border-dashed"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  )
}
