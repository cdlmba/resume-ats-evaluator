import { NextRequest, NextResponse } from 'next/server'

// Dynamic import to avoid build-time issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  // Import pdfjs-dist only when the function runs
  const pdfjsLib = await import('pdfjs-dist')
  
  // Configure worker for serverless environment
  if (typeof pdfjsLib.GlobalWorkerOptions !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const typedArray = new Uint8Array(arrayBuffer)
    
    const loadingTask = pdfjsLib.getDocument({ data: typedArray })
    const pdf = await loadingTask.promise
    
    let fullText = ''
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    return NextResponse.json({
      text: fullText.trim(),
      pages: pdf.numPages,
      info: {
        numPages: pdf.numPages
      }
    })
  } catch (error) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json(
      { error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
