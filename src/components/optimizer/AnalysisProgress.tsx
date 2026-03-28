'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalysisStep {
  id: string
  label: string
  duration: number
}

const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: 'reading', label: 'Reading your resume...', duration: 300 },
  { id: 'analyzing', label: 'Analyzing job requirements...', duration: 600 },
  { id: 'matching', label: 'Matching keywords...', duration: 800 },
  { id: 'calculating', label: 'Calculating ATS compatibility...', duration: 400 },
  { id: 'generating', label: 'Generating suggestions...', duration: 1200 },
  { id: 'finalizing', label: 'Finalizing report...', duration: 200 },
]

interface AnalysisProgressProps {
  isAnalyzing: boolean
  onComplete?: () => void
}

export function AnalysisProgress({ isAnalyzing, onComplete }: AnalysisProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStepIndex(-1)
      setCompletedSteps(new Set())
      return
    }

    setCurrentStepIndex(0)
    setCompletedSteps(new Set())

    let stepIndex = 0
    const runStep = () => {
      if (stepIndex >= ANALYSIS_STEPS.length) {
        onComplete?.()
        return
      }

      const step = ANALYSIS_STEPS[stepIndex]
      setCurrentStepIndex(stepIndex)

      setTimeout(() => {
        setCompletedSteps(prev => new Set(prev).add(step.id))
        stepIndex++
        runStep()
      }, step.duration)
    }

    runStep()
  }, [isAnalyzing, onComplete])

  if (!isAnalyzing && completedSteps.size === 0) {
    return null
  }

  return (
    <div className="space-y-3 py-4">
      <AnimatePresence mode="wait">
        {ANALYSIS_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isActive = currentStepIndex === index
          const isPending = !isCompleted && !isActive

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: isPending ? 0.4 : 1,
                x: 0,
              }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive && "bg-primary/10",
                isCompleted && "bg-emerald-500/5"
              )}
            >
              {/* Status indicator */}
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full transition-colors",
                isCompleted && "bg-emerald-500/20",
                isActive && "bg-primary/20",
                isPending && "bg-white/5"
              )}>
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-3 w-3 text-emerald-400" />
                  </motion.div>
                ) : isActive ? (
                  <Loader2 className="h-3 w-3 text-primary animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                )}
              </div>

              {/* Step label */}
              <span className={cn(
                "text-sm transition-colors",
                isCompleted && "text-emerald-400",
                isActive && "text-primary",
                isPending && "text-zinc-600"
              )}>
                {step.label}
              </span>

              {/* Completion time indicator */}
              {isCompleted && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto text-xs text-zinc-500"
                >
                  {step.duration}ms
                </motion.span>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Overall progress bar */}
      <div className="mt-4 px-4">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-400"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((completedSteps.size + (currentStepIndex >= 0 ? 0.5 : 0)) / ANALYSIS_STEPS.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-zinc-500 text-center mt-2">
          {completedSteps.size} of {ANALYSIS_STEPS.length} steps complete
        </p>
      </div>
    </div>
  )
}

// Minimal inline progress for compact UI
interface AnalysisProgressInlineProps {
  isAnalyzing: boolean
}

export function AnalysisProgressInline({ isAnalyzing }: AnalysisProgressInlineProps) {
  const [dotCount, setDotCount] = useState(1)

  useEffect(() => {
    if (!isAnalyzing) return

    const interval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1)
    }, 400)

    return () => clearInterval(interval)
  }, [isAnalyzing])

  if (!isAnalyzing) return null

  return (
    <div className="flex items-center gap-2 text-sm text-primary">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Analyzing{'.'.repeat(dotCount)}</span>
    </div>
  )
}
