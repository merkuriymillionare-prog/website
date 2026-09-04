'use client'

import { useEffect, useRef, useState } from 'react'
import { BUILDS, type Build } from './builds-data'
import { PORTFOLIO } from './portfolio-data'

const TG = 'https://t.me/nelacostework?direct'
const DISCORD = 'https://discord.gg/t7fwKMdcu8'
const EMAIL = 'mailto:nelacostework@gmail.com'

export default function Page() {
  const navRef = useRef<HTMLElement>(null)
  const contactsRef = useRef<HTMLDivElement>(null)
  const [contactsOpen, setContactsOpen] = useState(false)
  const [buildFilter, setBuildFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [activeBuild, setActiveBuild] = useState<Build | null>(null)

  // Модалка сборки: закрытие по Esc + блокировка скролла страницы
  useEffect(() => {
    if (!activeBuild) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveBuild(null)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [activeBuild])

  // Активная вкладка при скролле
  useEffect(() => {
    const sections = ['home', 'builds', 'hud', 'portfolio', 'reviews']
    const tabs = document.querySelectorAll<HTMLButtonElement>('.tab-btn')

    function updateActiveTab() {
      const scrollY = window.scrollY + 120
      let activeId = 'home'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) activeId = id
      }
      tabs.forEach((t) => t.classList.toggle('active', t.dataset.target === activeId))
    }

    window.addEventListener('scroll', updateActiveTab)
    updateActiveTab()
    return () => window.removeEventListener('scroll', updateActiveTab)
  }, [])

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

  // Закрытие меню контактов по клику вне
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (contactsRef.current && !contactsRef.current.contains(e.target as Node)) {
        setContactsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const scrollTo = (target: string) => {
    const el = document.getElementById(target)
    if (!el) return
    const offset = navRef.current ? navRef.current.offsetHeight + 10 : 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="site">
      <div className="bg-scene" aria-hidden="true">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="orb o4" />
        <div className="particles">
          <span style={{ top: '12%', left: '8%', animationDelay: '0s' }} />
          <span style={{ top: '22%', left: '88%', animationDelay: '-1.2s' }} />
          <span style={{ top: '38%', left: '18%', animationDelay: '-2.4s' }} />
          <span style={{ top: '55%', left: '72%', animationDelay: '-3.6s' }} />
          <span style={{ top: '68%', left: '35%', animationDelay: '-4.8s' }} />
          <span style={{ top: '15%', left: '52%', animationDelay: '-2s' }} />
          <span style={{ top: '80%', left: '12%', animationDelay: '-5.6s' }} />
          <span style={{ top: '85%', left: '60%', animationDelay: '-1.8s' }} />
          <span style={{ top: '45%', left: '92%', animationDelay: '-3.2s' }} />
          <span style={{ top: '5%', left: '70%', animationDelay: '-6.4s' }} />
        </div>
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
                    <stop offset="0" stopColor="#c1272d" />
                    <stop offset="1" stopColor="#e0525a" />
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
            <button className="tab-btn active" data-target="home" onClick={() => scrollTo('home')}>
              Главная
            </button>
            <button className="tab-btn" data-target="builds" onClick={() => scrollTo('builds')}>
              Сборки
            </button>
            <button className="tab-btn" data-target="hud" onClick={() => scrollTo('hud')}>
              HUDLoader
            </button>
            <button className="tab-btn" data-target="portfolio" onClick={() => scrollTo('portfolio')}>
              Портфолио
            </button>
            <button className="tab-btn" data-target="reviews" onClick={() => scrollTo('reviews')}>
              Отзывы
            </button>
          </div>

          <div className="nav-right">
            <div className="contacts-wrap" ref={contactsRef}>
              <button
                className={`nav-cta ghost${contactsOpen ? ' open' : ''}`}
                onClick={() => setContactsOpen((v) => !v)}
                aria-expanded={contactsOpen}
                aria-haspopup="true"
              >
                Контакты
                <svg className="caret" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {contactsOpen && (
                <div className="contacts-menu" role="menu">
                  <a href={TG} target="_blank" rel="noopener noreferrer" role="menuitem">
                    <span className="cm-ico tg">TG</span>
                    <span>
                      <b>Telegram</b>
                      <small>t.me/nelacostework</small>
                    </span>
                  </a>
                  <a href={EMAIL} role="menuitem">
                    <span className="cm-ico mail">@</span>
                    <span>
                      <b>Почта</b>
                      <small>nelacostework@gmail.com</small>
                    </span>
                  </a>
                  <a href={DISCORD} target="_blank" rel="noopener noreferrer" role="menuitem">
                    <span className="cm-ico dc">DC</span>
                    <span>
                      <b>Discord</b>
                      <small>сообщество RADMIR RP</small>
                    </span>
                  </a>
                </div>
              )}
            </div>
            <a className="nav-cta primary" href={TG} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </div>
        </div>
      </header>

      <main className="site-main">
        <div className="wrap">
          {/* ===== ГЛАВНАЯ ===== */}
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
                <div className="val">Качeственная работа</div>
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

            {/* Как купить */}
            <div className="section-head" data-reveal>
              <div className="eyebrow">инструкция</div>
              <h2>Как купить</h2>
              <div className="desc">
                Сборка на заказ, готовая сборка из каталога, сам HUDLoader или приват-канал со всеми платными сборками сразу.
              </div>
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
          </section>

          {/* ===== СБОРКИ ===== */}
          <section id="builds" className="section-block">
            <div className="glass builds-head" data-reveal>
              <div className="hero-tag">
                <span className="ping" />каталог
              </div>
              <h1 style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
                <span className="underline-accent">СБОРКИ</span>
              </h1>
              <p className="lead" style={{ marginBottom: 20, fontSize: 17, color: 'var(--muted)' }}>
                Готовые HUD-сборки на базе RADMIR-HUDLoader: скриншот, короткое описание и ссылка на скачивание — без
                лишних действий.
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
              </div>
            </div>
            {(() => {
              let filtered = BUILDS
              if (buildFilter === 'free') filtered = filtered.filter((b) => b.price === null)
              if (buildFilter === 'paid') filtered = filtered.filter((b) => b.price !== null)
              if (filtered.length === 0) {
                return (
                  <div className="glass builds-empty" data-reveal>
                    Пока нет сборок в этой категории.
                  </div>
                )
              }
              return (
                <div className="builds-grid">
                  {filtered.map((b, i) => (
                    <div
                      className="glass build-card reveal-pop"
                      data-reveal
                      style={{ '--d': `${(i % 3) * 80}ms` } as React.CSSProperties}
                      key={b.title}
                      onClick={() => setActiveBuild(b)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setActiveBuild(b)
                      }}
                    >
                      <div className="build-shot">
                        {b.screenshot ? (
                          <img src={b.screenshot} alt={b.title} className="shot-img" />
                        ) : (
                          <>
                            <div className="sky" style={{ background: b.sky }} />
                            <div
                              className="tower"
                              style={{ left: b.tower.left, width: b.tower.width, height: b.tower.height }}
                            />
                          </>
                        )}
                        <div className="bld" />
                        <span className={`price-tag${b.price === null ? ' free' : ''}`}>
                          {b.price === null ? 'Бесплатно' : `${b.price} ₽`}
                        </span>
                        <div className="hud-dot d1">{b.d1}</div>
                        <div className="hud-dot d2">✦</div>
                        <div className="badge">
                          {b.name} <span className="n">{b.n}</span>
                        </div>
                      </div>
                      <div className="build-body">
                        <div className="build-title-row">
                          <h3>{b.title}</h3>
                          <span className="build-downloads" title="Скачиваний">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 3v12" />
                              <path d="m7 10 5 5 5-5" />
                              <path d="M5 21h14" />
                            </svg>
                            {b.downloads}
                          </span>
                        </div>
                        <div className="build-meta">
                          {b.tags.map((t) => (
                            <span className="tag" key={t}>
                              {t}
                            </span>
                          ))}
                        </div>
                        <p>{b.desc}</p>
                        <div className="build-actions">
                          <a
                            className="btn btn-primary btn-sm"
                            href={b.download || TG}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {b.download ? 'Скачать' : 'Скачать (через TG)'}
                          </a>
                          <a
                            className="btn btn-outline btn-sm"
                            href={TG}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Вопрос
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </section>

          {/* ===== HUDLOADER ===== */}
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
                              stroke="#130808"
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

          {/* ===== ПОРТФОЛИО ===== */}
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

          {/* ===== ОТЗЫВЫ ===== */}
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
              {[
                {
                  text: 'Купил лоадер тут, хочу сказать что всё супер — попользовался пару дней, всё чётко объяснили по установке, так что смело можно брать.',
                  name: 'notinteresting',
                  role: 'Пользователь Radmir-HudLoader',
                },
                {
                  text: 'подгруз лучший среди всех которые я пробовал все четко работает и четкий фпс',
                  name: 'extrovert',
                  role: 'Пользователь Radmir-HudLoader',
                },
                {
                  text: 'сборка четкая, проработанна максимально, лишнее ничего, графика красивая, и лишние плагины убраны.',
                  name: 'Расул',
                  role: 'Покупатель сборки на заказ',
                },
                {
                  text: 'Огненный лоадер и фикс, всё сделали быстро и объяснили что как.',
                  name: 'fapeek',
                  role: 'Пользователь Radmir-HudLoader',
                },
                {
                  text: 'Купил лоадер и это реально лучший из тех что пробовал — мои пнг остались нетронутыми и всё стабильно работает. Нет такого, что грузится не с первого раза или лого криво стоит — всё меняется прямо в игре.',
                  name: 'winitabe',
                  role: 'Пользователь Radmir-HudLoader',
                },
                {
                  text: 'Все классно хорошо, сделал очень отличную сборку а главное быстро и помог разобраться со всем. Советую покупать.',
                  name: 'uprosil anon',
                  role: 'Покупатель сборки на заказ',
                },
              ].map((q, i) => (
                <div className="glass quote reveal-pop" data-reveal style={{ '--d': `${(i % 3) * 80}ms` } as React.CSSProperties} key={q.text}>
                  <div className="stars">★★★★★</div>
                  <p>{q.text}</p>
                  <div className="who">
                    <div className="avatar" />
                    <div>
                      <div className="who-name">{q.name}</div>
                      <div className="who-role">{q.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>


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

      {activeBuild && (
        <div className="build-modal-overlay" onClick={() => setActiveBuild(null)}>
          <div className="build-modal" onClick={(e) => e.stopPropagation()}>
            <button className="build-modal-close" onClick={() => setActiveBuild(null)} aria-label="Закрыть">
              ×
            </button>
            <div className="build-modal-media">
              <div className="build-shot build-modal-shot">
                {activeBuild.screenshot ? (
                  <img src={activeBuild.screenshot} alt={activeBuild.title} className="shot-img" />
                ) : (
                  <>
                    <div className="sky" style={{ background: activeBuild.sky }} />
                    <div
                      className="tower"
                      style={{
                        left: activeBuild.tower.left,
                        width: activeBuild.tower.width,
                        height: activeBuild.tower.height,
                      }}
                    />
                  </>
                )}
                <div className="bld" />
                <div className="hud-dot d1">{activeBuild.d1}</div>
                <div className="hud-dot d2">✦</div>
                <div className="badge">
                  {activeBuild.name} <span className="n">{activeBuild.n}</span>
                </div>
              </div>
            </div>
            <div className="build-modal-info">
              <div className="hero-tag">
                <span className="ping" />сборка
              </div>
              <h2>{activeBuild.title}</h2>
              <div className="build-meta">
                {activeBuild.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className={`build-modal-price${activeBuild.price === null ? ' free' : ''}`}>
                {activeBuild.price === null ? 'Бесплатно' : `Платно — ${activeBuild.price} ₽`}
              </div>
              <div className="build-modal-downloads">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                {activeBuild.downloads} скачиваний
              </div>
              <p className="build-modal-desc">{activeBuild.desc}</p>
              <ul className="build-modal-details">
                {activeBuild.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              {(() => {
                const similar = BUILDS.filter(
                  (b) => b.title !== activeBuild.title && b.tags.some((t) => activeBuild.tags.includes(t)),
                ).slice(0, 3)
                if (similar.length === 0) return null
                return (
                  <div className="build-modal-similar">
                    <div className="bms-label">Похожие сборки</div>
                    <div className="bms-list">
                      {similar.map((s) => (
                        <button key={s.title} className="bms-item" onClick={() => setActiveBuild(s)}>
                          <span className="bms-name">{s.title}</span>
                          <span className={`bms-price${s.price === null ? ' free' : ''}`}>
                            {s.price === null ? 'Бесплатно' : `${s.price} ₽`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}
              <div className="build-actions" style={{ marginTop: 'auto' }}>
                <a
                  className="btn btn-primary"
                  href={activeBuild.download || TG}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activeBuild.download ? 'Скачать' : 'Скачать (через TG)'}
                </a>
                <a className="btn btn-outline" href={TG} target="_blank" rel="noopener noreferrer">
                  Вопрос
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
