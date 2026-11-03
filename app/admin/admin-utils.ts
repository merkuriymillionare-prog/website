// Мелкие помощники админки: транслит, перевод картинок в WebP, загрузка на сервер.

const TR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

/** «Бабочка gta» → «babochka gta» (латиница для поиска и ссылки). */
export function translit(s: string): string {
  return s
    .toLowerCase()
    .split('')
    .map((c) => (c in TR ? TR[c] : c))
    .join('')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Картинка → WebP. maxW — максимальная ширина; square — обрезать до квадрата по центру (для аватарок). */
export async function toWebp(file: Blob, maxW: number, square = false): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  let sx = 0
  let sy = 0
  let sw = bmp.width
  let sh = bmp.height
  if (square) {
    const side = Math.min(bmp.width, bmp.height)
    sx = Math.round((bmp.width - side) / 2)
    sy = Math.round((bmp.height - side) / 2)
    sw = sh = side
  }
  const scale = Math.min(1, maxW / sw)
  const w = Math.max(1, Math.round(sw * scale))
  const h = Math.max(1, Math.round(sh * scale))
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, w, h)
  bmp.close?.()
  const blob = await new Promise<Blob | null>((res) => c.toBlob(res, 'image/webp', 0.86))
  if (blob && blob.type === 'image/webp') return blob
  // старые браузеры не умеют кодировать WebP — берём JPEG
  const jpg = await new Promise<Blob | null>((res) => c.toBlob(res, 'image/jpeg', 0.88))
  if (!jpg) throw new Error('Не удалось обработать картинку.')
  return jpg
}

export async function uploadImage(blob: Blob, name: string): Promise<string> {
  const r = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'x-name': encodeURIComponent(name).slice(0, 60) || 'image' },
    body: blob,
  })
  const j = (await r.json().catch(() => ({}))) as { path?: string; error?: string }
  if (!r.ok || !j.path) throw new Error(j.error || 'Не удалось загрузить картинку.')
  return j.path
}

export function downloadJson(name: string, data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
