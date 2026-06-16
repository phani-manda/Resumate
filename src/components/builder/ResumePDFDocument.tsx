import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import type { ResumeData } from './types'

const styles = StyleSheet.create({
  page: {
    padding: '0.4in',
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    lineHeight: 1.35,
    color: '#000',
  },
  /* ---------- header ---------- */
  header: {
    alignItems: 'center',
    marginBottom: 9,
  },
  name: {
    fontFamily: 'Times-Bold',
    fontSize: 17,
    textTransform: 'uppercase',
  },
  contactRow: {
    fontSize: 9,
    marginTop: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactSep: {
    marginHorizontal: 3,
    fontSize: 9,
  },
  contactLink: {
    color: '#000',
    textDecoration: 'none',
  },
  /* ---------- section heading ---------- */
  section: {
    marginTop: 9,
    marginBottom: 4,
  },
  sectionHeading: {
    fontFamily: 'Times-Bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  sectionRule: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    marginTop: 1,
    marginBottom: 5,
  },
  /* ---------- typography ---------- */
  body: {
    fontSize: 10.5,
    lineHeight: 1.35,
  },
  small: {
    fontSize: 9,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  italic: {
    fontFamily: 'Times-Italic',
  },
  /* ---------- layout ---------- */
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rowBaseline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  bulletChar: {
    width: 12,
    fontSize: 10.5,
  },
  bulletContent: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.35,
  },
  spacer4: { marginTop: 4 },
  spacer2: { marginTop: 2 },
  spacer6: { marginTop: 6 },
})

function SectionHeading({ children }: { children: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{children}</Text>
      <View style={styles.sectionRule} />
    </View>
  )
}

function ContactSeparator() {
  return <Text style={styles.contactSep}>|</Text>
}

function BulletItem({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletChar}>•</Text>
      <Text style={styles.bulletContent}>{children}</Text>
    </View>
  )
}

export function ResumePDFDocument({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experiences, education, projects, skills } = data

  const contactParts: { text: string; link?: string }[] = []
  if (personalInfo.phone) contactParts.push({ text: personalInfo.phone })
  if (personalInfo.email)
    contactParts.push({ text: personalInfo.email, link: `mailto:${personalInfo.email}` })
  if (personalInfo.linkedin)
    contactParts.push({ text: 'LinkedIn', link: personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}` })
  if (personalInfo.portfolio)
    contactParts.push({ text: 'Portfolio', link: personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}` })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ======== HEADER ======== */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {contactParts.length > 0 && (
            <View style={styles.contactRow}>
              {contactParts.map((part, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {i > 0 && <ContactSeparator />}
                  {part.link ? (
                    <Link src={part.link} style={styles.contactLink}>
                      <Text style={{ fontSize: 9 }}>{part.text}</Text>
                    </Link>
                  ) : (
                    <Text style={{ fontSize: 9 }}>{part.text}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ======== SUMMARY ======== */}
        {summary && (
          <>
            <SectionHeading>Summary</SectionHeading>
            <Text style={styles.body}>{summary}</Text>
          </>
        )}

        {/* ======== EDUCATION ======== */}
        {education.length > 0 && (
          <>
            <SectionHeading>Education</SectionHeading>
            {education.map((edu) => (
              <View key={edu.id} style={styles.spacer2}>
                <View style={styles.rowBaseline}>
                  <Text style={[styles.body, styles.bold]}>
                    {edu.institution}
                  </Text>
                  {edu.graduationDate && (
                    <Text style={[styles.body]}>
                      {edu.graduationDate}
                    </Text>
                  )}
                </View>
                <Text style={[styles.body, styles.italic]}>
                  {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* ======== TECHNICAL SKILLS ======== */}
        {skills.length > 0 && (
          <>
            <SectionHeading>Technical Skills</SectionHeading>
            <View>
              <BulletItem>
                {skills.join(', ')}
              </BulletItem>
            </View>
          </>
        )}

        {/* ======== PROJECTS ======== */}
        {projects && projects.length > 0 && (
          <>
            <SectionHeading>Projects</SectionHeading>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.spacer4}>
                <View style={styles.rowBaseline}>
                  <Text style={[styles.body, styles.bold]}>
                    {proj.name}
                  </Text>
                  {proj.link && (
                    <Link
                      src={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                      style={[styles.contactLink, { fontSize: 9 }]}
                    >
                      <Text style={{ fontSize: 9 }}>Link</Text>
                    </Link>
                  )}
                </View>
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={[styles.body, styles.italic]}>
                    {'Tech Stack: '}{proj.technologies.join(', ')}
                  </Text>
                )}
                {proj.description && (
                  <View style={styles.spacer2}>
                    {proj.description.split('\n').filter(Boolean).map((line, i) => (
                      <BulletItem key={i}>{line.trim()}</BulletItem>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* ======== EXPERIENCE ======== */}
        {experiences.length > 0 && (
          <>
            <SectionHeading>Experience</SectionHeading>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.spacer2}>
                <View style={styles.rowBaseline}>
                  <Text style={[styles.body, styles.bold]}>
                    {exp.position}{exp.company ? `, ${exp.company}` : ''}
                  </Text>
                  <Text style={[styles.body, { fontSize: 9 }]}>
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                  </Text>
                </View>
                {exp.description && (
                  <View style={styles.spacer2}>
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <BulletItem key={i}>{line.trim()}</BulletItem>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  )
}
