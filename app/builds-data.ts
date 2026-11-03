// Данные о сборках лежат в data/builds.json.
// Редактировать их проще всего в админке: /admin (подробности — в README, раздел «Админка»).
// Руками тоже можно: файл data/builds.json — обычный список, один объект = одна сборка.
//
// Поля сборки:
//   name        — название латиницей (для поиска; из него же делается стабильный id)
//   title       — название на карточке
//   price       — null = бесплатно, число = цена в ₽
//   downloads   — счётчик скачиваний
//   tags        — теги (2 первых видны на карточке)
//   desc        — описание
//   details     — список возможностей (вкладка «Возможности»)
//   screenshot  — картинка, например '/screenshots/my.png' или загруженная в админке '/api/img/...'
//   download    — ссылка на скачивание (нет — кнопка ведёт в Telegram)
//   review      — ссылка на видеообзор (нет — кнопки «Обзор» не будет)
//   sky         — запасной градиент, если нет скриншота

import raw from '../data/builds.json'

export type RawBuild = {
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

export type Build = RawBuild & {
  id: string // стабильный id (из name; при совпадении добавляется -2, -3)
  d1: string // порядковый номер 01, 02, …
}

const cap = (t: string) => t.trim().replace(/^./, (ch) => ch.toUpperCase())
const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'build'

/** Превращает сырые данные из JSON в готовые сборки: id, номер, аккуратное название. */
export function prepareBuilds(list: RawBuild[]): Build[] {
  const used = new Map<string, number>()
  return list.map((b, i) => {
    const base = slug(b.name)
    const n = (used.get(base) ?? 0) + 1
    used.set(base, n)
    return {
      ...b,
      id: n === 1 ? base : `${base}-${n}`,
      d1: String(i + 1).padStart(2, '0'),
      title: cap(b.title),
    }
  })
}

// Встроенная копия: показывается сразу, а затем сайт подтягивает свежий список с /api/builds.
export const BUILDS: Build[] = prepareBuilds(raw as RawBuild[])
