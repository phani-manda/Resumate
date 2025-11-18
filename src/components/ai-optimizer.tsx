"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, Download, FileText, Zap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface OptimizationResults {
  atsScore: number
  keywordsToAdd: string[]
  matchedKeywords: string[]
  suggestions: string[]
  reportId?: string
}

export function AIOptimizer() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<OptimizationResults | null>(null)

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast.error("Please provide both job description and resume text")
      return
    }

    setAnalyzing(true)
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const data = await response.json()
      setResults({
        atsScore: data.atsScore,
        keywordsToAdd: data.keywordsToAdd,
        matchedKeywords: data.matchedKeywords,
        suggestions: data.suggestions,
        reportId: data.reportId,
      })
      toast.success("Resume analysis complete!")
    } catch (error) {
      console.error('Error analyzing resume:', error)
      toast.error("Failed to analyze resume. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleExportPDF = () => {
    // PDF export logic would go here
    console.log("Exporting PDF...")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Job Description Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Job Description
              </CardTitle>
              <CardDescription>
                Paste the job description you're targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                className="min-h-[200px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Resume
              </CardTitle>
              <CardDescription>
                Paste your current resume text or upload a file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your resume text here..."
                className="min-h-[300px] resize-none"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <div className="flex gap-3">
                <Button 
                  onClick={handleAnalyze}
                  className="bg-gradient-to-r from-blue-500 to-primary hover:from-blue-600 hover:to-primary/90"
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                      </motion.div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  Upload Resume File
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ATS Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                ATS Compatibility Score
              </CardTitle>
              <CardDescription>
                How well your resume matches the job description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {results ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-primary to-success bg-clip-text text-transparent"
                      >
                        {results.atsScore}%
                      </motion.div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {results.atsScore >= 80 ? "Excellent Match" : results.atsScore >= 60 ? "Good Match" : "Needs Improvement"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {results.matchedKeywords.length} Keywords Matched
                      </Badge>
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {results.keywordsToAdd.length} Keywords Missing
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overall Score</span>
                      <span className="font-medium">{results.atsScore}%</span>
                    </div>
                    <Progress value={results.atsScore} className="h-3" />
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Analyze your resume to see your ATS compatibility score</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Keywords to Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Recommended Keywords
              </CardTitle>
              <CardDescription>
                Add these keywords to improve your ATS score
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="flex flex-wrap gap-2">
                  {results.keywordsToAdd.map((keyword, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge 
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {keyword}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Analyze your resume to see keyword recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Matched Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Matched Keywords
              </CardTitle>
              <CardDescription>
                Keywords already present in your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="flex flex-wrap gap-2">
                  {results.matchedKeywords.map((keyword, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {keyword}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Analyze your resume to see matched keywords</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Optimization Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Optimization Suggestions
              </CardTitle>
              <CardDescription>
                AI-powered recommendations to improve your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <ul className="space-y-3">
                  {results.suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm flex-1">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Analyze your resume to see optimization suggestions</p>
                </div>
              )}
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
          className="sticky top-20 space-y-6"
        >
          {/* Resume Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume Preview</CardTitle>
              <CardDescription>Live preview of your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/20 p-4">
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-bold text-lg">John Doe</h3>
                    <p className="text-muted-foreground">john@example.com | +1 (555) 123-4567</p>
                    <p className="text-muted-foreground">San Francisco, CA</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Professional Summary</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Experienced software engineer with 5+ years in full-stack development. 
                      Specialized in React, Node.js, and cloud technologies.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Work Experience</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-xs">Senior Software Engineer</p>
                        <p className="text-muted-foreground text-xs">Tech Corp • 2020 - Present</p>
                      </div>
                      <div>
                        <p className="font-medium text-xs">Software Engineer</p>
                        <p className="text-muted-foreground text-xs">StartUp Inc • 2018 - 2020</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Education</h4>
                    <p className="font-medium text-xs">B.S. Computer Science</p>
                    <p className="text-muted-foreground text-xs">University of Technology • 2018</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {["JavaScript", "React", "Node.js", "TypeScript", "Python"].map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-primary hover:from-blue-600 hover:to-primary/90"
                onClick={handleExportPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download as PDF
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Copy to Builder
              </Button>
              <Button variant="outline" className="w-full">
                Save Optimized Version
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Word Count</span>
                <span className="font-semibold">487</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Readability</span>
                <Badge variant="outline" className="bg-success/10 text-success">High</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Action Verbs</span>
                <span className="font-semibold">12</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bullet Points</span>
                <span className="font-semibold">8</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
