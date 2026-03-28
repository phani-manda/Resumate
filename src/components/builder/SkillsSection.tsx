'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface SkillsSectionProps {
  skills: string[]
  onAdd: (skill: string) => void
  onRemove: (skill: string) => void
}

export function SkillsSection({ skills, onAdd, onRemove }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAdd(newSkill)
      setNewSkill('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-black/30 border-white/10 h-9"
          aria-label="New skill"
        />
        <Button 
          onClick={handleAddSkill} 
          size="sm" 
          className="bg-primary hover:bg-primary/90 h-9"
          disabled={!newSkill.trim()}
        >
          Add
        </Button>
      </div>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Skills list">
          {skills.map((skill) => (
            <div 
              key={skill} 
              role="listitem"
              className="flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/20 px-3 py-1 transition-colors hover:bg-primary/30"
            >
              <span className="text-xs font-medium">{skill}</span>
              <button 
                onClick={() => onRemove(skill)} 
                className="hover:text-destructive transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 text-center py-4">
          No skills added yet. Start typing to add your first skill.
        </p>
      )}
    </div>
  )
}
