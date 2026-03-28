'use client'

import { useState, RefObject } from 'react'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

interface UsePdfExportOptions {
  previewRef: RefObject<HTMLDivElement | null>
  fileName?: string
}

interface UsePdfExportReturn {
  isDownloading: boolean
  handleDownloadPDF: () => Promise<void>
}

export function usePdfExport(options: UsePdfExportOptions): UsePdfExportReturn {
  const { previewRef, fileName = 'Resume' } = options
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    if (!previewRef.current) {
      toast.error('Preview not available.')
      return
    }

    try {
      setIsDownloading(true)
      toast.loading('Compiling document...', { id: 'pdf-download' })

      const element = previewRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      const sanitizedFileName = fileName.replace(/\s+/g, '_')
      pdf.save(`${sanitizedFileName}_Resume.pdf`)
      
      toast.success('Document downloaded.', { id: 'pdf-download' })
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error('Compilation failed', { id: 'pdf-download' })
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    isDownloading,
    handleDownloadPDF,
  }
}
