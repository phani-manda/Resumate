'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Check, FileText, Briefcase, Code, GraduationCap, Sparkles } from 'lucide-react'

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  category: 'professional' | 'creative' | 'technical' | 'academic'
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  colors: {
    primary: string
    accent: string
    text: string
    background: string
  }
  layout: 'single-column' | 'two-column' | 'minimal'
  fonts: {
    heading: string
    body: string
  }
  preview?: string // Preview image URL
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Clean and traditional design for corporate roles',
    category: 'professional',
    icon: Briefcase,
    colors: {
      primary: '#1a1a2e',
      accent: '#4a5568',
      text: '#1a202c',
      background: '#ffffff',
    },
    layout: 'single-column',
    fonts: {
      heading: 'Georgia, serif',
      body: 'Arial, sans-serif',
    },
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Sleek, minimalist design with ample white space',
    category: 'creative',
    icon: Sparkles,
    colors: {
      primary: '#0f172a',
      accent: '#7c3aed',
      text: '#334155',
      background: '#ffffff',
    },
    layout: 'minimal',
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'Perfect for developers and IT professionals',
    category: 'technical',
    icon: Code,
    colors: {
      primary: '#0d1117',
      accent: '#238636',
      text: '#c9d1d9',
      background: '#161b22',
    },
    layout: 'two-column',
    fonts: {
      heading: 'JetBrains Mono, monospace',
      body: 'Inter, sans-serif',
    },
  },
  {
    id: 'academic',
    name: 'Academic CV',
    description: 'Comprehensive format for academic positions',
    category: 'academic',
    icon: GraduationCap,
    colors: {
      primary: '#1e3a5f',
      accent: '#2d4a6f',
      text: '#1a202c',
      background: '#ffffff',
    },
    layout: 'single-column',
    fonts: {
      heading: 'Times New Roman, serif',
      body: 'Georgia, serif',
    },
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Stand out with bold colors and modern layout',
    category: 'creative',
    icon: FileText,
    colors: {
      primary: '#7c3aed',
      accent: '#ec4899',
      text: '#18181b',
      background: '#fafafa',
    },
    layout: 'two-column',
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif',
    },
  },
]

interface TemplatePickerProps {
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
}

export function TemplatePicker({ selectedTemplate, onSelectTemplate }: TemplatePickerProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'professional', label: 'Professional' },
    { id: 'creative', label: 'Creative' },
    { id: 'technical', label: 'Technical' },
    { id: 'academic', label: 'Academic' },
  ]

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return RESUME_TEMPLATES
    return RESUME_TEMPLATES.filter(t => t.category === categoryFilter)
  }, [categoryFilter])

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={categoryFilter === category.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCategoryFilter(category.id)}
            className={cn(
              "rounded-full whitespace-nowrap",
              categoryFilter === category.id 
                ? "bg-primary text-white" 
                : "text-zinc-400 hover:text-white"
            )}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = template.icon
          const isSelected = selectedTemplate === template.id

          return (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTemplate(template.id)}
              className={cn(
                "relative p-4 rounded-xl border transition-all text-left",
                "hover:border-primary/50 hover:bg-primary/5",
                isSelected 
                  ? "border-primary bg-primary/10 ring-2 ring-primary/30" 
                  : "border-white/10 bg-white/5"
              )}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}

              {/* Template preview */}
              <div 
                className="w-full aspect-[210/297] rounded-lg mb-4 relative overflow-hidden"
                style={{ backgroundColor: template.colors.background }}
              >
                {/* Mini preview layout */}
                <div className="absolute inset-3 flex flex-col gap-2">
                  <div 
                    className="h-4 rounded"
                    style={{ backgroundColor: template.colors.primary, width: '60%' }}
                  />
                  <div 
                    className="h-2 rounded"
                    style={{ backgroundColor: template.colors.text, opacity: 0.3, width: '80%' }}
                  />
                  <div className="flex-1 space-y-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="h-1.5 rounded"
                        style={{ 
                          backgroundColor: template.colors.text, 
                          opacity: 0.15,
                          width: `${70 + Math.random() * 30}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Layout indicator */}
                <div className="absolute bottom-2 right-2">
                  <span 
                    className="text-[8px] px-1.5 py-0.5 rounded"
                    style={{ 
                      backgroundColor: template.colors.accent,
                      color: template.colors.background,
                    }}
                  >
                    {template.layout}
                  </span>
                </div>
              </div>

              {/* Template info */}
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${template.colors.accent}20` }}
                >
                  <Icon 
                    className="h-5 w-5" 
                    style={{ color: template.colors.accent }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{template.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{template.description}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Hook to get the current template's styles
export function useTemplateStyles(templateId: string) {
  const template = RESUME_TEMPLATES.find(t => t.id === templateId) || RESUME_TEMPLATES[0]

  return {
    template,
    styles: {
      '--template-primary': template.colors.primary,
      '--template-accent': template.colors.accent,
      '--template-text': template.colors.text,
      '--template-bg': template.colors.background,
      '--template-font-heading': template.fonts.heading,
      '--template-font-body': template.fonts.body,
    } as React.CSSProperties,
  }
}
