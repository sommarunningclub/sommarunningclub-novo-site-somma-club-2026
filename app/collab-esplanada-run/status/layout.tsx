import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Status das inscrições | Esplanada Run',
  robots: { index: false, follow: false },
}

// Comportamento de app: trava o zoom (inclui o zoom automático do iOS ao focar inputs)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
}

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
