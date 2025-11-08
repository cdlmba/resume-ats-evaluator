import { NextRequest, NextResponse } from 'next/server'
import { atsTips } from '@/data/atsTips'

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const category = params.category
  const filtered = atsTips.filter(
    (tip) =>
      tip.id === category ||
      tip.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
  )

  if (filtered.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Category not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: filtered,
  })
}

