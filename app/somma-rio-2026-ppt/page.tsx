import type { Metadata, Viewport } from 'next'
import { Anton, Barlow } from 'next/font/google'
import { PptClient } from './PptClient'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

const display = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' })
const body = Barlow({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' })

const TITLE = 'Maratona do Rio 2026 · Apresentação Somma Club'
const DESCRIPTION =
  'Apresentação interativa do briefing da Maratona do Rio 2026 para os atletas do Somma Club: provas, percursos, pontos críticos, hidratação e torcida Somma.'
const URL = 'https://www.sommaclub.com.br/somma-rio-2026-ppt'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website', locale: 'pt_BR' },
}

export default function Page() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <PptClient />
    </div>
  )
}
