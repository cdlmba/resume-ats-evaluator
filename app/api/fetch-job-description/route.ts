import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove script and style elements
    $('script, style, nav, header, footer, aside').remove()

    // Try to find job description content
    // Common selectors for job posting sites
    const selectors = [
      '[class*="job-description"]',
      '[class*="jobDescription"]',
      '[id*="job-description"]',
      '[id*="jobDescription"]',
      '[class*="description"]',
      'article',
      'main',
      '.content',
    ]

    let text = ''
    for (const selector of selectors) {
      const element = $(selector).first()
      if (element.length > 0 && element.text().trim().length > 100) {
        text = element.text().trim()
        break
      }
    }

    // Fallback to body text if no specific section found
    if (!text || text.length < 100) {
      text = $('body').text().trim()
    }

    // Clean up the text
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim()

    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract meaningful content from URL' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      text,
      url,
    })
  } catch (error) {
    console.error('Error fetching job description:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job description' },
      { status: 500 }
    )
  }
}

