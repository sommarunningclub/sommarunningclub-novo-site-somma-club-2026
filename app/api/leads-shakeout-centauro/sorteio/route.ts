import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { fisherYatesShuffle, gerarHashAuditoria } from '@/lib/sorteio/utils'

const ORIGEM = 'shakeout-centauro-somma-rj'
const EVENTO = 'shakeout-centauro-somma-rj'
const ADMIN_CODE = process.env.SHAKEOUT_ADMIN_CODE || 'somma@shakeout2026'

const LEAD_COLS = 'id, nome_completo, email, telefone, cpf, sexo, uf, conhecia_somma, data_de_cadastro'

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase não configurado')
  return createClient(url, key)
}

type LeadRow = { id: string; nome_completo: string; email: string; telefone: string; cpf: string; sexo: string; uf: string; conhecia_somma: boolean; data_de_cadastro: string }

// pool de participantes elegíveis, filtrado por "conhece"
async function getPool(supabase: ReturnType<typeof db>, conhece: string) {
  let q = supabase
    .from('leads_shakeout_centauro')
    .select(LEAD_COLS)
    .eq('origem', ORIGEM)
    .eq('status', 'confirmado')
    .order('data_de_cadastro', { ascending: true })
  if (conhece === 'sim') q = q.eq('conhecia_somma', true)
  else if (conhece === 'nao') q = q.eq('conhecia_somma', false)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data || []) as LeadRow[]
}

