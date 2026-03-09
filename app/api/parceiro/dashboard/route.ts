import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Busca o evento mais recente a partir de 14/03/2026
    const { data: eventoRecente, error: eventoError } = await supabase
      .from('checkins')
      .select('nome_do_evento, data_do_evento')
      .gte('data_do_evento', '2026-03-14')
      .order('data_do_evento', { ascending: false })
      .limit(1)
      .single()

    if (eventoError || !eventoRecente) {
      return NextResponse.json({ error: 'Nenhum evento encontrado.' }, { status: 404 })
    }

    // Busca todos os check-ins do evento mais recente (sem dados pessoais)
    const { data: checkins, error: checkinsError } = await supabase
      .from('checkins')
      .select('id, pelotao, sexo, data_do_evento, nome_do_evento, validacao_do_checkin, data_hora_checkin')
      .eq('nome_do_evento', eventoRecente.nome_do_evento)
      .eq('data_do_evento', eventoRecente.data_do_evento)
      .order('data_hora_checkin', { ascending: false })

    if (checkinsError) {
      return NextResponse.json({ error: 'Erro ao buscar check-ins.' }, { status: 500 })
    }

    const total = checkins?.length ?? 0

    // Agrupamento por pelotão
    const porPelotao: Record<string, number> = {}
    checkins?.forEach(c => {
      const p = c.pelotao || 'Não informado'
      porPelotao[p] = (porPelotao[p] || 0) + 1
    })

    // Agrupamento por sexo
    const porSexo: Record<string, number> = {}
    checkins?.forEach(c => {
      const s = c.sexo || 'Não informado'
      porSexo[s] = (porSexo[s] || 0) + 1
    })

    // Validados vs pendentes
    const validados = checkins?.filter(c => c.validacao_do_checkin === true).length ?? 0
    const pendentes = total - validados

    // Check-ins por hora (para gráfico de fluxo)
    const porHora: Record<string, number> = {}
    checkins?.forEach(c => {
      if (c.data_hora_checkin) {
        const hora = new Date(c.data_hora_checkin).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).slice(0, 5)
        porHora[hora] = (porHora[hora] || 0) + 1
      }
    })

    return NextResponse.json({
      evento: {
        nome: eventoRecente.nome_do_evento,
        data: eventoRecente.data_do_evento,
      },
      total,
      validados,
      pendentes,
      porPelotao,
      porSexo,
      porHora,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
