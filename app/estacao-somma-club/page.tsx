import type { Metadata, Viewport } from 'next'
import { Anton, Barlow } from 'next/font/google'
import { EstacaoVivaClient } from './EstacaoVivaClient'

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

const TITLE = 'Estação SOMMA · Resumo técnico do projeto'
const DESCRIPTION =
  'A Estação SOMMA será a primeira base permanente de esporte, saúde, bem-estar e convivência urbana do Parque da Cidade — apresentação institucional do projeto.'
const URL = 'https://www.sommaclub.com.br/estacao-somma-club'

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
      <EstacaoVivaClient />
    </div>
  )
}
