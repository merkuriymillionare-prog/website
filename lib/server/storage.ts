import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

// Где лежат данные:
//  • GITHUB — переменные GITHUB_TOKEN и GITHUB_REPO заданы. Сборки и картинки коммитятся в репозиторий
//    (папка data/). Подходит для Vercel, где файловая система только для чтения.
//  • FILE   — иначе, если сайт запущен на своём сервере / локально: пишем в папку data/ рядом с проектом.
//  • READONLY — на Vercel без GitHub: читать можно (из data/builds.json в сборке), сохранять нельзя.

export type Mode = 'github' | 'file' | 'readonly'

export class ConflictError extends Error {
  constructor() {
    super('conflict')
  }
}
export class StorageError extends Error {}

export function storageMode(): Mode {
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) return 'github'
  if (process.env.VERCEL) return 'readonly'
  return 'file'
}

const dataDir = () => process.env.DATA_DIR || path.join(process.cwd(), 'data')
const sha1 = (s: string | Buffer) => crypto.createHash('sha1').update(s).digest('hex')

// ---------- GitHub ----------
const gh = {
  repo: () => process.env.GITHUB_REPO!,
  branch: () => process.env.GITHUB_BRANCH || 'main',
  dir: () => (process.env.GITHUB_DATA_PATH || 'data').replace(/^\/|\/$/g, ''),
  headers: (accept = 'application/vnd.github+json') => ({
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: accept,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'nelacostework-admin',
  }),
  url: (p: string) =>
    `https://api.github.com/repos/${gh.repo()}/contents/${p.split('/').map(encodeURIComponent).join('/')}`,
}

async function ghGet(p: string): Promise<{ content: string; sha: string } | null> {
  const r = await fetch(`${gh.url(p)}?ref=${encodeURIComponent(gh.branch())}`, { headers: gh.headers(), cache: 'no-store' })
  if (r.status === 404) return null
  if (!r.ok) throw new StorageError(`GitHub: ${r.status} ${(await r.text()).slice(0, 160)}`)
  const j = (await r.json()) as { content: string; sha: string }
  return { content: Buffer.from(j.content, 'base64').toString('utf8'), sha: j.sha }
}

async function ghPut(p: string, body: Buffer | string, message: string, sha?: string) {
  const r = await fetch(gh.url(p), {
    method: 'PUT',
    headers: { ...gh.headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(body).toString('base64'),
      branch: gh.branch(),
      ...(sha ? { sha } : {}),
    }),
  })
  if (r.status === 409 || r.status === 422) throw new ConflictError()
  if (!r.ok) throw new StorageError(`GitHub: ${r.status} ${(await r.text()).slice(0, 160)}`)
  const j = (await r.json()) as { content: { sha: string } }
  return j.content.sha
}

// ---------- публичный интерфейс ----------
export type Kind = 'builds' | 'reviews'
const FILE: Record<Kind, string> = { builds: 'builds.json', reviews: 'reviews.json' }
const LABEL: Record<Kind, string> = { builds: 'список сборок', reviews: 'отзывы' }

export async function readData(kind: Kind): Promise<{ data: unknown; version: string }> {
  const mode = storageMode()
  if (mode === 'github') {
    const f = await ghGet(`${gh.dir()}/${FILE[kind]}`)
    if (!f) throw new StorageError(`В репозитории нет файла ${gh.dir()}/${FILE[kind]}`)
    return { data: JSON.parse(f.content), version: f.sha }
  }
  const text = await fs.readFile(path.join(dataDir(), FILE[kind]), 'utf8')
  return { data: JSON.parse(text), version: sha1(text) }
}

export async function writeData(kind: Kind, data: unknown, expectedVersion?: string): Promise<{ version: string }> {
  const mode = storageMode()
  const text = JSON.stringify(data, null, 2) + '\n'
  if (mode === 'readonly') throw new StorageError('Сохранение недоступно: подключи GitHub (см. README) или запусти сайт на своём сервере.')
  if (mode === 'github') {
    const sha = await ghPut(`${gh.dir()}/${FILE[kind]}`, text, `Админка: обновлён ${LABEL[kind]}`, expectedVersion)
    return { version: sha }
  }
  const file = path.join(dataDir(), FILE[kind])
  if (expectedVersion) {
    const cur = sha1(await fs.readFile(file, 'utf8').catch(() => ''))
    if (cur !== expectedVersion) throw new ConflictError()
  }
  await fs.mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  await fs.writeFile(tmp, text, 'utf8')
  await fs.rename(tmp, file)
  return { version: sha1(text) }
}

export const readBuilds = () => readData('builds')
export const writeBuilds = (data: unknown, v?: string) => writeData('builds', data, v)

export async function writeUpload(name: string, buf: Buffer): Promise<void> {
  const mode = storageMode()
  if (mode === 'readonly') throw new StorageError('Загрузка картинок недоступна: подключи GitHub (см. README).')
  if (mode === 'github') {
    await ghPut(`${gh.dir()}/uploads/${name}`, buf, `Админка: картинка ${name}`)
    return
  }
  const dir = path.join(dataDir(), 'uploads')
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, name), buf)
}

export async function readUpload(name: string): Promise<Buffer | null> {
  const mode = storageMode()
  if (mode === 'github') {
    const r = await fetch(`${gh.url(`${gh.dir()}/uploads/${name}`)}?ref=${encodeURIComponent(gh.branch())}`, {
      headers: gh.headers('application/vnd.github.raw+json'),
      cache: 'no-store',
    })
    if (r.status === 404) return null
    if (!r.ok) throw new StorageError(`GitHub: ${r.status}`)
    return Buffer.from(await r.arrayBuffer())
  }
  try {
    return await fs.readFile(path.join(dataDir(), 'uploads', name))
  } catch {
    return null
  }
}
