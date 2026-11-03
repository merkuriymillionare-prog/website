import { NextResponse, type NextRequest } from 'next/server'
import { guard } from '@/lib/server/guard'
import { ConflictError, StorageError, readData, storageMode, writeData } from '@/lib/server/storage'
import { sanitizeReviews } from '@/lib/server/validate'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied
  try {
    const { data, version } = await readData('reviews')
    return NextResponse.json({ data, version, mode: storageMode() })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Не удалось прочитать отзывы.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const denied = guard(req, true)
  if (denied) return denied
  const body = (await req.json().catch(() => null)) as { data?: unknown; version?: unknown } | null
  if (!body) return NextResponse.json({ error: 'Пустой запрос.' }, { status: 400 })
  const clean = sanitizeReviews(body.data)
  if (!clean.ok) return NextResponse.json({ error: clean.error }, { status: 400 })
  try {
    const { version } = await writeData('reviews', clean.data, typeof body.version === 'string' ? body.version : undefined)
    return NextResponse.json({ ok: true, version, data: clean.data })
  } catch (e) {
    if (e instanceof ConflictError)
      return NextResponse.json({ error: 'Отзывы уже изменили в другом месте. Обнови страницу и повтори правки.' }, { status: 409 })
    if (e instanceof StorageError) return NextResponse.json({ error: e.message }, { status: 502 })
    return NextResponse.json({ error: 'Не удалось сохранить.' }, { status: 500 })
  }
}
