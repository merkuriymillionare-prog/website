// Отзывы лежат в data/reviews.json и правятся в админке (/admin → «Отзывы»), там же ставятся аватарки.
// Поля: name — имя, role — подпись («Пользователь HudLoader»), text — текст, stars — оценка 1–5,
// avatar — картинка, например '/api/img/...' (загруженная в админке) или '/avatars/vasya.webp' (файл из public/avatars).
// Нет аватарки — показывается первая буква имени.

import raw from '../data/reviews.json'

export type Review = {
  name: string
  role: string
  text: string
  stars: number
  avatar?: string
}

export const REVIEWS: Review[] = raw as Review[]
