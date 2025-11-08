# Resume ATS Evaluator

A web application that evaluates resumes against job descriptions using ATS (Applicant Tracking System) scanner best practices.

## Features

- **PDF Resume Upload**: Upload and parse PDF resumes
- **Job Description Analysis**: Extract and analyze job descriptions from any URL
- **Comprehensive ATS Evaluation**:
  - Keyword matching score based on job description keywords
  - Format compatibility checks (PDF format, contact info, sections, etc.)
  - Section completeness validation (Skills, Experience, Education)
  - Best practices compliance
- **Detailed Feedback**: Get actionable recommendations to improve your resume's ATS compatibility
- **ATS Tips**: Contextual tips based on your evaluation results

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd resume-ats-evaluator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Upload your resume as a PDF file
2. Enter the URL of the job posting you want to compare against
3. Click "Evaluate Resume" to get your ATS compatibility score and recommendations

## How It Works

1. **PDF Parsing**: Extracts text content from your uploaded PDF resume
2. **Job Description Scraping**: Fetches and extracts text from the job posting URL
3. **Keyword Analysis**: Identifies important keywords from the job description and checks if they appear in your resume
4. **Format Evaluation**: Checks for ATS-friendly formatting including:
   - PDF format compatibility
   - Contact information presence
   - Required sections (Skills, Experience, Education)
   - Proper formatting and structure
5. **Scoring & Recommendations**: Provides an overall score and specific recommendations to improve ATS compatibility

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **pdf-parse** - PDF text extraction
- **cheerio** - HTML parsing for job description extraction

## Project Structure

```
resume-ats-evaluator/
├── app/
│   ├── api/
│   │   ├── parse-pdf/          # PDF parsing endpoint
│   │   ├── fetch-job-description/  # Job description scraping endpoint
│   │   ├── evaluate/           # Resume evaluation endpoint
│   │   └── ats-tips/           # ATS tips API endpoints
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
├── components/
│   ├── ResumeUploader.tsx      # File upload component
│   └── ResultsDisplay.tsx      # Results display component
├── lib/
│   └── atsEvaluator.ts         # ATS evaluation logic
├── types/
│   └── atsTips.ts              # TypeScript types for ATS tips
├── data/
│   └── atsTips.ts              # ATS tips data
└── package.json
```

## ATS Best Practices Evaluated

- ✅ PDF format (ATS-friendly)
- ✅ Contact information completeness
- ✅ Skills section presence
- ✅ Experience section formatting
- ✅ Education section presence
- ✅ Keyword optimization
- ✅ Proper text structure and formatting
- ✅ Avoidance of special characters that break parsing

## Deployment

### Deploying to Vercel

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/resume-ats-evaluator.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and configure the build settings
   - Click "Deploy"

   Alternatively, use the Vercel CLI:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Your app will be live** at a URL like `https://resume-ats-evaluator.vercel.app`

### Environment Variables

No environment variables are required for basic functionality. The app works out of the box!

## License

MIT

