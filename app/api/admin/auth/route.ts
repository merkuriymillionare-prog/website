import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE, adminConfigured, checkPassword, loginAllowed, loginFailed, loginOk, makeToken, sameOrigin, verifyToken } from '@/lib/server/auth'
import { storageMode } from '@/lib/server/storage'

export const dynamic = 'force-dynamic'

const ipOf = (req: NextRequest) => (req.headers.get('x-forwarded-for') ?? 'local').split(',')[0].trim()

// Статус: включена ли админка, вошёл ли пользователь, куда сохраняются данные
export async function GET(req: NextRequest) {
  return NextResponse.json({
    configured: adminConfigured(),
    authed: verifyToken(req.cookies.get(COOKIE)?.value),
    mode: storageMode(),
  })
}

// Вход
export async function POST(req: NextRequest) {
  if (!adminConfigured()) return NextResponse.json({ error: 'Админка выключена: не задан ADMIN_PASSWORD.' }, { status: 503 })
  if (!sameOrigin(req.headers.get('origin'), req.headers.get('host'))) return NextResponse.json({ error: 'Отклонено.' }, { status: 403 })
  const ip = ipOf(req)
  if (!loginAllowed(ip)) return NextResponse.json({ error: 'Слишком много попыток. Подожди 10 минут.' }, { status: 429 })
  const body = (await req.json().catch(() => ({}))) as { password?: unknown }
  if (typeof body.password !== 'string' || !checkPassword(body.password)) {
    loginFailed(ip)
    return NextResponse.json({ error: 'Неверный пароль.' }, { status: 401 })
  }
  loginOk(ip)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
  return res
}

// Выход
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 })
  return res
}
