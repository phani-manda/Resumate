'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { toast } from 'sonner'
import type { ResumeData } from './types'

interface UseFileUploadOptions {
  onSuccess?: (data: ResumeData) => void
  maxSizeMB?: number
}

interface UseFileUploadReturn {
  isUploading: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
  triggerFileSelect: () => void
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { onSuccess, maxSizeMB = 10 } = options
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file.')
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    try {
      setIsUploading(true)
      toast.loading('Parsing your resume...', { id: 'resume-upload' })

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/parse', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to parse resume')
      }

      const parsedData = await response.json()

      const resumeData: ResumeData = {
        personalInfo: {
          fullName: parsedData.personalInfo?.fullName || '',
          email: parsedData.personalInfo?.email || '',
          phone: parsedData.personalInfo?.phone || '',
          location: parsedData.personalInfo?.location || '',
          linkedin: parsedData.personalInfo?.linkedin || '',
          portfolio: parsedData.personalInfo?.portfolio || '',
        },
        summary: parsedData.summary || '',
        experiences: (parsedData.experiences || []).map((exp: any) => ({
          id: exp.id || Date.now().toString(),
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
        })),
        education: (parsedData.education || []).map((edu: any) => ({
          id: edu.id || Date.now().toString(),
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          graduationDate: edu.graduationDate || '',
        })),
        projects: (parsedData.projects || []).map((proj: any) => ({
          id: proj.id || Date.now().toString(),
          name: proj.name || '',
          description: proj.description || '',
          technologies: proj.technologies || [],
          link: proj.link || '',
        })),
        skills: parsedData.skills || [],
      }

      onSuccess?.(resumeData)
      toast.success('Resume parsed successfully! All sections populated.', { id: 'resume-upload' })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to parse resume', { id: 'resume-upload' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return {
    isUploading,
    fileInputRef,
    handleFileUpload,
    triggerFileSelect,
  }
}
