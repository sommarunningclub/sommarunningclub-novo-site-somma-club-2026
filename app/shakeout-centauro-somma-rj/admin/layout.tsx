import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Admin · Shake Out Centauro + Somma',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
