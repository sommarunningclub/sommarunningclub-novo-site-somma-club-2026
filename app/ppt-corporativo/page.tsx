import type { Metadata, Viewport } from 'next'
import { Anton, Barlow } from 'next/font/google'
import { PptCorporativoClient } from './PptCorporativoClient'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

const display = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' })
const body = Barlow({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' })

const TITLE = 'Governança Corporativa · Somma Club'
const DESCRIPTION =
  'Estrutura para crescimento sustentável: governança, papéis, responsabilidades, KPIs e visão de futuro do Somma Club.'
const URL = 'https://www.sommaclub.com.br/ppt-corporativo'

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
      <PptCorporativoClient />
    </div>
  )
}
