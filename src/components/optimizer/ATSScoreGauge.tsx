'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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

  const getScoreColor = (value: number) => {
    if (value >= 90) {
      return { stroke: '#ff7a1a', glow: 'rgba(255, 122, 26, 0.42)', label: 'Excellent' }
    }
    if (value >= 75) {
      return { stroke: '#ff9d47', glow: 'rgba(255, 157, 71, 0.38)', label: 'Strong' }
    }
    if (value >= 50) {
      return { stroke: '#f5b15e', glow: 'rgba(245, 177, 94, 0.35)', label: 'Fair' }
    }
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.35)', label: 'Needs Work' }
  }

  const { stroke, glow, label } = getScoreColor(normalizedScore)

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${width}`}
        className="transform -rotate-90"
      >
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={glow}
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ filter: 'blur(8px)' }}
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
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-black tracking-tight"
          style={{ fontSize, color: stroke }}
          initial={animated ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'backOut' }}
        >
          {normalizedScore}
        </motion.span>
        {showLabel && size !== 'sm' && (
          <span className="mt-1 text-xs text-zinc-500">{label}</span>
        )}
      </div>
    </div>
  )
}

interface ScoreBreakdownProps {
  scores: {
    keywords: number
    format: number
    length: number
    readability: number
    impact: number
  }
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const metrics = [
    { key: 'keywords', label: 'Keywords', angle: 0 },
    { key: 'format', label: 'Format', angle: 72 },
    { key: 'length', label: 'Length', angle: 144 },
    { key: 'readability', label: 'Readability', angle: 216 },
    { key: 'impact', label: 'Impact', angle: 288 },
  ] as const

  const size = 200
  const center = size / 2
  const maxRadius = 80

  const points = metrics.map(({ key, angle }) => {
    const ratio = scores[key] / 100
    const radius = ratio * maxRadius
    const radians = (angle - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    }
  })

  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.25, 0.5, 0.75, 1].map((scale, index) => (
          <polygon
            key={index}
            points={metrics
              .map(({ angle }) => {
                const radius = scale * maxRadius
                const radians = (angle - 90) * (Math.PI / 180)
                return `${center + radius * Math.cos(radians)},${center + radius * Math.sin(radians)}`
              })
              .join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {metrics.map(({ angle }, index) => {
          const radians = (angle - 90) * (Math.PI / 180)
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(radians)}
              y2={center + maxRadius * Math.sin(radians)}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          )
        })}

        <motion.polygon
          points={polygonPoints}
          fill="rgba(255, 122, 26, 0.18)"
          stroke="rgba(255, 122, 26, 0.8)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        />

        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(255, 122, 26)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>

      {metrics.map(({ key, label, angle }) => {
        const radians = (angle - 90) * (Math.PI / 180)
        const labelRadius = maxRadius + 25
        const x = center + labelRadius * Math.cos(radians)
        const y = center + labelRadius * Math.sin(radians)

        return (
          <div
            key={key}
            className="absolute whitespace-nowrap text-xs text-zinc-400"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}

interface ScoreComparisonProps {
  score: number
  percentile: number
}

export function ScoreComparison({ score, percentile }: ScoreComparisonProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={cn(
          'rounded-full px-2 py-1 text-xs font-medium',
          percentile >= 75
            ? 'bg-orange-500/20 text-orange-300'
            : percentile >= 50
              ? 'bg-orange-400/20 text-orange-200'
              : percentile >= 25
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
        )}
      >
        Top {100 - percentile}%
      </div>
      <span className="text-zinc-500">
        Better than {percentile}% of applicants
      </span>
    </div>
  )
}

interface ScoreDeltaProps {
  delta: number
}

export function ScoreDelta({ delta }: ScoreDeltaProps) {
  if (delta === 0) {
    return <span className="text-sm text-zinc-500">No change</span>
  }

  const positive = delta > 0

  return (
    <div className={cn('flex items-center gap-1 text-sm font-medium', positive ? 'text-orange-300' : 'text-red-400')}>
      <span>{positive ? '+' : '-'}</span>
      <span>{Math.abs(delta)} points</span>
    </div>
  )
}
