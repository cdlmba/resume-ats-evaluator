import { ATSTip } from '@/types/atsTips'
import { atsTips } from '@/data/atsTips'

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
}

export function evaluateResume(
  resumeText: string,
  jobDescriptionText: string,
  fileName: string
): EvaluationResult {
  const resumeLower = resumeText.toLowerCase()
  const jobLower = jobDescriptionText.toLowerCase()

  // Extract keywords from job description
  const keywords = extractKeywords(jobDescriptionText)
  
  // Check keyword matching
  const keywordMatch = evaluateKeywordMatch(resumeText, keywords)

  // Check format compatibility
  const formatCompatibility = evaluateFormatCompatibility(
    resumeText,
    fileName
  )

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    keywordMatch.score * 0.6 + formatCompatibility.score * 0.4
  )

  // Generate recommendations
  const recommendations = generateRecommendations(
    keywordMatch,
    formatCompatibility,
    resumeText,
    jobDescriptionText
  )

  // Get relevant ATS tips based on evaluation
  const relevantTips = getRelevantTips(
    keywordMatch,
    formatCompatibility,
    resumeText
  )

  return {
    overallScore,
    keywordMatch,
    formatCompatibility,
    recommendations,
    relevantTips,
  }
}

function extractKeywords(text: string): string[] {
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
  ])

  // Extract words (3+ characters, alphanumeric)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !stopWords.has(word))

  // Count word frequency
  const wordCount = new Map<string, number>()
  words.forEach((word) => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1)
  })

  // Get top keywords (appearing at least twice, sorted by frequency)
  const keywords = Array.from(wordCount.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word)

  // Also extract technical terms and skills (uppercase words, common tech terms)
  const techTerms = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'github', 'api', 'rest', 'graphql', 'html', 'css',
    'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'mysql', 'redis',
    'agile', 'scrum', 'ci/cd', 'devops', 'microservices', 'machine learning',
    'ai', 'data science', 'analytics', 'cloud', 'azure', 'gcp', 'linux',
    'testing', 'qa', 'frontend', 'backend', 'full stack', 'mobile', 'ios',
    'android', 'ui/ux', 'design', 'product', 'management', 'leadership',
    'communication', 'collaboration', 'problem solving', 'analytical',
  ]

  techTerms.forEach((term) => {
    if (text.toLowerCase().includes(term) && !keywords.includes(term)) {
      keywords.push(term)
    }
  })

  return keywords.slice(0, 30) // Limit to top 30 keywords
}

function evaluateKeywordMatch(
  resumeText: string,
  keywords: string[]
): {
  score: number
  matched: string[]
  missing: string[]
  totalKeywords: number
} {
  if (keywords.length === 0) {
    return {
      score: 0,
      matched: [],
      missing: [],
      totalKeywords: 0,
    }
  }

  const resumeLower = resumeText.toLowerCase()
  const matched: string[] = []
  const missing: string[] = []

  keywords.forEach((keyword) => {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  })

  const score = Math.round((matched.length / keywords.length) * 100)

  return {
    score,
    matched,
    missing,
    totalKeywords: keywords.length,
  }
}

function evaluateFormatCompatibility(
  resumeText: string,
  fileName: string
): {
  score: number
  checks: {
    isPdf: boolean
    hasContactInfo: boolean
    hasSkillsSection: boolean
    hasExperienceSection: boolean
    hasEducationSection: boolean
    properFormatting: boolean
  }
} {
  const checks = {
    isPdf: fileName.toLowerCase().endsWith('.pdf'),
    hasContactInfo: checkContactInfo(resumeText),
    hasSkillsSection: checkSection(resumeText, ['skills', 'technical skills', 'core competencies']),
    hasExperienceSection: checkSection(resumeText, [
      'experience',
      'work experience',
      'employment',
      'professional experience',
    ]),
    hasEducationSection: checkSection(resumeText, [
      'education',
      'academic',
      'qualifications',
    ]),
    properFormatting: checkFormatting(resumeText),
  }

  const passedChecks = Object.values(checks).filter((check) => check === true)
    .length
  const score = Math.round((passedChecks / Object.keys(checks).length) * 100)

  return {
    score,
    checks,
  }
}

function checkContactInfo(text: string): boolean {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  
  return emailRegex.test(text) && phoneRegex.test(text)
}

function checkSection(text: string, sectionNames: string[]): boolean {
  const textLower = text.toLowerCase()
  return sectionNames.some((name) => textLower.includes(name.toLowerCase()))
}

function checkFormatting(text: string): boolean {
  // Check for reasonable line breaks and structure
  const lines = text.split('\n').filter((line) => line.trim().length > 0)
  const hasReasonableStructure = lines.length > 10 && lines.length < 200
  
  // Check for bullet points or structured content
  const hasBulletPoints = /[•\-\*]\s/.test(text) || /\d+\.\s/.test(text)
  
  // Check for dates (common in resumes)
  const hasDates = /\d{4}|\d{1,2}\/\d{1,2}\/\d{4}/.test(text)
  
  return hasReasonableStructure && (hasBulletPoints || hasDates)
}

