// Shared types for AI Optimizer components

export interface Improvement {
  issue: string
  before: string
  after: string
  impact: 'high' | 'medium' | 'low'
}

export interface OptimizationResults {
  atsScore: number
  missingKeywords: string[]
  matchedKeywords: string[]
  /** Overall AI assessment of the resume against the job description. */
  review: string | null
  /** Highest-impact fixes with an exact before → after rewrite. */
  improvements: Improvement[]
  suggestions: string[]
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  portfolio: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  link: string
}

export interface ParsedResume {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  skills: string[]
  rawText: string
}

/** Minimal shape of a saved resume listed under "Previous Work". */
export interface SavedResumeSummary {
  id: string
  title: string | null
  updatedAt: string
  atsScore?: number | null
}

export type ViewMode = 'text' | 'sections'

export interface UseOptimizerReturn {
  jobDescription: string
  setJobDescription: (value: string) => void
  resumeText: string
  setResumeText: (value: string) => void
  isAnalyzing: boolean
  results: OptimizationResults | null
  uploadedFile: File | null
  isUploading: boolean
  parsedResume: ParsedResume | null
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleRemoveFile: () => void
  handleAnalyze: () => Promise<void>
  // Previous work — persistence of the resume being optimized
  activeResumeId: string | null
  savedResumes: SavedResumeSummary[]
  isLoadingResumes: boolean
  isSaving: boolean
  handleSaveResume: () => Promise<void>
  handleLoadResume: (id: string) => Promise<void>
  handleNewWork: () => void
  // Resume editing handlers
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
  updateSummary: (value: string) => void
  updateExperience: (id: string, field: keyof Experience, value: string) => void
  addExperience: () => void
  removeExperience: (id: string) => void
  updateEducation: (id: string, field: keyof Education, value: string) => void
  addEducation: () => void
  removeEducation: (id: string) => void
  updateProject: (id: string, field: keyof Project, value: string | string[]) => void
  addProject: () => void
  removeProject: (id: string) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
}
