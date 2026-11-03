import { NextResponse } from 'next/server'
import bundled from '../../../data/builds.json'
import { readData } from '@/lib/server/storage'

// Публичный список сборок. Сайт подтягивает его при открытии, поэтому правки из админки
// видны сразу, без пересборки. Если хранилище недоступно — отдаётся копия из data/builds.json.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data } = await readData('builds')
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60' } })
  } catch {
    return NextResponse.json(bundled, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
  }
}
