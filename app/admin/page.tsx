'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RawBuild } from '../builds-data'
import type { Review } from '../reviews-data'
import { customThemeVars } from '../theme-utils'
import { downloadJson, toWebp, translit, uploadImage } from './admin-utils'

type Mode = 'github' | 'file' | 'readonly'
type Auth = 'loading' | 'off' | 'login' | 'in'
type Tab = 'builds' | 'reviews'
type Msg = { kind: 'ok' | 'err'; text: string } | null

const DEFAULT_SKY = 'linear-gradient(180deg,#241010 0%,#3a1414 45%,#c1272d 100%)'
const blankBuild = (): RawBuild => ({ name: '', title: '', price: null, downloads: 0, tags: [], desc: '', details: [], sky: DEFAULT_SKY })
const blankReview = (): Review => ({ name: '', role: '', text: '', stars: 5 })

const isUrl = (s?: string) => !s || /^https?:\/\/\S+$/i.test(s.trim())

function buildProblems(b: RawBuild): string[] {
  const p: string[] = []
  if (!b.title.trim()) p.push('Нет названия')
  if (!b.name.trim()) p.push('Нет ID (название латиницей)')
  if (b.price !== null && (!Number.isInteger(b.price) || b.price < 0)) p.push('Цена должна быть целым числом')
  if (!Number.isInteger(b.downloads) || b.downloads < 0) p.push('Скачиваний: целое число от 0')
  if (!isUrl(b.download)) p.push('Ссылка на скачивание должна начинаться с https://')
  if (!isUrl(b.review)) p.push('Ссылка на обзор должна начинаться с https://')
  return p
}
function reviewProblems(r: Review): string[] {
  const p: string[] = []
  if (!r.name.trim()) p.push('Нет имени')
  if (!r.text.trim()) p.push('Нет текста')
  return p
}

const MODE_TEXT: Record<Mode, string> = {
  github: 'Сохраняется в GitHub',
  file: 'Сохраняется на сервере',
  readonly: 'Только просмотр: подключи GitHub',
}

async function call<T>(url: string, init?: RequestInit): Promise<{ ok: boolean; status: number; json: T & { error?: string } }> {
  const r = await fetch(url, { ...init, cache: 'no-store' })
  const json = (await r.json().catch(() => ({}))) as T & { error?: string }
  return { ok: r.ok, status: r.status, json }
}

function Shell({ theme, custom, children }: { theme: string; custom: string; children: React.ReactNode }) {
  return (
    <div className="site adm" data-theme={theme} style={theme === 'custom' ? customThemeVars(custom) : undefined}>
      {children}
    </div>
  )
}

