'use client'

import { useState } from 'react'

interface ResumeUploaderProps {
  onEvaluate: (resumeText: string, jobDescriptionUrl: string) => void
  loading: boolean
}

export default function ResumeUploader({ onEvaluate, loading }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      await processFile(droppedFile)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0])
    }
  }

  const processFile = async (selectedFile: File) => {
    const validTypes = ['text/plain', 'application/pdf']
    
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a .txt or .pdf file')
      return
    }

    setFile(selectedFile)

    // Read the file as text
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setResumeText(text)
    }
    reader.readAsText(selectedFile)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (resumeText && jobDescriptionUrl) {
      onEvaluate(resumeText, jobDescriptionUrl)
    } else {
      alert('Please upload a resume and provide a job description URL')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Resume (TXT or PDF)
        </label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            id="resume"
            accept=".txt,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="resume"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-gray-600 font-medium">
              {file ? file.name : 'Click to upload or drag and drop'}
            </span>
            <span className="text-sm text-gray-500 mt-1">TXT or PDF files</span>
          </label>
        </div>

        {resumeText && (
          <div className="mt-4">
            <label htmlFor="resumeTextArea" className="block text-sm font-medium text-gray-700 mb-2">
              Resume Content (you can edit this)
            </label>
            <textarea
              id="resumeTextArea"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="jobUrl"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Job Description URL
        </label>
        <input
          type="url"
          id="jobUrl"
          value={jobDescriptionUrl}
          onChange={(e) => setJobDescriptionUrl(e.target.value)}
          placeholder="https://example.com/job-posting"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the URL of the job posting you want to compare against
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !resumeText || !jobDescriptionUrl}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Evaluating...
          </>
        ) : (
          'Evaluate Resume'
        )}
      </button>
    </form>
  )
}
