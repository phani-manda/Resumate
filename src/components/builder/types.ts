// Shared types for resume builder components

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
  link?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  projects?: Project[]
  skills: string[]
}

export interface SectionConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface UseResumeBuilderReturn {
  resumeData: ResumeData
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>
  resumeId: string | null
  saveStatus: SaveStatus
  isSaving: boolean
  handleManualSave: () => Promise<void>
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
  updateSummary: (value: string) => void
  addExperience: () => void
  removeExperience: (id: string) => void
  updateExperience: (id: string, field: keyof Experience, value: string) => void
  addEducation: () => void
  removeEducation: (id: string) => void
  updateEducation: (id: string, field: keyof Education, value: string) => void
  addProject: () => void
  removeProject: (id: string) => void
  updateProject: (id: string, field: keyof Project, value: string | string[]) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
}
