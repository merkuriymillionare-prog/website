import crypto from 'node:crypto'

// Вход в админку по паролю из ADMIN_PASSWORD. После входа ставится подписанная cookie на 7 дней.
// Подпись — HMAC от ADMIN_SECRET (если не задан — от самого пароля), поэтому подделать её нельзя.

export const COOKIE = 'nw_admin'
const WEEK = 7 * 24 * 60 * 60 * 1000

export const adminConfigured = () => (process.env.ADMIN_PASSWORD ?? '').length >= 8

const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || ''

const sign = (payload: string) => crypto.createHmac('sha256', secret()).update(payload).digest('hex')

export function makeToken(now = Date.now()): string {
  const exp = String(now + WEEK)
  return `${exp}.${sign(`admin.${exp}`)}`
}

export function verifyToken(token: string | undefined | null, now = Date.now()): boolean {
  if (!token || !adminConfigured()) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < now) return false
  const good = sign(`admin.${exp}`)
  const a = Buffer.from(sig)
  const b = Buffer.from(good)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function checkPassword(input: string): boolean {
  if (!adminConfigured()) return false
  const h = (s: string) => crypto.createHash('sha256').update(s).digest()
  return crypto.timingSafeEqual(h(input), h(process.env.ADMIN_PASSWORD!))
}

// Защита от перебора пароля: 6 попыток в 10 минут с одного адреса.
const attempts = new Map<string, { n: number; t: number }>()
export function loginAllowed(ip: string, now = Date.now()): boolean {
  const a = attempts.get(ip)
  if (!a || now - a.t > 10 * 60 * 1000) return true
  return a.n < 6
}
export function loginFailed(ip: string, now = Date.now()) {
  const a = attempts.get(ip)
  if (!a || now - a.t > 10 * 60 * 1000) attempts.set(ip, { n: 1, t: now })
  else a.n++
  if (attempts.size > 500) attempts.clear()
}
export function loginOk(ip: string) {
  attempts.delete(ip)
}

/** Запросы, меняющие данные, принимаем только с нашего же сайта. */
export function sameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return true // не браузерные клиенты (curl) всё равно должны иметь cookie
  try {
    return !!host && new URL(origin).host === host
  } catch {
    return false
  }
}
