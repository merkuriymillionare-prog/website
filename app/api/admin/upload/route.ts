import crypto from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { guard } from '@/lib/server/guard'
import { StorageError, writeUpload } from '@/lib/server/storage'
import { MAX_UPLOAD_BYTES, detectImage, safeUploadName } from '@/lib/server/validate'

export const dynamic = 'force-dynamic'

// Загрузка скриншота: тело запроса — сама картинка. Тип проверяем по содержимому.
export async function POST(req: NextRequest) {
  const denied = guard(req, true)
  if (denied) return denied
  const buf = Buffer.from(await req.arrayBuffer())
  if (buf.length === 0) return NextResponse.json({ error: 'Пустой файл.' }, { status: 400 })
  if (buf.length > MAX_UPLOAD_BYTES) return NextResponse.json({ error: 'Файл слишком большой (максимум 4 МБ).' }, { status: 413 })
  const type = detectImage(buf)
  if (!type) return NextResponse.json({ error: 'Нужна картинка WebP, PNG или JPG.' }, { status: 415 })
  const name = safeUploadName(req.headers.get('x-name') ?? 'build', type.ext, crypto.randomBytes(3).toString('hex'))
  try {
    await writeUpload(name, buf)
  } catch (e) {
    return NextResponse.json({ error: e instanceof StorageError ? e.message : 'Не удалось сохранить картинку.' }, { status: 502 })
  }
  return NextResponse.json({ ok: true, path: `/api/img/${name}` })
}
