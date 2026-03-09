import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busca = searchParams.get('busca') || ''

    // Buscar o evento mais recente
    const { data: eventoRecente } = await supabase
      .from('checkins')
      .select('nome_do_evento, data_do_evento')
      .order('data_do_evento', { ascending: false })
      .limit(1)
      .single()

    if (!eventoRecente) {
      return NextResponse.json({ checkins: [], evento: null })
    }

    let query = supabase
      .from('checkins')
      .select('id, nome_completo, cpf, pelotao, validacao_do_checkin, data_hora_checkin, nome_do_evento, data_do_evento')
      .eq('data_do_evento', eventoRecente.data_do_evento)
      .order('nome_completo', { ascending: true })

    if (busca) {
      query = query.or(
        `nome_completo.ilike.%${busca}%,cpf.ilike.%${busca}%`
      )
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ checkins: data || [], evento: eventoRecente })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, validacao_do_checkin } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    const { error } = await supabase
      .from('checkins')
      .update({
        validacao_do_checkin,
        validated_at: validacao_do_checkin
          ? new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T') + '-03:00'
          : null,
      })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
