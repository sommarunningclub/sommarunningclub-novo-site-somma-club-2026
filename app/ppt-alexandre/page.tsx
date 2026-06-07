import type { Metadata, Viewport } from 'next'
import { Anton, Barlow } from 'next/font/google'
import { PptAlexandreClient } from './PptAlexandreClient'

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

const TITLE = 'O Futuro do Somma Club · Governança e Proteção Jurídica'
const DESCRIPTION =
  'Por que formalizar a estrutura do Somma protege os fundadores, os voluntários, a comunidade e a marca — e prepara o crescimento sustentável.'
const URL = 'https://www.sommaclub.com.br/ppt-alexandre'

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
      <PptAlexandreClient />
    </div>
  )
}
