import WingsAdminClient from '@/components/wings-cronometragem/WingsAdminClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Painel de Cronometragem | Wings das Atléticas',
  robots: { index: false, follow: false },
}

export default function WingsAdminPage() {
  return <WingsAdminClient />
}
