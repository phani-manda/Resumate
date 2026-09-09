"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Send, AlertCircle, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { useChat } from '@ai-sdk/react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

const STARTER_PROMPTS = [
  'Review my resume bullet points',
  'Help me prepare for a technical interview',
  'What skills should I highlight for this role?',
  'How can I improve my resume summary?',
]

export function CareerCoachChat() {
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [reactionState, setReactionState] = useState<Record<string, 'thumbsUp' | 'thumbsDown'>>({})

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages, append } = useChat({
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
    const viewport = scrollAreaRef.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    let isMounted = true

    interface ChatHistoryMessage {
      id: string
      role: 'user' | 'assistant'
      content: string
      sessionId?: string
    }

    const loadHistory = async () => {
      try {
        const response = await fetch('/api/ai/chat/history?limit=40')
        if (!response.ok) return

        const payload = await response.json()
        if (!isMounted) return

        if (Array.isArray(payload.messages) && payload.messages.length > 0) {
          setMessages(
            (payload.messages as ChatHistoryMessage[]).map((message) => ({
              id: message.id,
              role: message.role,
              content: message.content,
            }))
          )

          const lastMessage = (payload.messages as ChatHistoryMessage[])[payload.messages.length - 1]
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
    void append({ role: 'user', content: question })
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

  const showStarters =
    messages.length <= 1 && messages[0]?.role === 'assistant' && !isLoading

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <header className="mb-4 shrink-0">
        <h1 className="text-heading-xl text-ink-primary">Career Coach</h1>
        <p className="text-body-sm text-ink-secondary">Your AI-powered career advisor</p>
      </header>

      <div className="flex min-h-0 flex-1 gap-6">
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-line bg-surface shadow-card">
          {error && (
            <Alert variant="destructive" className="m-4 shrink-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message === 'Unauthorized'
                  ? 'Please sign in to use the career coach.'
                  : 'Failed to connect to AI service. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <div className="min-h-0 flex-1 overflow-hidden" ref={scrollAreaRef}>
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                {showStarters && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendQuestion(prompt)}
                        className="rounded-xl border border-line bg-subtle p-3 text-left text-body-sm text-ink-primary transition-colors hover:border-line-strong hover:bg-surface"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`group relative max-w-[85%] px-4 py-3 ${
                          message.role === 'user'
                            ? 'rounded-xl rounded-br-sm bg-accent-subtle text-accent-text'
                            : 'rounded-xl rounded-bl-sm border border-line bg-surface text-ink-primary'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none text-inherit prose-p:my-1">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
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
                                className="h-7 w-7"
                                onClick={() => handleReaction(message.id, 'thumbsUp')}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleReaction(message.id, 'thumbsDown')}
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                        {copiedMessageId === message.id && (
                          <p className="mt-1 text-caption text-accent-text">Copied</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl rounded-bl-sm border border-line bg-surface px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 0.15, 0.3].map((delay) => (
                          <motion.span
                            key={delay}
                            className="h-2 w-2 rounded-full bg-ink-muted"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-line p-4"
          >
            <div className="flex items-end gap-3 rounded-xl border border-line-strong bg-surface px-4 py-3">
              <Textarea
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={1}
                className="min-h-[24px] max-h-32 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (input.trim()) handleSubmit(e as unknown as React.FormEvent)
                  }
                }}
              />
              <Button
                type="submit"
                variant={input.trim() ? 'action' : 'ghost'}
                size="icon"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        <aside className="hidden w-56 shrink-0 lg:block">
          <p className="mb-3 text-label uppercase text-ink-muted">History</p>
          <p className="text-body-sm text-ink-muted">
            Past sessions appear here as you chat.
          </p>
        </aside>
      </div>
    </div>
  )
}
