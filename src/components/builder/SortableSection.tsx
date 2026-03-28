'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SectionConfig } from './types'

interface SortableSectionProps {
  section: SectionConfig
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  isDragging?: boolean
}

export function SortableSection({
  section,
  isExpanded,
  onToggle,
  children,
  isDragging = false,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Icon = section.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-white/10 overflow-hidden bg-black/20 transition-shadow",
        isSorting && "shadow-lg shadow-primary/20 ring-2 ring-primary/30",
        isDragging && "opacity-50"
      )}
    >
      {/* Section Header with Drag Handle */}
      <div
        className={cn(
          "flex items-center transition-all",
          isExpanded 
            ? "bg-primary/10 text-primary" 
            : "hover:bg-white/5 text-white"
        )}
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-4 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors touch-none"
          aria-label={`Drag to reorder ${section.label}`}
        >
          <GripVertical className="h-4 w-4 text-zinc-500" />
        </button>

        {/* Section Toggle Button */}
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-between p-4 pl-0"
          aria-expanded={isExpanded}
          aria-controls={`section-${section.id}`}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{section.label}</span>
          </div>
          <ChevronDown className={cn(
            "h-5 w-5 transition-transform duration-200",
            isExpanded && "rotate-180"
          )} />
        </button>
      </div>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`section-${section.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
