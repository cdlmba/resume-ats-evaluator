'use client'

import { EvaluationResult } from '@/app/page'
import { ATSTip } from '@/types/atsTips'

interface ResultsDisplayProps {
  result: EvaluationResult
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Evaluation Results
        </h2>
        <div
          className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(
            result.overallScore
          )} ${getScoreColor(result.overallScore)}`}
        >
          <span className="text-4xl font-bold">{result.overallScore}%</span>
        </div>
        <p className="mt-4 text-lg text-gray-600">Overall ATS Compatibility Score</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Keyword Match Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Keyword Matching
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Match Rate
                </span>
                <span className={`text-lg font-bold ${getScoreColor(result.keywordMatch.score)}`}>
                  {result.keywordMatch.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    result.keywordMatch.score >= 80
                      ? 'bg-green-500'
                      : result.keywordMatch.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${result.keywordMatch.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {result.keywordMatch.matched.length} of {result.keywordMatch.totalKeywords} keywords matched
              </p>
            </div>

            {result.keywordMatch.matched.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2">
                  ✓ Matched Keywords ({result.keywordMatch.matched.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordMatch.matched.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.keywordMatch.missing.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">
                  ✗ Missing Keywords ({result.keywordMatch.missing.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordMatch.missing.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Format Compatibility Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Format Compatibility
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Score</span>
                <span className={`text-lg font-bold ${getScoreColor(result.formatCompatibility.score)}`}>
                  {result.formatCompatibility.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    result.formatCompatibility.score >= 80
                      ? 'bg-green-500'
                      : result.formatCompatibility.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${result.formatCompatibility.score}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">PDF Format</span>
                <span
                  className={`text-sm font-semibold ${
                    result.formatCompatibility.checks.isPdf
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.formatCompatibility.checks.isPdf ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Contact Information</span>
                <span
                  className={`text-sm font-semibold ${
                    result.formatCompatibility.checks.hasContactInfo
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.formatCompatibility.checks.hasContactInfo ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Skills Section</span>
                <span
                  className={`text-sm font-semibold ${
                    result.formatCompatibility.checks.hasSkillsSection
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.formatCompatibility.checks.hasSkillsSection ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Experience Section</span>
                <span
                  className={`text-sm font-semibold ${
                    result.formatCompatibility.checks.hasExperienceSection
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.formatCompatibility.checks.hasExperienceSection ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Education Section</span>
                <span
                  className={`text-sm font-semibold ${
                    result.formatCompatibility.checks.hasEducationSection
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.formatCompatibility.checks.hasEducationSection ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Proper Formatting</span>
                <span
                  className={`text-sm font-semibold ${
                    result.formatCompatibility.checks.properFormatting
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.formatCompatibility.checks.properFormatting ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {result.recommendations.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ATS Tips Section */}
      {result.relevantTips && result.relevantTips.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            ATS Best Practice Tips
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Based on your evaluation, here are specific tips to improve your resume's ATS compatibility:
          </p>
          <div className="space-y-6">
            {result.relevantTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
              >
                <div className="flex items-start mb-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">
                        {tip.id === 'format-structure' && '📄'}
                        {tip.id === 'keywords-content' && '🔑'}
                        {tip.id === 'technical-details' && '⚙️'}
                        {tip.id === 'skills-section' && '💼'}
                        {tip.id === 'testing' && '✅'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {tip.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{tip.category}</p>
                  </div>
                </div>
                <ul className="space-y-2 mt-4">
                  {tip.tips.map((tipText, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-indigo-500 mr-2 mt-1">▸</span>
                      <span>{tipText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

