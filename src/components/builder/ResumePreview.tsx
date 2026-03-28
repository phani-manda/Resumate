'use client'

import { forwardRef } from 'react'
import type { ResumeData } from './types'

interface ResumePreviewProps {
  resumeData: ResumeData
  forPdf?: boolean
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ resumeData, forPdf = false }, ref) {
    const fontSize = forPdf ? '11px' : '12px'
    const headerFontSize = forPdf ? '12px' : '13px'
    const titleFontSize = '18px'

    return (
      <div
        ref={ref}
        className="bg-white text-black mx-auto"
        style={{ 
          width: '100%',
          maxWidth: forPdf ? '210mm' : undefined,
          minHeight: forPdf ? 'auto' : 'auto',
          aspectRatio: forPdf ? undefined : '210 / 297',
          padding: forPdf ? '15mm' : '24px',
          fontSize,
          lineHeight: '1.4',
        }}
      >
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-3 mb-4">
          <h1 style={{ fontSize: titleFontSize, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>
            {resumeData.personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <div style={{ fontSize, marginTop: '6px', color: '#4b5563' }} className="flex flex-wrap gap-x-3">
            {[
              resumeData.personalInfo.email,
              resumeData.personalInfo.phone,
              resumeData.personalInfo.location,
              resumeData.personalInfo.linkedin
            ].filter(Boolean).map((item, i, arr) => (
              <span key={i}>{item}{i < arr.length - 1 ? ' •' : ''}</span>
            ))}
          </div>
        </header>

        {/* Professional Summary */}
        {resumeData.summary && (
          <section className="mb-4">
            <h2 style={{ fontSize: headerFontSize, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
              Professional Profile
            </h2>
            <p style={{ fontSize, color: '#374151' }}>{resumeData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experiences.length > 0 && (
          <section className="mb-4">
            <h2 style={{ fontSize: headerFontSize, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
              Experience
            </h2>
            {resumeData.experiences.map(exp => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 style={{ fontSize, fontWeight: 'bold', color: '#111827' }}>{exp.position}</h3>
                  <span style={{ fontSize: forPdf ? '10px' : '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                <div style={{ fontSize, fontWeight: '600', color: '#374151' }}>{exp.company}</div>
                <p style={{ fontSize, color: '#4b5563', whiteSpace: 'pre-wrap', marginTop: '2px' }}>{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <section className="mb-4">
            <h2 style={{ fontSize: headerFontSize, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
              Education
            </h2>
            {resumeData.education.map(edu => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between gap-2">
                  <h3 style={{ fontSize, fontWeight: 'bold', color: '#111827' }}>{edu.institution}</h3>
                  <span style={{ fontSize: forPdf ? '10px' : '11px', color: '#6b7280' }}>{edu.graduationDate}</span>
                </div>
                <div style={{ fontSize, color: '#374151' }}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <section className="mb-4">
            <h2 style={{ fontSize: headerFontSize, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
              Projects
            </h2>
            {resumeData.projects.map(proj => (
              <div key={proj.id} className="mb-2">
                <h3 style={{ fontSize, fontWeight: 'bold', color: '#111827' }}>{proj.name}</h3>
                {proj.description && <p style={{ fontSize, color: '#374151' }}>{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p style={{ fontSize: forPdf ? '10px' : '11px', color: '#6b7280', marginTop: '2px' }}>
                    <span className="font-medium">Tech:</span> {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <section>
            <h2 style={{ fontSize: headerFontSize, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', marginBottom: '6px', paddingBottom: '2px', color: '#1f2937' }}>
              Skills
            </h2>
            <div style={{ fontSize, color: '#374151' }}>
              {resumeData.skills.join(' • ')}
            </div>
          </section>
        )}
      </div>
    )
  }
)