export default function AdminPage() {
  const [auth, setAuth] = useState<Auth>('loading')
  const [mode, setMode] = useState<Mode>('file')
  const [pwd, setPwd] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [theme, setTheme] = useState('red')
  const [custom, setCustom] = useState('#ff5a36')

  const [tab, setTab] = useState<Tab>('builds')
  const [builds, setBuilds] = useState<RawBuild[]>([])
  const [bBase, setBBase] = useState('[]')
  const [bVer, setBVer] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [rBase, setRBase] = useState('[]')
  const [rVer, setRVer] = useState('')
  const [selB, setSelB] = useState(0)
  const [selR, setSelR] = useState(0)
  const [query, setQuery] = useState('')
  const [msg, setMsg] = useState<Msg>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const [tagDraft, setTagDraft] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const say = useCallback((kind: 'ok' | 'err', text: string) => setMsg({ kind, text }), [])
  useEffect(() => {
    if (!msg || msg.kind === 'err') return
    const t = setTimeout(() => setMsg(null), 3500)
    return () => clearTimeout(t)
  }, [msg])

  // тема сайта (если посетитель/ты её уже выбирал)
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem('nw-settings') || '{}')
      if (typeof v.theme === 'string') setTheme(v.theme)
      if (typeof v.customColor === 'string') setCustom(v.customColor)
    } catch {}
  }, [])

  const loadAll = useCallback(async () => {
    const [b, r] = await Promise.all([
      call<{ data: RawBuild[]; version: string; mode: Mode }>('/api/admin/builds'),
      call<{ data: Review[]; version: string }>('/api/admin/reviews'),
    ])
    if (b.status === 401) return setAuth('login')
    if (!b.ok) return say('err', b.json.error || 'Не удалось загрузить сборки.')
    setBuilds(b.json.data)
    setBBase(JSON.stringify(b.json.data))
    setBVer(b.json.version)
    setMode(b.json.mode)
    if (r.ok) {
      setReviews(r.json.data)
      setRBase(JSON.stringify(r.json.data))
      setRVer(r.json.version)
    } else say('err', r.json.error || 'Не удалось загрузить отзывы.')
  }, [say])

  useEffect(() => {
    ;(async () => {
      const s = await call<{ configured: boolean; authed: boolean; mode: Mode }>('/api/admin/auth')
      setMode(s.json.mode)
      if (!s.json.configured) return setAuth('off')
      if (!s.json.authed) return setAuth('login')
      setAuth('in')
      loadAll()
    })()
  }, [loadAll])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErr('')
    const r = await call('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) })
    if (!r.ok) return setLoginErr(r.json.error || 'Не получилось войти.')
    setPwd('')
    setAuth('in')
    loadAll()
  }
  const logout = async () => {
    await call('/api/admin/auth', { method: 'DELETE' })
    setAuth('login')
  }

  const bDirty = JSON.stringify(builds) !== bBase
  const rDirty = JSON.stringify(reviews) !== rBase
  const dirty = tab === 'builds' ? bDirty : rDirty

  // предупреждение при закрытии вкладки с несохранёнными правками
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (bDirty || rDirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [bDirty, rDirty])

  const cur = builds[selB]
  const curR = reviews[selR]
  const bProblems = useMemo(() => builds.map(buildProblems), [builds])
  const rProblems = useMemo(() => reviews.map(reviewProblems), [reviews])
  const anyProblem = tab === 'builds' ? bProblems.some((p) => p.length) : rProblems.some((p) => p.length)

  const patchB = (patch: Partial<RawBuild>) => setBuilds((l) => l.map((b, i) => (i === selB ? { ...b, ...patch } : b)))
  const patchR = (patch: Partial<Review>) => setReviews((l) => l.map((r, i) => (i === selR ? { ...r, ...patch } : r)))

  const save = useCallback(async () => {
    if (saving) return
    if (mode === 'readonly') return say('err', 'Сохранение выключено: подключи GitHub (см. README → «Админка»).')
    if (anyProblem) return say('err', 'Исправь отмеченные ⚠ ошибки, потом сохраняй.')
    setSaving(true)
    try {
      if (tab === 'builds') {
        const r = await call<{ version: string; data: RawBuild[] }>('/api/admin/builds', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: builds, version: bVer }) })
        if (!r.ok) throw new Error(r.json.error || 'Не удалось сохранить.')
        setBuilds(r.json.data)
        setBBase(JSON.stringify(r.json.data))
        setBVer(r.json.version)
      } else {
        const r = await call<{ version: string; data: Review[] }>('/api/admin/reviews', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: reviews, version: rVer }) })
        if (!r.ok) throw new Error(r.json.error || 'Не удалось сохранить.')
        setReviews(r.json.data)
        setRBase(JSON.stringify(r.json.data))
        setRVer(r.json.version)
      }
      say('ok', 'Сохранено. На сайте изменения появятся через несколько секунд.')
    } catch (e) {
      say('err', e instanceof Error ? e.message : 'Не удалось сохранить.')
    } finally {
      setSaving(false)
    }
  }, [anyProblem, builds, bVer, mode, reviews, rVer, saving, say, tab])

  // Ctrl+S
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (dirty) save()
      }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [dirty, save])

  const revert = () => {
    if (!confirm('Отменить все несохранённые правки на этой вкладке?')) return
    if (tab === 'builds') setBuilds(JSON.parse(bBase))
    else setReviews(JSON.parse(rBase))
  }

  // ---- картинки ----
  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return
      if (!file.type.startsWith('image/')) return say('err', 'Нужна картинка (PNG, JPG или WebP).')
      setUploading(true)
      try {
        if (tab === 'builds') {
          if (!cur) throw new Error('Сначала выбери или создай сборку.')
          const path = await uploadImage(await toWebp(file, 1600), cur.name || cur.title || 'build')
          patchB({ screenshot: path })
        } else {
          if (!curR) throw new Error('Сначала выбери или создай отзыв.')
          const path = await uploadImage(await toWebp(file, 256, true), curR.name || 'avatar')
          patchR({ avatar: path })
        }
        say('ok', 'Картинка загружена. Не забудь нажать «Сохранить на сайт».')
      } catch (e) {
        say('err', e instanceof Error ? e.message : 'Не удалось загрузить картинку.')
      } finally {
        setUploading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, cur, curR, selB, selR, say],
  )

  // вставка картинки из буфера (Ctrl+V)
  useEffect(() => {
    const h = (e: ClipboardEvent) => {
      const f = Array.from(e.clipboardData?.files ?? []).find((x) => x.type.startsWith('image/'))
      if (f) {
        e.preventDefault()
        handleFile(f)
      }
    }
    document.addEventListener('paste', h)
    return () => document.removeEventListener('paste', h)
  }, [handleFile])

  // ---- действия над списком ----
  const move = <T,>(list: T[], set: (l: T[]) => void, i: number, d: -1 | 1, sel: (n: number) => void) => {
    const j = i + d
    if (j < 0 || j >= list.length) return
    const n = [...list]
    ;[n[i], n[j]] = [n[j], n[i]]
    set(n)
    sel(j)
  }
  const addBuild = () => {
    setBuilds((l) => [...l, blankBuild()])
    setSelB(builds.length)
    setQuery('')
  }
  const addReview = () => {
    setReviews((l) => [...l, blankReview()])
    setSelR(reviews.length)
  }
  const dupBuild = (i: number) => {
    const b = builds[i]
    setBuilds((l) => [...l.slice(0, i + 1), { ...b, title: b.title + ' (копия)', name: b.name + ' copy', tags: [...b.tags], details: [...b.details] }, ...l.slice(i + 1)])
    setSelB(i + 1)
  }
  const removeBuild = (i: number) => {
    if (!confirm(`Удалить сборку «${builds[i].title || 'без названия'}»? (Пока не нажмёшь «Сохранить», её можно вернуть кнопкой «Отменить правки».)`)) return
    setBuilds((l) => l.filter((_, k) => k !== i))
    setSelB(Math.max(0, i - 1))
  }
  const removeReview = (i: number) => {
    if (!confirm(`Удалить отзыв «${reviews[i].name || 'без имени'}»?`)) return
    setReviews((l) => l.filter((_, k) => k !== i))
    setSelR(Math.max(0, i - 1))
  }

  const importFile = async (f: File | undefined) => {
    if (!f) return
    try {
      const data = JSON.parse(await f.text())
      if (!Array.isArray(data)) throw new Error()
      if (tab === 'builds') setBuilds(data as RawBuild[])
      else setReviews(data as Review[])
      say('ok', 'Файл загружен в редактор. Проверь и нажми «Сохранить на сайт».')
    } catch {
      say('err', 'Не получилось прочитать файл: нужен JSON со списком.')
    }
  }

  const allTags = useMemo(() => Array.from(new Set(builds.flatMap((b) => b.tags))).sort(), [builds])
  const shownBuilds = builds.map((b, i) => ({ b, i })).filter(({ b }) => !query || `${b.title} ${b.name}`.toLowerCase().includes(query.toLowerCase()))

  const addTag = (raw: string) => {
    const t = raw.trim().slice(0, 40)
    if (!t || !cur || cur.tags.includes(t) || cur.tags.length >= 10) return setTagDraft('')
    patchB({ tags: [...cur.tags, t] })
    setTagDraft('')
  }

  // ================= экраны входа =================
  if (auth === 'loading') return <Shell theme={theme} custom={custom}><div className="adm-center">Загрузка…</div></Shell>

  if (auth === 'off')
    return (
      <Shell theme={theme} custom={custom}>
        <div className="adm-center">
          <div className="adm-card">
            <h1>Админка выключена</h1>
            <p>Чтобы включить её, задай переменную окружения <code>ADMIN_PASSWORD</code> (минимум 8 символов) и перезапусти / передеплой сайт.</p>
            <p>На Vercel: Project → Settings → Environment Variables. Подробная инструкция в README, раздел «Админка».</p>
          </div>
        </div>
      </Shell>
    )

  if (auth === 'login')
    return (
      <Shell theme={theme} custom={custom}>
        <div className="adm-center">
          <form className="adm-card" onSubmit={login}>
            <h1>Вход в админку</h1>
            <p>NELACOSTE work · управление сборками и отзывами</p>
            <input className="adm-input" type="password" autoFocus placeholder="Пароль" value={pwd} onChange={(e) => setPwd(e.target.value)} autoComplete="current-password" />
            {loginErr && <div className="adm-msg err">{loginErr}</div>}
            <button className="btn btn-primary" type="submit" disabled={!pwd}>Войти</button>
          </form>
        </div>
      </Shell>
    )

  // ================= основная админка =================
  const price = cur?.price
  return (
    <Shell theme={theme} custom={custom}>
      <header className="adm-top">
        <div className="adm-brand"><b>NELACOSTE</b> work <span>админка</span></div>
        <div className="adm-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'builds'} className={tab === 'builds' ? 'on' : ''} onClick={() => setTab('builds')}>
            Сборки <i>{builds.length}</i>{bDirty && <em title="Есть несохранённые правки" />}
          </button>
          <button role="tab" aria-selected={tab === 'reviews'} className={tab === 'reviews' ? 'on' : ''} onClick={() => setTab('reviews')}>
            Отзывы <i>{reviews.length}</i>{rDirty && <em title="Есть несохранённые правки" />}
          </button>
        </div>
        <div className="adm-top-right">
          <span className={`adm-mode ${mode}`}>{MODE_TEXT[mode]}</span>
          <button className="adm-ghost" onClick={() => downloadJson(tab === 'builds' ? 'builds.json' : 'reviews.json', tab === 'builds' ? builds : reviews)} title="Скачать копию списка">Резерв</button>
          <button className="adm-ghost" onClick={() => importRef.current?.click()} title="Загрузить список из файла">Из файла</button>
          <input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => { importFile(e.target.files?.[0]); e.target.value = '' }} />
          <a className="adm-ghost" href="/" target="_blank" rel="noopener noreferrer">Сайт ↗</a>
          <button className="adm-ghost" onClick={logout}>Выйти</button>
        </div>
      </header>

      {msg && <div className={`adm-msg ${msg.kind} adm-flash`} onClick={() => setMsg(null)}>{msg.text}</div>}

      {tab === 'builds' ? (
        <div className="adm-body">
          <aside className="adm-list">
            <button className="btn btn-primary adm-add" onClick={addBuild}>＋ Новая сборка</button>
            <input className="adm-input" placeholder="Поиск…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="adm-items">
              {shownBuilds.map(({ b, i }) => (
                <div key={i} className={`adm-item${i === selB ? ' on' : ''}`} onClick={() => setSelB(i)}>
                  <div className="adm-thumb">{b.screenshot ? <img src={b.screenshot} alt="" loading="lazy" /> : <span style={{ background: b.sky }} />}</div>
                  <div className="adm-item-t">
                    <b>{b.title || 'Без названия'}</b>
                    <small>{b.price === null ? 'Бесплатно' : `${b.price} ₽`} · ⬇ {b.downloads}</small>
                  </div>
                  {bProblems[i]?.length > 0 && <span className="adm-warn" title={bProblems[i].join('\n')}>⚠</span>}
                  <div className="adm-item-btns" onClick={(e) => e.stopPropagation()}>
                    <button title="Выше" onClick={() => move(builds, setBuilds, i, -1, setSelB)}>↑</button>
                    <button title="Ниже" onClick={() => move(builds, setBuilds, i, 1, setSelB)}>↓</button>
                  </div>
                </div>
              ))}
              {shownBuilds.length === 0 && <div className="adm-empty">Ничего не найдено</div>}
            </div>
          </aside>

          {cur ? (
            <main className="adm-main">
              <section className="adm-form">
                <h2>Сборка</h2>
                {bProblems[selB]?.length > 0 && <div className="adm-msg err">⚠ {bProblems[selB].join(' · ')}</div>}

                <div className="adm-grid2">
                  <label className="adm-field">
                    <span>Название на карточке *</span>
                    <input className="adm-input" value={cur.title} maxLength={80} placeholder="Например: Invicta own crmp!" onChange={(e) => {
                      const auto = translit(cur.title)
                      patchB({ title: e.target.value, ...(!cur.name || cur.name === auto ? { name: translit(e.target.value) } : {}) })
                    }} />
                  </label>
                  <label className="adm-field">
                    <span>ID латиницей * <small>для поиска; ставится сам</small></span>
                    <input className="adm-input" value={cur.name} maxLength={80} onChange={(e) => patchB({ name: e.target.value })} />
                  </label>
                </div>

                <div className="adm-grid2">
                  <div className="adm-field">
                    <span>Цена</span>
                    <div className="adm-price">
                      <div className="sm-seg">
                        <button className={price === null ? 'on' : ''} onClick={() => patchB({ price: null })}>Бесплатно</button>
                        <button className={price !== null ? 'on' : ''} onClick={() => patchB({ price: price ?? 200 })}>Платная</button>
                      </div>
                      {price !== null && (
                        <label className="adm-suffix"><input className="adm-input" type="number" min={0} step={10} value={price} onChange={(e) => patchB({ price: e.target.value === '' ? 0 : Math.round(Number(e.target.value)) })} /><i>₽</i></label>
                      )}
                    </div>
                  </div>
                  <label className="adm-field">
                    <span>Скачиваний</span>
                    <input className="adm-input" type="number" min={0} value={cur.downloads} onChange={(e) => patchB({ downloads: Math.max(0, Math.round(Number(e.target.value) || 0)) })} />
                  </label>
                </div>

                <div className="adm-field">
                  <span>Скриншот <small>перетащи файл, нажми или вставь из буфера (Ctrl+V). Сам станет WebP, ширина до 1600 px</small></span>
                  <div
                    className={`adm-drop${drag ? ' over' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]) }}
                  >
                    {cur.screenshot ? <img src={cur.screenshot} alt="" /> : <div className="adm-drop-empty"><b>Загрузить картинку</b><small>PNG, JPG или WebP</small></div>}
                    {uploading && <div className="adm-uploading">Загружаю…</div>}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }} />
                  {cur.screenshot && <button className="adm-link" onClick={() => patchB({ screenshot: undefined })}>Убрать картинку</button>}
                </div>

                <div className="adm-grid2">
                  <label className="adm-field">
                    <span>Ссылка на скачивание <small>пусто — кнопка ведёт в Telegram</small></span>
                    <input className="adm-input" value={cur.download ?? ''} placeholder="https://disk.yandex.ru/d/…" onChange={(e) => patchB({ download: e.target.value || undefined })} />
                  </label>
                  <label className="adm-field">
                    <span>Ссылка на видеообзор <small>пусто — кнопки «Обзор» не будет</small></span>
                    <input className="adm-input" value={cur.review ?? ''} placeholder="https://youtu.be/…" onChange={(e) => patchB({ review: e.target.value || undefined })} />
                  </label>
                </div>

                <label className="adm-field">
                  <span>Описание</span>
                  <textarea className="adm-input" rows={3} maxLength={1500} value={cur.desc} onChange={(e) => patchB({ desc: e.target.value })} />
                </label>

                <div className="adm-field">
                  <span>Теги <small>Enter или запятая; первые два видны на карточке</small></span>
                  <div className="adm-tags">
                    {cur.tags.map((t) => (
                      <i key={t}>{t}<button onClick={() => patchB({ tags: cur.tags.filter((x) => x !== t) })} aria-label={`Убрать ${t}`}>×</button></i>
                    ))}
                    <input
                      list="adm-tag-list"
                      value={tagDraft}
                      placeholder="новый тег…"
                      onChange={(e) => (e.target.value.includes(',') ? addTag(e.target.value.replace(',', '')) : setTagDraft(e.target.value))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagDraft) } else if (e.key === 'Backspace' && !tagDraft && cur.tags.length) patchB({ tags: cur.tags.slice(0, -1) }) }}
                      onBlur={() => addTag(tagDraft)}
                    />
                    <datalist id="adm-tag-list">{allTags.map((t) => <option key={t} value={t} />)}</datalist>
                  </div>
                </div>

                <label className="adm-field">
                  <span>Возможности <small>каждая с новой строки (вкладка «Возможности»)</small></span>
                  <textarea className="adm-input" rows={5} value={cur.details.join('\n')} onChange={(e) => patchB({ details: e.target.value.split('\n') })} onBlur={() => patchB({ details: cur.details.map((d) => d.trim()).filter(Boolean) })} />
                </label>

                <div className="adm-row-btns">
                  <button className="adm-ghost" onClick={() => dupBuild(selB)}>Дублировать</button>
                  <button className="adm-ghost danger" onClick={() => removeBuild(selB)}>Удалить сборку</button>
                </div>
              </section>

              <aside className="adm-preview">
                <div className="adm-prev-t">Так будет на сайте</div>
                <div className="acard" style={{ cursor: 'default' }}>
                  <div className="acard-shot">
                    {cur.screenshot ? <img className="acard-fg loaded" src={cur.screenshot} alt="" /> : <div className="acard-fallback" style={{ background: cur.sky }} />}
                    <span className={`acard-chip${price === null ? ' free' : ''}`}>{price === null ? 'Бесплатно' : `${price} ₽`}</span>
                  </div>
                  <div className="acard-body">
                    <h3 className="acard-title">{cur.title || 'Название сборки'}</h3>
                    <div className="acard-tags">{cur.tags.slice(0, 2).map((t) => <i key={t}>{t}</i>)}</div>
                    <div className="acard-row"><span className="acard-dl">⬇ {cur.downloads}</span><span className="acard-more">Подробнее</span></div>
                  </div>
                </div>
              </aside>
            </main>
          ) : (
            <main className="adm-main"><div className="adm-empty big">Сборок пока нет. Нажми «＋ Новая сборка».</div></main>
          )}
        </div>
      ) : (
        <div className="adm-body">
          <aside className="adm-list">
            <button className="btn btn-primary adm-add" onClick={addReview}>＋ Новый отзыв</button>
            <div className="adm-items">
              {reviews.map((r, i) => (
                <div key={i} className={`adm-item${i === selR ? ' on' : ''}`} onClick={() => setSelR(i)}>
                  <div className="adm-thumb round">{r.avatar ? <img src={r.avatar} alt="" loading="lazy" /> : <span className="init">{(r.name || '?').charAt(0).toUpperCase()}</span>}</div>
                  <div className="adm-item-t"><b>{r.name || 'Без имени'}</b><small>{r.text.slice(0, 40) || '—'}</small></div>
                  {rProblems[i]?.length > 0 && <span className="adm-warn" title={rProblems[i].join('\n')}>⚠</span>}
                  <div className="adm-item-btns" onClick={(e) => e.stopPropagation()}>
                    <button title="Выше" onClick={() => move(reviews, setReviews, i, -1, setSelR)}>↑</button>
                    <button title="Ниже" onClick={() => move(reviews, setReviews, i, 1, setSelR)}>↓</button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && <div className="adm-empty">Отзывов пока нет</div>}
            </div>
          </aside>

          {curR ? (
            <main className="adm-main">
              <section className="adm-form">
                <h2>Отзыв</h2>
                {rProblems[selR]?.length > 0 && <div className="adm-msg err">⚠ {rProblems[selR].join(' · ')}</div>}
                <div className="adm-field">
                  <span>Аватарка <small>квадрат; сам обрежется по центру до 256 px</small></span>
                  <div className="adm-avatar-row">
                    <div className={`adm-avatar${drag ? ' over' : ''}`} onClick={() => fileRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]) }}>
                      {curR.avatar ? <img src={curR.avatar} alt="" /> : <span>{(curR.name || '?').charAt(0).toUpperCase()}</span>}
                      {uploading && <div className="adm-uploading">…</div>}
                    </div>
                    <div className="adm-avatar-btns">
                      <button className="adm-ghost" onClick={() => fileRef.current?.click()}>Загрузить</button>
                      {curR.avatar && <button className="adm-ghost danger" onClick={() => patchR({ avatar: undefined })}>Убрать</button>}
                      <small>Перетащи файл на круг или вставь из буфера (Ctrl+V)</small>
                    </div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }} />
                </div>
                <div className="adm-grid2">
                  <label className="adm-field"><span>Имя *</span><input className="adm-input" maxLength={60} value={curR.name} onChange={(e) => patchR({ name: e.target.value })} /></label>
                  <label className="adm-field"><span>Подпись</span><input className="adm-input" maxLength={80} placeholder="Покупатель сборки на заказ" value={curR.role} onChange={(e) => patchR({ role: e.target.value })} /></label>
                </div>
                <label className="adm-field"><span>Текст отзыва *</span><textarea className="adm-input" rows={5} maxLength={1200} value={curR.text} onChange={(e) => patchR({ text: e.target.value })} /></label>
                <div className="adm-field">
                  <span>Оценка</span>
                  <div className="adm-stars">{[1, 2, 3, 4, 5].map((n) => <button key={n} className={n <= curR.stars ? 'on' : ''} onClick={() => patchR({ stars: n })} aria-label={`${n} из 5`}>★</button>)}</div>
                </div>
                <div className="adm-row-btns"><button className="adm-ghost danger" onClick={() => removeReview(selR)}>Удалить отзыв</button></div>
              </section>
              <aside className="adm-preview">
                <div className="adm-prev-t">Так будет на сайте</div>
                <div className="glass quote">
                  <div className="stars">{'★'.repeat(curR.stars)}<span className="off">{'★'.repeat(5 - curR.stars)}</span></div>
                  <p>{curR.text || 'Текст отзыва…'}</p>
                  <div className="who">
                    <div className="avatar">{curR.avatar ? <img src={curR.avatar} alt="" /> : <span>{(curR.name || '?').charAt(0).toUpperCase()}</span>}</div>
                    <div><div className="who-name">{curR.name || 'Имя'}</div><div className="who-role">{curR.role}</div></div>
                  </div>
                </div>
              </aside>
            </main>
          ) : (
            <main className="adm-main"><div className="adm-empty big">Нажми «＋ Новый отзыв».</div></main>
          )}
        </div>
      )}

      <footer className={`adm-save${dirty ? ' show' : ''}`}>
        <span>{dirty ? 'Есть несохранённые изменения' : 'Всё сохранено'}</span>
        <div>
          <button className="adm-ghost" disabled={!dirty || saving} onClick={revert}>Отменить правки</button>
          <button className="btn btn-primary" disabled={!dirty || saving || anyProblem || mode === 'readonly'} onClick={save}>{saving ? 'Сохраняю…' : 'Сохранить на сайт'}</button>
        </div>
      </footer>
    </Shell>
  )
}
