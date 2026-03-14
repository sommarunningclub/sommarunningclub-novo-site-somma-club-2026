import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Próximo evento (futuro ou aberto, excluindo encerrados)
    const { data: upcoming, error: upErr } = await supabase
      .from('eventos')
      .select('id, titulo, data_evento, horario_inicio, local, checkin_status, pelotoes')
      .or(`data_evento.gt.${today},checkin_status.eq.aberto,checkin_status.eq.bloqueado`)
      .neq('checkin_status', 'encerrado')
      .order('data_evento', { ascending: true })
      .limit(1)
      .single()

    if (upErr && upErr.code !== 'PGRST116') {
      console.error('[site] Erro ao buscar próximo evento:', upErr)
    }

    // Histórico (últimos 30 dias, apenas encerrados)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const { data: historico, error: histErr } = await supabase
      .from('eventos')
      .select('id, titulo, data_evento, local, checkin_status')
      .eq('checkin_status', 'encerrado')
      .gte('data_evento', thirtyDaysAgo)
      .neq('id', upcoming?.id || '00000000-0000-0000-0000-000000000000')
      .order('data_evento', { ascending: false })
      .limit(10)

    if (histErr) {
      console.error('[site] Erro ao buscar histórico:', histErr)
    }

    return NextResponse.json({
      proximo_evento: upcoming || null,
      historico: historico || [],
    })
  } catch (error) {
    console.error('[site] Erro em GET /api/eventos:', error)
    return NextResponse.json(
      { proximo_evento: null, historico: [] },
      { status: 500 }
    )
  }
}
