import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import mammoth from 'mammoth'
import { ollama } from 'ollama-ai-provider'
import { generateText } from 'ai'
import { extractText } from 'unpdf'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Server-side file size validation (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const fileType = file.type
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    try {
      if (fileType === 'application/pdf') {
        // Extract text from PDF using unpdf (serverless-compatible)
        console.log('Processing PDF with unpdf...')
        
        const uint8Array = new Uint8Array(buffer)
        const { text: textPages } = await extractText(uint8Array)
        const rawText = Array.isArray(textPages) ? textPages.join('\n') : textPages
        console.log(`Extracted ${rawText.length} characters from PDF`)
        
        // Use Ollama to clean and structure the extracted text
        if (rawText.length > 50) {
          console.log('Cleaning PDF text with Ollama...')
          try {
            const { text: cleanedText } = await generateText({
              // @ts-expect-error - AI SDK version type mismatch
              model: ollama('llama3.2'),
              prompt: `You are a text cleaning assistant. The following text was extracted from a PDF resume but may have formatting issues, broken lines, or scattered information.

Please clean and restructure this text into a well-formatted resume with clear sections (Contact Info, Summary, Experience, Education, Skills, etc.). 
- Fix broken lines and paragraphs
- Remove page break markers
- Organize scattered information
- Preserve all dates, company names, and achievements
- Maintain chronological order

Raw text:
${rawText}

Return ONLY the cleaned, well-structured resume text without any additional commentary.`,
            })
            
            text = cleanedText.trim()
            console.log('PDF text cleaned successfully')
          } catch (ollamaError) {
            console.log('Ollama cleaning unavailable, using raw text:', ollamaError)
            text = rawText
          }
        } else {
          text = rawText
        }
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        // Parse DOCX with mammoth, then clean with Ollama
        console.log('Processing DOCX...')
        const result = await mammoth.extractRawText({ buffer })
        const rawText = result.value
        
        // Use Ollama to clean and structure DOCX text
        try {
          const { text: cleanedText } = await generateText({
            // @ts-expect-error - AI SDK version type mismatch
            model: ollama('llama3.2'),
            prompt: `Clean and properly format this resume text. Fix any formatting issues and organize it into clear sections:

${rawText}

Return only the cleaned resume text.`,
          })
          text = cleanedText.trim()
          console.log('DOCX text cleaned with Ollama')
        } catch (ollamaError) {
          console.log('Ollama cleaning failed, using raw text')
          text = rawText
        }
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload PDF or DOCX files.' },
          { status: 400 }
        )
      }

      // Clean up the extracted text
      text = text
        .replace(/\s+/g, ' ') // Remove extra whitespace
        .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
        .trim()

      if (!text || text.length < 50) {
        return NextResponse.json(
          { error: 'Could not extract text from file. File may be empty or corrupted.' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        text,
        filename: file.name,
        size: file.size,
        type: fileType,
      })
    } catch (parseError) {
      console.error('File parsing error:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse file. Please ensure it is a valid PDF or DOCX file.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    )
  }
}
