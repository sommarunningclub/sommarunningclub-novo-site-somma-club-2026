import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function authorized(req: NextRequest) {
  const expected = process.env.WINGS_ADMIN_KEY
  if (!expected) return true // sem env var, libera (modo dev) — defina em prod
  const provided =
    req.headers.get('x-admin-key') ||
    req.nextUrl.searchParams.get('key')
  return provided === expected
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

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
