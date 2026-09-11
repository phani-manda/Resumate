'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import type {
  OptimizationResults,
  PersonalInfo,
  Experience,
  Education,
  Project,
  ParsedResume,
  SavedResumeSummary,
  ViewMode,
  UseOptimizerReturn
} from './types'

const EMPTY_PERSONAL_INFO: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  portfolio: ''
}

export function useOptimizer(): UseOptimizerReturn {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<OptimizationResults | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('sections')

  // Previous work — the resume being optimized and its saved instances.
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null)
  const [savedResumes, setSavedResumes] = useState<SavedResumeSummary[]>([])
  const [isLoadingResumes, setIsLoadingResumes] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Supports /optimizer?resume=<id> links from the dashboard.
  const searchParams = useSearchParams()
  const resumeIdParam = searchParams.get('resume')
  const handledResumeParam = useRef(false)

  const buildResumeText = (resume: ParsedResume): string => {
    const lines: string[] = []
    
    if (resume.personalInfo.fullName) lines.push(resume.personalInfo.fullName)
    const contactParts = [
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.location
    ].filter(Boolean)
    if (contactParts.length) lines.push(contactParts.join(' | '))
    if (resume.personalInfo.linkedin) lines.push(resume.personalInfo.linkedin)
    if (resume.personalInfo.portfolio) lines.push(resume.personalInfo.portfolio)
    
    if (resume.summary) {
      lines.push('\n--- PROFESSIONAL SUMMARY ---')
      lines.push(resume.summary)
    }
    
    if (resume.experiences.length > 0) {
      lines.push('\n--- EXPERIENCE ---')
      resume.experiences.forEach(exp => {
        lines.push(`\n${exp.position} at ${exp.company}`)
        lines.push(`${exp.startDate} - ${exp.endDate || 'Present'}`)
        if (exp.description) lines.push(exp.description)
      })
    }
    
    if (resume.education.length > 0) {
      lines.push('\n--- EDUCATION ---')
      resume.education.forEach(edu => {
        lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''} - ${edu.institution}`)
        if (edu.graduationDate) lines.push(`Graduated: ${edu.graduationDate}`)
      })
    }
    
    if (resume.projects && resume.projects.length > 0) {
      lines.push('\n--- PROJECTS ---')
      resume.projects.forEach(proj => {
        lines.push(`\n${proj.name}`)
        if (proj.description) lines.push(proj.description)
        if (proj.technologies.length > 0) lines.push(`Technologies: ${proj.technologies.join(', ')}`)
        if (proj.link) lines.push(`Link: ${proj.link}`)
      })
    }
    
    if (resume.skills.length > 0) {
      lines.push('\n--- SKILLS ---')
      lines.push(resume.skills.join(', '))
    }
    
    return lines.join('\n')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword'
    ]
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setUploadedFile(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/parse', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      
      setParsedResume({
        personalInfo: data.personalInfo || {
          fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: ''
        },
        summary: data.summary || '',
        experiences: data.experiences || [],
        education: data.education || [],
        projects: data.projects || [],
        skills: data.skills || [],
        rawText: data.rawText || '',
      })
      
      setResumeText(data.rawText || '')
      setViewMode('sections')
      toast.success(`${file.name} parsed successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
      // Clear the input so the same file can be re-selected after edits.
      event.target.value = ''
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setResumeText('')
    setParsedResume(null)
  }

  const handleAnalyze = async () => {
    const textToAnalyze = viewMode === 'sections' && parsedResume
      ? buildResumeText(parsedResume)
      : resumeText

    if (!jobDescription.trim() || !textToAnalyze.trim()) {
      toast.error('Input missing: Job Description and Resume required.')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText: textToAnalyze }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Analysis failed')
      }

      const data = await response.json()
      setResults({
        atsScore: data.atsScore || 0,
        missingKeywords: data.missingKeywords || [],
        matchedKeywords: data.matchedKeywords || [],
        review: typeof data.review === 'string' ? data.review : null,
        improvements: Array.isArray(data.improvements) ? data.improvements : [],
        suggestions: data.suggestions || [],
      })
      toast.success('Analysis complete.')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error instanceof Error ? error.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // ===== Previous work — persistence ========================================

  /** Maps an API resume record to the editor's ParsedResume state. */
  const mapResumeToState = useCallback(
    (data: Record<string, unknown>): ParsedResume => {
      const info = (data.personalInfo ?? {}) as Partial<PersonalInfo>
      const resume: ParsedResume = {
        personalInfo: { ...EMPTY_PERSONAL_INFO, ...info },
        summary: (data.summary as string) ?? '',
        experiences: Array.isArray(data.experiences)
          ? (data.experiences as Experience[])
          : [],
        education: Array.isArray(data.education) ? (data.education as Education[]) : [],
        projects: Array.isArray(data.projects) ? (data.projects as Project[]) : [],
        skills: Array.isArray(data.skills) ? (data.skills as string[]) : [],
        rawText: '',
      }
      // Rebuild raw text so the "Raw Text" view is populated when loading.
      resume.rawText = buildResumeText(resume)
      return resume
    },
    []
  )

  /** Loads the list of saved resumes for the "Previous Work" menu. */
  const refreshSavedResumes = useCallback(async () => {
    setIsLoadingResumes(true)
    try {
      const response = await fetch('/api/resumes')
      if (!response.ok) return
      const data = await response.json()
      if (Array.isArray(data)) {
        setSavedResumes(
          data.map((resume: { id: string; title?: string | null; updatedAt: string; atsScore?: number | null }) => ({
            id: resume.id,
            title: resume.title ?? null,
            updatedAt: resume.updatedAt,
            atsScore: resume.atsScore ?? null,
          }))
        )
      }
    } catch (error) {
      console.error('Failed to load saved resumes:', error)
    } finally {
      setIsLoadingResumes(false)
    }
  }, [])

  // Keeps the saved list fresh on mount.
  useEffect(() => {
    void refreshSavedResumes()
  }, [refreshSavedResumes])

  // Loads ?resume=<id> once (dashboard "Optimize" links).
  useEffect(() => {
    if (!resumeIdParam || handledResumeParam.current) return
    handledResumeParam.current = true

    let cancelled = false
    void (async () => {
      try {
        const response = await fetch(`/api/resumes/${resumeIdParam}`)
        if (!response.ok) throw new Error('Failed to load resume')
        const data = await response.json()
        if (cancelled) return
        setParsedResume(mapResumeToState(data))
        setActiveResumeId(resumeIdParam)
        setViewMode('sections')
        toast.success('Resume loaded from your previous work')
      } catch (error) {
        if (cancelled) return
        console.error('Failed to load resume:', error)
        toast.error('Could not load this resume')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [resumeIdParam, mapResumeToState])

  // ===== Resume editing handlers ============================================

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      personalInfo: { ...parsedResume.personalInfo, [field]: value }
    })
  }

  const updateSummary = (value: string) => {
    if (!parsedResume) return
    setParsedResume({ ...parsedResume, summary: value })
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      experiences: parsedResume.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    })
  }

  const addExperience = () => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      experiences: [...parsedResume.experiences, {
        id: `exp-${Date.now()}`,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    })
  }

  const removeExperience = (id: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      experiences: parsedResume.experiences.filter(exp => exp.id !== id)
    })
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      education: parsedResume.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    })
  }

  const addEducation = () => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      education: [...parsedResume.education, {
        id: `edu-${Date.now()}`,
        institution: '',
        degree: '',
        field: '',
        graduationDate: ''
      }]
    })
  }

  const removeEducation = (id: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      education: parsedResume.education.filter(edu => edu.id !== id)
    })
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      projects: parsedResume.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    })
  }

  const addProject = () => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      projects: [...parsedResume.projects, {
        id: `proj-${Date.now()}`,
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    })
  }

  const removeProject = (id: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      projects: parsedResume.projects.filter(proj => proj.id !== id)
    })
  }

  const addSkill = (skill: string) => {
    if (!parsedResume || !skill.trim()) return
    if (parsedResume.skills.includes(skill.trim())) return
    setParsedResume({
      ...parsedResume,
      skills: [...parsedResume.skills, skill.trim()]
    })
  }

  const removeSkill = (skill: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      skills: parsedResume.skills.filter(s => s !== skill)
    })
  }

  /** Persists the resume currently being optimized (create or update). */
  const persistActiveResume = useCallback(
    async (state: ParsedResume): Promise<string | null> => {
      const payload = {
        title: state.personalInfo.fullName
          ? `${state.personalInfo.fullName} — Optimizer`
          : 'Optimizer Work',
        personalInfo: state.personalInfo,
        summary: state.summary,
        experiences: state.experiences,
        education: state.education,
        projects: state.projects,
        skills: state.skills,
      }

      const endpoint = activeResumeId ? `/api/resumes/${activeResumeId}` : '/api/resumes'
      const method = activeResumeId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save resume')

      const saved = (await response.json()) as { id: string }
      if (!activeResumeId) setActiveResumeId(saved.id)
      void refreshSavedResumes()
      return saved.id
    },
    [activeResumeId, refreshSavedResumes]
  )

  // Silent debounced autosave while the user edits the resume sections.
  useEffect(() => {
    if (!parsedResume) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)
        await persistActiveResume(parsedResume)
      } catch (error) {
        console.error('Autosave failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [parsedResume, persistActiveResume])

  const handleSaveResume = useCallback(async () => {
    if (!parsedResume) {
      toast.error('Nothing to save yet — add or upload resume content first.')
      return
    }
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    try {
      setIsSaving(true)
      await persistActiveResume(parsedResume)
      toast.success('Resume saved to your previous work.')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Could not save this resume.')
    } finally {
      setIsSaving(false)
    }
  }, [parsedResume, persistActiveResume])

  const handleLoadResume = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/resumes/${id}`)
        if (!response.ok) throw new Error('Failed to load resume')
        const data = await response.json()
        setParsedResume(mapResumeToState(data))
        setActiveResumeId(id)
        setResults(null)
        setUploadedFile(null)
        setJobDescription('')
        setViewMode('sections')
        toast.success('Resume loaded from your previous work')
      } catch (error) {
        console.error('Failed to load resume:', error)
        toast.error('Could not load this resume')
      }
    },
    [mapResumeToState]
  )

  const handleNewWork = useCallback(() => {
    setActiveResumeId(null)
    setParsedResume(null)
    setResults(null)
    setUploadedFile(null)
    setResumeText('')
    setJobDescription('')
    setViewMode('sections')
  }, [])

  return {
    jobDescription,
    setJobDescription,
    resumeText,
    setResumeText,
    isAnalyzing,
    results,
    uploadedFile,
    isUploading,
    parsedResume,
    viewMode,
    setViewMode,
    handleFileUpload,
    handleRemoveFile,
    handleAnalyze,
    activeResumeId,
    savedResumes,
    isLoadingResumes,
    isSaving,
    handleSaveResume,
    handleLoadResume,
    handleNewWork,
    updatePersonalInfo,
    updateSummary,
    updateExperience,
    addExperience,
    removeExperience,
    updateEducation,
    addEducation,
    removeEducation,
    updateProject,
    addProject,
    removeProject,
    addSkill,
    removeSkill,
  }
}
