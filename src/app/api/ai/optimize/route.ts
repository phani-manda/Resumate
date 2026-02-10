import { groq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeText, jobDescription } = await request.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      )
    }

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume against the job description and provide:
1. ATS compatibility score (0-100)
2. Missing keywords (array of strings)
3. Matched keywords (array of strings)
4. Optimization suggestions (array of strings with specific actionable advice)

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this exact format:
{
  "atsScore": number,
  "missingKeywords": ["keyword1", "keyword2"],
  "matchedKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`

    // Use Groq for fast optimization analysis
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set GROQ_API_KEY.' },
        { status: 500 }
      )
    }

    const model = groq('llama-3.3-70b-versatile')
    console.log('Using Groq Llama 3.3 for resume optimization')

    let text
    try {
      const response = await generateText({
        model,
        prompt,
      })
      text = response.text
      console.log('AI Response:', text.substring(0, 200)) // Log first 200 chars for debugging
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      return NextResponse.json(
        { 
          error: 'Failed to generate AI response',
          details: aiError instanceof Error ? aiError.message : 'Unknown AI error'
        },
        { status: 500 }
      )
    }

    // Extract JSON from response (handle markdown code blocks and extra text)
    let jsonText = text.trim()
    
    // Remove markdown code blocks
    if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }
    
    // Try to find JSON object in the text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }

    // Parse and validate AI response with error handling
    let optimizationData
    try {
      optimizationData = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      console.error('Raw AI output:', text)
      
      // Try to extract meaningful data even if JSON parsing fails
      return NextResponse.json(
        { 
          error: 'AI response was not in valid JSON format',
          rawResponse: text.substring(0, 500), // Send first 500 chars for debugging
        },
        { status: 500 }
      )
    }

    // Validate required fields and types
    if (
      typeof optimizationData.atsScore !== 'number' ||
      !Array.isArray(optimizationData.missingKeywords) ||
      !Array.isArray(optimizationData.matchedKeywords) ||
      !Array.isArray(optimizationData.suggestions)
    ) {
      console.error('AI response missing required fields or invalid types:', optimizationData)
      return NextResponse.json(
        { error: 'AI response structure is invalid' },
        { status: 500 }
      )
    }

    // Attempt to save optimization report to database
    let reportId = null
    try {
      const report = await prisma.optimizationReport.create({
        data: {
          userId: userId,
          clerkUserId: userId,
          atsScore: optimizationData.atsScore,
          keywords: {
            missing: optimizationData.missingKeywords,
            matched: optimizationData.matchedKeywords,
          },
          suggestions: optimizationData.suggestions,
        },
      })
      reportId = report.id
    } catch (dbError) {
      // Log database error but continue returning analysis to user
      // Storage failures should not block user from seeing AI results
      console.error('Database save failed for optimization report:', dbError)
      console.error('Error details:', dbError instanceof Error ? dbError.message : dbError)
    }

    // Return analysis data regardless of database save success
    return NextResponse.json({
      atsScore: optimizationData.atsScore,
      keywordsToAdd: optimizationData.missingKeywords,
      matchedKeywords: optimizationData.matchedKeywords,
      suggestions: optimizationData.suggestions,
      reportId,
      ...(reportId === null && { warning: 'Analysis generated but not saved to database' }),
    })
  } catch (error) {
    console.error('Error in optimize route:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Failed to optimize resume',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check if GOOGLE_GENERATIVE_AI_API_KEY is set correctly'
      },
      { status: 500 }
    )
  }
}
