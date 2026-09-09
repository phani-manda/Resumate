import { groq } from '@ai-sdk/groq'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const maxDuration = 30

// Model is configurable via GROQ_MODEL so it can be swapped without a code change.
const MODEL_ID = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/** Concatenates the text parts of a UI message. */
function getMessageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim()
}

function isUIMessage(value: unknown): value is UIMessage {
  if (typeof value !== 'object' || value === null) return false
  const message = value as { role?: unknown; parts?: unknown }
  return (
    typeof message.role === 'string' &&
    ['user', 'assistant', 'system'].includes(message.role) &&
    Array.isArray(message.parts)
  )
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let messages: UIMessage[]
    let sessionId: string | undefined
    let resumeContext: string | undefined

    try {
      const body = (await request.json()) as {
        messages?: unknown
        sessionId?: string
        resumeContext?: string
      }
      sessionId = body.sessionId
      resumeContext = body.resumeContext

      if (!Array.isArray(body.messages) || body.messages.length === 0) {
        return Response.json({ error: 'Invalid messages format' }, { status: 400 })
      }

      if (!body.messages.every(isUIMessage)) {
        return Response.json({ error: 'Invalid messages format' }, { status: 400 })
      }

      messages = body.messages

      const hasUserMessage = messages.some(
        (message) => message.role === 'user' && getMessageText(message).length > 0
      )

      if (!hasUserMessage) {
        return Response.json(
          { error: 'At least one valid text message is required' },
          { status: 400 }
        )
      }
    } catch {
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    // Reuse the client's session id, or fall back to a recent session / a new one.
    if (!sessionId) {
      const recentMessage = await prisma.chatMessage.findFirst({
        where: {
          clerkUserId: userId,
          timestamp: {
            gte: new Date(Date.now() - 30 * 60 * 1000),
          },
        },
        orderBy: { timestamp: 'desc' },
        select: { sessionId: true },
      })

      sessionId = recentMessage?.sessionId || generateSessionId()
    }

    const lastMessage = messages[messages.length - 1]
    const lastUserText = lastMessage?.role === 'user' ? getMessageText(lastMessage) : ''

    if (lastUserText) {
      await prisma.chatMessage.create({
        data: {
          userId: userId,
          clerkUserId: userId,
          role: 'user',
          content: lastUserText,
          sessionId: sessionId,
        },
      })
    }

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: 'AI service not configured. Please set GROQ_API_KEY.' },
        { status: 503 }
      )
    }

    const systemPrompt = `You are an expert career coach and resume advisor with years of experience helping professionals optimize their resumes and advance their careers.

Your role is to:
- Provide actionable, specific advice on resume optimization
- Help users craft compelling professional summaries and achievement statements
- Suggest relevant keywords and skills for their target roles
- Guide them on resume formatting and structure
- Offer interview preparation tips
- Provide career development guidance

Always be:
- Professional yet friendly and encouraging
- Specific with examples when possible
- Focused on actionable improvements
- Supportive of the user's career goals

Keep responses concise but comprehensive, typically 2-4 paragraphs unless more detail is requested.${
      resumeContext
        ? `

Here is the user's current resume data for context:
${resumeContext}`
        : ''
    }`

    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: groq(MODEL_ID),
      messages: modelMessages,
      system: systemPrompt,
      onFinish: async ({ text }) => {
        if (!text.trim()) return
        try {
          await prisma.chatMessage.create({
            data: {
              userId: userId,
              clerkUserId: userId,
              role: 'assistant',
              content: text,
              sessionId: sessionId,
            },
          })
        } catch (dbError) {
          console.error('Failed to save assistant message:', dbError)
        }
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Error in chat route:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error)
    return Response.json(
      { error: 'Failed to process chat request. Please try again.' },
      { status: 500 }
    )
  }
}