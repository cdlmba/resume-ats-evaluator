import { NextRequest, NextResponse } from 'next/server'
import { evaluateResume } from '@/lib/atsEvaluator'

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescriptionText, fileName } = await request.json()

    if (!resumeText || !jobDescriptionText) {
      return NextResponse.json(
        { error: 'Resume text and job description text are required' },
        { status: 400 }
      )
    }

    const evaluation = evaluateResume(
      resumeText,
      jobDescriptionText,
      fileName || 'resume.pdf'
    )

    return NextResponse.json({
      ...evaluation,
      resumeText,
      jobDescriptionText,
    })
  } catch (error) {
    console.error('Error evaluating resume:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate resume' },
      { status: 500 }
    )
  }
}

