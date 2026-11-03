import { NextResponse } from 'next/server'
import bundled from '../../../data/reviews.json'
import { readData } from '@/lib/server/storage'

// Публичный список отзывов (как /api/builds: свежие данные, а при сбое — копия из data/reviews.json).
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data } = await readData('reviews')
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60' } })
  } catch {
    return NextResponse.json(bundled, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
  }
}
