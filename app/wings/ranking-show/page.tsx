import WingsRankingShowClient from '@/components/wings-cronometragem/WingsRankingShowClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Ranking Show | Wings das Atléticas 2026',
  description: 'Ranking interativo e animado em tempo real do Revezamento 4×100m.',
}

export default function WingsRankingShowPage() {
  return <WingsRankingShowClient />
}
