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

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    })

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    // Parse and validate AI response with error handling
    let optimizationData
    try {
      optimizationData = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      console.error('Raw AI output:', text)
      return NextResponse.json(
        { error: 'AI response was not in valid JSON format' },
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
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    )
  }
}
