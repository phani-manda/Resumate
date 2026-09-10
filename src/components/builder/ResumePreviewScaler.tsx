'use client'

import { useState, useRef, useEffect, type RefObject } from 'react'
import { ResumePreview } from './ResumePreview'
import type { ResumeData } from './types'

interface ResumePreviewScalerProps {
  resumeData: ResumeData
  previewRef: RefObject<HTMLDivElement | null>
}

const A4_WIDTH_PX = 793 // 210mm at 96dpi

/**
 * Renders the true-size A4 resume preview and scales it with CSS `zoom`
 * so the full page fits the available width. This keeps the preview a
 * faithful 1:1 representation of the output resume — just smaller.
 */
export function ResumePreviewScaler({ resumeData, previewRef }: ResumePreviewScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.6)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateZoom = () => {
      const available = container.clientWidth - 48 // padding
      const next = Math.min(1, Math.max(0.35, available / A4_WIDTH_PX))
      setZoom(next)
    }

    updateZoom()

    const observer = new ResizeObserver(updateZoom)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-1 min-h-0 items-start justify-center overflow-auto p-6 scrollbar-thin"
    >
      <div
        style={{ zoom, transformOrigin: 'top center' }}
        className="shrink-0"
      >
        <ResumePreview ref={previewRef} resumeData={resumeData} />
      </div>
    </div>
  )
}