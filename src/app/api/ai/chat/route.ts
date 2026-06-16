import { groq } from '@ai-sdk/groq'
import { convertToModelMessages, streamText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const maxDuration = 30

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    let messages: Array<{ role: string; content: string }>
    let sessionId: string | undefined
    let resumeContext: string | undefined
    
    try {
      const body = await request.json()
      messages = body.messages
      sessionId = body.sessionId
      resumeContext = body.resumeContext
      
      if (!messages || !Array.isArray(messages)) {
        return new Response(
          JSON.stringify({ error: 'Invalid messages format' }), 
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      const hasValidUserMessage = messages.some(
        (message) =>
          typeof message === 'object' &&
          message !== null &&
          typeof message.role === 'string' &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0
      )

      if (!hasValidUserMessage) {
        return new Response(
          JSON.stringify({ error: 'At least one valid text message is required' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

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
    if (lastMessage && lastMessage.role === 'user') {
      await prisma.chatMessage.create({
        data: {
          userId: userId,
          clerkUserId: userId,
          role: 'user',
          content: lastMessage.content,
          sessionId: sessionId,
        },
      })
    }

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured. Please set GROQ_API_KEY.' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const model = groq('llama-3.3-70b-versatile')

    let systemPrompt = `You are an expert career coach and resume advisor with years of experience helping professionals optimize their resumes and advance their careers. 

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

Keep responses concise but comprehensive, typically 2-4 paragraphs unless more detail is requested.`

    if (resumeContext) {
      systemPrompt += `\n\nHere is the user's current resume data for context:\n${resumeContext}`
    }

    const validMessages = messages
      .filter(
        (m): m is { role: string; content: string } =>
          typeof m?.role === 'string' &&
          typeof m?.content === 'string' &&
          m.content.trim().length > 0
      )
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }))

    if (validMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid chat messages were provided.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // biome-ignore lint/suspicious/noExplicitAny: convertToModelMessages v6 expects UIMessage with parts field; our simple role/content messages are runtime-compatible
    const coreMessages = await convertToModelMessages(validMessages as any)

    const result = streamText({
      // @ts-expect-error - groq provider returns LanguageModelV1, compatible at runtime
      model,
      messages: coreMessages,
      system: systemPrompt,
      onFinish: async ({ text }) => {
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

    const response = result.toTextStreamResponse()
    response.headers.set('X-Session-Id', sessionId)
    
    return response
  } catch (error) {
    console.error('Error in chat route:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request. Please try again.',
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
