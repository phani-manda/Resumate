'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { saveAs } from 'file-saver'
import type { ResumeData } from './types'

interface UsePdfExportOptions {
  resumeData: ResumeData
}

interface UsePdfExportReturn {
  isDownloading: boolean
  handleDownloadPDF: () => Promise<void>
}

export function usePdfExport(options: UsePdfExportOptions): UsePdfExportReturn {
  const { resumeData } = options
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      toast.loading('Compiling document...', { id: 'pdf-download' })

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error || `Server returned ${response.status}`)
      }

      const blob = await response.blob()

      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf'

      saveAs(blob, fileName)
      toast.success('Document downloaded.', { id: 'pdf-download' })
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error(
        error instanceof Error ? error.message : 'Compilation failed',
        { id: 'pdf-download' }
      )
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    isDownloading,
    handleDownloadPDF,
  }
}
