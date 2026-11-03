import { UPLOAD_NAME_RE, detectImage } from '@/lib/server/validate'
import { readUpload } from '@/lib/server/storage'

// Картинки, загруженные через админку. Имя файла уникально, поэтому кэшируем навсегда.
export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!UPLOAD_NAME_RE.test(name)) return new Response('Not found', { status: 404 })
  const buf = await readUpload(name).catch(() => null)
  const type = buf ? detectImage(buf) : null
  if (!buf || !type) return new Response('Not found', { status: 404 })
  return new Response(new Uint8Array(buf), {
    headers: {
      'Content-Type': type.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
