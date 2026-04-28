import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'

export const dynamic = 'force-dynamic'

function authorized(req: NextRequest) {
  const expected = process.env.WINGS_ADMIN_KEY
  if (!expected) return true
  const provided = req.headers.get('x-admin-key')
  return provided === expected
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { registration_id, status, operator } = await req.json()
    if (!registration_id || !['pending', 'checked_in', 'no_show'].includes(status)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const update: Record<string, unknown> = {
      checkin_status: status,
      checkin_at: status === 'checked_in' ? new Date().toISOString() : null,
      checkin_by: status === 'checked_in' ? (operator || 'admin') : null,
    }

    const { data, error } = await supabase
      .from('wings_registrations')
      .update(update)
      .eq('id', registration_id)
      .select('id, evento_id, cpf, checkin_status, checkin_at, checkin_by')
      .single()

    if (error) {
      console.error('[wings/checkin]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Espelhar no `checkins` (admin Somma): marca validacao_do_checkin = true
    // quando status = checked_in; reverte caso contrário.
    const { error: mirrorErr } = await supabase
      .from('checkins')
      .update({
        validacao_do_checkin: status === 'checked_in',
      })
      .eq('evento_id', data.evento_id)
      .eq('cpf', data.cpf)

    if (mirrorErr) {
      console.error('[wings/checkin] espelho em checkins falhou:', mirrorErr.message)
    }

    return NextResponse.json({ success: true, registration: data })
  } catch (err) {
    console.error('[wings/checkin] erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
