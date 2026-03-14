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

    // Buscar o evento mais recente a partir de 15/03/2026
    const { data: eventoRecente } = await supabase
      .from('checkins')
      .select('nome_do_evento, data_do_evento')
      .gte('data_do_evento', '2026-03-15')
      .order('data_do_evento', { ascending: false })
      .limit(1)
      .single()

    if (!eventoRecente) {
      return NextResponse.json({ checkins: [], evento: null })
    }

    let query = supabase
      .from('checkins')
      .select('id, nome_completo, email, telefone, cpf, sexo, pelotao, nome_do_evento, data_do_evento, data_hora_checkin, validacao_do_checkin')
      .eq('data_do_evento', eventoRecente.data_do_evento)
      .order('data_hora_checkin', { ascending: false })

    if (busca) {
      query = query.or(
        `nome_completo.ilike.%${busca}%,cpf.ilike.%${busca}%,email.ilike.%${busca}%`
      )
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      checkins: data || [],
      evento: eventoRecente,
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
