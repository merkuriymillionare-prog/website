'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Просмотр скриншота на весь экран: зум колёсиком / кнопками / кликом, перетаскивание,
// стрелки ← → (другая сборка), лента миниатюр внизу, Esc закрывает.

export type LbItem = { id: string; src: string; title: string }

const MAX_SCALE = 6

export default function Lightbox({
  items,
  currentId,
  onSelect,
  onClose,
}: {
  items: LbItem[]
  currentId: string
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const idx = Math.max(0, items.findIndex((i) => i.id === currentId))
  const cur = items[idx]

  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const sRef = useRef(1)
  const pRef = useRef({ x: 0, y: 0 })
  const stageRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ sx: number; sy: number; px: number; py: number; moved: boolean } | null>(null)

  const apply = useCallback((s: number, p: { x: number; y: number }) => {
    sRef.current = s
    pRef.current = p
    setScale(s)
    setPos(p)
  }, [])
  const reset = useCallback(() => apply(1, { x: 0, y: 0 }), [apply])

  // точка (cx, cy) считается от центра сцены — именно она остаётся «на месте» при зуме
  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      const s = sRef.current
      const ns = Math.min(MAX_SCALE, Math.max(1, s * factor))
      if (ns === s) return
      if (ns === 1) return apply(1, { x: 0, y: 0 })
      const p = pRef.current
      const k = ns / s
      apply(ns, { x: cx - (cx - p.x) * k, y: cy - (cy - p.y) * k })
    },
    [apply],
  )

  // при смене картинки — сброс
  useEffect(() => {
    reset()
  }, [currentId, reset])

  // колёсико (нужен не-passive обработчик, чтобы страница не прокручивалась)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(Math.exp(-e.deltaY * 0.0018), e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const go = useCallback(
    (step: number) => {
      const n = items.length
      onSelect(items[(idx + step + n) % n].id)
    },
    [idx, items, onSelect],
  )

  // клавиатура
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === '+' || e.key === '=') zoomAt(1.3, 0, 0)
      else if (e.key === '-' || e.key === '_') zoomAt(1 / 1.3, 0, 0)
      else if (e.key === '0') reset()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, onClose, reset, zoomAt])

  // лента миниатюр: текущая в центр
  useEffect(() => {
    stripRef.current
      ?.querySelector('.on')
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [currentId])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    drag.current = { sx: e.clientX, sy: e.clientY, px: pRef.current.x, py: pRef.current.y, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 4) return
    d.moved = true
    if (sRef.current > 1) {
      setDragging(true)
      apply(sRef.current, { x: d.px + dx, y: d.py + dy })
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    setDragging(false)
    if (!d || d.moved) return
    // обычный клик по картинке: приблизить в точке клика
    const r = stageRef.current!.getBoundingClientRect()
    if (sRef.current === 1) zoomAt(2.3, e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
  }

  if (!cur) return null
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={cur.title}>
      <div className="lb-top">
        <div className="lb-title">
          {cur.title}
          <span>
            {idx + 1} / {items.length}
          </span>
        </div>
        <div className="lb-tools">
          <button onClick={() => zoomAt(1 / 1.3, 0, 0)} aria-label="Уменьшить" disabled={scale <= 1}>
            −
          </button>
          <span className="lb-pct">{Math.round(scale * 100)}%</span>
          <button onClick={() => zoomAt(1.3, 0, 0)} aria-label="Приблизить" disabled={scale >= MAX_SCALE}>
            ＋
          </button>
          <button onClick={reset} aria-label="Вписать в экран" title="Вписать в экран">
            ⤢
          </button>
          <button onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
      </div>

      <div
        className="lb-stage"
        ref={stageRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <button className="lb-arrow prev" onClick={() => go(-1)} aria-label="Предыдущая сборка">
          ‹
        </button>
        <img
          key={cur.id}
          src={cur.src}
          alt={cur.title}
          className="lb-img"
          draggable={false}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
            transition: dragging ? 'none' : 'transform .12s ease-out',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={() => sRef.current > 1 && reset()}
        />
        <button className="lb-arrow next" onClick={() => go(1)} aria-label="Следующая сборка">
          ›
        </button>
      </div>

      <div className="lb-hint">Колёсико или клик — приблизить · перетаскивай · ← → — другая сборка · Esc — закрыть</div>
      <div className="lb-strip" ref={stripRef}>
        {items.map((it) => (
          <button
            key={it.id}
            className={`lb-thumb${it.id === currentId ? ' on' : ''}`}
            onClick={() => onSelect(it.id)}
            title={it.title}
            aria-label={it.title}
          >
            <img src={it.src} alt="" loading="lazy" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  )
}
