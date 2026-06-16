'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface ATSScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export function ATSScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
}: ATSScoreGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, score))

  const dimensions = {
    sm: { width: 80, strokeWidth: 6, fontSize: 18 },
    md: { width: 140, strokeWidth: 10, fontSize: 32 },
    lg: { width: 200, strokeWidth: 14, fontSize: 48 },
  }

  const { width, strokeWidth, fontSize } = dimensions[size]
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (normalizedScore / 100) * circumference
  const dashOffset = circumference - progress

  const getScoreStyle = (value: number) => {
    if (value >= 80) {
      return {
        stroke: 'var(--success)',
        label: 'Excellent',
        badge: 'success' as const,
      }
    }
    if (value >= 60) {
      return {
        stroke: 'var(--warning)',
        label: 'Good',
        badge: 'warning' as const,
      }
    }
    return {
      stroke: 'var(--danger)',
      label: 'Needs Work',
      badge: 'danger' as const,
    }
  }

  const { stroke, label, badge } = getScoreStyle(normalizedScore)

  return (
    <div className="relative inline-flex flex-col items-center gap-3">
      <svg
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${width}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-subtle)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: dashOffset }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-bold tracking-tight text-ink-primary"
          style={{ fontSize }}
          initial={animated ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {normalizedScore}
        </motion.span>
      </div>

      {showLabel && size !== 'sm' && (
        <>
          <Badge variant={badge}>{label}</Badge>
          <p className="text-caption text-ink-muted">ATS compatibility score</p>
        </>
      )}
    </div>
  )
}

interface ScoreComparisonProps {
  score: number
  percentile: number
}

export function ScoreComparison({ score, percentile }: ScoreComparisonProps) {
  return (
    <div className="flex items-center gap-2 text-body-sm">
      <Badge variant={percentile >= 50 ? 'success' : 'warning'}>
        Top {100 - percentile}%
      </Badge>
      <span className="text-ink-muted">
        Better than {percentile}% of applicants
      </span>
    </div>
  )
}
