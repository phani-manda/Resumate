"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Send, Bot, User, Sparkles, AlertCircle, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { useChat } from 'ai/react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

const SUGGESTED_QUESTIONS = [
  'How can I improve my resume summary?',
  'What skills should I highlight for a tech role?',
  'How do I describe my achievements better?',
  'Should I include a cover letter?',
  'How far back should my work history go?',
]

export function CareerCoachChat() {
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [reactionState, setReactionState] = useState<Record<string, 'thumbsUp' | 'thumbsDown'>>({})

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/ai/chat',
    body: { sessionId },
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Career Coach. I'm here to help you optimize your resume, prepare for interviews, and advance your career. What would you like to know?",
      },
    ],
    onResponse: (response) => {
      const nextSessionId = response.headers.get('X-Session-Id')
      if (nextSessionId) {
        setSessionId(nextSessionId)
      }
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  useEffect(() => {
    let isMounted = true

    const loadHistory = async () => {
      try {
        const response = await fetch('/api/ai/chat/history?limit=40')
        if (!response.ok) return

        const payload = await response.json()
        if (!isMounted) return

        if (Array.isArray(payload.messages) && payload.messages.length > 0) {
          setMessages(
            payload.messages.map((message: { id: string; role: 'user' | 'assistant'; content: string }) => ({
              id: message.id,
              role: message.role,
              content: message.content,
            }))
          )

          const lastMessage = payload.messages[payload.messages.length - 1]
          if (lastMessage?.sessionId) {
            setSessionId(lastMessage.sessionId)
          }
        }
      } catch (historyError) {
        console.error('Failed to load chat history:', historyError)
      }
    }

    void loadHistory()

    return () => {
      isMounted = false
    }
  }, [setMessages])

  const handleSendQuestion = (question: string) => {
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
    
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.requestSubmit()
      }
    }, 0)
  }

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      toast.success('Message copied')

      window.setTimeout(() => {
        setCopiedMessageId((current) => (current === messageId ? null : current))
      }, 1200)
    } catch (copyError) {
      console.error('Copy failed:', copyError)
      toast.error('Could not copy message')
    }
  }

  const handleReaction = async (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => {
    setReactionState((current) => ({ ...current, [messageId]: reaction }))

    try {
      const response = await fetch(`/api/ai/chat/messages/${messageId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction }),
      })

      if (!response.ok) {
        throw new Error('Reaction save failed')
      }
    } catch (reactionError) {
      console.error('Reaction failed:', reactionError)
      toast.error('Could not save feedback')
    }
  }

  return (
    <div className="grid h-full grid-cols-1 grid-rows-1 gap-6 overflow-hidden lg:grid-cols-3 xl:gap-8">
      {/* Main Chat Panel - Fixed height with internal scroll */}
      <div className="lg:col-span-2 min-h-0 overflow-hidden">
        <Card className="futuristic-card flex h-full flex-col overflow-hidden rounded-[30px]">
          <CardHeader className="flex-shrink-0 bg-card/48 px-7 py-6">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Career Coach
            </CardTitle>
            <CardDescription>Get personalized career advice and resume tips</CardDescription>
          </CardHeader>
          
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            {/* Error Alert - Fixed */}
            {error && (
              <div className="flex-shrink-0">
                <Alert variant="destructive" className="mx-6 mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message === 'Unauthorized' 
                      ? 'Please sign in to use the career coach.' 
                      : 'Failed to connect to AI service. Please try again.'}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {/* Scrollable Messages Area - Only this scrolls */}
            <div className="flex-1 min-h-0 overflow-hidden" ref={scrollAreaRef}>
              <ScrollArea className="h-full">
                <div className="space-y-5 px-7 py-6">
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
                        className={`group relative max-w-[80%] rounded-[22px] p-4 ${
                          message.role === 'user'
                            ? 'bg-orange-500 text-white shadow-[0_0_24px_-12px_rgba(255,122,26,0.7)]'
                            : 'surface-soft text-foreground'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-inherit prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-code:text-inherit">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.18em] opacity-60">
                            {message.role === 'user' ? 'You' : 'Coach'}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full bg-black/10 hover:bg-black/20"
                              onClick={() => handleCopyMessage(message.id, message.content)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            {message.role === 'assistant' && (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={`h-7 w-7 rounded-full bg-black/10 hover:bg-black/20 ${
                                    reactionState[message.id] === 'thumbsUp' ? 'text-orange-300' : ''
                                  }`}
                                  onClick={() => handleReaction(message.id, 'thumbsUp')}
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={`h-7 w-7 rounded-full bg-black/10 hover:bg-black/20 ${
                                    reactionState[message.id] === 'thumbsDown' ? 'text-red-300' : ''
                                  }`}
                                  onClick={() => handleReaction(message.id, 'thumbsDown')}
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        {copiedMessageId === message.id && (
                          <div className="mt-2 text-[11px] font-medium text-orange-300">Copied</div>
                        )}
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
                    <div className="rounded-2xl bg-card/72 p-4 shadow-[var(--shadow-sm)]">
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
              </div>
              </ScrollArea>
            </div>
            
            {/* Fixed Input Area - Stays at bottom */}
            <div className="flex-shrink-0 bg-card/42 px-7 py-5">
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
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((question) => (
                  <Button
                    key={question}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-card/72"
                    onClick={() => handleSendQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Fixed with internal scroll */}
      <div className="flex flex-col gap-6 overflow-hidden min-h-0">
        {/* Quick Tips Card */}
        <Card className="futuristic-card flex-shrink-0 rounded-[30px]">
          <CardHeader className="px-7 py-6">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-400" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-7 pb-7">
            <div className="rounded-2xl bg-card/72 p-4 shadow-[var(--shadow-sm)]">
              <h4 className="mb-1 text-sm font-medium">Use Action Verbs</h4>
              <p className="text-xs text-muted-foreground">
                Start bullet points with strong verbs like "Led", "Developed", "Increased"
              </p>
            </div>
            <div className="rounded-2xl bg-card/72 p-4 shadow-[var(--shadow-sm)]">
              <h4 className="mb-1 text-sm font-medium">Quantify Results</h4>
              <p className="text-xs text-muted-foreground">
                Include numbers, percentages, and metrics to show impact
              </p>
            </div>
            <div className="rounded-2xl bg-card/72 p-4 shadow-[var(--shadow-sm)]">
              <h4 className="mb-1 text-sm font-medium">Tailor Content</h4>
              <p className="text-xs text-muted-foreground">
                Customize your resume for each job application
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Questions Card - Scrollable */}
        <Card className="futuristic-card flex min-h-0 flex-1 flex-col rounded-[30px]">
          <CardHeader className="flex-shrink-0 px-7 py-6">
            <CardTitle>Suggested Questions</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="space-y-3 px-7 pb-7">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto w-full justify-start rounded-2xl bg-card/72 px-4 py-4 text-left text-foreground shadow-[var(--shadow-sm)] hover:bg-orange-500/10"
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
