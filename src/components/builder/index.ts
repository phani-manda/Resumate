// Builder Components - Phase 2 Modular Architecture
export { SectionWrapper } from './SectionWrapper'
export { PersonalInfoSection } from './PersonalInfoSection'
export { ExperienceSection } from './ExperienceSection'
export { EducationSection } from './EducationSection'
export { ProjectsSection } from './ProjectsSection'
export { SkillsSection } from './SkillsSection'
export { ResumePreview } from './ResumePreview'
export { ActionToolbar } from './ActionToolbar'

// Phase 3 Components
export { DraggableSections } from './DraggableSections'
export { SortableSection } from './SortableSection'
export { VersionHistory } from './VersionHistory'
export { ExportMenu } from './ExportMenu'
export { TemplatePicker, RESUME_TEMPLATES, useTemplateStyles } from './TemplatePicker'

// Hooks
export { useResumeBuilder } from './useResumeBuilder'
export { useFileUpload } from './useFileUpload'
export { usePdfExport } from './usePdfExport'
export { useExportFormats } from './useExportFormats'

// Types
export type {
  PersonalInfo,
  Experience,
  Education,
  Project,
  ResumeData,
  SectionConfig,
  SaveStatus,
  UseResumeBuilderReturn,
} from './types'
export type { ResumeTemplate } from './TemplatePicker'
