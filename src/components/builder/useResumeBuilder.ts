'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import type { 
  ResumeData, 
  PersonalInfo, 
  Experience, 
  Education, 
  Project,
  SaveStatus,
  UseResumeBuilderReturn 
} from './types'

const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experiences: [],
  education: [],
  projects: [],
  skills: [],
}

export function useResumeBuilder(initialResumeId?: string | null): UseResumeBuilderReturn {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA)
  const [resumeId, setResumeId] = useState<string | null>(initialResumeId ?? null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-save with debounce
  const handleAutoSave = useCallback(async () => {
    if (!resumeData.personalInfo.fullName && !resumeData.personalInfo.email) {
      return
    }

    try {
      setIsSaving(true)
      setSaveStatus('saving')
      const endpoint = resumeId ? `/api/resumes/${resumeId}` : '/api/resumes'
      const method = resumeId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      })

      if (!response.ok) throw new Error('Failed to save resume')

      const savedResume = await response.json()
      if (!resumeId) {
        setResumeId(savedResume.id)
      }
      setSaveStatus('saved')
      toast.success('Resume auto-saved')
    } catch (error) {
      console.error('Auto-save failed:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }, [resumeData, resumeId])

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave()
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [resumeData, handleAutoSave])

  const handleManualSave = async () => {
    if (!resumeData.personalInfo.fullName && !resumeData.personalInfo.email) {
      toast.error('Brief requirement: Name or Email needed.')
      return
    }

    try {
      setIsSaving(true)
      setSaveStatus('saving')
      const endpoint = resumeId ? `/api/resumes/${resumeId}` : '/api/resumes'
      const method = resumeId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      })

      if (!response.ok) throw new Error('Failed to save resume')

      const savedResume = await response.json()
      if (!resumeId) {
        setResumeId(savedResume.id)
      }
      setSaveStatus('saved')
      toast.success('Resume sequence saved.')
    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('error')
      toast.error('Save sequence failed.')
    } finally {
      setIsSaving(false)
    }
  }

  // Personal info
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateSummary = (value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }))
  }

  // Experience handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }))
  }

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }))
  }

  // Education handlers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          graduationDate: '',
        },
      ],
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }))
  }

  // Project handlers
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          technologies: [],
          link: '',
        },
      ],
    }))
  }

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((proj) => proj.id !== id),
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects || []).map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }))
  }

  // Skill handlers
  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  return {
    resumeData,
    setResumeData,
    resumeId,
    saveStatus,
    isSaving,
    handleManualSave,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    removeExperience,
    updateExperience,
    addEducation,
    removeEducation,
    updateEducation,
    addProject,
    removeProject,
    updateProject,
    addSkill,
    removeSkill,
  }
}