// linha de ganhador -> shape esperado pelos componentes (Ganhador.checkin)
function toGanhador(g: Record<string, unknown>) {
  return {
    id: g.id, sorteio_id: g.sorteio_id, checkin_id: g.lead_id, posicao: g.posicao,
    numero_sorteado: g.numero_sorteado, status: g.status, confirmado_em: g.confirmado_em ?? null,
    substituido_por: g.substituido_por ?? null, created_at: g.created_at,
    checkin: {
      nome_completo: g.nome_completo, email: g.email, telefone: g.telefone,
      cpf: g.cpf, sexo: g.sexo, pelotao: g.uf, // UF aparece no badge laranja
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, code } = body as { action: string; code: string }
    if (code !== ADMIN_CODE) return NextResponse.json({ error: 'Código de acesso inválido.' }, { status: 401 })

    const supabase = db()

    // ---- elegíveis para o filtro ----
    if (action === 'participants') {
      const pool = await getPool(supabase, String(body.conhece ?? 'todos'))
      return NextResponse.json({
        stats: {
          total: pool.length,
          conhece: pool.filter((p) => p.conhecia_somma).length,
          nao_conhece: pool.filter((p) => !p.conhecia_somma).length,
        },
      })
    }

    // ---- realizar sorteio ----
    if (action === 'sortear') {
      const titulo = String(body.titulo ?? '').trim()
      const quantidade = Number(body.quantidade ?? 0)
      const conhece = String(body.conhece ?? 'todos')
      const criado_por = body.criado_por ? String(body.criado_por) : null
      if (!titulo || !quantidade) return NextResponse.json({ error: 'Informe o título e a quantidade.' }, { status: 400 })

      const pool = await getPool(supabase, conhece)
      if (pool.length === 0) return NextResponse.json({ error: 'Nenhum participante elegível com este filtro.' }, { status: 400 })
      if (quantidade > pool.length) return NextResponse.json({ error: `Quantidade (${quantidade}) maior que elegíveis (${pool.length}).` }, { status: 400 })

      const numerados = pool.map((p, i) => ({ ...p, numero: i + 1 }))
      const sorteados = fisherYatesShuffle(numerados).slice(0, quantidade)

      const timestamp = new Date().toISOString()
      const audit_hash = await gerarHashAuditoria({
        candidatoIds: pool.map((p) => p.id), ganhadorIds: sorteados.map((p) => p.id), timestamp, eventoId: EVENTO,
      })

      const { data: sorteio, error: sErr } = await supabase
        .from('sorteios_shakeout')
        .insert({ titulo, filtros_aplicados: { conhece }, total_elegiveis: pool.length, criado_por, audit_hash })
        .select().single()
      if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 })

      const rows = sorteados.map((p, i) => ({
        sorteio_id: sorteio.id, lead_id: p.id, posicao: i + 1, numero_sorteado: p.numero, status: 'pendente',
        nome_completo: p.nome_completo, email: p.email, telefone: p.telefone, cpf: p.cpf, sexo: p.sexo, uf: p.uf,
      }))
      const { data: inseridos, error: gErr } = await supabase.from('ganhadores_shakeout').insert(rows).select()
      if (gErr) return NextResponse.json({ error: gErr.message }, { status: 500 })

      return NextResponse.json({ sorteio: { ...sorteio, ganhadores: (inseridos || []).map(toGanhador) } })
    }

    // ---- histórico ----
    if (action === 'historico') {
      const { data: sorteios, error } = await supabase.from('sorteios_shakeout').select('*').order('created_at', { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      const ids = (sorteios || []).map((s) => s.id)
      const { data: gs } = ids.length ? await supabase.from('ganhadores_shakeout').select('*').in('sorteio_id', ids).order('posicao', { ascending: true }) : { data: [] }
      const result = (sorteios || []).map((s) => ({ ...s, ganhadores: (gs || []).filter((g) => g.sorteio_id === s.id).map(toGanhador) }))
      return NextResponse.json({ sorteios: result })
    }

    // ---- confirmar / ausente ----
    if (action === 'confirmar' || action === 'ausente') {
      const id = body.id
      if (!id) return NextResponse.json({ error: 'ID não informado.' }, { status: 400 })
      const patch = action === 'confirmar' ? { status: 'confirmado', confirmado_em: new Date().toISOString() } : { status: 'ausente' }
      const { error } = await supabase.from('ganhadores_shakeout').update(patch).eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ success: true })
    }

    // ---- resorteio (substituto) ----
    if (action === 'resorteio') {
      const id = body.id
      const { data: ausente } = await supabase.from('ganhadores_shakeout').select('*').eq('id', id).single()
      if (!ausente) return NextResponse.json({ error: 'Ganhador não encontrado.' }, { status: 404 })
      const { data: sorteio } = await supabase.from('sorteios_shakeout').select('*').eq('id', ausente.sorteio_id).single()
      if (!sorteio) return NextResponse.json({ error: 'Sorteio não encontrado.' }, { status: 404 })

      const { data: todos } = await supabase.from('ganhadores_shakeout').select('lead_id').eq('sorteio_id', sorteio.id)
      const excluidos = new Set((todos || []).map((g) => g.lead_id))

      const pool = await getPool(supabase, (sorteio.filtros_aplicados?.conhece as string) || 'todos')
      const numerados = pool.map((p, i) => ({ ...p, numero: i + 1 }))
      const disponiveis = numerados.filter((p) => !excluidos.has(p.id))
      if (disponiveis.length === 0) return NextResponse.json({ error: 'Nenhum participante disponível para resorteio.' }, { status: 400 })

      const sub = fisherYatesShuffle(disponiveis)[0]
      const { data: novo, error: nErr } = await supabase.from('ganhadores_shakeout').insert({
        sorteio_id: sorteio.id, lead_id: sub.id, posicao: ausente.posicao, numero_sorteado: sub.numero, status: 'pendente',
        nome_completo: sub.nome_completo, email: sub.email, telefone: sub.telefone, cpf: sub.cpf, sexo: sub.sexo, uf: sub.uf,
      }).select().single()
      if (nErr) return NextResponse.json({ error: nErr.message }, { status: 500 })
      await supabase.from('ganhadores_shakeout').update({ substituido_por: novo.id }).eq('id', id)
      return NextResponse.json({ ganhador: toGanhador(novo) })
    }

    // ---- limpar histórico ----
    if (action === 'limpar') {
      await supabase.from('sorteios_shakeout').delete().not('id', 'is', null)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Ação desconhecida.' }, { status: 400 })
  } catch (e) {
    console.error('[shakeout-sorteio] erro:', e)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
