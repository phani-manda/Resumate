'use client'

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Separator } from '@/components/ui/Separator'
import { Plus, Trash2, Download, Save, Upload, Loader2, FileDown, User, Briefcase, GraduationCap, Zap, ChevronRight, Sparkles } from 'lucide-react'
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

interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
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
    skills: [],
  })

  const [newSkill, setNewSkill] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('personal')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

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

    const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type.')
      return
    }

    try {
      setIsUploading(true)
      const text = await file.text()

      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
      const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)

      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: emailMatch?.[0] || prev.personalInfo.email,
          phone: phoneMatch?.[0] || prev.personalInfo.phone,
        },
        summary: text.slice(0, 500),
      }))

      toast.success('Data extraction complete.')
    } catch (error) {
      toast.error('Parsing failed.')
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

  const tabs = [
    { id: 'personal', label: 'Identity', icon: User },
    { id: 'experience', label: 'Missions', icon: Briefcase },
    { id: 'education', label: 'Training', icon: GraduationCap },
    { id: 'skills', label: 'Arsenal', icon: Zap },
  ]

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 pb-4">
      {/* Sidebar Navigation - Mobile Top / Desktop Left */}
      <div className="lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 mb-4 lg:mb-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 w-full whitespace-nowrap text-left",
              activeTab === tab.id
                ? "glass-panel bg-primary/10 text-primary border-primary/20"
                : "hover:bg-white/5 text-muted-foreground hover:text-white"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
            )}
          </button>
        ))}

        <Separator className="my-4 bg-white/10 hidden lg:block" />

        {/* Actions Sidebar */}
        <div className="hidden lg:flex flex-col gap-3">
          <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          <Button variant="outline" className="justify-start border-white/10 hover:bg-white/5 rounded-xl h-12" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" /> Import Data
          </Button>
          <Button variant="outline" className="justify-start border-white/10 hover:bg-white/5 rounded-xl h-12" onClick={handleManualSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> Save Progress
          </Button>
          <Button className="justify-start bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 border-0 rounded-xl h-12" onClick={handleDownloadPDF} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 min-w-0 flex flex-col glass-panel rounded-3xl overflow-hidden border-white/10 shadow-2xl relative">
        <ScrollArea className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {activeTab === 'personal' && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Inputs rewritten with glass styles */}
                  {[
                    { id: 'fullName', label: 'Full Name', val: resumeData.personalInfo.fullName },
                    { id: 'email', label: 'Email', val: resumeData.personalInfo.email, type: 'email' },
                    { id: 'phone', label: 'Phone', val: resumeData.personalInfo.phone },
                    { id: 'location', label: 'Location', val: resumeData.personalInfo.location },
                    { id: 'linkedin', label: 'LinkedIn', val: resumeData.personalInfo.linkedin },
                    { id: 'portfolio', label: 'Portfolio', val: resumeData.personalInfo.portfolio },
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="text-zinc-400">{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type || 'text'}
                        value={field.val}
                        onChange={e => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, [field.id]: e.target.value } })}
                        className="bg-black/20 border-white/10 focus:border-primary/50 text-white placeholder:text-zinc-600"
                      />
                    </div>
                  ))}
                  <div className="col-span-2 space-y-2">
                    <Label className="text-zinc-400">Professional Summary</Label>
                    <Textarea
                      rows={4}
                      value={resumeData.summary}
                      onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                      className="bg-black/20 border-white/10 focus:border-primary/50 text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-6">
                  {resumeData.experiences.map((exp, idx) => (
                    <div key={exp.id} className="group relative p-6 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="bg-transparent border-b border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-zinc-600 font-bold text-lg" />
                        <Input placeholder="Position" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} className="bg-transparent border-b border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-zinc-600" />
                        <div className="space-y-1"><Label className="text-xs text-zinc-500">Start</Label><Input type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="bg-black/20 border-white/10" /></div>
                        <div className="space-y-1"><Label className="text-xs text-zinc-500">End</Label><Input type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className="bg-black/20 border-white/10" /></div>
                        <div className="col-span-2"><Textarea placeholder="Description..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} className="bg-black/20 border-white/10 min-h-[100px]" /></div>
                      </div>
                      <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button onClick={addExperience} variant="outline" className="w-full border-dashed border-white/20 hover:bg-white/5 hover:border-primary/50 hover:text-primary">
                    <Plus className="mr-2 h-4 w-4" /> Add Mission
                  </Button>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="group relative p-6 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} className="bg-transparent border-b border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-zinc-600 font-bold text-lg" />
                        <Input placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="bg-transparent border-b border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-zinc-600" />
                        <Input placeholder="Field of Study" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} className="bg-black/20 border-white/10" />
                        <Input type="month" value={edu.graduationDate} onChange={e => updateEducation(edu.id, 'graduationDate', e.target.value)} className="bg-black/20 border-white/10" />
                      </div>
                      <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive" onClick={() => removeEducation(edu.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button onClick={addEducation} variant="outline" className="w-full border-dashed border-white/20 hover:bg-white/5 hover:border-primary/50 hover:text-primary">
                    <Plus className="mr-2 h-4 w-4" /> Add Training
                  </Button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-6 p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Add a skill or technology..."
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="bg-black/20 border-white/10 focus:border-primary/50"
                    />
                    <Button onClick={addSkill} className="bg-primary hover:bg-primary/90">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <div key={skill} className="flex items-center gap-2 rounded-full bg-primary/20 border border-primary/20 px-4 py-1.5 text-primary-foreground">
                        <span className="text-sm font-medium">{skill}</span>
                        <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </div>

      {/* Live Preview Panel - Desktop Right */}
      <div className="hidden lg:flex w-[400px] flex-col gap-4">
        <div className="flex-1 bg-zinc-900/50 rounded-3xl border border-white/10 overflow-hidden flex flex-col relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/20">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Live Preview</span>
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          </div>

          <ScrollArea className="flex-1 bg-[#525659] p-4"> {/* Darker grey background for PDF viewer look */}
            <div
              ref={previewRef}
              className="bg-white text-black min-h-[500px] shadow-2xl mx-auto p-8 text-[10pt] leading-relaxed origin-top transition-transform duration-200"
              style={{ width: '100%' }}
            >
              {/* Simplistic Resume Template */}
              <header className="border-b-2 border-gray-800 pb-4 mb-4">
                <h1 className="text-3xl font-bold uppercase tracking-tight">{resumeData.personalInfo.fullName || 'YOUR NAME'}</h1>
                <div className="text-sm mt-2 flex flex-wrap gap-3 text-gray-600">
                  {[
                    resumeData.personalInfo.email,
                    resumeData.personalInfo.phone,
                    resumeData.personalInfo.location,
                    resumeData.personalInfo.linkedin
                  ].filter(Boolean).map((item, i) => (
                    <span key={i}>{item} • </span>
                  ))}
                </div>
              </header>

              {resumeData.summary && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Professional Profile</h2>
                  <p className="text-gray-700">{resumeData.summary}</p>
                </section>
              )}

              {resumeData.experiences.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Experience</h2>
                  {resumeData.experiences.map(exp => (
                    <div key={exp.id} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate} – {exp.endDate || 'Present'}</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">{exp.company}</div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </section>
              )}

              {resumeData.education.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Education</h2>
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                        <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                      </div>
                      <div className="text-sm text-gray-700">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                    </div>
                  ))}
                </section>
              )}

              {resumeData.skills.length > 0 && (
                <section>
                  <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Skills</h2>
                  <div className="text-sm text-gray-700 leading-normal">
                    {resumeData.skills.join(' • ')}
                  </div>
                </section>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
