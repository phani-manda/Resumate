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
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`section-${section.id}`}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 transition-colors",
          isExpanded ? "bg-accent-subtle text-accent-text" : "text-ink-primary hover:bg-subtle"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span className="text-heading-lg font-semibold">{section.label}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`section-${section.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
