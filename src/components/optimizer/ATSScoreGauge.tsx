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
  // Clamp score between 0-100
  const normalizedScore = Math.max(0, Math.min(100, score))
  
  // SVG dimensions based on size
  const dimensions = {
    sm: { width: 80, strokeWidth: 6, fontSize: 18 },
    md: { width: 140, strokeWidth: 10, fontSize: 32 },
    lg: { width: 200, strokeWidth: 14, fontSize: 48 },
  }
  
  const { width, strokeWidth, fontSize } = dimensions[size]
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  // Calculate stroke dashoffset for the progress
  const progress = (normalizedScore / 100) * circumference
  const dashOffset = circumference - progress

  // Color zones based on score
  const getScoreColor = (s: number) => {
    if (s >= 90) return { stroke: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)', label: 'Excellent' }
    if (s >= 75) return { stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', label: 'Good' }
    if (s >= 50) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', label: 'Fair' }
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'Needs Work' }
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
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Glow effect */}
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
        
        {/* Progress circle */}
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
      
      {/* Score text in center */}
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
          <span className="text-xs text-zinc-500 mt-1">{label}</span>
        )}
      </div>
    </div>
  )
}

// Score breakdown radar for multiple metrics
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

  // Calculate polygon points based on scores
  const points = metrics.map(({ key, angle }) => {
    const score = scores[key] / 100
    const radius = score * maxRadius
    const radians = (angle - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    }
  })

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circles */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <polygon
            key={i}
            points={metrics.map(({ angle }) => {
              const radius = scale * maxRadius
              const radians = (angle - 90) * (Math.PI / 180)
              return `${center + radius * Math.cos(radians)},${center + radius * Math.sin(radians)}`
            }).join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {metrics.map(({ angle }, i) => {
          const radians = (angle - 90) * (Math.PI / 180)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(radians)}
              y2={center + maxRadius * Math.sin(radians)}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          )
        })}

        {/* Score polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(124, 58, 237, 0.2)"
          stroke="rgba(124, 58, 237, 0.8)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Data points */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(124, 58, 237)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>

      {/* Labels */}
      {metrics.map(({ key, label, angle }) => {
        const radians = (angle - 90) * (Math.PI / 180)
        const labelRadius = maxRadius + 25
        const x = center + labelRadius * Math.cos(radians)
        const y = center + labelRadius * Math.sin(radians)
        
        return (
          <div
            key={key}
            className="absolute text-xs text-zinc-400 whitespace-nowrap"
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

// Score comparison badge
interface ScoreComparisonProps {
  score: number
  percentile: number
}

export function ScoreComparison({ score, percentile }: ScoreComparisonProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        percentile >= 75 ? "bg-emerald-500/20 text-emerald-400" :
        percentile >= 50 ? "bg-blue-500/20 text-blue-400" :
        percentile >= 25 ? "bg-amber-500/20 text-amber-400" :
        "bg-red-500/20 text-red-400"
      )}>
        Top {100 - percentile}%
      </div>
      <span className="text-zinc-500">
        Better than {percentile}% of applicants
      </span>
    </div>
  )
}

// Score delta indicator
interface ScoreDeltaProps {
  delta: number
}

export function ScoreDelta({ delta }: ScoreDeltaProps) {
  const isPositive = delta > 0
  const isZero = delta === 0

  if (isZero) {
    return <span className="text-zinc-500 text-sm">No change</span>
  }

  return (
    <div className={cn(
      "flex items-center gap-1 text-sm font-medium",
      isPositive ? "text-emerald-400" : "text-red-400"
    )}>
      <span>{isPositive ? '↑' : '↓'}</span>
      <span>{Math.abs(delta)} points</span>
    </div>
  )
}
