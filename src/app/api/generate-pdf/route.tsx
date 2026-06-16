import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { auth } from '@clerk/nextjs/server'
import { ResumePDFDocument } from '@/components/builder/ResumePDFDocument'
import type { ResumeData } from '@/components/builder/types'

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const resumeData = body as ResumeData

    if (!resumeData || !resumeData.personalInfo) {
      return NextResponse.json({ error: 'Invalid resume data' }, { status: 400 })
    }

    const buffer = await renderToBuffer(
      <ResumePDFDocument data={resumeData} />
    )

    const fileName = resumeData.personalInfo.fullName
      ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf'

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
