// Проверка данных сборок на сервере. Всё, что приходит из админки, проходит через sanitizeBuilds:
// лишние поля выбрасываются, строки обрезаются по длине, ссылки — только http(s), картинки — только свои.

export type RawBuildInput = {
  name: string
  title: string
  price: number | null
  downloads: number
  tags: string[]
  desc: string
  details: string[]
  sky: string
  screenshot?: string
  download?: string
  review?: string
}

export const DEFAULT_SKY = 'linear-gradient(180deg,#241010 0%,#3a1414 45%,#c1272d 100%)'
const MAX_BUILDS = 300

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '')
const multi = (v: unknown, max: number): string => (typeof v === 'string' ? v.replace(/\r/g, '').trim().slice(0, max) : '')

function url(v: unknown): string | undefined {
  const s = str(v, 500)
  if (!s) return undefined
  try {
    const u = new URL(s)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : undefined
  } catch {
    return undefined
  }
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

export function sanitizeBuilds(input: unknown): Result<RawBuildInput[]> {
  if (!Array.isArray(input)) return { ok: false, error: 'Ожидался список сборок.' }
  if (input.length > MAX_BUILDS) return { ok: false, error: `Слишком много сборок (максимум ${MAX_BUILDS}).` }
  const out: RawBuildInput[] = []
  for (let i = 0; i < input.length; i++) {
    const b = input[i] as Record<string, unknown>
    if (!b || typeof b !== 'object') return { ok: false, error: `Сборка №${i + 1}: неверный формат.` }
    const title = str(b.title, 80)
    const name = str(b.name, 80)
    const label = title || `№${i + 1}`
    if (!title) return { ok: false, error: `Сборка №${i + 1}: не заполнено название.` }
    if (!name) return { ok: false, error: `Сборка «${label}»: не заполнен ID (название латиницей).` }

    let price: number | null = null
    if (b.price !== null && b.price !== undefined && b.price !== '') {
      const p = Number(b.price)
      if (!Number.isInteger(p) || p < 0 || p > 1_000_000) return { ok: false, error: `Сборка «${label}»: цена должна быть целым числом.` }
      price = p
    }
    const dl = Number(b.downloads ?? 0)
    if (!Number.isInteger(dl) || dl < 0 || dl > 1_000_000_000) return { ok: false, error: `Сборка «${label}»: скачиваний — целое число от 0.` }

    const tags = (Array.isArray(b.tags) ? b.tags : []).map((t) => str(t, 40)).filter(Boolean).slice(0, 10)
    const details = (Array.isArray(b.details) ? b.details : []).map((t) => multi(t, 400)).filter(Boolean).slice(0, 15)

    let sky = str(b.sky, 300)
    if (!/^[a-zA-Z0-9#%(),.\s-]{0,300}$/.test(sky) || !sky) sky = DEFAULT_SKY

    const item: RawBuildInput = { name, title, price, downloads: dl, tags, desc: multi(b.desc, 1500), details, sky }

    const shot = str(b.screenshot, 200)
    if (shot) {
      if (!/^(\/api\/img\/[a-z0-9][a-z0-9._-]{0,120}|\/screenshots\/[A-Za-z0-9][A-Za-z0-9._-]{0,120})$/.test(shot))
        return { ok: false, error: `Сборка «${label}»: недопустимый путь к картинке.` }
      item.screenshot = shot
    }
    const d = url(b.download)
    if (str(b.download, 500) && !d) return { ok: false, error: `Сборка «${label}»: ссылка на скачивание должна начинаться с https://` }
    if (d) item.download = d
    const r = url(b.review)
    if (str(b.review, 500) && !r) return { ok: false, error: `Сборка «${label}»: ссылка на обзор должна начинаться с https://` }
    if (r) item.review = r
    out.push(item)
  }
  return { ok: true, data: out }
}

/** Тип картинки по первым байтам (расширению и заголовкам не верим). */
export function detectImage(buf: Uint8Array): { ext: 'webp' | 'png' | 'jpg'; mime: string } | null {
  if (buf.length < 12) return null
  const eq = (o: number, s: string) => s.split('').every((c, i) => buf[o + i] === c.charCodeAt(0))
  if (eq(0, 'RIFF') && eq(8, 'WEBP')) return { ext: 'webp', mime: 'image/webp' }
  if (buf[0] === 0x89 && eq(1, 'PNG')) return { ext: 'png', mime: 'image/png' }
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg', mime: 'image/jpeg' }
  return null
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024 // лимит тела запроса на Vercel — 4,5 МБ

export function safeUploadName(base: string, ext: string, rand: string): string {
  const slug =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'build'
  return `${slug}-${rand}.${ext}`
}

export const UPLOAD_NAME_RE = /^[a-z0-9][a-z0-9._-]{0,120}$/


export type RawReviewInput = { name: string; role: string; text: string; stars: number; avatar?: string }

export function sanitizeReviews(input: unknown): Result<RawReviewInput[]> {
  if (!Array.isArray(input)) return { ok: false, error: 'Ожидался список отзывов.' }
  if (input.length > 200) return { ok: false, error: 'Слишком много отзывов (максимум 200).' }
  const out: RawReviewInput[] = []
  for (let i = 0; i < input.length; i++) {
    const r = input[i] as Record<string, unknown>
    if (!r || typeof r !== 'object') return { ok: false, error: `Отзыв №${i + 1}: неверный формат.` }
    const name = str(r.name, 60)
    const text = multi(r.text, 1200)
    if (!name) return { ok: false, error: `Отзыв №${i + 1}: не указано имя.` }
    if (!text) return { ok: false, error: `Отзыв «${name}»: пустой текст.` }
    let stars = Number(r.stars ?? 5)
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) stars = 5
    const item: RawReviewInput = { name, role: str(r.role, 80), text, stars }
    const av = str(r.avatar, 200)
    if (av) {
      if (!/^(\/api\/img\/[a-z0-9][a-z0-9._-]{0,120}|\/avatars\/[A-Za-z0-9][A-Za-z0-9._-]{0,120})$/.test(av))
        return { ok: false, error: `Отзыв «${name}»: недопустимый путь к аватарке.` }
      item.avatar = av
    }
    out.push(item)
  }
  return { ok: true, data: out }
}
