import type { Metadata, Viewport } from 'next'
import { Anton, Barlow } from 'next/font/google'
import { PptEvolve2Client } from './PptEvolve2Client'

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

const TITLE = 'Assessoria Somma Club powered by Evolve+ · Proposta'
const DESCRIPTION =
  'Naming rights da Assessoria Somma Club: a Evolve+ como academia oficial da principal assessoria esportiva do ecossistema Somma. Proposta executiva focada em entregáveis.'
const URL = 'https://www.sommaclub.com.br/ppt-evolve-2'

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
      <PptEvolve2Client />
    </div>
  )
}
