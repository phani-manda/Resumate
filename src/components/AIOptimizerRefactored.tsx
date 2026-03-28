'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'
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
  X
} from 'lucide-react'

import {
  JobDescriptionInput,
  ResumeUploader,
  ResultsPanel,
  useOptimizer,
} from './optimizer'

export function AIOptimizerRefactored() {
  const [newSkill, setNewSkill] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        <div className="glass-panel flex-1 flex flex-col overflow-hidden rounded-3xl border-white/10 shadow-2xl relative group min-h-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-white/10 flex items-center gap-3 bg-white/5 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 box-shadow-glow">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Optimization Core</h2>
              <p className="text-xs text-zinc-400">Align your profile with market requirements</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-y-auto relative z-10 scrollbar-thin">
            <div className="p-6 space-y-8">
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />

              <div className="space-y-3">
                <Label htmlFor="resumeText" className="text-zinc-300 font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-300" /> Current Resume Content
                </Label>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <ResumeUploader
                  uploadedFile={uploadedFile}
                  isUploading={isUploading}
                  onFileSelect={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                />

                {/* Text area for manual paste */}
                {!uploadedFile && (
                  <div className="relative">
                    <div className="text-center text-xs text-zinc-400 my-2">or paste manually</div>
                    <div className="relative group/input">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-300/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition duration-500" />
                      <Textarea
                        id="resumeText"
                        placeholder="Paste your resume text here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={6}
                        className="relative bg-black/40 border-white/10 focus:border-orange-500/50 text-white placeholder:text-zinc-500 resize-none rounded-2xl p-4"
                      />
                    </div>
                  </div>
                )}
                
                {/* Parsed sections view */}
                {uploadedFile && parsedResume && (
                  <div className="space-y-4">
                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'sections' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('sections')}
                        className={cn(
                          "rounded-lg text-xs",
                          viewMode === 'sections' ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"
                        )}
                      >
                        <Edit3 className="h-3 w-3 mr-1" /> Sections
                      </Button>
                      <Button
                        variant={viewMode === 'text' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('text')}
                        className={cn(
                          "rounded-lg text-xs",
                          viewMode === 'text' ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"
                        )}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Raw Text
                      </Button>
                    </div>

                    {viewMode === 'text' ? (
                      <div className="relative group/input">
                        <div className="text-xs text-zinc-400 mb-2">Extracted Content (editable):</div>
                        <Textarea
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          rows={8}
                          className="relative bg-black/40 border-white/10 focus:border-orange-500/50 text-white placeholder:text-zinc-500 resize-none rounded-2xl p-4 text-sm"
                        />
                      </div>
                    ) : (
                      /* Editable Sections View */
                      <div className="space-y-4">
                        {/* Personal Info Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4 text-orange-300" />
                            <span className="text-sm font-medium text-zinc-300">Personal Information</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Full Name"
                              value={parsedResume.personalInfo.fullName}
                              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                              className="bg-black/30 border-white/10 text-white text-sm h-9"
                            />
                            <Input
                              placeholder="Email"
                              value={parsedResume.personalInfo.email}
                              onChange={(e) => updatePersonalInfo('email', e.target.value)}
                              className="bg-black/30 border-white/10 text-white text-sm h-9"
                            />
                            <Input
                              placeholder="Phone"
                              value={parsedResume.personalInfo.phone}
                              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                              className="bg-black/30 border-white/10 text-white text-sm h-9"
                            />
                            <Input
                              placeholder="Location"
                              value={parsedResume.personalInfo.location}
                              onChange={(e) => updatePersonalInfo('location', e.target.value)}
                              className="bg-black/30 border-white/10 text-white text-sm h-9"
                            />
                          </div>
                        </div>

                        {/* Summary Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-orange-400" />
                            <span className="text-sm font-medium text-zinc-300">Professional Summary</span>
                          </div>
                          <Textarea
                            placeholder="Professional summary..."
                            value={parsedResume.summary}
                            onChange={(e) => updateSummary(e.target.value)}
                            rows={3}
                            className="bg-black/30 border-white/10 text-white text-sm resize-none"
                          />
                        </div>

                        {/* Experience Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-green-400" />
                              <span className="text-sm font-medium text-zinc-300">Experience ({parsedResume.experiences.length})</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={addExperience} className="h-7 text-xs text-primary hover:bg-primary/20">
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {parsedResume.experiences.map((exp) => (
                              <div key={exp.id} className="p-3 rounded-lg bg-black/30 border border-white/5 relative group">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(exp.id)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-7 text-sm text-white"
                                  />
                                  <Input
                                    placeholder="Position"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-7 text-sm text-white"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Education Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-orange-300" />
                              <span className="text-sm font-medium text-zinc-300">Education ({parsedResume.education.length})</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={addEducation} className="h-7 text-xs text-primary hover:bg-primary/20">
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="space-y-3 max-h-36 overflow-y-auto">
                            {parsedResume.education.map((edu) => (
                              <div key={edu.id} className="p-3 rounded-lg bg-black/30 border border-white/5 relative group">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEducation(edu.id)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-7 text-sm text-white"
                                  />
                                  <Input
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-7 text-sm text-white"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Projects Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FolderKanban className="h-4 w-4 text-orange-300" />
                              <span className="text-sm font-medium text-zinc-300">Projects ({parsedResume.projects?.length || 0})</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={addProject} className="h-7 text-xs text-primary hover:bg-primary/20">
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {parsedResume.projects?.map((proj) => (
                              <div key={proj.id} className="p-3 rounded-lg bg-black/30 border border-white/5 relative group">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProject(proj.id)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <div className="space-y-2">
                                  <Input
                                    placeholder="Project Name"
                                    value={proj.name}
                                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 h-7 text-sm text-white font-medium"
                                  />
                                  <Textarea
                                    placeholder="Description..."
                                    value={proj.description}
                                    onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                    rows={2}
                                    className="bg-black/20 border-white/10 text-xs text-zinc-300 resize-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Skills Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-4 w-4 text-orange-400" />
                            <span className="text-sm font-medium text-zinc-300">Skills ({parsedResume.skills.length})</span>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <Input
                              placeholder="Add skill..."
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                              className="bg-black/30 border-white/10 text-white text-sm h-8"
                            />
                            <Button variant="ghost" size="sm" onClick={handleAddSkill} className="h-8 text-xs text-primary hover:bg-primary/20">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                            {parsedResume.skills.map((skill) => (
                              <div key={skill} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/20 border border-orange-500/20 text-orange-300 text-xs">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-400">
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
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex-shrink-0 p-6 border-t border-white/10 bg-white/5 backdrop-blur-md relative z-10">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim() || (!resumeText.trim() && !parsedResume)}
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-300 hover:from-orange-400 hover:to-orange-200 border-0 shadow-[0_0_24px_-8px_rgba(255,122,26,0.55)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-xl"
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

      {/* Right: Results Panel */}
      <div className="w-full lg:w-1/2 h-full">
        <ResultsPanel results={results} />
      </div>
    </div>
  )
}
