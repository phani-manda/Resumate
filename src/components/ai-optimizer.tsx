"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react"

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

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast.error("Please provide both job description and resume")
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
        atsScore: data.atsScore,
        missingKeywords: data.missingKeywords,
        matchedKeywords: data.matchedKeywords,
        suggestions: data.suggestions,
      })
      toast.success("Analysis complete!")
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to analyze resume')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left: Input Form - Scrollable */}
      <div className="w-1/2">
        <Card className="h-full">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Resume Optimizer
            </CardTitle>
            <CardDescription>
              Analyze your resume against job descriptions and get AI-powered suggestions
            </CardDescription>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-12rem)]">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeText">Your Resume</Label>
                <Textarea
                  id="resumeText"
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={12}
                />
              </div>
            </CardContent>
          </ScrollArea>
          <div className="flex-shrink-0 border-t p-6">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim() || !resumeText.trim()}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Right: Results - Fixed with internal scroll */}
      <div className="w-1/2">
        <Card className="flex h-full flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>

          {!results ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No Analysis Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your resume and job description, then click Analyze
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <CardContent className="space-y-6 p-6">
                {/* ATS Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">ATS Compatibility Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-4xl font-bold ${getScoreColor(results.atsScore)}`}>
                          {results.atsScore}%
                        </span>
                        <Badge variant={results.atsScore >= 80 ? 'default' : 'secondary'}>
                          {getScoreLabel(results.atsScore)}
                        </Badge>
                      </div>
                      <Progress value={results.atsScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Keywords Analysis */}
                <Tabs defaultValue="missing">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="missing">
                      Missing ({results.missingKeywords.length})
                    </TabsTrigger>
                    <TabsTrigger value="matched">
                      Matched ({results.matchedKeywords.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="missing" className="space-y-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          Keywords to Add
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {results.missingKeywords.length > 0 ? (
                            results.missingKeywords.map((keyword) => (
                              <Badge key={keyword} variant="outline" className="border-yellow-600">
                                {keyword}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              All important keywords are present!
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="matched" className="space-y-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Matched Keywords
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {results.matchedKeywords.length > 0 ? (
                            results.matchedKeywords.map((keyword) => (
                              <Badge key={keyword} variant="outline" className="border-green-600">
                                {keyword}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No matched keywords found
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="h-4 w-4" />
                      AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {results.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {index + 1}
                          </span>
                          <p className="text-sm">{suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  )
}
