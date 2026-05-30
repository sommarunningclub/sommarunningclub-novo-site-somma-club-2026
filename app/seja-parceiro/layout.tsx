import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seja parceiro',
  description:
    'Conecte sua marca à maior comunidade de corrida do Distrito Federal. Seja um parceiro do SOMMA Running Club em Brasília.',
  alternates: { canonical: 'https://sommaclub.com.br/seja-parceiro' },
  openGraph: {
    title: 'Seja parceiro | SOMMA Running Club',
    description: 'Conecte sua marca à maior comunidade de corrida do Distrito Federal.',
    url: 'https://sommaclub.com.br/seja-parceiro',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
