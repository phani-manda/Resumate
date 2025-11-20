"use client"

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChat } from 'ai/react'

const SUGGESTED_QUESTIONS = [
  'How can I improve my resume summary?',
  'What skills should I highlight for a tech role?',
  'How do I describe my achievements better?',
  'Should I include a cover letter?',
  'How far back should my work history go?',
]

export function CareerCoachChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Career Coach. I'm here to help you optimize your resume, prepare for interviews, and advance your career. What would you like to know?",
      },
    ],
  })

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendQuestion = (question: string) => {
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
    
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.requestSubmit()
      }
    }, 0)
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Chat Panel - Fixed height with internal scroll */}
      <div className="lg:col-span-2">
        <Card className="flex h-full flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Career Coach
            </CardTitle>
            <CardDescription>Get personalized career advice and resume tips</CardDescription>
          </CardHeader>
          
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            {/* Scrollable Messages Area */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="min-h-0 space-y-4 pb-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 border-2 border-primary">
                          <AvatarFallback className="bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 border-2 border-muted">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
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
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="h-2 w-2 rounded-full bg-primary"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-primary"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            
            {/* Fixed Input Area */}
            <div className="flex-shrink-0 border-t px-6 py-4">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  placeholder="Ask me anything about your career..."
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Fixed with internal scroll */}
      <div className="flex flex-col gap-6 overflow-hidden">
        {/* Quick Tips Card */}
        <Card className="flex-shrink-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-muted p-3">
              <h4 className="mb-1 text-sm font-medium">Use Action Verbs</h4>
              <p className="text-xs text-muted-foreground">
                Start bullet points with strong verbs like "Led", "Developed", "Increased"
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <h4 className="mb-1 text-sm font-medium">Quantify Results</h4>
              <p className="text-xs text-muted-foreground">
                Include numbers, percentages, and metrics to show impact
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <h4 className="mb-1 text-sm font-medium">Tailor Content</h4>
              <p className="text-xs text-muted-foreground">
                Customize your resume for each job application
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Questions Card - Scrollable */}
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Suggested Questions</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="space-y-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto w-full justify-start py-3 text-left"
                  onClick={() => handleSendQuestion(question)}
                >
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
