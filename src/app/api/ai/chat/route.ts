import { groq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export const maxDuration = 30

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
    try {
      const body = await request.json()
      messages = body.messages
      
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

    // Stream AI response
    const result = await streamText({
      model,
      messages,
      system: `You are an expert career coach and resume advisor with years of experience helping professionals optimize their resumes and advance their careers. 

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

Keep responses concise but comprehensive, typically 2-4 paragraphs unless more detail is requested.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat route:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
