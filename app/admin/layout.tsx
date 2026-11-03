import type { Metadata } from 'next'

// Админка не должна попадать в поиск.
export const metadata: Metadata = {
  title: 'Админка — NELACOSTE work',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
