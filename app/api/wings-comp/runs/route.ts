import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'
import { isStaffAuthorized } from '@/lib/wings-cronometragem/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fase = searchParams.get('fase')
  const supabase = getServiceClient()

  let q = supabase.from('wings_comp_runs').select('*').order('tempo_final_ms', { ascending: true })
  if (fase) q = q.eq('fase', fase)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ runs: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body?.atletica_id || typeof body.tempo_bruto_ms !== 'number') {
    return NextResponse.json({ error: 'Campos obrigatórios: atletica_id, tempo_bruto_ms.' }, { status: 400 })
  }
  if (body.tempo_bruto_ms < 0) {
    return NextResponse.json({ error: 'Tempo inválido.' }, { status: 400 })
  }
  const fase = body.fase === 'final' ? 'final' : 'classificatoria'

  // bateria: int >= 1 (ou null), raia: int 1-8 (ou null)
  const bateria =
    body.bateria === '' || body.bateria == null
      ? null
      : Number.isInteger(Number(body.bateria)) && Number(body.bateria) >= 1
        ? Number(body.bateria)
        : null
  const raia =
    body.raia === '' || body.raia == null
      ? null
      : Number.isInteger(Number(body.raia)) && Number(body.raia) >= 1 && Number(body.raia) <= 8
        ? Number(body.raia)
        : null
  if (body.raia != null && body.raia !== '' && raia == null) {
    return NextResponse.json({ error: 'Raia deve ser um inteiro entre 1 e 8.' }, { status: 400 })
  }
  if (body.bateria != null && body.bateria !== '' && bateria == null) {
    return NextResponse.json({ error: 'Bateria deve ser um inteiro >= 1.' }, { status: 400 })
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('wings_comp_runs')
    .insert({
      atletica_id: body.atletica_id,
      fase,
      bateria,
      raia,
      tempo_bruto_ms: Math.round(body.tempo_bruto_ms),
      penalidade_1_ms: Math.round(body.penalidade_1_ms ?? 0),
      penalidade_2_ms: Math.round(body.penalidade_2_ms ?? 0),
      penalidade_3_ms: Math.round(body.penalidade_3_ms ?? 0),
      penalidade_4_ms: Math.round(body.penalidade_4_ms ?? 0),
      observacoes: body.observacoes?.trim() || null,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ run: data })
}

export async function PATCH(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  const update: Record<string, unknown> = {}
  if (body.fase === 'classificatoria' || body.fase === 'final') update.fase = body.fase
  if (typeof body.tempo_bruto_ms === 'number' && body.tempo_bruto_ms >= 0) {
    update.tempo_bruto_ms = Math.round(body.tempo_bruto_ms)
  }
  if ('bateria' in body) {
    if (body.bateria === null || body.bateria === '') update.bateria = null
    else if (Number.isInteger(Number(body.bateria)) && Number(body.bateria) >= 1) {
      update.bateria = Number(body.bateria)
    } else {
      return NextResponse.json({ error: 'Bateria inválida.' }, { status: 400 })
    }
  }
  if ('raia' in body) {
    if (body.raia === null || body.raia === '') update.raia = null
    else if (Number.isInteger(Number(body.raia)) && Number(body.raia) >= 1 && Number(body.raia) <= 8) {
      update.raia = Number(body.raia)
    } else {
      return NextResponse.json({ error: 'Raia deve ser entre 1 e 8.' }, { status: 400 })
    }
  }
  for (const k of ['penalidade_1_ms', 'penalidade_2_ms', 'penalidade_3_ms', 'penalidade_4_ms'] as const) {
    if (typeof body[k] === 'number' && body[k] >= 0) update[k] = Math.round(body[k])
  }
  if (typeof body.observacoes === 'string' || body.observacoes === null) {
    update.observacoes = body.observacoes?.trim() || null
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('wings_comp_runs')
    .update(update)
    .eq('id', body.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ run: data })
}

export async function DELETE(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  const supabase = getServiceClient()
  const { error } = await supabase.from('wings_comp_runs').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
