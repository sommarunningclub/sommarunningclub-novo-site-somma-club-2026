import type { Metadata, Viewport } from 'next'
import { Anton, Barlow } from 'next/font/google'
import { PptEvolveClient } from './PptEvolveClient'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
}

const display = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' })
const body = Barlow({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' })

const TITLE = 'Somma Club + Evolve · Apresentação'
const DESCRIPTION =
  'O Somma Club virou uma plataforma de comunidade, influência e lifestyle. A Evolve tem a chance de ser a primeira academia a ocupar oficialmente esse território.'
const URL = 'https://www.sommaclub.com.br/ppt-evolve'

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
      <PptEvolveClient />
    </div>
  )
}
