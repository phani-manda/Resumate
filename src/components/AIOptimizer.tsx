"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Progress } from "@/components/ui/Progress"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { toast } from "sonner"
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Loader2,
  Bot,
  ArrowRight,
  Target,
  Upload,
  X,
  User,
  Briefcase,
  GraduationCap,
  Zap,
  Edit3,
  Eye,
  Plus,
  Trash2,
  FolderKanban
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface OptimizationResults {
  atsScore: number
  missingKeywords: string[]
  matchedKeywords: string[]
  suggestions: string[]
}

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  portfolio: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
}

interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  link: string
}

interface ParsedResume {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  skills: string[]
  rawText: string
}

export function AIOptimizer() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<OptimizationResults | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [viewMode, setViewMode] = useState<'text' | 'sections'>('sections')
  const [newSkill, setNewSkill] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const buildResumeText = (resume: ParsedResume): string => {
    const lines: string[] = []
    
    // Personal Info
    if (resume.personalInfo.fullName) lines.push(resume.personalInfo.fullName)
    const contactParts = [
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.location
    ].filter(Boolean)
    if (contactParts.length) lines.push(contactParts.join(' | '))
    if (resume.personalInfo.linkedin) lines.push(resume.personalInfo.linkedin)
    if (resume.personalInfo.portfolio) lines.push(resume.personalInfo.portfolio)
    
    // Summary
    if (resume.summary) {
      lines.push('\n--- PROFESSIONAL SUMMARY ---')
      lines.push(resume.summary)
    }
    
    // Experience
    if (resume.experiences.length > 0) {
      lines.push('\n--- EXPERIENCE ---')
      resume.experiences.forEach(exp => {
        lines.push(`\n${exp.position} at ${exp.company}`)
        lines.push(`${exp.startDate} - ${exp.endDate || 'Present'}`)
        if (exp.description) lines.push(exp.description)
      })
    }
    
    // Education
    if (resume.education.length > 0) {
      lines.push('\n--- EDUCATION ---')
      resume.education.forEach(edu => {
        lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''} - ${edu.institution}`)
        if (edu.graduationDate) lines.push(`Graduated: ${edu.graduationDate}`)
      })
    }
    
    // Projects
    if (resume.projects && resume.projects.length > 0) {
      lines.push('\n--- PROJECTS ---')
      resume.projects.forEach(proj => {
        lines.push(`\n${proj.name}`)
        if (proj.description) lines.push(proj.description)
        if (proj.technologies.length > 0) lines.push(`Technologies: ${proj.technologies.join(', ')}`)
        if (proj.link) lines.push(`Link: ${proj.link}`)
      })
    }
    
    // Skills
    if (resume.skills.length > 0) {
      lines.push('\n--- SKILLS ---')
      lines.push(resume.skills.join(', '))
    }
    
    return lines.join('\n')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type - Accept both PDF and DOCX
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setUploadedFile(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Use the parse API to get structured resume data
      const response = await fetch('/api/upload/parse', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      
      // Set parsed resume with all sections including projects
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
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setResumeText('')
    setParsedResume(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Update personal info
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      personalInfo: { ...parsedResume.personalInfo, [field]: value }
    })
  }

  // Update summary
  const updateSummary = (value: string) => {
    if (!parsedResume) return
    setParsedResume({ ...parsedResume, summary: value })
  }

  // Experience handlers
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

  // Education handlers
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

  // Project handlers
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

  // Skills handlers
  const addSkill = () => {
    if (!parsedResume || !newSkill.trim()) return
    if (parsedResume.skills.includes(newSkill.trim())) return
    setParsedResume({
      ...parsedResume,
      skills: [...parsedResume.skills, newSkill.trim()]
    })
    setNewSkill('')
  }

  const removeSkill = (skill: string) => {
    if (!parsedResume) return
    setParsedResume({
      ...parsedResume,
      skills: parsedResume.skills.filter(s => s !== skill)
    })
  }

  const handleAnalyze = async () => {
    // Build text from parsed resume if in sections mode
    const textToAnalyze = viewMode === 'sections' && parsedResume 
      ? buildResumeText(parsedResume) 
      : resumeText
    
    if (!jobDescription.trim() || !textToAnalyze.trim()) {
      toast.error("Input missing: Job Description and Resume required.")
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
        suggestions: data.suggestions || [],
      })
      toast.success("Analysis complete.")
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error instanceof Error ? error.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Optimal'
    if (score >= 60) return 'Moderate'
    return 'Critical'
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 pb-4 lg:p-0 min-h-0">
      {/* Left: Input Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-0 max-h-full">
        <div className="glass-panel flex-1 flex flex-col overflow-hidden rounded-3xl border-white/10 shadow-2xl relative group min-h-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex-shrink-0 p-6 border-b border-white/10 flex items-center gap-3 bg-white/5 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 box-shadow-glow">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Optimization Core</h2>
              <p className="text-xs text-zinc-400">Align your profile with market requirements</p>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto relative z-10 scrollbar-thin">
            <div className="p-6 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="jobDescription" className="text-zinc-300 font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-400" /> Target Job Description
                </Label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition duration-500" />
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="relative bg-black/40 border-white/10 focus:border-purple-500/50 text-white placeholder:text-zinc-500 resize-none rounded-2xl p-4"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="resumeText" className="text-zinc-300 font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" /> Current Resume Content
                </Label>
                
                {/* File Upload Area */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  
                  {!uploadedFile ? (
                    <label
                      htmlFor="resume-upload"
                      className="relative block cursor-pointer group/upload"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover/upload:opacity-100 transition duration-500" />
                      <div className="relative bg-black/40 border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl p-8 transition-colors">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                            <Upload className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Upload Resume</p>
                            <p className="text-xs text-zinc-400 mt-1">PDF, DOCX or DOC (Max 10MB)</p>
                          </div>
                          {isUploading && (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                          )}
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="relative group/file">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur" />
                      <div className="relative bg-black/60 border border-green-500/30 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/20">
                            <FileText className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{uploadedFile.name}</p>
                            <p className="text-xs text-zinc-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button
                            onClick={handleRemoveFile}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text area for manual paste (optional) */}
                {!uploadedFile && (
                  <div className="relative">
                    <div className="text-center text-xs text-zinc-400 my-2">or paste manually</div>
                    <div className="relative group/input">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition duration-500" />
                      <Textarea
                        id="resumeText"
                        placeholder="Paste your resume text here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={6}
                        className="relative bg-black/40 border-white/10 focus:border-blue-500/50 text-white placeholder:text-zinc-500 resize-none rounded-2xl p-4"
                      />
                    </div>
                  </div>
                )}
                
                {/* Show parsed sections or raw text view when file uploaded */}
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
                          className="relative bg-black/40 border-white/10 focus:border-blue-500/50 text-white placeholder:text-zinc-500 resize-none rounded-2xl p-4 text-sm"
                        />
                      </div>
                    ) : (
                      /* Editable Sections View */
                      <div className="space-y-4">
                        {/* Personal Info Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4 text-blue-400" />
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
                            <FileText className="h-4 w-4 text-purple-400" />
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
                            {parsedResume.experiences.map((exp, idx) => (
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
                                <div className="flex gap-2 mt-2">
                                  <Input
                                    placeholder="Start"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    className="bg-black/20 border-white/10 h-7 text-xs text-zinc-400"
                                  />
                                  <Input
                                    placeholder="End"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    className="bg-black/20 border-white/10 h-7 text-xs text-zinc-400"
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
                              <GraduationCap className="h-4 w-4 text-yellow-400" />
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
                              <FolderKanban className="h-4 w-4 text-cyan-400" />
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
                                  <Input
                                    placeholder="Technologies (comma-separated)"
                                    value={proj.technologies?.join(', ') || ''}
                                    onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                    className="bg-black/20 border-white/10 h-7 text-xs text-zinc-400"
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
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                              className="bg-black/30 border-white/10 text-white text-sm h-8"
                            />
                            <Button variant="ghost" size="sm" onClick={addSkill} className="h-8 text-xs text-primary hover:bg-primary/20">
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

          <div className="flex-shrink-0 p-6 border-t border-white/10 bg-white/5 backdrop-blur-md relative z-10">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim() || (!resumeText.trim() && !parsedResume)}
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-xl"
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
        <div className="h-full glass-panel rounded-3xl overflow-hidden border-white/10 shadow-2xl flex flex-col relative group">
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" /> Analysis Report
            </h2>
            {results && (
              <Badge variant={results.atsScore >= 80 ? 'default' : 'secondary'} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                {getScoreLabel(results.atsScore)} Match
              </Badge>
            )}
          </div>

          {!results ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/20 relative z-10">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Sparkles className="h-10 w-10 text-zinc-500 relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready for Input</h3>
              <p className="text-zinc-400 max-w-sm leading-relaxed">
                Provide your resume and target job description to initiate the AI compatibility analysis engine.
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1 bg-black/20 relative z-10">
              <div className="p-6 space-y-6">
                {/* Score Card */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2" />
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">ATS Compatibility Score</h3>
                  <div className="flex items-end gap-3 mb-2">
                    <span className={cn("text-6xl font-black tracking-tighter", getScoreColor(results.atsScore))}>
                      {results.atsScore}
                    </span>
                    <span className="text-xl text-zinc-500 font-light mb-3">/ 100</span>
                  </div>
                  <Progress value={results.atsScore} className="h-2 bg-white/10" indicatorClassName={cn(results.atsScore >= 80 ? "bg-emerald-500" : results.atsScore >= 60 ? "bg-yellow-500" : "bg-red-500")} />
                </div>

                {/* Keywords Analysis */}
                <Tabs defaultValue="missing" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 bg-black/40 border border-white/10 p-1 rounded-2xl">
                    <TabsTrigger value="missing" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-xl">Missing Keywords ({results.missingKeywords?.length || 0})</TabsTrigger>
                    <TabsTrigger value="matched" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-xl">Matched ({results.matchedKeywords?.length || 0})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="missing" className="mt-4">
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                      <div className="flex flex-wrap gap-2">
                        {results.missingKeywords && results.missingKeywords.length > 0 ? (
                          results.missingKeywords.map((keyword) => (
                            <Badge key={keyword} variant="outline" className="border-red-500/20 text-red-300 bg-red-500/10 hover:bg-red-500/20 py-1.5 px-3 rounded-lg">
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="h-5 w-5" />
                            All critical keywords present
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="matched" className="mt-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="flex flex-wrap gap-2">
                        {results.matchedKeywords && results.matchedKeywords.length > 0 ? (
                          results.matchedKeywords.map((keyword) => (
                            <Badge key={keyword} variant="outline" className="border-emerald-500/20 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 py-1.5 px-3 rounded-lg">
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-zinc-500">No matches found.</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Suggestions Protocol */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" /> Optimization Protocol
                  </h3>
                  <div className="space-y-3">
                    {results.suggestions && results.suggestions.length > 0 ? (
                      results.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                            {index + 1}
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed">{suggestion}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500 text-sm">No suggestions available.</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
