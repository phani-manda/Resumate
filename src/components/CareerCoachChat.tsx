"use client"

import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Send, AlertCircle, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

const STARTER_PROMPTS = [
  'Review my resume bullet points',
  'Help me prepare for a technical interview',
  'What skills should I highlight for this role?',
  'How can I improve my resume summary?',
]

const GREETING: UIMessage = {
  id: 'greeting',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: "Hello! I'm your AI Career Coach. I'm here to help you optimize your resume, prepare for interviews, and advance your career. What would you like to know?",
    },
  ],
}

/** Concatenates the text parts of a UI message for display/copying. */
function getMessageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
}

interface ChatHistoryMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sessionId?: string
}

export function CareerCoachChat() {
  const [input, setInput] = useState('')
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [reactionState, setReactionState] = useState<Record<string, 'thumbsUp' | 'thumbsDown'>>({})

  // The session id travels with every request; the transport reads it lazily
  // so an updated id (after history load) is used without recreating the chat.
  const sessionIdRef = useRef<string | undefined>(undefined)
  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: '/api/ai/chat',
        body: () => ({ sessionId: sessionIdRef.current }),
      }),
    []
  )

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
    messages: [GREETING],
    onError: (chatError) => {
      console.error('Chat error:', chatError)
    },
  })

  const isBusy = status === 'submitted' || status === 'streaming'
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
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
          const history = payload.messages as ChatHistoryMessage[]
          setMessages(
            history.map((message) => ({
              id: message.id,
              role: message.role,
              parts: [{ type: 'text' as const, text: message.content }],
            }))
          )

          const lastMessage = history[history.length - 1]
          if (lastMessage?.sessionId) {
            sessionIdRef.current = lastMessage.sessionId
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

  const handleSend = () => {
    const text = input.trim()
    if (!text || isBusy) return
    setInput('')
    void sendMessage({ text })
  }

  const handleSendQuestion = (question: string) => {
    if (isBusy) return
    void sendMessage({ text: question })
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
    messages.length <= 1 && messages[0]?.role === 'assistant' && !isBusy

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <header className="mb-4 shrink-0">
        <h1 className="text-heading-xl text-ink-primary">Career Coach</h1>
        <p className="text-body-sm text-ink-secondary">Your AI-powered career advisor</p>
      </header>

      <div className="flex min-h-0 flex-1">
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
                  {messages.map((message) => {
                    const text = getMessageText(message)
                    return (
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
                            <ReactMarkdown>{text}</ReactMarkdown>
                          </div>
                          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCopyMessage(message.id, text)}
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
                    )
                  })}
                </AnimatePresence>

                {isBusy && (
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
            onSubmit={(event) => {
              event.preventDefault()
              handleSend()
            }}
            className="shrink-0 border-t border-line p-4"
          >
            <div className="flex items-end gap-3 rounded-xl border border-line-strong bg-surface px-4 py-3">
              <Textarea
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isBusy}
                rows={1}
                className="min-h-[24px] max-h-32 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                type="submit"
                variant={input.trim() ? 'action' : 'ghost'}
                size="icon"
                disabled={!input.trim() || isBusy}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}