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
    previewRef,
    fileName: resumeData.personalInfo.fullName || 'Resume',
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
    <div className="flex h-full min-h-0 flex-col gap-6 lg:flex-row xl:gap-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Left Panel - Collapsible Sections */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:max-w-[52%]">
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
      <div className="glass-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[30px] lg:max-w-[48%]">
        {/* Preview Header */}
        <div className="flex items-center justify-between bg-card/48 p-4 md:p-5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Live Preview</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs hover:bg-white/10"
            onClick={() => setShowFullPreview(true)}
            aria-label="Expand preview"
          >
            <Maximize2 className="h-3 w-3 mr-1" /> Expand
          </Button>
        </div>

        {/* A4 Preview Container */}
        <div className="flex flex-1 min-h-0 items-start justify-center overflow-auto bg-[#525659] p-5 md:p-6 xl:p-8 scrollbar-thin">
          <div className="w-full max-w-[520px] shadow-2xl">
            <ResumePreview ref={previewRef} resumeData={resumeData} />
          </div>
        </div>
      </div>

      {/* Full Preview Dialog */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="flex h-[95vh] max-w-[min(95vw,980px)] flex-col overflow-hidden border-white/10 bg-[#525659] p-0">
          <DialogHeader className="flex-shrink-0 border-b border-white/10 bg-black/40 p-5">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">Full Resume Preview</DialogTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleDownloadPDF} disabled={isDownloading} className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-auto p-4 md:p-6">
            <div className="mx-auto shadow-2xl" style={{ maxWidth: '210mm' }}>
              <ResumePreview ref={fullPreviewRef} resumeData={resumeData} forPdf />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
