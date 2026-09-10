'use client'

import { forwardRef } from 'react'
import type { ResumeData } from './types'

interface ResumePreviewProps {
  resumeData: ResumeData
  forPdf?: boolean
}

const A4_WIDTH_MM = 210

function formatDate(value: string): string {
  if (!value) return ''
  const parts = value.split('-')
  if (parts.length === 2) {
    const [year, month] = parts
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return value
}

function formatDateRange(start: string, end: string): string {
  const startLabel = formatDate(start)
  const endLabel = end ? formatDate(end) : 'Present'
  if (!startLabel && !endLabel) return ''
  return `${startLabel} – ${endLabel}`
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ resumeData, forPdf = false }, ref) {
    const { personalInfo, summary, experiences, education, projects, skills } = resumeData

    const contactItems = [personalInfo.phone, personalInfo.email, personalInfo.location].filter(Boolean)

    return (
      <div
        ref={ref}
        className="bg-white text-black mx-auto"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '12mm 14mm',
          fontSize: '10.5pt',
          lineHeight: '1.4',
          fontFamily: "'Times New Roman', Times, serif",
          boxSizing: 'border-box',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '8pt' }}>
          <h1
            style={{
              fontSize: '18pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: 0,
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {contactItems.length > 0 && (
            <div style={{ fontSize: '9.5pt', marginTop: '3pt', color: '#374151' }}>
              {contactItems.map((item, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ margin: '0 6pt' }}>•</span>}
                  {item}
                </span>
              ))}
            </div>
          )}
          {(personalInfo.linkedin || personalInfo.portfolio) && (
            <div style={{ fontSize: '9.5pt', marginTop: '2pt', color: '#374151' }}>
              {personalInfo.linkedin && (
                <span>LinkedIn: {personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
              )}
              {personalInfo.linkedin && personalInfo.portfolio && <span style={{ margin: '0 6pt' }}>•</span>}
              {personalInfo.portfolio && <span>{personalInfo.portfolio.replace(/^https?:\/\//, '')}</span>}
            </div>
          )}
        </header>

        {summary && <SectionHeading>Professional Summary</SectionHeading>}
        {summary && <p style={{ margin: '0 0 8pt', textAlign: 'justify' }}>{summary}</p>}

        {experiences.length > 0 && (
          <>
            <SectionHeading>Experience</SectionHeading>
            {experiences.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '7pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8pt' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{exp.position}</span>
                    {exp.company && <span>, {exp.company}</span>}
                  </div>
                  {exp.startDate && (
                    <span style={{ fontSize: '9.5pt', color: '#4b5563', whiteSpace: 'nowrap' }}>
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <div style={{ marginTop: '2pt' }}>
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <BulletPoint key={i}>{line.trim()}</BulletPoint>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <SectionHeading>Education</SectionHeading>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '5pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8pt' }}>
                  <span style={{ fontWeight: 700 }}>{edu.institution}</span>
                  {edu.graduationDate && (
                    <span style={{ fontSize: '9.5pt', color: '#4b5563' }}>{formatDate(edu.graduationDate)}</span>
                  )}
                </div>
                <div style={{ fontStyle: 'italic' }}>
                  {edu.degree}
                  {edu.field && `, ${edu.field}`}
                </div>
              </div>
            ))}
          </>
        )}

        {skills.length > 0 && (
          <>
            <SectionHeading>Technical Skills</SectionHeading>
            <div>{skills.join(', ')}</div>
          </>
        )}

        {projects && projects.length > 0 && (
          <>
            <SectionHeading>Projects</SectionHeading>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '6pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8pt' }}>
                  <span style={{ fontWeight: 700 }}>{proj.name}</span>
                  {proj.link && (
                    <span style={{ fontSize: '9pt', color: '#2563eb' }}>
                      {proj.link.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div style={{ fontSize: '9.5pt', fontStyle: 'italic', color: '#4b5563' }}>
                    Tech Stack: {proj.technologies.join(', ')}
                  </div>
                )}
                {proj.description && (
                  <div style={{ marginTop: '2pt' }}>
                    {proj.description.split('\n').filter(Boolean).map((line, i) => (
                      <BulletPoint key={i}>{line.trim()}</BulletPoint>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    )
  }
)

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '10pt', marginBottom: '4pt' }}>
      <h2
        style={{
          fontSize: '12pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          margin: 0,
        }}
      >
        {children}
      </h2>
      <div style={{ borderBottom: '1pt solid #000', marginTop: '2pt' }} />
    </div>
  )
}

function BulletPoint({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '4pt', marginBottom: '1pt' }}>
      <span style={{ width: '8pt', flexShrink: 0 }}>•</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  )
}