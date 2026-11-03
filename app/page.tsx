'use client'

import { useEffect, useRef, useState } from 'react'
import { BUILDS as BUNDLED_BUILDS, prepareBuilds, type Build, type RawBuild } from './builds-data'
import { REVIEWS as BUNDLED_REVIEWS, type Review } from './reviews-data'
import { PORTFOLIO } from './portfolio-data'
import FlyBg from './fly-bg'
import Lightbox from './lightbox'
import { INSTALL_STEPS, INSTALL_VIDEO, youtubeId } from './install-data'
import { startTranslator } from './i18n'
import { customThemeVars, normalizeHex } from './theme-utils'

const TG = 'https://t.me/nelacostework?direct'
const DISCORD = 'https://discord.gg/t7fwKMdcu8'
const EMAIL = 'mailto:nelacostework@gmail.com'
const VK = 'https://vk.ru/nelacostework'

export default function Page() {
  const navRef = useRef<HTMLElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [buildFilter, setBuildFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [activeBuild, setActiveBuild] = useState<Build | null>(null)
  type View = 'home' | 'builds' | 'favs' | 'hud' | 'prices' | 'install' | 'portfolio' | 'reviews'
  const VIEWS: View[] = ['home', 'builds', 'favs', 'hud', 'prices', 'install', 'portfolio', 'reviews']
  const [view, setView] = useState<View>('home')
  const [infoTab, setInfoTab] = useState<'how' | 'price' | 'why'>('how')
  const [modalTab, setModalTab] = useState<'about' | 'features' | 'similar'>('about')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'default' | 'popular' | 'cheap' | 'name'>('default')
  const [settingsOpen, setSettingsOpen] = useState(false)
  type Theme = 'red' | 'violet' | 'blue' | 'green' | 'orange' | 'pink' | 'cyan' | 'gold' | 'custom'
  const [theme, setTheme] = useState<Theme>('red')
  const [customColor, setCustomColor] = useState('#ff5a36')
  const [hexDraft, setHexDraft] = useState('#ff5a36')
  const [density, setDensity] = useState<'compact' | 'normal' | 'large'>('normal')
  const [motion, setMotion] = useState<'on' | 'off'>('on')
  const [lang, setLang] = useState<'ru' | 'en'>('ru')
  const [scale, setScale] = useState<'s' | 'm' | 'l'>('m')
  const [round, setRound] = useState<'sharp' | 'normal' | 'round'>('normal')
  const [bgIcons, setBgIcons] = useState<'off' | 'few' | 'normal' | 'many'>('normal')
  const [zoomOpen, setZoomOpen] = useState(false)
  const [videoOn, setVideoOn] = useState(false)
  const [favs, setFavs] = useState<string[]>([])
  const [favsLoaded, setFavsLoaded] = useState(false)
  const [favNote, setFavNote] = useState('')
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [builds, setBuilds] = useState<Build[]>(BUNDLED_BUILDS)
  const [reviews, setReviews] = useState<Review[]>(BUNDLED_REVIEWS)
  const BUILDS = builds
  const [toast, setToast] = useState('')
  const [showTop, setShowTop] = useState(false)

  // Свежие сборки и отзывы (правятся в админке): подтягиваем сразу после открытия сайта.
  useEffect(() => {
    fetch('/api/builds')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setBuilds(prepareBuilds(d as RawBuild[]))
      })
      .catch(() => {})
    fetch('/api/reviews')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setReviews(d as Review[])
      })
      .catch(() => {})
  }, [])

  // Кнопка «Наверх» и всплывающие подсказки
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  // Настройки сайта: читаем сохранённые значения и запоминаем изменения
  useEffect(() => {
    try {
      const raw = localStorage.getItem('nw-settings')
      if (raw) {
        const v = JSON.parse(raw)
        const THEMES = ['red', 'violet', 'blue', 'green', 'orange', 'pink', 'cyan', 'gold', 'custom']
        if (THEMES.includes(v.theme)) setTheme(v.theme)
        if (typeof v.customColor === 'string') {
          setCustomColor(normalizeHex(v.customColor))
          setHexDraft(normalizeHex(v.customColor))
        }
        if (['compact', 'normal', 'large'].includes(v.density)) setDensity(v.density)
        if (['on', 'off'].includes(v.motion)) setMotion(v.motion)
        if (['ru', 'en'].includes(v.lang)) setLang(v.lang)
        if (['s', 'm', 'l'].includes(v.scale)) setScale(v.scale)
        if (['sharp', 'normal', 'round'].includes(v.round)) setRound(v.round)
        if (['off', 'few', 'normal', 'many'].includes(v.bgIcons)) setBgIcons(v.bgIcons)
      }
    } catch {}
    setSettingsLoaded(true)
  }, [])
  useEffect(() => {
    if (!settingsLoaded) return
    try {
      localStorage.setItem(
        'nw-settings',
        JSON.stringify({ theme, customColor, density, motion, lang, scale, round, bgIcons }),
      )
    } catch {}
  }, [settingsLoaded, theme, customColor, density, motion, lang, scale, round, bgIcons])

  // Избранное: хранится в браузере посетителя
  useEffect(() => {
    try {
      const raw = localStorage.getItem('nw-favs')
      if (raw) {
        const ids = JSON.parse(raw)
        if (Array.isArray(ids)) setFavs(ids.filter((x) => typeof x === 'string'))
      }
    } catch {}
    setFavsLoaded(true)
  }, [])
  useEffect(() => {
    if (!favsLoaded) return
    try {
      localStorage.setItem('nw-favs', JSON.stringify(favs))
    } catch {}
  }, [favs, favsLoaded])
  const toggleFav = (id: string) => {
    setToast(favs.includes(id) ? 'Убрано из избранного' : 'Добавлено в избранное ♥')
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }
  const favBuilds = BUILDS.filter((b) => favs.includes(b.id))

  const downloadAllFavs = () => {
    const links = favBuilds.map((b) => b.download).filter(Boolean) as string[]
    if (links.length === 0) {
      setFavNote('У выбранных сборок пока нет прямых ссылок — открой нужную через «Подробнее».')
      return
    }
    let blocked = 0
    links.forEach((u, i) => {
      setTimeout(() => {
        const w = window.open(u, '_blank', 'noopener,noreferrer')
        if (!w) blocked++
        if (i === links.length - 1) {
          setTimeout(() => {
            setFavNote(
              blocked > 0
                ? 'Браузер заблокировал часть вкладок. Разреши всплывающие окна для сайта или скачай по одной.'
                : '',
            )
          }, 50)
        }
      }, i * 350)
    })
  }


  // Перевод интерфейса (RU/EN)
  useEffect(() => {
    document.documentElement.lang = lang
    const root = rootRef.current
    if (!root) return
    return startTranslator(root, lang)
  }, [lang])

  useEffect(() => {
    setModalTab('about')
    if (!activeBuild) setZoomOpen(false)
  }, [activeBuild])

  useEffect(() => {
    if (!settingsOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [settingsOpen])

  // Модалка сборки: закрытие по Esc + блокировка скролла страницы
  useEffect(() => {
    if (!activeBuild) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (zoomOpen) return // пока открыт просмотр на весь экран, им управляет он сам
      if (e.key === 'Escape') setActiveBuild(null)
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setActiveBuild((prev) => {
          if (!prev) return prev
          const i = BUILDS.findIndex((b) => b.id === prev.id)
          const step = e.key === 'ArrowRight' ? 1 : -1
          return BUILDS[(i + step + BUILDS.length) % BUILDS.length]
        })
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [activeBuild, zoomOpen])

  // Открытый экран берём из адреса (#builds и т.п.) и обновляем при переключении
  useEffect(() => {
    const h = window.location.hash.replace('#', '') as View
    if (VIEWS.includes(h)) setView(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    try {
      history.replaceState(null, '', view === 'home' ? window.location.pathname : `#${view}`)
    } catch {}
  }, [view])

  // Появление блоков при скролле — MutationObserver подхватывает и элементы,
  // которые появляются позже (например, карточки после смены фильтра),
  // а не только те, что были на странице при первой загрузке.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    function observeAll(root: ParentNode) {
      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-in)').forEach((el) => io.observe(el))
    }
    observeAll(document)

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches('[data-reveal]')) io.observe(node)
          observeAll(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  const scrollTo = (target: string) => {
    if ((VIEWS as string[]).includes(target)) setView(target as View)
  }

  const ytId = youtubeId(INSTALL_VIDEO)

  const renderBuildCard = (b: Build, i: number) => (
                    <div
                      className="acard reveal-pop"
                      data-reveal
                      style={{ '--d': `${(i % 4) * 60}ms` } as React.CSSProperties}
                      key={b.id}
                      onClick={() => setActiveBuild(b)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setActiveBuild(b)
                        }
                      }}
                    >
                      <div className="acard-shot">
                        {b.screenshot ? (
                          <>
                            <img src={b.screenshot} alt="" aria-hidden="true" className="acard-bg" loading="lazy" />
                            <img
                              src={b.screenshot}
                              alt={b.title}
                              className="acard-fg"
                              loading="lazy"
                              ref={(el) => {
                                if (el?.complete) el.classList.add('loaded')
                              }}
                              onLoad={(e) => e.currentTarget.classList.add('loaded')}
                            />
                          </>
                        ) : (
                          <div className="acard-fallback" style={{ background: b.sky }} />
                        )}
                        <span className={`acard-chip${b.price === null ? ' free' : ''}`}>
                          {b.price === null ? 'Бесплатно' : `${b.price} ₽`}
                        </span>
                        <button
                          type="button"
                          className={`acard-heart${favs.includes(b.id) ? ' on' : ''}`}
                          aria-label={favs.includes(b.id) ? 'Убрать из избранного' : 'В избранное'}
                          aria-pressed={favs.includes(b.id)}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFav(b.id)
                          }}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <svg viewBox="0 0 24 24" fill={favs.includes(b.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </button>
                      </div>
                      <div className="acard-body">
                        <h3 className="acard-title">{b.title}</h3>
                        <div className="acard-tags">
                          {b.tags.slice(0, 2).map((t) => (
                            <i key={t}>{t}</i>
                          ))}
                        </div>
                        <div className="acard-row">
                          <span className="acard-dl" title="Скачиваний">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 3v12" />
                              <path d="m7 10 5 5 5-5" />
                              <path d="M5 21h14" />
                            </svg>
                            {b.downloads}
                          </span>
                          <span className="acard-more">Подробнее</span>
                        </div>
                      </div>
                    </div>
  )

  return (
    <div
      className="site"
      ref={rootRef}
      data-theme={theme}
      data-density={density}
      data-motion={motion}
      data-scale={scale}
      data-round={round}
      style={theme === 'custom' ? customThemeVars(customColor) : undefined}
    >
      <div className="bg-scene" aria-hidden="true">
        <FlyBg
          enabled={motion === 'on' && bgIcons !== 'off'}
          theme={theme + (theme === 'custom' ? customColor : '')}
          amount={bgIcons}
        />
      </div>

      {/* НАВИГАЦИЯ */}
      <header className="nav" ref={navRef}>
        <div className="nav-inner">
          <button
            className="logo"
            onClick={() => scrollTo('home')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <span className="logo-badge" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="navLogoGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--acc-1)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--acc-2)' }} />
                  </linearGradient>
                </defs>
                <path
                  d="M10,0 H48 L64,16 V54 A10,10 0 0 1 54,64 H10 A10,10 0 0 1 0,54 V10 A10,10 0 0 1 10,0 Z"
                  fill="url(#navLogoGrad)"
                />
                <path d="M17 47V17h6.2l17.6 21.6V17h6.2v30h-6.2L23.2 25.4V47H17Z" fill="#130808" />
                <circle cx="57" cy="9" r="3.6" fill="url(#navLogoGrad)" />
              </svg>
            </span>
            <span className="highlight">NELACOSTE</span>
            <span className="sub">WORK</span>
          </button>
          <div className="tabs">
            <button className={`tab-btn${view === 'home' ? ' active' : ''}`} data-target="home" onClick={() => scrollTo('home')}>
              Главная
            </button>
            <button className={`tab-btn${view === 'builds' ? ' active' : ''}`} data-target="builds" onClick={() => scrollTo('builds')}>
              Сборки
            </button>
            <button className={`tab-btn${view === 'favs' ? ' active' : ''}`} data-target="favs" onClick={() => scrollTo('favs')}>
              ♥ Избранное{favs.length > 0 && <span className="tab-count">{favs.length}</span>}
            </button>
            <button className={`tab-btn${view === 'hud' ? ' active' : ''}`} data-target="hud" onClick={() => scrollTo('hud')}>
              HUDLoader
            </button>
            <button className={`tab-btn${view === 'prices' ? ' active' : ''}`} data-target="prices" onClick={() => scrollTo('prices')}>
              Цены
            </button>
            <button className={`tab-btn${view === 'install' ? ' active' : ''}`} data-target="install" onClick={() => scrollTo('install')}>
              Установка
            </button>
            <button className={`tab-btn${view === 'portfolio' ? ' active' : ''}`} data-target="portfolio" onClick={() => scrollTo('portfolio')}>
              Портфолио
            </button>
            <button className={`tab-btn${view === 'reviews' ? ' active' : ''}`} data-target="reviews" onClick={() => scrollTo('reviews')}>
              Отзывы
            </button>
          </div>

          <div className="nav-right">
            <div className="corner-pill" role="group" aria-label="Контакты и настройки">
              <a className="cp-btn" href={EMAIL} title="Почта" aria-label="Почта">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
              <a className="cp-btn" href={DISCORD} target="_blank" rel="noopener noreferrer" title="Discord" aria-label="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.5 5.3A16 16 0 0 0 15.6 4l-.5 1a14 14 0 0 0-4.2 0l-.5-1a16 16 0 0 0-3.9 1.3C4 9 3.3 12.6 3.6 16.1a16 16 0 0 0 4.8 2.4l1-1.6c-.6-.2-1.1-.5-1.6-.8l.4-.3a11 11 0 0 0 9.6 0l.4.3c-.5.3-1 .6-1.6.8l1 1.6a16 16 0 0 0 4.8-2.4c.4-4-.7-7.5-2.9-10.8ZM9.5 14c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6Zm5 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6Z" />
                </svg>
              </a>
              <a className="cp-btn" href={VK} target="_blank" rel="noopener noreferrer" title="VK" aria-label="VK">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.8 17.2c-5.6 0-8.8-3.8-8.9-10.200h2.800c.1 4.700 2.200 6.700 3.800 7.100V7h2.600v4.100c1.600-.2 3.300-2 3.800-4.100h2.600c-.4 2.500-2.200 4.300-3.500 5.100 1.300.6 3.300 2.200 4.100 5.100h-2.900c-.6-1.900-2.100-3.300-4.100-3.500v3.500h-.3z" />
                </svg>
              </a>
              <span className="cp-sep" aria-hidden="true" />
              <button className="cp-btn" onClick={() => setSettingsOpen(true)} title="Настройки" aria-label="Настройки">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
                </svg>
              </button>
            </div>
            <a className="nav-cta primary with-ico" href={TG} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.5 3.5 2.8 10.7c-.9.4-.9 1.1-.2 1.3l4.7 1.5 1.8 5.6c.2.6.4.7.9.4l2.6-2.2 4.8 3.5c.9.5 1.5.2 1.8-.9l3.2-15.1c.3-1.3-.5-1.8-1.4-1.3Zm-3.9 4.4-8.7 7.9-.3 3.6-1.5-4.9L17 7.5c.5-.3.9-.1.6.4Z" />
              </svg>
              Написать
            </a>
          </div>
        </div>
      </header>

      <main className="site-main">
        <div className="wrap">
          {/* ===== ГЛАВНАЯ ===== */}
          {view === 'home' && (
          <section id="home" className="section-block">
            {/* Hero — редизайн */}
            <div className="hero-v2" data-reveal>
              <div className="hero-shine" aria-hidden="true" />
              <div className="hero-badges">
                <span className="hero-tag">
                  <span className="ping" />
                  nelacoste work · CRMP / SA:MP
                </span>
                <span className="hero-tag alt">RADMIR RP / HASSLE RP</span>
              </div>
              <h1 className="hero-title">
                МАСТЕРСКАЯ <span className="grad">{"HUD'ов"}</span>
                <br />
                И СБОРОК ДЛЯ <span className="underline-accent">CRMP</span>
              </h1>
              <p className="hero-sub">
                {
                  'Делаю HUD\u2019ы и сборки для CRMP. RADMIR-HUDLoader снимает лимиты на создание HUD\u2019ов, а «Сборки» — уже готовые конфиги: поставил и играешь.'
                }
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => scrollTo('builds')}>
                  Смотреть сборки
                </button>
                <button className="btn btn-ghost" onClick={() => scrollTo('hud')}>
                  О HUDLoader
                </button>
                <a
                  className="btn btn-icon"
                  href={TG}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Написать в Telegram"
                >
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 19, height: 19 }}>
                    <path
                      d="M21 4L2.5 11.3c-1 .4-1 1.9.1 2.2l4.4 1.4 1.7 5.3c.3.9 1.4 1.1 2.1.4l2.5-2.4 4.6 3.4c.9.6 2.1.1 2.3-.9L22.9 5c.3-1.1-.8-1.9-1.9-1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
              <div className="hero-ticker" aria-hidden="true">
                <div className="ticker-track">
                  {[
                    "Безлимитные HUD'ы",
                    'Приватные PNG / PSD',
                    'Обучение с нуля',
                    'Поддержка 24/7',
                    'Разовая оплата 1200₽',
                    'Готовые сборки',
                    "Безлимитные HUD'ы",
                    'Приватные PNG / PSD',
                    'Обучение с нуля',
                    'Поддержка 24/7',
                    'Разовая оплата 1200₽',
                    'Готовые сборки',
                  ].map((t, i) => (
                    <span className="tick" key={i}>
                      <span className="tick-dot" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="glass stats-bar" data-reveal>
              <div className="stat">
                <div className="val">100+</div>
                <div className="lbl">{"HUD'ов создано клиентами"}</div>
              </div>
              <div className="stat">
                <div className="val">Качественная работа</div>
                <div className="lbl">Быстро. Качественно. Без лишних сложностей.</div>
              </div>
              <div className="stat">
                <div className="val">{'<1 дня'}</div>
                <div className="lbl">средний ответ в Telegram</div>
              </div>
              <div className="stat">
                <div className="val">24/7</div>
                <div className="lbl">поддержка на связи</div>
              </div>
            </div>

            {/* Навигация по разделам */}
            <div className="section-head" data-reveal>
              <div className="eyebrow">навигация</div>
              <h2>Куда дальше</h2>
              <div className="desc">
                Три раздела на выбор — готовые сборки, сам лоадер или что о нём говорят те, кто уже купил.
              </div>
            </div>
            <div className="link-cards">
              <button className="glass link-card reveal-pop" data-reveal style={{ '--d': '0ms' } as React.CSSProperties} onClick={() => scrollTo('builds')}>
                <div className="kicker">готовые решения</div>
                <h3>Сборки</h3>
                <p>
                  Скриншот, короткое описание и ссылка на скачивание. Ставишь и играешь, без лишней возни с настройкой.
                </p>
                <div className="go">Открыть каталог →</div>
              </button>
              <button className="glass link-card reveal-pop" data-reveal style={{ '--d': '80ms' } as React.CSSProperties} onClick={() => scrollTo('hud')}>
                <div className="kicker">продукт</div>
                <h3>RADMIR-HUDLoader</h3>
                <p>
                  {
                    'Снимает лимиты на создание HUD\u2019ов и даёт полный доступ к радару, интерфейсу и шрифтам — меняй как хочешь.'
                  }
                </p>
                <div className="go">Открыть страницу →</div>
              </button>
              <button className="glass link-card reveal-pop" data-reveal style={{ '--d': '160ms' } as React.CSSProperties} onClick={() => scrollTo('reviews')}>
                <div className="kicker">от клиентов</div>
                <h3>Отзывы</h3>
                <p>Что пишут те, кто уже пользуется лоадером или ставил сборку — без прикрас.</p>
                <div className="go">Читать отзывы →</div>
              </button>
            </div>

          </section>
          )}

          {view === 'prices' && (
          <section id="prices" className="section-block prices-view">
            <div className="subtabs" data-reveal>
              {(
                [
                  ['how', 'Как купить'],
                  ['price', 'Стоимость'],
                  ['why', 'Почему мы'],
                ] as const
              ).map(([k, label]) => (
                <button key={k} className={`subtab${infoTab === k ? ' on' : ''}`} onClick={() => setInfoTab(k)}>
                  {label}
                </button>
              ))}
            </div>
            {infoTab === 'how' && (
              <>
            {/* Как купить */}
            <div className="section-head" data-reveal>
              <div className="eyebrow">инструкция</div>
              <h2>Как купить</h2>
              <div className="desc">Сборка на заказ, готовая сборка из каталога, сам HUDLoader или приват-канал со всеми платными сборками сразу.</div>
            </div>
            <div className="steps">
              {[
                {
                  n: 1,
                  h: 'Сборка на заказ',
                  p: 'Пиши в Telegram, опиши стиль и цвета, которые нравятся — соберу под тебя.',
                },
                {
                  n: 2,
                  h: 'Готовая сборка',
                  p: 'Выбираешь в каталоге, оплачиваешь — получаешь ссылку на скачивание и всё, что нужно для установки.',
                },
                {
                  n: 3,
                  h: 'RADMIR-HUDLoader',
                  p: 'Разовая оплата 1200₽ — выдаю лоадер, приватные PNG/PSD, обучаю с нуля и остаюсь на связи.',
                },
                {
                  n: 4,
                  h: 'Приват-канал',
                  p: 'Доступ ко всем платным сборкам сразу, плюс новые HUD\u2019ы по мере выхода.',
                },
              ].map((s, i) => (
                <div className="glass step reveal-left" data-reveal style={{ '--d': `${i * 80}ms` } as React.CSSProperties} key={s.n}>
                  <div className="sn">{s.n}</div>
                  <h4>{s.h}</h4>
                  <p>{s.p}</p>
                  <a className="step-cta" href={TG} target="_blank" rel="noopener noreferrer">
                    Написать →
                  </a>
                </div>
              ))}
            </div>

              </>
            )}
            {infoTab === 'price' && (
              <>
            {/* Прайс */}
            <div className="section-head" data-reveal>
              <div className="eyebrow">прайс</div>
              <h2>Стоимость услуг</h2>
              <div className="desc">Вот расценки. По сборке на заказ финальная цена зависит от того, что именно нужно.</div>
            </div>
            <div className="price-grid">
              {[
                { name: 'Сборка на заказ', val: '250–400 ₽', note: 'индивидуально под твой стиль' },
                { name: "Сборка SAMP HUD's", val: '300–450 ₽', note: 'готовый конфиг' },
                { name: 'HUD на заказ', val: '150 ₽', note: 'один HUD под задачу' },
                { name: 'Фикс PNG', val: '100 ₽', note: 'починка после обновления' },
                { name: 'RADMIR-HUDLoader', val: '1 200 ₽', note: 'разовая оплата · без подписки', featured: true },
                { name: 'Приват-канал', val: 'по запросу', note: 'все платные сборки сразу' },
              ].map((p, i) => (
                <a
                  className={`glass price-item reveal-pop${p.featured ? ' featured' : ''}`}
                  data-reveal
                  style={{ '--d': `${(i % 3) * 70}ms` } as React.CSSProperties}
                  key={p.name}
                  href={TG}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.featured && <span className="price-flag">популярно</span>}
                  <div className="pi-name">{p.name}</div>
                  <div className="pi-val">{p.val}</div>
                  <div className="pi-note">{p.note}</div>
                </a>
              ))}
            </div>
            <div className="price-foot glass" data-reveal>
              Принимаем оплату в Рублях / звёздах. Итоговая цена уточняется индивидуально.
            </div>
              </>
            )}
            {infoTab === 'why' && (
              <>
            {/* Особенности */}
            <div className="section-head" data-reveal>
              <div className="eyebrow">преимущества</div>
              <h2>Почему выбирают нас</h2>
              <div className="desc">Коротко о том, чем я реально могу помочь — без воды.</div>
            </div>
            <div className="feature-strip">
              {[
                { n: '01', h: "Без лимитов", p: 'Делай сколько угодно HUD\u2019ов — хоть под разные сервера, ограничений нет.' },
                { n: '02', h: 'Свои исходники', p: 'Отдаю приватные PNG и PSD — редактируешь как хочешь, без привязки ко мне.' },
                { n: '03', h: 'На связи почти всегда', p: 'В Telegram обычно отвечаю в течение часа, вопросы по установке — не проблема.' },
                { n: '04', h: 'Обучение с нуля', p: 'Покажу весь процесс от установки до готового HUD\u2019а, даже если раньше не работал с редакторами.' },
                { n: '05', h: 'Слежу за обновлениями', p: 'Если после патча клиента лоадер ломается — чиню и выкладываю фикс.' },
                { n: '06', h: 'Честная цена', p: '1200₽ один раз — без подписок и доплат за "дополнительные" функции.' },
              ].map((f, i) => (
                <div className="glass feature reveal-pop" data-reveal style={{ '--d': `${(i % 3) * 80}ms` } as React.CSSProperties} key={f.n}>
                  <div className="num">{f.n}</div>
                  <h4>{f.h}</h4>
                  <p>{f.p}</p>
                </div>
              ))}
            </div>

              </>
            )}
          </section>
          )}

          {/* ===== СБОРКИ ===== */}
          {view === 'builds' && (
          <section id="builds" className="section-block">
            <div className="glass builds-head" data-reveal>
              <div className="hero-tag">
                <span className="ping" />каталог
              </div>
              <h1 style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
                <span className="underline-accent">СБОРКИ</span>
              </h1>
              <p className="lead" style={{ marginBottom: 20, fontSize: 17, color: 'var(--muted)' }}>
                Готовые HUD-сборки на базе RADMIR-HUDLoader: скриншот, описание и ссылка на скачивание. Нажми «Подробнее», чтобы увидеть всё.
              </p>
              <div className="builds-toolbar">
                <div className="builds-filter">
                  {(
                    [
                      ['all', 'Все'],
                      ['free', 'Бесплатные'],
                      ['paid', 'Платные'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      className={`builds-filter-btn${buildFilter === key ? ' active' : ''}`}
                      onClick={() => setBuildFilter(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="cat-search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Поиск сборки…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  className="cat-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  aria-label="Сортировка"
                >
                  <option value="default">Как в каталоге</option>
                  <option value="popular">Сначала популярные</option>
                  <option value="cheap">Сначала дешёвые</option>
                  <option value="name">По названию</option>
                </select>
              </div>
            </div>
            {(() => {
              let filtered = BUILDS

              if (buildFilter === 'free') filtered = filtered.filter((b) => b.price === null)
              if (buildFilter === 'paid') filtered = filtered.filter((b) => b.price !== null)
              const q = query.trim().toLowerCase()
              if (q) {
                filtered = filtered.filter((b) =>
                  `${b.title} ${b.name} ${b.tags.join(' ')}`.toLowerCase().includes(q),
                )
              }
              if (sort === 'popular') filtered = [...filtered].sort((x, y) => y.downloads - x.downloads)
              if (sort === 'cheap') filtered = [...filtered].sort((x, y) => (x.price ?? 0) - (y.price ?? 0))
              if (sort === 'name') filtered = [...filtered].sort((x, y) => x.title.localeCompare(y.title, 'ru'))
              if (filtered.length === 0) {
                return (
                  <div className="glass builds-empty" data-reveal>
                    Ничего не найдено.
                  </div>
                )
              }
              return (
                <div className="builds-grid">
                  {filtered.map((b, i) => renderBuildCard(b, i))}
                </div>
              )
            })()}
          </section>
          )}

          {/* ===== HUDLOADER ===== */}
          {view === 'favs' && (
            <section id="favs" className="section-block">
              <div className="glass builds-head" data-reveal>
                <div className="hero-tag">
                  <span className="ping" />избранное
                </div>
                <h1 style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
                  <span className="underline-accent">МОИ СБОРКИ</span>
                </h1>
                <p className="lead" style={{ marginBottom: 20, fontSize: 17, color: 'var(--muted)' }}>
                  Отмечай сердечком сборки в каталоге, и они соберутся здесь. Список хранится в твоём браузере.
                </p>
                {favBuilds.length > 0 && (
                  <div className="fav-actions">
                    <button className="btn btn-primary" onClick={downloadAllFavs}>
                      Скачать все ({favBuilds.length})
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setFavs([])
                        setFavNote('')
                      }}
                    >
                      Очистить
                    </button>
                  </div>
                )}
                {favNote && <div className="fav-note">{favNote}</div>}
              </div>
              {favBuilds.length > 0 ? (
                <div className="builds-grid">{favBuilds.map((b, i) => renderBuildCard(b, i))}</div>
              ) : (
                <div className="glass fav-empty" data-reveal>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <h3>Пока пусто</h3>
                  <p>Нажми сердечко на карточке сборки, и она появится здесь.</p>
                  <button className="btn btn-primary" onClick={() => setView('builds')}>
                    Открыть каталог
                  </button>
                </div>
              )}
            </section>
          )}

          {view === 'install' && (
            <section id="install" className="section-block">
              <div className="section-head" data-reveal>
                <div className="eyebrow">инструкция</div>
                <h2>Как установить</h2>
                <div className="desc">Несколько шагов, и сборка в игре. Если проще смотреть, рядом видео-туториал.</div>
              </div>
              <div className="ins-grid">
                <ol className="ins-steps">
                  {INSTALL_STEPS.map((st, i) => {
                    const last = i === INSTALL_STEPS.length - 1
                    return (
                      <li
                        key={st.title}
                        className="glass ins-step reveal-left"
                        data-reveal
                        style={{ '--d': `${i * 70}ms` } as React.CSSProperties}
                      >
                        <div className="ins-n">{last ? '?' : i + 1}</div>
                        <div className="ins-body">
                          <h4>{st.title}</h4>
                          <p>{st.text}</p>
                          {st.img && <img className="ins-img" src={st.img} alt={st.title} loading="lazy" />}
                          {last && (
                            <a className="step-cta" href={TG} target="_blank" rel="noopener noreferrer">
                              Написать в Telegram →
                            </a>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
                <div className="glass ins-video" data-reveal>
                  {ytId ? (
                    videoOn ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                        title="Видео-туториал"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button className="ins-poster" onClick={() => setVideoOn(true)} aria-label="Смотреть туториал">
                        <img src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`} alt="" />
                        <span className="ins-play">▶</span>
                        <span className="ins-cap">Смотреть туториал на YouTube</span>
                      </button>
                    )
                  ) : (
                    <div className="ins-soon">
                      <span className="ins-play">▶</span>
                      <h3>Видео-туториал скоро</h3>
                      <p>Пока смотри шаги слева. Что-то непонятно, напиши, подскажу.</p>
                      <a className="btn btn-primary" href={TG} target="_blank" rel="noopener noreferrer">
                        Написать в Telegram
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {view === 'hud' && (
          <section id="hud" className="section-block">
            <div className="glass product-head" data-reveal>
              <div className="hero-tag">
                <span className="ping" />в продаже
              </div>
              <h1 style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
                RADMIR-<span className="underline-accent">HUDLOADER</span>
              </h1>
              <p className="lead" style={{ marginBottom: 12, fontSize: 17, color: 'var(--muted)' }}>
                {'Создавай HUD\u2019ы без ограничений — свой радар, свой интерфейс, свой стиль.'}
              </p>
            </div>
            <div className="product-grid">
              <div className="glass product-copy" data-reveal>
                <p className="lede">
                  {
                    'RADMIR-HUDLoader снимает лимит на количество HUD\u2019ов и открывает полный доступ к кастомизации. Радар, шрифты, расположение элементов — всё меняется под твой стиль, а не только то, что разрешил оригинальный клиент.'
                  }
                </p>
                <details className="acc">
                  <summary>Сравнение: с лоадером и без</summary>
                <div className="compare">
                  <div className="compare-col reveal-left" data-reveal>
                    <div className="compare-h">Без лоадера</div>
                    <ul>
                      <li>{'Один HUD «как у всех», без своих правок'}</li>
                      <li>Радар и интерфейс — фиксированные</li>
                      <li>Разбираешься в редакторе сам, без обучения</li>
                    </ul>
                  </div>
                  <div className="compare-col acc reveal-right" data-reveal style={{ '--d': '100ms' } as React.CSSProperties}>
                    <div className="compare-h">С RADMIR-HUDLoader</div>
                    <ul>
                      <li>{"Сколько угодно своих HUD'ов без лимита"}</li>
                      <li>Радар, иконки, шрифты — под твой стиль</li>
                      <li>Обучение с нуля и поддержка 24/7</li>
                    </ul>
                  </div>
                </div>
                </details>
                <details className="acc">
                  <summary>Возможности лоадера</summary>
                <div className="why-grid">
                  <div className="why-item" data-reveal>
                    <h4>
                      <span className="ico" />Безлимитное создание
                    </h4>
                    <p>{"Создавай сколько угодно уникальных HUD'ов — без ограничений по количеству проектов."}</p>
                  </div>
                  <div className="why-item" data-reveal style={{ '--d': '80ms' } as React.CSSProperties}>
                    <h4>
                      <span className="ico" />Полная кастомизация
                    </h4>
                    <p>Меняй радар, HUD и любые элементы интерфейса под свой стиль.</p>
                  </div>
                  <div className="why-item" data-reveal style={{ '--d': '160ms' } as React.CSSProperties}>
                    <h4>
                      <span className="ico" />Удобная разработка
                    </h4>
                    <p>Быстрое редактирование и лёгкое освоение — не нужно быть дизайнером.</p>
                  </div>
                  <div className="why-item" data-reveal style={{ '--d': '240ms' } as React.CSSProperties}>
                    <h4>
                      <span className="ico" />Обучение и поддержка
                    </h4>
                    <p>Полное обучение работе с лоадером плюс поддержка на связи 24/7.</p>
                  </div>
                </div>
                </details>
                <details className="acc" open>
                  <summary>Что входит в покупку</summary>
                <div className="includes">
                  <h4>Что входит</h4>
                  <ul>
                    {[
                      'RADMIR HUDLoader',
                      "Безлимитное создание HUD'ов",
                      'Приватные PNG',
                      'PSD-исходники',
                      'Полное обучение',
                      'Поддержка 24/7',
                    ].map((item) => (
                      <li key={item}>
                        <span className="check">
                          <svg viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="#fff"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                </details>
              </div>
              <div className="glass price-card" data-reveal>
                <div className="plabel">стоимость</div>
                <div className="pname">RADMIR-HUDLoader — полный доступ</div>
                <div className="amount">
                  1200<span className="cur">₽</span>
                </div>
                <div className="pnote">разовая оплата · без подписки</div>
                <a className="btn btn-primary" href={TG} target="_blank" rel="noopener noreferrer">
                  Купить сейчас
                </a>
                <a className="tg" href={TG} target="_blank" rel="noopener noreferrer">
                  или написать перед покупкой →
                </a>
                <hr />
                <ul className="mini-list">
                  <li>Ответ в Telegram обычно в течение часа</li>
                  <li>Помогаем с установкой и первым запуском</li>
                  <li>Доступ выдаётся после оплаты</li>
                </ul>
              </div>
            </div>
          </section>
          )}

          {/* ===== ПОРТФОЛИО ===== */}
          {view === 'portfolio' && (
          <section id="portfolio" className="section-block">
            <div className="glass builds-head" data-reveal>
              <div className="hero-tag">
                <span className="ping" />галерея
              </div>
              <h1 style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
                <span className="underline-accent">ПОРТФОЛИО</span>
              </h1>
              <p className="lead" style={{ marginBottom: 0, fontSize: 17, color: 'var(--muted)' }}>
                Скриншоты наших сборок и HUD&rsquo;ов — то, что реально стоит в игре у клиентов.
              </p>
            </div>

            <div className="portfolio-marquee" data-reveal>
              <div className="portfolio-track">
                {[...PORTFOLIO, ...PORTFOLIO].map((p, i) => (
                  <div className="portfolio-item" key={`${p.caption}-${i}`}>
                    {p.src ? (
                      <img src={p.src} alt={p.caption} />
                    ) : (
                      <div className="portfolio-fallback" style={{ background: p.fallback }}>
                        <span>{p.caption}</span>
                      </div>
                    )}
                    <div className="portfolio-caption">{p.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          )}

          {/* ===== ОТЗЫВЫ ===== */}
          {view === 'reviews' && (
          <section id="reviews" className="section-block">
            <div className="glass builds-head" data-reveal>
              <div className="hero-tag">
                <span className="ping" />от клиентов
              </div>
              <h1 style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
                <span className="underline-accent">ОТЗЫВЫ</span>
              </h1>
              <p className="lead" style={{ marginBottom: 8, fontSize: 17, color: 'var(--muted)' }}>
                Что говорят те, кто уже пользуется HUDLoader и ставил наши сборки.
              </p>
            </div>
            <div className="quotes" style={{ marginTop: 28 }}>
              {reviews.map((q, i) => (
                <div className="glass quote reveal-pop" data-reveal style={{ '--d': `${(i % 3) * 80}ms` } as React.CSSProperties} key={`${q.name}-${i}`}>
                  <div className="stars" aria-label={`${q.stars} из 5`}>
                    {'★'.repeat(q.stars)}
                    <span className="off">{'★'.repeat(5 - q.stars)}</span>
                  </div>
                  <p>{q.text}</p>
                  <div className="who">
                    <div className="avatar">
                      {q.avatar ? <img src={q.avatar} alt="" loading="lazy" /> : <span>{q.name.trim().charAt(0).toUpperCase()}</span>}
                    </div>
                    <div>
                      <div className="who-name">{q.name}</div>
                      <div className="who-role">{q.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          )}


          {view === 'home' && (
          <>
          {/* ===== DISCORD (перенесён вниз) ===== */}
          <section className="section-block">
            <div className="section-head" data-reveal>
              <div className="eyebrow">сообщество</div>
              <h2>Наш Discord</h2>
              <div className="desc">
                Заходи, если хочешь быть в курсе новостей и пообщаться с другими игроками.
              </div>
            </div>
            <div className="glass discord-card" data-reveal>
              <div className="discord-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.9 6.3c-1.2-.6-2.5-1-3.9-1.2l-.2.4c1.2.3 2.3.7 3.3 1.3-2.9-1.4-6.4-1.4-9.3 0 1-.6 2.1-1 3.3-1.3l-.2-.4c-1.4.2-2.7.6-3.9 1.2C5.9 9.9 5.2 13.4 5.5 16.9c1.5 1.1 3 1.8 4.4 2.2l.6-1c-.8-.3-1.6-.7-2.3-1.2.2.1.4.3.6.4 2.9 1.4 6.4 1.4 9.3 0 .2-.1.4-.2.6-.4-.7.5-1.5.9-2.3 1.2l.6 1c1.4-.4 2.9-1.1 4.4-2.2.4-4-.6-7.5-2.5-10.6ZM9.7 14.8c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.1 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3>RADMIR RP | Сборки • Плагины • Пиар</h3>
                <p>
                  Ищешь топовые сборки и графику для Радмира, хочешь пропиарить свой мувик или просто пообщаться? Тебе
                  сюда.
                </p>
              </div>
              <a className="btn btn-primary" href={DISCORD} target="_blank" rel="noopener noreferrer">
                Зайти в Discord
              </a>
            </div>
          </section>

          {/* ===== СОЦСЕТИ (над контактной информацией) ===== */}
          <section className="section-block social-section">
            <div className="section-head" data-reveal>
              <div className="eyebrow">мы на связи</div>
              <h2>Соцсети и каналы</h2>
              <div className="desc">Подписывайся, чтобы не пропустить новости и обновления.</div>
            </div>
            <div className="social-links">
              {[
                { label: 'Discord', name: 'RADMIR RP', href: DISCORD },
                { label: 'TG', name: 'nelacostework', href: 'https://t.me/nelacostework' },
                { label: 'TG', name: 'externalwrkshp', href: 'https://t.me/externalwrkshp' },
                { label: 'VK', name: 'nelacostework', href: VK },
              ].map((s, i) => (
                <a
                  className="glass social-chip"
                  data-reveal
                  style={{ '--d': `${i * 60}ms` } as React.CSSProperties}
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sc-label">{s.label}</span> {s.name}
                </a>
              ))}
            </div>
          </section>
          </>
          )}
        </div>

        {/* ===== ФУТЕР ===== */}
        <footer className="site-footer">
          <div className="footer-brand">
            <span className="highlight">NELACOSTE</span> WORK
          </div>

          <div className="footer-copy">
            © NELACOSTE WORK — создание игровых сборов RADMIR RP / HASSLE RP.
            <br />
            NELACOSTE WORK не связана с RADMIR, коммерческая деятельность компании соответствует политике RADMIR RP.
          </div>

          <div className="footer-divider" />

          <div className="footer-contact">
            <a className="footer-contact-item" href={TG} target="_blank" rel="noopener noreferrer">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 4L2.5 11.3c-1 .4-1 1.9.1 2.2l4.4 1.4 1.7 5.3c.3.9 1.4 1.1 2.1.4l2.5-2.4 4.6 3.4c.9.6 2.1.1 2.3-.9L22.9 5c.3-1.1-.8-1.9-1.9-1z" />
              </svg>
              t.me/nelacostework
            </a>
            <a className="footer-contact-item" href={EMAIL}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              nelacostework@gmail.com
            </a>
            <a className="footer-contact-item" href={VK} target="_blank" rel="noopener noreferrer">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                <path d="M12.8 17.2c-5.6 0-8.8-3.8-8.9-10.200h2.800c.1 4.700 2.200 6.700 3.800 7.100V7h2.600v4.100c1.600-.2 3.300-2 3.800-4.100h2.600c-.4 2.500-2.200 4.300-3.500 5.100 1.300.6 3.300 2.200 4.100 5.100h-2.900c-.6-1.900-2.100-3.300-4.100-3.500v3.500h-.3z" />
              </svg>
              vk.ru/nelacostework
            </a>
            <a className="footer-contact-item" href={DISCORD} target="_blank" rel="noopener noreferrer">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18.9 6.3c-1.2-.6-2.5-1-3.9-1.2l-.2.4c1.2.3 2.3.7 3.3 1.3-2.9-1.4-6.4-1.4-9.3 0 1-.6 2.1-1 3.3-1.3l-.2-.4c-1.4.2-2.7.6-3.9 1.2C5.9 9.9 5.2 13.4 5.5 16.9c1.5 1.1 3 1.8 4.4 2.2l.6-1c-.8-.3-1.6-.7-2.3-1.2.2.1.4.3.6.4 2.9 1.4 6.4 1.4 9.3 0 .2-.1.4-.2.6-.4-.7.5-1.5.9-2.3 1.2l.6 1c1.4-.4 2.9-1.1 4.4-2.2.4-4-.6-7.5-2.5-10.6z" />
              </svg>
              Discord
            </a>
          </div>

          <div className="footer-divider" />

          <div className="footer-note">По всем вопросам обращаться в Telegram или на почту.</div>
        </footer>
      </main>

      {settingsOpen && (
        <div className="st-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="st-card" role="dialog" aria-modal="true" aria-label="Настройки сайта" onClick={(e) => e.stopPropagation()}>
            <button className="bm-close" onClick={() => setSettingsOpen(false)} aria-label="Закрыть">
              ×
            </button>
            <h2 className="st-title">Настройки</h2>
            <p className="st-sub">Подстрой сайт под себя. Выбор запоминается.</p>

            <div className="st-section">
              <div className="st-label">Язык</div>
              <div className="sm-seg">
                <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>
                  Русский
                </button>
                <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
                  English
                </button>
              </div>
            </div>

            <div className="st-section">
              <div className="st-label">Цвет сайта</div>
              <div className="st-colors">
                {(
                  [
                    ['red', 'Красный', '#d0313a'],
                    ['violet', 'Фиолет', '#7c4dff'],
                    ['blue', 'Синий', '#2f6bff'],
                    ['green', 'Зелёный', '#22b559'],
                    ['orange', 'Оранж', '#f97316'],
                    ['pink', 'Розовый', '#ec4899'],
                    ['cyan', 'Голубой', '#06b6d4'],
                    ['gold', 'Золото', '#eab308'],
                  ] as const
                ).map(([key, name, color]) => (
                  <button key={key} className={`st-color${theme === key ? ' on' : ''}`} onClick={() => setTheme(key)}>
                    <span className="st-dot" style={{ background: color }} />
                    {name}
                  </button>
                ))}
                <label className={`st-color st-custom${theme === 'custom' ? ' on' : ''}`}>
                  <span className="st-dot st-rainbow" style={theme === 'custom' ? { background: customColor } : undefined} />
                  Свой
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(normalizeHex(e.target.value))
                      setTheme('custom')
                    }}
                    aria-label="Свой цвет"
                  />
                </label>
              </div>
              {theme === 'custom' && (
                <div className="st-hex">
                  <span className="st-dot" style={{ background: customColor }} />
                  <input
                    type="text"
                    value={hexDraft}
                    maxLength={7}
                    spellCheck={false}
                    onChange={(e) => {
                      setHexDraft(e.target.value)
                      if (/^#?[0-9a-fA-F]{6}$/.test(e.target.value.trim())) setCustomColor(normalizeHex(e.target.value))
                    }}
                    aria-label="HEX цвет"
                  />
                </div>
              )}
            </div>

            <div className="st-section">
              <div className="st-label">Размер карточек сборок</div>
              <div className="sm-seg">
                {(
                  [
                    ['compact', 'Мелко'],
                    ['normal', 'Обычно'],
                    ['large', 'Крупно'],
                  ] as const
                ).map(([key, label]) => (
                  <button key={key} className={density === key ? 'on' : ''} onClick={() => setDensity(key)}>
                    {label}
                  </button>
                ))}
              </div>
              <div
                className="st-preview"
                style={{ gridTemplateColumns: `repeat(${density === 'compact' ? 5 : density === 'large' ? 3 : 4}, 1fr)` }}
              >
                {Array.from({ length: density === 'compact' ? 10 : density === 'large' ? 6 : 8 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
              <div className="st-hint">Так будет выглядеть сетка на вкладке «Сборки».</div>
            </div>

            <div className="st-grid2">
              <div className="st-section">
                <div className="st-label">Масштаб интерфейса</div>
                <div className="sm-seg">
                  {(
                    [
                      ['s', '90%'],
                      ['m', '100%'],
                      ['l', '110%'],
                    ] as const
                  ).map(([key, label]) => (
                    <button key={key} className={scale === key ? 'on' : ''} onClick={() => setScale(key)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="st-section">
                <div className="st-label">Скругление углов</div>
                <div className="sm-seg">
                  {(
                    [
                      ['sharp', 'Острые'],
                      ['normal', 'Обычные'],
                      ['round', 'Круглые'],
                    ] as const
                  ).map(([key, label]) => (
                    <button key={key} className={round === key ? 'on' : ''} onClick={() => setRound(key)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="st-grid2">
              <div className="st-section">
                <div className="st-label">Фоновые значки</div>
                <div className="sm-seg">
                  {(
                    [
                      ['off', 'Выкл'],
                      ['few', 'Мало'],
                      ['normal', 'Норм'],
                      ['many', 'Много'],
                    ] as const
                  ).map(([key, label]) => (
                    <button key={key} className={bgIcons === key ? 'on' : ''} onClick={() => setBgIcons(key)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="st-section">
                <div className="st-label">Анимации</div>
                <div className="sm-seg">
                  <button className={motion === 'on' ? 'on' : ''} onClick={() => setMotion('on')}>
                    Включены
                  </button>
                  <button className={motion === 'off' ? 'on' : ''} onClick={() => setMotion('off')}>
                    Выключены
                  </button>
                </div>
              </div>
            </div>

            <div className="st-actions">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setTheme('red')
                  setCustomColor('#ff5a36')
                  setHexDraft('#ff5a36')
                  setDensity('normal')
                  setMotion('on')
                  setLang('ru')
                  setScale('m')
                  setRound('normal')
                  setBgIcons('normal')
                }}
              >
                Сбросить
              </button>
              <button className="btn btn-primary" onClick={() => setSettingsOpen(false)}>
                Готово
              </button>
            </div>
          </div>
        </div>
      )}

      {activeBuild && (
        <div className="bm-overlay" onClick={() => setActiveBuild(null)}>
          <div className="bm" role="dialog" aria-modal="true" aria-label={activeBuild.title} onClick={(e) => e.stopPropagation()}>
            <button className="bm-close" onClick={() => setActiveBuild(null)} aria-label="Закрыть">
              ×
            </button>

            <div
              className="bm-media zoomable"
              onClick={() => activeBuild.screenshot && setZoomOpen(true)}
              title="Увеличить"
            >
              {activeBuild.screenshot ? (
                <>
                  <img src={activeBuild.screenshot} alt="" aria-hidden="true" className="bm-bg" />
                  <img src={activeBuild.screenshot} alt={activeBuild.title} className="bm-fg" />
                </>
              ) : (
                <div className="bm-fallback" style={{ background: activeBuild.sky }} />
              )}
              {activeBuild.screenshot && <span className="bm-zoomhint">🔍 Увеличить</span>}
              <button
                className="bm-nav prev"
                aria-label="Предыдущая сборка"
                onClick={(e) => {
                  e.stopPropagation()
                  const i = BUILDS.findIndex((b) => b.id === activeBuild.id)
                  setActiveBuild(BUILDS[(i - 1 + BUILDS.length) % BUILDS.length])
                }}
              >
                ‹
              </button>
              <button
                className="bm-nav next"
                aria-label="Следующая сборка"
                onClick={(e) => {
                  e.stopPropagation()
                  const i = BUILDS.findIndex((b) => b.id === activeBuild.id)
                  setActiveBuild(BUILDS[(i + 1) % BUILDS.length])
                }}
              >
                ›
              </button>
            </div>

            <div className="bm-info">
              <div className="bm-head">
                <h2>{activeBuild.title}</h2>
                <div className="bm-meta">
                  <span className={`bm-price${activeBuild.price === null ? ' free' : ''}`}>
                    {activeBuild.price === null ? 'Бесплатно' : `${activeBuild.price} ₽`}
                  </span>
                  <span className="bm-dl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    {activeBuild.downloads} скачиваний
                  </span>
                </div>
                <div className="bm-tags">
                  {activeBuild.tags.map((t) => (
                    <i key={t}>{t}</i>
                  ))}
                </div>
              </div>

              <div className="bm-tabs" role="tablist">
                {(
                  [
                    ['about', 'О сборке'],
                    ['features', 'Возможности'],
                    ['similar', 'Похожие'],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={modalTab === k}
                    className={`bm-tab${modalTab === k ? ' on' : ''}`}
                    onClick={() => setModalTab(k)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="bm-pane">
                {modalTab === 'about' && <p className="bm-desc">{activeBuild.desc}</p>}
                {modalTab === 'features' && (
                  <ul className="bm-list">
                    {activeBuild.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
                {modalTab === 'similar' &&
                  (() => {
                    const similar = BUILDS.filter(
                      (b) => b.id !== activeBuild.id && b.tags.some((t) => activeBuild.tags.includes(t)),
                    ).slice(0, 5)
                    if (similar.length === 0) return <p className="bm-desc">Похожих сборок пока нет.</p>
                    return (
                      <div className="bm-similar">
                        {similar.map((x) => (
                          <button key={x.id} className="bms-item" onClick={() => setActiveBuild(x)}>
                            <span className="bms-name">{x.title}</span>
                            <span className={`bms-price${x.price === null ? ' free' : ''}`}>
                              {x.price === null ? 'Бесплатно' : `${x.price} ₽`}
                            </span>
                          </button>
                        ))}
                      </div>
                    )
                  })()}
              </div>

              <div className="bm-actions">
                <a
                  className="btn btn-primary"
                  href={activeBuild.download || TG}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activeBuild.download ? 'Скачать' : 'Скачать (через TG)'}
                </a>
                {activeBuild.review && (
                  <a className="btn btn-outline" href={activeBuild.review} target="_blank" rel="noopener noreferrer">
                    ▶ Обзор
                  </a>
                )}
                <button
                  className={`btn btn-outline bm-fav${favs.includes(activeBuild.id) ? ' on' : ''}`}
                  onClick={() => toggleFav(activeBuild.id)}
                  aria-pressed={favs.includes(activeBuild.id)}
                >
                  {favs.includes(activeBuild.id) ? '♥ В избранном' : '♡ В избранное'}
                </button>
                <a className="btn btn-outline" href={TG} target="_blank" rel="noopener noreferrer">
                  Вопрос
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeBuild && zoomOpen && activeBuild.screenshot && (
        <Lightbox
          items={BUILDS.filter((b) => b.screenshot).map((b) => ({ id: b.id, src: b.screenshot as string, title: b.title }))}
          currentId={activeBuild.id}
          onSelect={(id) => {
            const b = BUILDS.find((x) => x.id === id)
            if (b) setActiveBuild(b)
          }}
          onClose={() => setZoomOpen(false)}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      <button
        className={`to-top${showTop ? ' show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Наверх"
        tabIndex={showTop ? 0 : -1}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 14 6-6 6 6" />
        </svg>
      </button>
    </div>
  )
}
