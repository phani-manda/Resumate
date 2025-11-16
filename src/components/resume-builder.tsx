"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Download, Eye, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  degree: string
  school: string
  location: string
  graduationDate: string
  gpa: string
}

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
  }
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
  })

  const [newSkill, setNewSkill] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [optimizationScore, setOptimizationScore] = useState(0)

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        {
          id: Date.now().toString(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
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
          degree: "",
          school: "",
          location: "",
          graduationDate: "",
          gpa: "",
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
    if (newSkill.trim()) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index),
    })
  }

  const calculateOptimization = () => {
    let score = 0
    if (resumeData.personalInfo.fullName) score += 10
    if (resumeData.personalInfo.email) score += 10
    if (resumeData.personalInfo.phone) score += 5
    if (resumeData.summary) score += 15
    if (resumeData.experiences.length > 0) score += 25
    if (resumeData.education.length > 0) score += 20
    if (resumeData.skills.length >= 5) score += 15
    setOptimizationScore(score)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
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
                    placeholder="john@example.com"
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
                    placeholder="+1 (555) 123-4567"
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
                    placeholder="New York, NY"
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
                    placeholder="linkedin.com/in/johndoe"
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
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="johndoe.com"
                    value={resumeData.personalInfo.website}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, website: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>Brief overview of your career</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Experienced software engineer with 5+ years in full-stack development..."
                className="min-h-[120px]"
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Your professional history</CardDescription>
              </div>
              <Button onClick={addExperience} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence>
                {resumeData.experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          placeholder="Senior Software Engineer"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          placeholder="Tech Corp"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="San Francisco, CA"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Key responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Your academic background</CardDescription>
              </div>
              <Button onClick={addEducation} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence>
                {resumeData.education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          placeholder="Bachelor of Science in Computer Science"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>School</Label>
                        <Input
                          placeholder="University of Technology"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="Boston, MA"
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input
                          placeholder="3.8"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Your technical and soft skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {resumeData.skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-20"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Optimization Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-6xl font-bold text-primary"
                >
                  {optimizationScore}%
                </motion.div>
                <p className="text-sm text-muted-foreground mt-2">Resume Completeness</p>
              </div>
              <Button onClick={calculateOptimization} className="w-full">
                Calculate Score
              </Button>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Personal Info</span>
                  <span>{resumeData.personalInfo.fullName ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Summary</span>
                  <span>{resumeData.summary ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience</span>
                  <span>{resumeData.experiences.length > 0 ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Education</span>
                  <span>{resumeData.education.length > 0 ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Skills</span>
                  <span>{resumeData.skills.length >= 5 ? "✓" : "○"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
