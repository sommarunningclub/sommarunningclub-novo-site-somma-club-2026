import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'
import { isStaffAuthorized } from '@/lib/wings-cronometragem/auth'

const TOP_N = 8

// Fecha a classificatória: calcula top N por tempo combinado já com desconto
// de barras e marca essas atléticas como classificada_final = true.
// Empata? Mantém ordem do banco (created_at). Em produção raro empatar em ms.
export async function POST(req: NextRequest) {
  if (!(await isStaffAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const supabase = getServiceClient()

  const [{ data: atleticas, error: errA }, { data: runs, error: errR }] = await Promise.all([
    supabase.from('wings_comp_atleticas').select('id, nome, barras'),
    supabase.from('wings_comp_runs').select('atletica_id, tipo_prova, tempo_final_ms').eq('fase', 'classificatoria'),
  ])
  if (errA) return NextResponse.json({ error: errA.message }, { status: 500 })
  if (errR) return NextResponse.json({ error: errR.message }, { status: 500 })

  // Melhor por (atletica, tipo)
  const melhor = new Map<string, { normal: number | null; dinamico: number | null }>()
  for (const r of runs ?? []) {
    const slot = melhor.get(r.atletica_id) ?? { normal: null, dinamico: null }
    if (r.tipo_prova === 'normal') {
      if (slot.normal == null || r.tempo_final_ms < slot.normal) slot.normal = r.tempo_final_ms
    } else if (r.tipo_prova === 'dinamico') {
      if (slot.dinamico == null || r.tempo_final_ms < slot.dinamico) slot.dinamico = r.tempo_final_ms
    }
    melhor.set(r.atletica_id, slot)
  }

  const completas = (atleticas ?? [])
    .map(a => {
      const slot = melhor.get(a.id) ?? { normal: null, dinamico: null }
      if (slot.normal == null || slot.dinamico == null) return null
      const bruto = slot.normal + slot.dinamico
      const desconto = (a.barras ?? 0) * 1000
      return { id: a.id, nome: a.nome, tempo: Math.max(0, bruto - desconto) }
    })
    .filter((x): x is { id: string; nome: string; tempo: number } => x !== null)
    .sort((a, b) => a.tempo - b.tempo)

  const topIds = completas.slice(0, TOP_N).map(x => x.id)
  if (topIds.length === 0) {
    return NextResponse.json({ error: 'Nenhuma equipe completou as 2 provas ainda.' }, { status: 400 })
  }

  // Reset todas e seta as top N em duas operações
  const { error: errReset } = await supabase
    .from('wings_comp_atleticas')
    .update({ classificada_final: false })
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (errReset) return NextResponse.json({ error: errReset.message }, { status: 500 })

  const { error: errSet } = await supabase
    .from('wings_comp_atleticas')
    .update({ classificada_final: true })
    .in('id', topIds)
  if (errSet) return NextResponse.json({ error: errSet.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    classificadas: completas.slice(0, TOP_N),
    total_atleticas_completas: completas.length,
  })
}

// Reabre a classificatória — desmarca todas as classificações
export async function DELETE() {
  if (!(await isStaffAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const supabase = getServiceClient()
  const { error } = await supabase
    .from('wings_comp_atleticas')
    .update({ classificada_final: false })
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
