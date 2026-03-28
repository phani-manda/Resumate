'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType,
  BorderStyle,
} from 'docx'
import { saveAs } from 'file-saver'
import type { ResumeData } from './types'

interface UseExportFormatsOptions {
  resumeData: ResumeData
}

export function useExportFormats({ resumeData }: UseExportFormatsOptions) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToDocx = async () => {
    setIsExporting(true)
    try {
      toast.loading('Generating DOCX...', { id: 'export-docx' })

      const sections = []

      // Header - Name and Contact
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.personalInfo.fullName || 'Your Name',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        })
      )

      // Contact info
      const contactItems = [
        resumeData.personalInfo.email,
        resumeData.personalInfo.phone,
        resumeData.personalInfo.location,
      ].filter(Boolean)

      if (contactItems.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactItems.join(' | '),
                size: 20,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        )
      }

      // LinkedIn/Portfolio
      const links = [
        resumeData.personalInfo.linkedin,
        resumeData.personalInfo.portfolio,
      ].filter(Boolean)

      if (links.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: links.join(' | '),
                size: 18,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        )
      }

      // Professional Summary
      if (resumeData.summary) {
        sections.push(
          new Paragraph({
            text: 'PROFESSIONAL SUMMARY',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: resumeData.summary,
            spacing: { after: 200 },
          })
        )
      }

      // Experience
      if (resumeData.experiences.length > 0) {
        sections.push(
          new Paragraph({
            text: 'EXPERIENCE',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: { before: 200, after: 100 },
          })
        )

        for (const exp of resumeData.experiences) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true }),
                new TextRun({ text: ` at ${exp.company}` }),
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.startDate} – ${exp.endDate || 'Present'}`,
                  italics: true,
                  color: '666666',
                  size: 18,
                }),
              ],
              spacing: { after: 50 },
            })
          )

          if (exp.description) {
            sections.push(
              new Paragraph({
                text: exp.description,
                spacing: { after: 150 },
              })
            )
          }
        }
      }

      // Education
      if (resumeData.education.length > 0) {
        sections.push(
          new Paragraph({
            text: 'EDUCATION',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: { before: 200, after: 100 },
          })
        )

        for (const edu of resumeData.education) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun({ text: edu.field ? ` in ${edu.field}` : '' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution }),
                new TextRun({ text: edu.graduationDate ? ` | ${edu.graduationDate}` : '' }),
              ],
              spacing: { after: 100 },
            })
          )
        }
      }

      // Projects
      if (resumeData.projects && resumeData.projects.length > 0) {
        sections.push(
          new Paragraph({
            text: 'PROJECTS',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: { before: 200, after: 100 },
          })
        )

        for (const proj of resumeData.projects) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: proj.name, bold: true })],
            })
          )
          if (proj.description) {
            sections.push(
              new Paragraph({
                text: proj.description,
                spacing: { after: 50 },
              })
            )
          }
          if (proj.technologies && proj.technologies.length > 0) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Technologies: ', bold: true, size: 18 }),
                  new TextRun({ text: proj.technologies.join(', '), size: 18 }),
                ],
                spacing: { after: 100 },
              })
            )
          }
        }
      }

      // Skills
      if (resumeData.skills.length > 0) {
        sections.push(
          new Paragraph({
            text: 'SKILLS',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: resumeData.skills.join(' • '),
            spacing: { after: 100 },
          })
        )
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: sections,
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`
        : 'Resume.docx'

      saveAs(blob, fileName)
      toast.success('DOCX downloaded!', { id: 'export-docx' })
    } catch (error) {
      console.error('DOCX export failed:', error)
      toast.error('Failed to export DOCX', { id: 'export-docx' })
    } finally {
      setIsExporting(false)
    }
  }

  const exportToTxt = () => {
    setIsExporting(true)
    try {
      const lines: string[] = []

      // Header
      lines.push(resumeData.personalInfo.fullName || 'Your Name')
      lines.push('='.repeat(50))

      const contactItems = [
        resumeData.personalInfo.email,
        resumeData.personalInfo.phone,
        resumeData.personalInfo.location,
      ].filter(Boolean)

      if (contactItems.length > 0) {
        lines.push(contactItems.join(' | '))
      }

      const links = [
        resumeData.personalInfo.linkedin,
        resumeData.personalInfo.portfolio,
      ].filter(Boolean)

      if (links.length > 0) {
        lines.push(links.join(' | '))
      }

      lines.push('')

      // Summary
      if (resumeData.summary) {
        lines.push('PROFESSIONAL SUMMARY')
        lines.push('-'.repeat(30))
        lines.push(resumeData.summary)
        lines.push('')
      }

      // Experience
      if (resumeData.experiences.length > 0) {
        lines.push('EXPERIENCE')
        lines.push('-'.repeat(30))
        for (const exp of resumeData.experiences) {
          lines.push(`${exp.position} at ${exp.company}`)
          lines.push(`${exp.startDate} – ${exp.endDate || 'Present'}`)
          if (exp.description) {
            lines.push(exp.description)
          }
          lines.push('')
        }
      }

      // Education
      if (resumeData.education.length > 0) {
        lines.push('EDUCATION')
        lines.push('-'.repeat(30))
        for (const edu of resumeData.education) {
          lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`)
          lines.push(`${edu.institution}${edu.graduationDate ? ` | ${edu.graduationDate}` : ''}`)
          lines.push('')
        }
      }

      // Projects
      if (resumeData.projects && resumeData.projects.length > 0) {
        lines.push('PROJECTS')
        lines.push('-'.repeat(30))
        for (const proj of resumeData.projects) {
          lines.push(proj.name)
          if (proj.description) lines.push(proj.description)
          if (proj.technologies?.length) {
            lines.push(`Technologies: ${proj.technologies.join(', ')}`)
          }
          lines.push('')
        }
      }

      // Skills
      if (resumeData.skills.length > 0) {
        lines.push('SKILLS')
        lines.push('-'.repeat(30))
        lines.push(resumeData.skills.join(' • '))
      }

      const content = lines.join('\n')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`
        : 'Resume.txt'

      saveAs(blob, fileName)
      toast.success('TXT downloaded!')
    } catch (error) {
      console.error('TXT export failed:', error)
      toast.error('Failed to export TXT')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJson = () => {
    try {
      const content = JSON.stringify(resumeData, null, 2)
      const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.json`
        : 'Resume.json'

      saveAs(blob, fileName)
      toast.success('JSON downloaded!')
    } catch (error) {
      console.error('JSON export failed:', error)
      toast.error('Failed to export JSON')
    }
  }

  return {
    isExporting,
    exportToDocx,
    exportToTxt,
    exportToJson,
  }
}
