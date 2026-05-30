import type { Metadata } from 'next'
import CollabClient from './CollabClient'

export const metadata: Metadata = {
  title: 'Somma Club × Esplanada Run | Corrida Oficial 21/06/2026',
  description:
    'Somma Club marca presença oficial na Esplanada Run 2026. Corrida gratuita na Esplanada dos Ministérios, 21 de junho. Acesso exclusivo via CPF para membros da comunidade.',
  alternates: { canonical: 'https://sommaclub.com.br/collab-esplanada-run' },
  openGraph: {
    title: 'Somma Club × Esplanada Run, Juntos na Esplanada',
    description:
      '21 de junho de 2026 · Esplanada dos Ministérios · Largada 07h00. A rua é de todos. E o Somma vai estar lá.',
    url: 'https://sommaclub.com.br/collab-esplanada-run',
  },
}

export default function Page() {
  return <CollabClient />
}
