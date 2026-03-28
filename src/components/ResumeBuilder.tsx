'use client'

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Separator } from '@/components/ui/Separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Plus, Trash2, Download, Save, Upload, Loader2, User, Briefcase, GraduationCap, Zap, ChevronDown, Sparkles, Maximize2, X } from 'lucide-react'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
  link?: string
}

interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  skills: string[]
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
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
  })

  const [newSkill, setNewSkill] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>('personal')
  const [showFullPreview, setShowFullPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const fullPreviewRef = useRef<HTMLDivElement>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const handleAutoSave = useCallback(async () => {
    if (!resumeData.personalInfo.fullName && !resumeData.personalInfo.email) {
      return // Don't save empty resumes
    }

    try {
      setIsSaving(true)
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
      toast.success('Resume auto-saved')
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [resumeData, resumeId])

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave()
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [resumeData, handleAutoSave])

  const handleManualSave = async () => {
    if (!resumeData.personalInfo.fullName && !resumeData.personalInfo.email) {
      toast.error('Brief requirement: Name or Email needed.')
      return
    }

    try {
      setIsSaving(true)
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
      toast.success('Resume sequence saved.')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Save sequence failed.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!previewRef.current) {
      toast.error('Preview not verified.')
      return
    }

    try {
      setIsDownloading(true)
      toast.loading('Compiling document...', { id: 'pdf-download' })

      // Create a clone for PDF generation with white background
      const element = previewRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf'

      pdf.save(fileName)
      toast.success('Document downloaded.', { id: 'pdf-download' })
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error('Compilation failed', { id: 'pdf-download' })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file.')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    try {
      setIsUploading(true)
      toast.loading('Parsing your resume...', { id: 'resume-upload' })

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/parse', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to parse resume')
      }

      const parsedData = await response.json()

      // Populate all resume sections with parsed data
      setResumeData({
        personalInfo: {
          fullName: parsedData.personalInfo?.fullName || '',
          email: parsedData.personalInfo?.email || '',
          phone: parsedData.personalInfo?.phone || '',
          location: parsedData.personalInfo?.location || '',
          linkedin: parsedData.personalInfo?.linkedin || '',
          portfolio: parsedData.personalInfo?.portfolio || '',
        },
        summary: parsedData.summary || '',
        experiences: (parsedData.experiences || []).map((exp: any) => ({
          id: exp.id || Date.now().toString(),
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
        })),
        education: (parsedData.education || []).map((edu: any) => ({
          id: edu.id || Date.now().toString(),
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          graduationDate: edu.graduationDate || '',
        })),
        projects: (parsedData.projects || []).map((proj: any, index: number) => ({
          id: proj.id || `${Date.now()}-${index}`,
          name: proj.name || '',
          description: proj.description || '',
          technologies: proj.technologies || [],
          link: proj.link || '',
        })),
        skills: parsedData.skills || [],
      })

      toast.success('Resume parsed successfully! All sections populated.', { id: 'resume-upload' })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to parse resume', { id: 'resume-upload' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    })
  }

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.filter((exp) => exp.id !== id),
    })
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    })
  }

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          graduationDate: '',
        },
      ],
    })
  }

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    })
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()],
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skill),
    })
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Zap },
  ]

  // Resume Preview Component (reusable for both inline and full preview)
  const ResumePreview = ({ forPdf = false }: { forPdf?: boolean }) => (
    <div
      ref={forPdf ? fullPreviewRef : previewRef}
      className="bg-white text-black mx-auto"
      style={{ 
        width: forPdf ? '100%' : '100%',
        maxWidth: forPdf ? '210mm' : undefined,
        minHeight: forPdf ? 'auto' : 'auto',
        aspectRatio: forPdf ? undefined : '210 / 297',
        padding: forPdf ? '15mm' : '24px',
        fontSize: forPdf ? '11px' : '12px',
        lineHeight: '1.4',
      }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-3 mb-4">
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>
          {resumeData.personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div style={{ fontSize: forPdf ? '11px' : '12px', marginTop: '6px', color: '#4b5563' }} className="flex flex-wrap gap-x-3">
          {[
            resumeData.personalInfo.email,
            resumeData.personalInfo.phone,
            resumeData.personalInfo.location,
            resumeData.personalInfo.linkedin
          ].filter(Boolean).map((item, i, arr) => (
            <span key={i}>{item}{i < arr.length - 1 ? ' •' : ''}</span>
          ))}
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.summary && (
        <section className="mb-4">
          <h2 style={{ fontSize: forPdf ? '12px' : '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
            Professional Profile
          </h2>
          <p style={{ fontSize: forPdf ? '11px' : '12px', color: '#374151' }}>{resumeData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resumeData.experiences.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: forPdf ? '12px' : '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
            Experience
          </h2>
          {resumeData.experiences.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline gap-2">
                <h3 style={{ fontSize: forPdf ? '11px' : '12px', fontWeight: 'bold', color: '#111827' }}>{exp.position}</h3>
                <span style={{ fontSize: forPdf ? '10px' : '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>{exp.startDate} – {exp.endDate || 'Present'}</span>
              </div>
              <div style={{ fontSize: forPdf ? '11px' : '12px', fontWeight: '600', color: '#374151' }}>{exp.company}</div>
              <p style={{ fontSize: forPdf ? '11px' : '12px', color: '#4b5563', whiteSpace: 'pre-wrap', marginTop: '2px' }}>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: forPdf ? '12px' : '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
            Education
          </h2>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between gap-2">
                <h3 style={{ fontSize: forPdf ? '11px' : '12px', fontWeight: 'bold', color: '#111827' }}>{edu.institution}</h3>
                <span style={{ fontSize: forPdf ? '10px' : '11px', color: '#6b7280' }}>{edu.graduationDate}</span>
              </div>
              <div style={{ fontSize: forPdf ? '11px' : '12px', color: '#374151' }}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: forPdf ? '12px' : '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
            Projects
          </h2>
          {resumeData.projects.map(proj => (
            <div key={proj.id} className="mb-2">
              <h3 style={{ fontSize: forPdf ? '11px' : '12px', fontWeight: 'bold', color: '#111827' }}>{proj.name}</h3>
              {proj.description && <p style={{ fontSize: forPdf ? '11px' : '12px', color: '#374151' }}>{proj.description}</p>}
              {proj.technologies && proj.technologies.length > 0 && (
                <p style={{ fontSize: forPdf ? '10px' : '11px', color: '#6b7280', marginTop: '2px' }}>
                  <span className="font-medium">Tech:</span> {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: forPdf ? '12px' : '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
            Skills
          </h2>
          <div style={{ fontSize: forPdf ? '11px' : '12px', color: '#374151' }}>
            {resumeData.skills.join(' • ')}
          </div>
        </section>
      )}
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 gap-4 lg:gap-6">
      {/* Left Panel - Collapsible Sections */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden lg:max-w-[50%]">
        {/* Action Buttons Header */}
        <div className="flex gap-2 mb-4 flex-wrap flex-shrink-0">
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          <Button 
            variant="outline" 
            size="sm"
            className="border-white/10 hover:bg-white/5 rounded-lg text-sm"
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Import
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 rounded-lg text-sm" onClick={handleManualSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-orange-300 hover:opacity-90 rounded-lg text-sm" onClick={handleDownloadPDF} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>

        {/* Collapsible Sections */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {sections.map((section) => (
            <div key={section.id} className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-all",
                  expandedSection === section.id 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-white/5 text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5" />
                  <span className="font-medium">{section.label}</span>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  expandedSection === section.id && "rotate-180"
                )} />
              </button>

              {/* Section Content */}
              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-white/5">
                      {section.id === 'personal' && (
                        <div className="grid gap-4 md:grid-cols-2 pt-4">
                          {[
                            { id: 'fullName', label: 'Full Name', val: resumeData.personalInfo.fullName },
                            { id: 'email', label: 'Email', val: resumeData.personalInfo.email, type: 'email' },
                            { id: 'phone', label: 'Phone', val: resumeData.personalInfo.phone },
                            { id: 'location', label: 'Location', val: resumeData.personalInfo.location },
                            { id: 'linkedin', label: 'LinkedIn', val: resumeData.personalInfo.linkedin },
                            { id: 'portfolio', label: 'Portfolio', val: resumeData.personalInfo.portfolio },
                          ].map((field) => (
                            <div key={field.id} className="space-y-1">
                              <Label className="text-zinc-400 text-xs">{field.label}</Label>
                              <Input
                                id={field.id}
                                type={field.type || 'text'}
                                value={field.val}
                                onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, [field.id]: e.target.value } })}
                                className="bg-black/30 border-white/10 focus:border-primary/50 text-white h-9"
                              />
                            </div>
                          ))}
                          <div className="col-span-2 space-y-1">
                            <Label className="text-zinc-400 text-xs">Professional Summary</Label>
                            <Textarea
                              rows={3}
                              value={resumeData.summary}
                              onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                              className="bg-black/30 border-white/10 focus:border-primary/50 text-white resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {section.id === 'experience' && (
                        <div className="space-y-4 pt-4">
                          {resumeData.experiences.map((exp) => (
                            <div key={exp.id} className="group relative p-4 rounded-lg bg-white/5 border border-white/5">
                              <div className="grid gap-3 md:grid-cols-2">
                                <Input placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                                <Input placeholder="Position" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                                <Input type="month" placeholder="Start" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                                <Input type="month" placeholder="End" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                                <div className="col-span-2">
                                  <Textarea placeholder="Description..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} className="bg-black/30 border-white/10 min-h-[80px]" />
                                </div>
                              </div>
                              <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive" onClick={() => removeExperience(exp.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button onClick={addExperience} variant="outline" size="sm" className="w-full border-dashed border-white/20 hover:bg-white/5">
                            <Plus className="mr-2 h-4 w-4" /> Add Experience
                          </Button>
                        </div>
                      )}

                      {section.id === 'education' && (
                        <div className="space-y-4 pt-4">
                          {resumeData.education.map((edu) => (
                            <div key={edu.id} className="group relative p-4 rounded-lg bg-white/5 border border-white/5">
                              <div className="grid gap-3 md:grid-cols-2">
                                <Input placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                                <Input placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                                <Input placeholder="Field of Study" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                                <Input type="month" placeholder="Graduation" value={edu.graduationDate} onChange={e => updateEducation(edu.id, 'graduationDate', e.target.value)} className="bg-black/30 border-white/10 h-9" />
                              </div>
                              <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive" onClick={() => removeEducation(edu.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button onClick={addEducation} variant="outline" size="sm" className="w-full border-dashed border-white/20 hover:bg-white/5">
                            <Plus className="mr-2 h-4 w-4" /> Add Education
                          </Button>
                        </div>
                      )}

                      {section.id === 'skills' && (
                        <div className="space-y-4 pt-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill..."
                              value={newSkill}
                              onChange={e => setNewSkill(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                              className="bg-black/30 border-white/10 h-9"
                            />
                            <Button onClick={addSkill} size="sm" className="bg-primary hover:bg-primary/90 h-9">Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill) => (
                              <div key={skill} className="flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/20 px-3 py-1">
                                <span className="text-xs font-medium">{skill}</span>
                                <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden lg:max-w-[50%]">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Live Preview</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs hover:bg-white/10"
            onClick={() => setShowFullPreview(true)}
          >
            <Maximize2 className="h-3 w-3 mr-1" /> Expand
          </Button>
        </div>

        {/* A4 Preview Container */}
        <div className="flex-1 min-h-0 overflow-auto bg-[#525659] p-4 flex items-start justify-center scrollbar-thin">
          <div className="w-full max-w-[400px] shadow-2xl">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* Full Preview Dialog */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-[min(95vw,900px)] h-[95vh] p-0 bg-[#525659] border-white/10 flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0 p-4 border-b border-white/10 bg-black/40">
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
              <ResumePreview forPdf />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
