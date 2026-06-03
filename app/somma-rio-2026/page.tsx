import type { Metadata, Viewport } from 'next'
import { Anton, Barlow } from 'next/font/google'
import { SommaRioClient } from './SommaRioClient'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

const display = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' })
const body = Barlow({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' })

const TITLE = 'Maratona do Rio 2026 · Briefing Somma Club'
const DESCRIPTION =
  'Briefing técnico da Maratona do Rio 2026 para os atletas do Somma Club: percursos 42K, 21K, 10K e 5K, altimetria, pontos críticos, hidratação, torcida Somma e dicas estratégicas.'
const URL = 'https://www.sommaclub.com.br/somma-rio-2026'
const OG_IMAGE = 'https://www.sommaclub.com.br/og-image.jpg'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'website',
    locale: 'pt_BR',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Maratona do Rio 2026 · Somma Club' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
}

export default function Page() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <SommaRioClient />
    </div>
  )
}
