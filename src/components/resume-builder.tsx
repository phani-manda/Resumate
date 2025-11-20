'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Download, Save, Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
  const [resumeId, setResumeId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
  }, [resumeData])

  const handleAutoSave = async () => {
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
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a .txt, .pdf, .doc, or .docx file')
      return
    }

    try {
      setIsUploading(true)
      const text = await file.text()
      
      // Basic parsing - extract email, phone, and use content as summary
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
      const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
      
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: emailMatch?.[0] || prev.personalInfo.email,
          phone: phoneMatch?.[0] || prev.personalInfo.phone,
        },
        summary: text.slice(0, 500), // First 500 chars as summary
      }))

      toast.success('Resume uploaded! Please review and edit the extracted data.')
    } catch (error) {
      toast.error('Failed to parse resume file')
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

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left: Form - Scrollable */}
      <div className="w-2/3">
        <Card className="h-full">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle>Build Your Resume</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-5rem)]">
            <CardContent className="p-6">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio</Label>
                      <Input
                        id="portfolio"
                        value={resumeData.personalInfo.portfolio}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, portfolio: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          summary: e.target.value,
                        })
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  {resumeData.experiences.map((exp) => (
                    <Card key={exp.id}>
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(exp.id, 'description', e.target.value)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={addExperience} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <Card key={edu.id}>
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field of Study</Label>
                            <Input
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Graduation Date</Label>
                            <Input
                              type="month"
                              value={edu.graduationDate}
                              onChange={(e) =>
                                updateEducation(edu.id, 'graduationDate', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={addEducation} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Education
                  </Button>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1"
                      >
                        <span className="text-sm">{skill}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeSkill(skill)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Right: Preview & Actions - Fixed */}
      <div className="flex w-1/3 flex-col gap-4">
        {/* Actions Card - Fixed */}
        <Card className="flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Resume
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        {/* Preview Card - Fixed with internal scroll */}
        <Card className="flex flex-1 flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle className="text-base">Live Preview</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="space-y-4 p-6">
              {/* Personal Info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h2>
                <div className="mt-2 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                </div>
                {(resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) && (
                  <div className="mt-1 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                    {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                    {resumeData.personalInfo.portfolio && <span>• {resumeData.personalInfo.portfolio}</span>}
                  </div>
                )}
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 font-semibold">Professional Summary</h3>
                    <p className="text-sm text-muted-foreground">{resumeData.summary}</p>
                  </div>
                </>
              )}

              {/* Experience */}
              {resumeData.experiences.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 font-semibold">Experience</h3>
                    <div className="space-y-4">
                      {resumeData.experiences.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between">
                            <h4 className="font-medium">{exp.position || 'Position'}</h4>
                            <span className="text-sm text-muted-foreground">
                              {exp.startDate} - {exp.endDate || 'Present'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{exp.company || 'Company'}</p>
                          <p className="mt-1 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 font-semibold">Education</h3>
                    <div className="space-y-3">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between">
                            <h4 className="font-medium">{edu.degree || 'Degree'}</h4>
                            <span className="text-sm text-muted-foreground">{edu.graduationDate}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{edu.institution || 'Institution'}</p>
                          {edu.field && <p className="text-sm">Field: {edu.field}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <span key={skill} className="rounded-md bg-secondary px-2 py-1 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
