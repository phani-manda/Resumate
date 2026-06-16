'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { User, Briefcase, GraduationCap, Zap, Sparkles, Maximize2, Download } from 'lucide-react'

import {
  SectionWrapper,
  PersonalInfoSection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  SkillsSection,
  ResumePreview,
  ActionToolbar,
  useResumeBuilder,
  useFileUpload,
  usePdfExport,
} from './builder'
import type { SectionConfig } from './builder/types'

const sections: SectionConfig[] = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: Sparkles },
  { id: 'skills', label: 'Skills', icon: Zap },
]

export function ResumeBuilderRefactored() {
  const [expandedSection, setExpandedSection] = useState<string | null>('personal')
  const [showFullPreview, setShowFullPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const fullPreviewRef = useRef<HTMLDivElement>(null)

  const {
    resumeData,
    setResumeData,
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
  } = useResumeBuilder()

  const { isUploading, fileInputRef, handleFileUpload, triggerFileSelect } = useFileUpload({
    onSuccess: setResumeData,
  })

  const { isDownloading, handleDownloadPDF } = usePdfExport({
    resumeData,
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return (
          <PersonalInfoSection
            personalInfo={resumeData.personalInfo}
            summary={resumeData.summary}
            onPersonalInfoChange={updatePersonalInfo}
            onSummaryChange={updateSummary}
          />
        )
      case 'experience':
        return (
          <ExperienceSection
            experiences={resumeData.experiences}
            onAdd={addExperience}
            onRemove={removeExperience}
            onUpdate={updateExperience}
          />
        )
      case 'education':
        return (
          <EducationSection
            education={resumeData.education}
            onAdd={addEducation}
            onRemove={removeEducation}
            onUpdate={updateEducation}
          />
        )
      case 'projects':
        return (
          <ProjectsSection
            projects={resumeData.projects ?? []}
            onAdd={addProject}
            onRemove={removeProject}
            onUpdate={updateProject}
          />
        )
      case 'skills':
        return (
          <SkillsSection
            skills={resumeData.skills}
            onAdd={addSkill}
            onRemove={removeSkill}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="-mx-6 -mt-6 mb-4 flex flex-wrap items-center gap-3 border-b border-line bg-surface px-6 py-3">
        <h1 className="text-heading-lg text-ink-primary">
          {resumeData.personalInfo.fullName || 'Untitled Resume'}
        </h1>
        <span className="flex items-center gap-1.5 text-caption text-ink-muted">
          <span className={`h-2 w-2 rounded-full ${isSaving ? 'animate-pulse bg-warning' : 'bg-success'}`} />
          {isSaving ? 'Saving…' : 'Saved'}
        </span>
      </div>

    <div className="builder-layout flex-1 min-h-0 gap-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Left Panel - Collapsible Sections */}
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <ActionToolbar
          onImport={triggerFileSelect}
          onSave={handleManualSave}
          onExport={handleDownloadPDF}
          isUploading={isUploading}
          isSaving={isSaving}
          isDownloading={isDownloading}
        />

        {/* Collapsible Sections */}
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-2 scrollbar-thin">
          {sections.map((section) => (
            <SectionWrapper
              key={section.id}
              section={section}
              isExpanded={expandedSection === section.id}
              onToggle={() => toggleSection(section.id)}
            >
              {renderSectionContent(section.id)}
            </SectionWrapper>
          ))}
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="preview-panel flex min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-subtle">
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-surface px-4 py-3">
          <span className="text-label uppercase text-ink-muted">Live Preview</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullPreview(true)}
            aria-label="Expand preview"
          >
            <Maximize2 className="mr-1 h-3 w-3" />
            Expand
          </Button>
        </div>

        <div className="flex flex-1 min-h-0 items-start justify-center overflow-auto p-6 scrollbar-thin">
          <div className="w-full max-w-[520px] rounded-lg bg-white p-8 shadow-lg">
            <ResumePreview ref={previewRef} resumeData={resumeData} />
          </div>
        </div>
      </div>

      {/* Full Preview Dialog */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="flex h-[95vh] max-w-[min(95vw,980px)] flex-col overflow-hidden bg-subtle p-0">
          <DialogHeader className="shrink-0 border-b border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <DialogTitle>Full Resume Preview</DialogTitle>
              <Button size="sm" onClick={handleDownloadPDF} disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-auto p-6">
            <div className="mx-auto rounded-lg bg-white p-8 shadow-lg" style={{ maxWidth: '210mm' }}>
              <ResumePreview ref={fullPreviewRef} resumeData={resumeData} forPdf />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}
