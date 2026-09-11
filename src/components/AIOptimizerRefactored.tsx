'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'
import { PreviousWorkSelect } from './PreviousWorkSelect'
import {
  FileText,
  Sparkles,
  Loader2,
  Bot,
  User,
  Briefcase,
  GraduationCap,
  Zap,
  Edit3,
  Eye,
  Plus,
  Trash2,
  FolderKanban,
  X,
  Save,
  FolderOpen,
  FilePlus2,
} from 'lucide-react'

import {
  JobDescriptionInput,
  ResumeUploader,
  ResultsPanel,
  AnalysisProgress,
  useOptimizer,
} from './optimizer'

export function AIOptimizerRefactored() {
  const [newSkill, setNewSkill] = useState('')

  const {
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
    // Previous work — persistence
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
  } = useOptimizer()

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill)
      setNewSkill('')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 pb-4 lg:p-0 min-h-0">
      {/* Left: Input Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-0 max-h-full">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
                <Bot className="h-6 w-6 text-accent-text" />
              </div>
              <div>
                <h2 className="text-heading-lg text-ink-primary">ATS Optimizer</h2>
                <p className="text-caption text-ink-secondary">Match your resume to any job description</p>
              </div>
            </div>

            {/* Previous work + save controls */}
            <div className="flex items-center gap-2">
              {activeResumeId && (
                <span className="hidden items-center gap-1 text-caption text-success sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {isSaving ? 'Saving…' : 'Saved'}
                </span>
              )}
              <PreviousWorkSelect
                resumes={savedResumes}
                activeId={activeResumeId}
                isLoading={isLoadingResumes}
                onSelect={handleLoadResume}
                onNew={handleNewWork}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSaveResume}
                disabled={isSaving || !parsedResume}
                title="Save resume to your previous work"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
            <div className="p-6 space-y-8">
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />

              <div className="space-y-3">
                <Label htmlFor="resumeText" className="font-medium flex items-center gap-2 text-ink-primary">
                  <FileText className="h-4 w-4 text-accent-text" /> Current Resume Content
                </Label>

                <ResumeUploader
                  uploadedFile={uploadedFile}
                  isUploading={isUploading}
                  onFileSelect={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                />

                {!uploadedFile && (
                  <div className="relative">
                    <div className="text-center text-xs text-ink-muted my-2">or paste manually</div>
                    <Textarea
                      id="resumeText"
                      placeholder="Paste your resume text here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                )}
                
                {uploadedFile && parsedResume && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'sections' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('sections')}
                        className="text-xs"
                      >
                        <Edit3 className="h-3 w-3 mr-1" /> Sections
                      </Button>
                      <Button
                        variant={viewMode === 'text' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('text')}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" /> Raw Text
                      </Button>
                    </div>

                    {viewMode === 'text' ? (
                      <div>
                        <div className="text-xs text-ink-muted mb-2">Extracted Content (editable):</div>
                        <Textarea
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          rows={8}
                          className="text-sm resize-none"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-subtle border border-line">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4 text-accent-text" />
                            <span className="text-sm font-medium text-ink-primary">Personal Information</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Full Name"
                              value={parsedResume.personalInfo.fullName}
                              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                              className="text-sm h-9"
                            />
                            <Input
                              placeholder="Email"
                              value={parsedResume.personalInfo.email}
                              onChange={(e) => updatePersonalInfo('email', e.target.value)}
                              className="text-sm h-9"
                            />
                            <Input
                              placeholder="Phone"
                              value={parsedResume.personalInfo.phone}
                              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                              className="text-sm h-9"
                            />
                            <Input
                              placeholder="Location"
                              value={parsedResume.personalInfo.location}
                              onChange={(e) => updatePersonalInfo('location', e.target.value)}
                              className="text-sm h-9"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-subtle border border-line">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-accent-text" />
                            <span className="text-sm font-medium text-ink-primary">Professional Summary</span>
                          </div>
                          <Textarea
                            placeholder="Professional summary..."
                            value={parsedResume.summary}
                            onChange={(e) => updateSummary(e.target.value)}
                            rows={3}
                            className="text-sm resize-none"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-subtle border border-line">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-success-text" />
                              <span className="text-sm font-medium text-ink-primary">Experience ({parsedResume.experiences.length})</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={addExperience} className="h-7 text-xs">
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {parsedResume.experiences.map((exp) => (
                              <div key={exp.id} className="p-3 rounded-lg bg-surface border border-line relative group">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(exp.id)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    className="text-sm h-7"
                                  />
                                  <Input
                                    placeholder="Position"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    className="text-sm h-7"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-subtle border border-line">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-accent-text" />
                              <span className="text-sm font-medium text-ink-primary">Education ({parsedResume.education.length})</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={addEducation} className="h-7 text-xs">
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="space-y-3 max-h-36 overflow-y-auto">
                            {parsedResume.education.map((edu) => (
                              <div key={edu.id} className="p-3 rounded-lg bg-surface border border-line relative group">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEducation(edu.id)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    className="text-sm h-7"
                                  />
                                  <Input
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    className="text-sm h-7"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-subtle border border-line">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FolderKanban className="h-4 w-4 text-accent-text" />
                              <span className="text-sm font-medium text-ink-primary">Projects ({parsedResume.projects?.length || 0})</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={addProject} className="h-7 text-xs">
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {parsedResume.projects?.map((proj) => (
                              <div key={proj.id} className="p-3 rounded-lg bg-surface border border-line relative group">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProject(proj.id)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <div className="space-y-2">
                                  <Input
                                    placeholder="Project Name"
                                    value={proj.name}
                                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                    className="text-sm h-7 font-medium"
                                  />
                                  <Textarea
                                    placeholder="Description..."
                                    value={proj.description}
                                    onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                    rows={2}
                                    className="text-xs resize-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-subtle border border-line">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-4 w-4 text-accent-text" />
                            <span className="text-sm font-medium text-ink-primary">Skills ({parsedResume.skills.length})</span>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <Input
                              placeholder="Add skill..."
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                              className="text-sm h-8"
                            />
                            <Button variant="ghost" size="sm" onClick={handleAddSkill} className="h-8 text-xs">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                            {parsedResume.skills.map((skill) => (
                              <div key={skill} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-subtle border border-accent/20 text-accent-text text-xs">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <AnalysisProgress isAnalyzing={isAnalyzing} />
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-line p-5">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim() || (!resumeText.trim() && !parsedResume)}
              className="w-full h-12 text-lg font-bold disabled:cursor-not-allowed disabled:transform-none rounded-xl"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Data...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full">
        <ResultsPanel results={results} />
      </div>
    </div>
  )
}
