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

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('wings_comp_runs')
    .insert({
      atletica_id: body.atletica_id,
      fase,
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
