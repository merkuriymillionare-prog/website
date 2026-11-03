import type { CSSProperties } from 'react'

// Свой цвет сайта: из одного HEX строим всю палитру (акценты + тёмные поверхности в оттенке цвета).
function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  const v = m ? m[1] : 'ff5a36'
  const r = parseInt(v.slice(0, 2), 16) / 255
  const g = parseInt(v.slice(2, 4), 16) / 255
  const b = parseInt(v.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

export function normalizeHex(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  return m ? '#' + m[1].toLowerCase() : '#ff5a36'
}

export function customThemeVars(hex: string): CSSProperties {
  const clean = normalizeHex(hex)
  const [h, s, l] = hexToHsl(clean)
  const sat = Math.round(Math.min(1, Math.max(0.45, s)) * 100)
  const hsl = (hh: number, ss: number, ll: number) => `hsl(${Math.round(hh)} ${Math.round(ss)}% ${Math.round(ll)}%)`
  const light = Math.min(0.78, Math.max(0.52, l + 0.16)) * 100
  const dark = Math.max(0.28, l - 0.16) * 100
  const r = parseInt(clean.slice(1, 3), 16)
  const g = parseInt(clean.slice(3, 5), 16)
  const b = parseInt(clean.slice(5, 7), 16)
  const base = Math.min(40, sat)
  return {
    '--acc-rgb': `${r}, ${g}, ${b}`,
    '--acc-1': clean,
    '--acc-2': hsl(h, sat, light),
    '--acc-3': hsl(h, sat, dark),
    '--bg-0': hsl(h, base, 5),
    '--bg-1': hsl(h, base, 9),
    '--surface': hsl(h, base - 4, 10),
    '--surface-2': hsl(h, base - 6, 14),
  } as CSSProperties
}
