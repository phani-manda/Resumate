'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import type {
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
  Project,
  UseResumeBuilderReturn,
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

/**
 * Builds a full ResumeData object from an API response, falling back to
 * defaults for fields that may be missing from older records.
 */
function normalizeResumeData(data: Partial<ResumeData> | undefined): ResumeData {
  if (!data) return DEFAULT_RESUME_DATA

  return {
    ...DEFAULT_RESUME_DATA,
    ...data,
    personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, ...(data.personalInfo ?? {}) },
    experiences: data.experiences ?? [],
    education: data.education ?? [],
    projects: data.projects ?? [],
    skills: data.skills ?? [],
  }
}

export function useResumeBuilder(initialResumeId?: string | null): UseResumeBuilderReturn {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA)
  const [resumeId, setResumeId] = useState<string | null>(initialResumeId ?? null)
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(initialResumeId))
  const [isSaving, setIsSaving] = useState(false)
  // Guards the debounced autosave from firing while data is being fetched.
  const isHydrating = useRef<boolean>(Boolean(initialResumeId))
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load an existing resume when the builder is opened with ?id=<resumeId>.
  useEffect(() => {
    if (!initialResumeId) return

    let cancelled = false

    fetch(`/api/resumes/${initialResumeId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to load resume')
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        setResumeData(normalizeResumeData(data))
        setResumeId(initialResumeId)
      })
      .catch((loadError) => {
        if (cancelled) return
        console.error('Failed to load resume:', loadError)
        toast.error('Could not load this resume')
      })
      .finally(() => {
        if (cancelled) return
        isHydrating.current = false
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [initialResumeId])

  const persistResume = useCallback(async (): Promise<void> => {
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
  }, [resumeData, resumeId])

  // Debounced auto-save — silent; the header status dot reflects the state.
  useEffect(() => {
    if (isHydrating.current) return
    if (!resumeData.personalInfo.fullName && !resumeData.personalInfo.email) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)
        await persistResume()
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [resumeData, persistResume])

  const handleManualSave = async () => {
    if (!resumeData.personalInfo.fullName && !resumeData.personalInfo.email) {
      toast.error('Add at least a name or email to save your resume.')
      return
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    try {
      setIsSaving(true)
      await persistResume()
      toast.success('Resume saved.')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Could not save this resume.')
    } finally {
      setIsSaving(false)
    }
  }

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }))
  }

  const updateSummary = (value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }))
  }

  // Generates a unique-but-stable id for new list entries.
  const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  // Experience handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { id: newId('exp'), company: '', position: '', startDate: '', endDate: '', description: '' },
      ],
    }))
  }

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp),
    }))
  }

  // Education handlers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: newId('edu'), institution: '', degree: '', field: '', graduationDate: '' },
      ],
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu),
    }))
  }

  // Project handlers
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects ?? []),
        { id: newId('proj'), name: '', description: '', technologies: [], link: '' },
      ],
    }))
  }

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects ?? []).filter(proj => proj.id !== id),
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: (prev.projects ?? []).map(proj => proj.id === id ? { ...proj, [field]: value } : proj),
    }))
  }

  // Skill handlers
  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }))
    }
  }

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }))
  }

  return {
    resumeData,
    setResumeData,
    resumeId,
    isSaving,
    isLoading,
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