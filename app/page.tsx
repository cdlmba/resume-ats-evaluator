'use client'

import { useState } from 'react'
import ResumeUploader from '@/components/ResumeUploader'
import ResultsDisplay from '@/components/ResultsDisplay'
import { ATSTip } from '@/types/atsTips'

export interface EvaluationResult {
  overallScore: number
  keywordMatch: {
    score: number
    matched: string[]
    missing: string[]
    totalKeywords: number
  }
  formatCompatibility: {
    score: number
    checks: {
      isPdf: boolean
      hasContactInfo: boolean
      hasSkillsSection: boolean
      hasExperienceSection: boolean
      hasEducationSection: boolean
      properFormatting: boolean
    }
  }
  recommendations: string[]
  relevantTips: ATSTip[]
  resumeText: string
  jobDescriptionText: string
}

export default function Home() {
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEvaluate = async (resumeText: string, jobDescriptionUrl: string) => {
    setLoading(true)
    setError(null)
    setEvaluationResult(null)

    try {
      // Step 1: Fetch job description
      const jobResponse = await fetch('/api/fetch-job-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: jobDescriptionUrl }),
      })

      if (!jobResponse.ok) {
        throw new Error('Failed to fetch job description')
      }

      const { text: jobDescriptionText } = await jobResponse.json()

      // Step 2: Evaluate
      const evalResponse = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText,
          fileName: 'resume.txt',
        }),
      })

      if (!evalResponse.ok) {
        throw new Error('Failed to evaluate resume')
      }

      const result = await evalResponse.json()
      setEvaluationResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume ATS Evaluator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and compare it against any job description to get
            ATS-friendly recommendations
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <ResumeUploader onEvaluate={handleEvaluate} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {evaluationResult && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <ResultsDisplay result={evaluationResult} />
          </div>
        )}
      </div>
    </main>
  )
}
