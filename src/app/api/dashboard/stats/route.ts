import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's resumes count
    const resumesCount = await prisma.resume.count({
      where: { clerkUserId: userId },
    })

    // Get optimization reports with scores
    const optimizationReports = await prisma.optimizationReport.findMany({
      where: { clerkUserId: userId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        atsScore: true,
        createdAt: true,
      },
    })

    // Calculate ATS score stats
    const scores = optimizationReports.map(r => r.atsScore)
    const latestScore = scores[scores.length - 1] || 0
    const firstScore = scores[0] || 0
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0
    const scoreImprovement = scores.length > 1 ? latestScore - firstScore : 0

    // Get chat message count
    const chatCount = await prisma.chatMessage.count({
      where: { clerkUserId: userId },
    })

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentOptimizations = await prisma.optimizationReport.count({
      where: {
        clerkUserId: userId,
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    // Get ATS score history for chart (last 10 reports)
    const scoreHistory = optimizationReports.slice(-10).map(report => ({
      date: report.createdAt.toISOString(),
      score: report.atsScore,
    }))

    // Get most common missing keywords (aggregate from all reports)
    const allReports = await prisma.optimizationReport.findMany({
      where: { clerkUserId: userId },
      select: { keywords: true },
    })

    const keywordCounts: Record<string, number> = {}
    for (const report of allReports) {
      const keywords = report.keywords as any
      if (keywords?.missing && Array.isArray(keywords.missing)) {
        for (const kw of keywords.missing) {
          keywordCounts[kw] = (keywordCounts[kw] || 0) + 1
        }
      }
    }

    const topMissingKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword, count]) => ({ keyword, count }))

    // Calculate resume completion percentage (based on filled fields)
    const latestResume = await prisma.resume.findFirst({
      where: { clerkUserId: userId },
      orderBy: { updatedAt: 'desc' },
    })

    let completionPercentage = 0
    if (latestResume) {
      const fields = [
        latestResume.personalInfo,
        latestResume.summary,
        (latestResume.experiences as any[])?.length > 0,
        (latestResume.education as any[])?.length > 0,
        (latestResume.skills as any[])?.length > 0,
      ]
      const filledFields = fields.filter(Boolean).length
      completionPercentage = Math.round((filledFields / fields.length) * 100)
    }

    // Get weekly activity for chart
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const weeklyChats = await prisma.chatMessage.groupBy({
      by: ['timestamp'],
      where: {
        clerkUserId: userId,
        timestamp: { gte: sevenDaysAgo },
      },
      _count: true,
    })

    return NextResponse.json({
      stats: {
        resumesCount,
        optimizationsCount: optimizationReports.length,
        chatSessionsCount: chatCount,
        latestScore,
        avgScore,
        scoreImprovement,
        completionPercentage,
        recentOptimizations,
      },
      charts: {
        scoreHistory,
        topMissingKeywords,
        weeklyActivity: weeklyChats,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
