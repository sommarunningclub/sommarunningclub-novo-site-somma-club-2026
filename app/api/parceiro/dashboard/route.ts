import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventoId = searchParams.get('evento_id') || ''

    // Buscar todos os eventos da tabela eventos
    const { data: eventos, error: eventosError } = await supabase
      .from('eventos')
      .select('id, titulo, data_evento, checkin_status')
      .order('data_evento', { ascending: false })

    if (eventosError || !eventos || eventos.length === 0) {
      return NextResponse.json({ error: 'Nenhum evento encontrado.' }, { status: 404 })
    }

    // Se evento_id informado usa ele, senão pega o mais recente
    const eventoSelecionado = eventoId
      ? eventos.find(e => e.id === eventoId) || eventos[0]
      : eventos[0]

    // Busca todos os check-ins pelo evento_id (sem dados pessoais)
    const { data: checkins, error: checkinsError } = await supabase
      .from('checkins')
      .select('id, pelotao, sexo, data_do_evento, nome_do_evento, validacao_do_checkin, data_hora_checkin')
      .eq('evento_id', eventoSelecionado.id)
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
        id: eventoSelecionado.id,
        nome: eventoSelecionado.titulo,
        data: eventoSelecionado.data_evento,
        checkin_status: eventoSelecionado.checkin_status,
      },
      eventos: eventos.map(e => ({
        id: e.id,
        titulo: e.titulo,
        data_evento: e.data_evento,
        checkin_status: e.checkin_status,
      })),
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