function generateRecommendations(
  keywordMatch: {
    score: number
    matched: string[]
    missing: string[]
    totalKeywords: number
  },
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
  },
  resumeText: string,
  jobDescriptionText: string
): string[] {
  const recommendations: string[] = []

  // Keyword recommendations
  if (keywordMatch.score < 70) {
    recommendations.push(
      `Add ${keywordMatch.missing.slice(0, 5).join(', ')} and other relevant keywords from the job description to improve ATS matching.`
    )
  }

  if (keywordMatch.missing.length > 10) {
    recommendations.push(
      `Consider incorporating more job-specific terminology and skills mentioned in the job description.`
    )
  }

  // Format recommendations
  if (!formatCompatibility.checks.hasContactInfo) {
    recommendations.push(
      'Ensure your resume includes a clear contact section with email and phone number at the top.'
    )
  }

  if (!formatCompatibility.checks.hasSkillsSection) {
    recommendations.push(
      'Add a dedicated Skills section to highlight your technical and soft skills. This helps ATS systems categorize your qualifications.'
    )
  }

  if (!formatCompatibility.checks.hasExperienceSection) {
    recommendations.push(
      'Make sure your work experience is clearly labeled in a dedicated section with proper formatting.'
    )
  }

  if (!formatCompatibility.checks.hasEducationSection) {
    recommendations.push(
      'Include an Education section with your degrees and certifications.'
    )
  }

  if (!formatCompatibility.checks.properFormatting) {
    recommendations.push(
      'Improve resume structure with clear sections, bullet points, and consistent formatting. ATS systems parse well-structured resumes more accurately.'
    )
  }

  // General ATS recommendations
  if (resumeText.length < 200) {
    recommendations.push(
      'Your resume seems too short. Add more detail about your experience, skills, and accomplishments.'
    )
  }

  if (resumeText.length > 2000) {
    recommendations.push(
      'Your resume might be too long. Consider condensing to 1-2 pages for better ATS compatibility.'
    )
  }

  // Check for common ATS issues
  if (/[^\x00-\x7F]/.test(resumeText)) {
    recommendations.push(
      'Avoid special characters and symbols that might not be parsed correctly by ATS systems.'
    )
  }

  if (/\t/.test(resumeText)) {
    recommendations.push(
      'Replace tabs with spaces for better ATS compatibility.'
    )
  }

  // Check for keywords in context
  const jobLower = jobDescriptionText.toLowerCase()
  const resumeLower = resumeText.toLowerCase()
  
  // Suggest using exact phrases from job description
  const importantPhrases = extractImportantPhrases(jobDescriptionText)
  const missingPhrases = importantPhrases.filter(
    (phrase) => !resumeLower.includes(phrase.toLowerCase())
  ).slice(0, 3)

  if (missingPhrases.length > 0) {
    recommendations.push(
      `Consider using these exact phrases from the job description: "${missingPhrases.join('", "')}".`
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Your resume looks good! Continue to customize it for each job application to maximize ATS compatibility.'
    )
  }

  return recommendations
}

function extractImportantPhrases(text: string): string[] {
  // Extract 2-4 word phrases that might be important
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 20)
  const phrases: string[] = []

  sentences.forEach((sentence) => {
    const words = sentence.trim().split(/\s+/).filter((w) => w.length > 2)
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(' ').toLowerCase()
      if (phrase.length > 10 && phrase.length < 50) {
        phrases.push(phrase)
      }
    }
  })

  // Return unique phrases, limited to top 10
  return [...new Set(phrases)].slice(0, 10)
}

function getRelevantTips(
  keywordMatch: {
    score: number
    matched: string[]
    missing: string[]
    totalKeywords: number
  },
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
  },
  resumeText: string
): ATSTip[] {
  const relevantTipIds: string[] = []

  // Format and structure tips - always relevant but prioritize if issues found
  if (
    !formatCompatibility.checks.isPdf ||
    !formatCompatibility.checks.properFormatting ||
    formatCompatibility.score < 80
  ) {
    relevantTipIds.push('format-structure')
  }

  // Keywords and content tips - prioritize if keyword match is low
  if (keywordMatch.score < 70 || keywordMatch.missing.length > 5) {
    relevantTipIds.push('keywords-content')
  }

  // Technical details tips - prioritize if formatting issues
  if (
    !formatCompatibility.checks.properFormatting ||
    /[^\x00-\x7F]/.test(resumeText) ||
    /\t/.test(resumeText)
  ) {
    relevantTipIds.push('technical-details')
  }

  // Skills section tips - prioritize if missing skills section
  if (!formatCompatibility.checks.hasSkillsSection || keywordMatch.score < 70) {
    relevantTipIds.push('skills-section')
  }

  // Testing tips - always include as general advice
  relevantTipIds.push('testing')

  // Remove duplicates and get tips
  const uniqueTipIds = [...new Set(relevantTipIds)]
  const tips = atsTips.filter((tip) => uniqueTipIds.includes(tip.id))

  // If no specific issues, return all tips
  if (tips.length === 0) {
    return atsTips
  }

  return tips
}

