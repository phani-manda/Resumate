"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const SAMPLE_RESPONSES = [
  "Great question! To make your resume stand out, focus on quantifiable achievements. Instead of 'Managed a team', try 'Led a team of 8 developers, increasing productivity by 35%'.",
  "I'd recommend highlighting your most relevant skills at the top of your resume. Consider creating a 'Key Skills' section with 6-8 core competencies that match the job description.",
  "For your professional summary, aim for 3-4 impactful sentences that showcase your unique value proposition. Start with your title and years of experience, then highlight 2-3 major achievements.",
  "Action verbs are crucial! Replace passive language with strong verbs like 'spearheaded', 'implemented', 'optimized', 'orchestrated', or 'revolutionized'.",
  "Keep your resume to 1-2 pages. Focus on the last 10-15 years of experience, and make sure every bullet point demonstrates value you brought to previous roles.",
]

const SUGGESTED_QUESTIONS = [
  "How can I improve my resume summary?",
  "What skills should I highlight for a tech role?",
  "How do I describe my achievements better?",
  "Should I include a cover letter?",
  "How far back should my work history go?",
]

export function CareerCoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Career Coach. I'm here to help you optimize your resume, prepare for interviews, and advance your career. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Career Coach
            </CardTitle>
            <CardDescription>Get personalized career advice and resume tips</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 border-2 border-primary">
                          <AvatarFallback className="bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 border-2 border-muted">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <div className="flex gap-2 pt-4 border-t">
              <Input
                placeholder="Ask me anything about your career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={() => handleSend()} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Use Action Verbs</h4>
              <p className="text-xs text-muted-foreground">
                Start bullet points with strong verbs like "Led", "Developed", "Increased"
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Quantify Results</h4>
              <p className="text-xs text-muted-foreground">
                Include numbers, percentages, and metrics to show impact
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Tailor Content</h4>
              <p className="text-xs text-muted-foreground">
                Customize your resume for each job application
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => handleSend(question)}
              >
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
