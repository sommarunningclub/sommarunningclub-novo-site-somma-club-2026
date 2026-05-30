import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inscrição confirmada',
  description: 'Obrigado por se inscrever no SOMMA Running Club.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://sommaclub.com.br/obrigado' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
