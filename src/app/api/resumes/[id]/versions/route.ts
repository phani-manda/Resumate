import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify the resume belongs to the user
    const resume = await prisma.resume.findFirst({
      where: { id, clerkUserId: userId },
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Get all versions for this resume
    const versions = await prisma.resumeVersion.findMany({
      where: { resumeId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        versionNumber: true,
        snapshot: true,
        changeDescription: true,
        createdAt: true,
      },
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching resume versions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { changeDescription } = body

    // Get the resume with current data
    const resume = await prisma.resume.findFirst({
      where: { id, clerkUserId: userId },
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Get the latest version number
    const latestVersion = await prisma.resumeVersion.findFirst({
      where: { resumeId: id },
      orderBy: { versionNumber: 'desc' },
    })

    const newVersionNumber = (latestVersion?.versionNumber || 0) + 1

    // Create a new version
    const version = await prisma.resumeVersion.create({
      data: {
        resumeId: id,
        versionNumber: newVersionNumber,
        snapshot: {
          personalInfo: resume.personalInfo,
          summary: resume.summary,
          experiences: resume.experiences,
          education: resume.education,
          projects: resume.projects,
          skills: resume.skills,
        },
        changeDescription: changeDescription || null,
      },
    })

    return NextResponse.json(version)
  } catch (error) {
    console.error('Error creating resume version:', error)
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    )
  }
}
