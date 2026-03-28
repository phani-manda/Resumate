import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

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
        snapshot: true,
        label: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      versions.map((version, index) => ({
        ...version,
        versionNumber: versions.length - index,
        changeDescription: version.label,
      }))
    )
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
    const { changeDescription, label } = body

    // Get the resume with current data
    const resume = await prisma.resume.findFirst({
      where: { id, clerkUserId: userId },
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Get the latest version number
    const versionCount = await prisma.resumeVersion.count({
      where: { resumeId: id },
    })

    const newVersionNumber = versionCount + 1

    // Create a new version
    const version = await prisma.resumeVersion.create({
      data: {
        resumeId: id,
        snapshot: {
          personalInfo: resume.personalInfo,
          summary: resume.summary,
          experiences: resume.experiences,
          education: resume.education,
          projects: resume.projects,
          skills: resume.skills,
        },
        label: changeDescription || label || null,
      },
    })

    return NextResponse.json({
      ...version,
      versionNumber: newVersionNumber,
      changeDescription: version.label,
    })
  } catch (error) {
    console.error('Error creating resume version:', error)
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    )
  }
}
