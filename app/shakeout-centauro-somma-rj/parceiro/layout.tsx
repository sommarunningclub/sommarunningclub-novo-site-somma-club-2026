import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Parceiro · Shake Out Centauro + Somma',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function ParceiroLayout({ children }: { children: React.ReactNode }) {
  return children
}
