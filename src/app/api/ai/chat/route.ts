import { groq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { v4 as uuidv4 } from 'crypto'

export const maxDuration = 30

// Generate a session ID for grouping messages
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
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

    // Validate request body
    let messages
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
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate session ID if not provided
    if (!sessionId) {
      // Check for existing recent session (within 30 minutes)
      const recentMessage = await prisma.chatMessage.findFirst({
        where: {
          clerkUserId: userId,
          timestamp: {
            gte: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          },
        },
        orderBy: { timestamp: 'desc' },
        select: { sessionId: true },
      })
      
      sessionId = recentMessage?.sessionId || generateSessionId()
    }

    // Save the user message to the database BEFORE streaming
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

    // Use Groq for fast chat responses
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
    console.log('Using Groq for chat completion')

    // Build system prompt with optional resume context
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

    // Stream AI response
    const result = await streamText({
      // @ts-expect-error - AI SDK version type mismatch
      model: model,
      messages,
      system: systemPrompt,
      onFinish: async ({ text }) => {
        // Save the assistant's response after streaming completes
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

    // Add session ID to response headers
    const response = result.toDataStreamResponse()
    response.headers.set('X-Session-Id', sessionId)
    
    return response
  } catch (error) {
    console.error('Error in chat route:', error)
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
