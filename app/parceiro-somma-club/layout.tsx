import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acesso Parceiro',
  description: 'Área restrita de parceiros do SOMMA Club. Acesse com seu código de liberação.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://sommaclub.com.br/parceiro-somma-club' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
