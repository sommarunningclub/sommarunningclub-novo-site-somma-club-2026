import { NextRequest, NextResponse } from 'next/server'
import { isWingsAdminAuthorized } from '@/lib/auth/wings-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  if (!isWingsAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { getServiceClient } = await import('@/lib/wings/supabase')
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('wings_registrations')
    .select(`
      id, full_name, phone, cpf, gender,
      checkin_status, checkin_at, checkin_by,
      registration_token, created_at,
      institution:institutions ( id, name ),
      atletica:atleticas ( id, name )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ registrations: data ?? [] })
}
