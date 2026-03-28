'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SectionConfig } from './types'

interface SectionWrapperProps {
  section: SectionConfig
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function SectionWrapper({ section, isExpanded, onToggle, children }: SectionWrapperProps) {
  const Icon = section.icon

  return (
    <div
      data-selected={isExpanded}
      className="card-selection glass-panel rounded-[26px]"
    >
      {/* Section Header */}
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`section-${section.id}`}
        className={cn(
          "group flex w-full items-center justify-between p-5 transition-all duration-150 ease-out",
          isExpanded 
            ? "bg-primary/10 text-primary" 
            : "text-foreground hover:bg-card/70"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 transition-transform duration-150 group-hover:scale-110" />
          <span className="font-medium">{section.label}</span>
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 transition-transform duration-200",
          isExpanded && "rotate-180"
        )} />
      </button>

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
            <div className="p-5 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
