import { groq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages } = await request.json()

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages,
      system: "You are a professional career coach helping users optimize their resumes and advance their careers. Provide specific, actionable advice. Be encouraging, professional, and detail-oriented. Help users with resume writing, job search strategies, interview preparation, and career development.",
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat route:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
