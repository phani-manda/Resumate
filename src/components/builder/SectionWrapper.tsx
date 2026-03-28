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
    <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
      {/* Section Header */}
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`section-${section.id}`}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-all",
          isExpanded 
            ? "bg-primary/10 text-primary" 
            : "hover:bg-white/5 text-white"
        )}
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
