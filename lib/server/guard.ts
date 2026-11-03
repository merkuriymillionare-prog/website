import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE, adminConfigured, sameOrigin, verifyToken } from './auth'

/** Возвращает ответ-ошибку, если запрос не от админа; иначе null. */
export function guard(req: NextRequest, write = false): NextResponse | null {
  if (!adminConfigured())
    return NextResponse.json({ error: 'Админка выключена: задай переменную ADMIN_PASSWORD (минимум 8 символов).' }, { status: 503 })
  if (!verifyToken(req.cookies.get(COOKIE)?.value)) return NextResponse.json({ error: 'Нужен вход.' }, { status: 401 })
  if (write && !sameOrigin(req.headers.get('origin'), req.headers.get('host')))
    return NextResponse.json({ error: 'Запрос с чужого сайта отклонён.' }, { status: 403 })
  return null
}
