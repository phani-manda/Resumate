import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const where = { clerkUserId: userId }

    // User's total resume count
    const resumesCount = await prisma.resume.count({ where })

    // Optimization reports (ordered by creation) to derive score stats
    const optimizationReports = await prisma.optimizationReport.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      select: { atsScore: true, createdAt: true },
    })

    const scores = optimizationReports.map((report) => report.atsScore)
    const latestScore = scores[scores.length - 1] || 0
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0
    const scoreImprovement = scores.length > 1 ? latestScore - scores[0] : 0

    // Total chat messages count
    const chatCount = await prisma.chatMessage.count({ where })

    // Optimizations run in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentOptimizations = await prisma.optimizationReport.count({
      where: {
        clerkUserId: userId,
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    return NextResponse.json({
      stats: {
        resumesCount,
        optimizationsCount: optimizationReports.length,
        chatSessionsCount: chatCount,
        latestScore,
        avgScore,
        scoreImprovement,
        recentOptimizations,
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
