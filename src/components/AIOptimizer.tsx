"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Progress } from "@/components/ui/Progress"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Separator } from "@/components/ui/Separator"
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
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface OptimizationResults {
  atsScore: number
  missingKeywords: string[]
  matchedKeywords: string[]
  suggestions: string[]
}

export function AIOptimizer() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<OptimizationResults | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setResumeText(data.text)
      toast.success(`${file.name} uploaded successfully`)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast.error("Input missing: Job Description and Resume required.")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText }),
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
    <div className="flex flex-col lg:flex-row h-full gap-6 pb-4 lg:p-0">
      {/* Left: Input Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="glass-panel flex-1 flex flex-col overflow-hidden rounded-3xl border-white/10 shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 box-shadow-glow">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Optimization Core</h2>
              <p className="text-xs text-zinc-400">Align your profile with market requirements</p>
            </div>
          </div>

          <ScrollArea className="flex-1 relative z-10">
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
                    className="relative bg-black/40 border-white/10 focus:border-purple-500/50 text-white placeholder:text-zinc-600 resize-none rounded-2xl p-4"
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
                            <p className="text-xs text-zinc-500 mt-1">PDF, DOCX or DOC (Max 10MB)</p>
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
                    <div className="text-center text-xs text-zinc-500 my-2">or paste manually</div>
                    <div className="relative group/input">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition duration-500" />
                      <Textarea
                        id="resumeText"
                        placeholder="Paste your resume text here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={6}
                        className="relative bg-black/40 border-white/10 focus:border-blue-500/50 text-white placeholder:text-zinc-600 resize-none rounded-2xl p-4"
                      />
                    </div>
                  </div>
                )}
                
                {/* Show extracted text preview if file uploaded */}
                {uploadedFile && resumeText && (
                  <div className="relative group/input">
                    <div className="text-xs text-zinc-400 mb-2">Extracted Content (editable):</div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition duration-500" />
                    <Textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      rows={6}
                      className="relative bg-black/40 border-white/10 focus:border-blue-500/50 text-white placeholder:text-zinc-600 resize-none rounded-2xl p-4 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md relative z-10">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim() || !resumeText.trim()}
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
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
