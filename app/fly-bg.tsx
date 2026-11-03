'use client'

import { useEffect, useRef } from 'react'

// Фон: медленно плывущие значки оружия из игры (PNG из /public/icons).
// Значки перекрашиваются в цвета выбранной темы сайта, на разной глубине,
// слегка смещаются за курсором. Чтобы добавить значок — положи PNG в
// public/icons и допиши путь в ICONS.
// Не запускается при «Анимации: выкл», prefers-reduced-motion; на телефонах значков меньше.

const ICONS = ['/icons/0.png', '/icons/24.png', '/icons/43.png', '/icons/42.png']

type P = {
  icon: number
  x: number
  y: number
  z: number // глубина 0.35..1 (ближе = крупнее, быстрее, ярче)
  rot: number
  vr: number
  vx: number
  vy: number
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// чёрный контур -> цвет темы, серая заливка -> тот же цвет, но бледнее, прозрачное остаётся
function tint(img: HTMLImageElement, rgb: string, size: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const x = c.getContext('2d')!
  x.drawImage(img, 0, 0, size, size)
  const d = x.getImageData(0, 0, size, size)
  const [r, g, b] = rgb.split(',').map((v) => parseInt(v, 10))
  for (let i = 0; i < d.data.length; i += 4) {
    const a = d.data[i + 3]
    if (!a) continue
    const lum = d.data[i] * 0.299 + d.data[i + 1] * 0.587 + d.data[i + 2] * 0.114
    const t = Math.min(1, lum / 218)
    d.data[i] = r
    d.data[i + 1] = g
    d.data[i + 2] = b
    d.data[i + 3] = a * (1 - t * 0.6)
  }
  x.putImageData(d, 0, 0)
  return c
}

export default function FlyBg({
  enabled,
  theme,
  amount = 'normal',
}: {
  enabled: boolean
  theme: string
  amount?: 'few' | 'normal' | 'many' | 'off'
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const imgsRef = useRef<HTMLImageElement[]>([])
  const spritesRef = useRef<HTMLCanvasElement[]>([])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    let mx = 0
    let my = 0
    let cx = 0
    let cy = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / w - 0.5
      my = e.clientY / h - 0.5
    }
    if (!coarse) window.addEventListener('mousemove', onMove)

    ;(async () => {
      const site = canvas.closest('.site') as HTMLElement | null
      const rgb = (site ? getComputedStyle(site).getPropertyValue('--acc-rgb') : '').trim() || '193, 39, 45'
      const imgs = (await Promise.all(ICONS.map(loadImage))).filter(Boolean) as HTMLImageElement[]
      if (cancelled || imgs.length === 0) return
      imgsRef.current = imgs
      spritesRef.current = imgs.map((im) => tint(im, rgb, 160))

      const mult = amount === 'few' ? 0.5 : amount === 'many' ? 1.7 : 1
      const count = Math.round((coarse || w < 700 ? 10 : 22) * mult)
      const parts: P[] = Array.from({ length: count }, (_, i) => {
        const z = 0.35 + Math.random() * 0.65
        return {
          icon: i % imgs.length,
          x: Math.random(),
          y: Math.random(),
          z,
          rot: (Math.random() - 0.5) * 1.2,
          vr: (Math.random() - 0.5) * 0.18 * z,
          vx: (Math.random() - 0.5) * 0.012 * z,
          vy: -0.004 - Math.random() * 0.012 * z,
        }
      })

      let last = performance.now()
      const frame = (now: number) => {
        if (cancelled) return
        raf = requestAnimationFrame(frame)
        if (document.hidden) {
          last = now
          return
        }
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        cx += (mx - cx) * 0.05
        cy += (my - cy) * 0.05

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        for (const p of parts) {
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.rot += p.vr * dt
          if (p.y < -0.15) {
            p.y = 1.15
            p.x = Math.random()
          }
          if (p.x < -0.15) p.x = 1.15
          if (p.x > 1.15) p.x = -0.15

          const size = 46 + p.z * 86
          const px = p.x * w - cx * p.z * 80
          const py = p.y * h - cy * p.z * 80
          ctx.save()
          ctx.translate(px, py)
          ctx.rotate(p.rot)
          ctx.globalAlpha = 0.12 + p.z * 0.34
          const sp = spritesRef.current[p.icon]
          if (sp) ctx.drawImage(sp, -size / 2, -size / 2, size, size)
          ctx.restore()
        }
      }
      raf = requestAnimationFrame(frame)
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [enabled, amount])

  // смена цвета темы: только перекрашиваем значки, не пересоздавая их
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || imgsRef.current.length === 0) return
    const site = canvas.closest('.site') as HTMLElement | null
    const rgb = (site ? getComputedStyle(site).getPropertyValue('--acc-rgb') : '').trim() || '193, 39, 45'
    spritesRef.current = imgsRef.current.map((im) => tint(im, rgb, 160))
  }, [theme])

  if (!enabled) return null
  return <canvas ref={ref} className="fly-bg" aria-hidden="true" />
}
