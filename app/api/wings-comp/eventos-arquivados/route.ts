import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'
import { isStaffAuthorized } from '@/lib/wings-cronometragem/auth'

export async function GET(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const supabase = getServiceClient()

  if (id) {
    const { data, error } = await supabase
      .from('wings_eventos_arquivados')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ evento: data })
  }

  const { data, error } = await supabase
    .from('wings_eventos_arquivados')
    .select('id, nome, descricao, data_evento, total_atleticas, total_runs, created_at')
    .order('data_evento', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ eventos: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  const nome = (body?.nome ?? '').trim()
  if (!nome) return NextResponse.json({ error: 'Nome obrigatório.' }, { status: 400 })

  const descricao = body?.descricao?.trim() || null
  const data_evento = body?.data_evento || null

  const supabase = getServiceClient()

  // Captura snapshot do estado atual
  const [aR, atR, rR, cR] = await Promise.all([
    supabase.from('wings_comp_atleticas').select('*'),
    supabase.from('wings_comp_atletas').select('*'),
    supabase.from('wings_comp_runs').select('*'),
    supabase.from('wings_comp_config').select('*').eq('id', 'singleton').single(),
  ])

  if (aR.error) return NextResponse.json({ error: aR.error.message }, { status: 500 })
  if (atR.error) return NextResponse.json({ error: atR.error.message }, { status: 500 })
  if (rR.error) return NextResponse.json({ error: rR.error.message }, { status: 500 })

  const snapshot = {
    atleticas: aR.data ?? [],
    atletas: atR.data ?? [],
    runs: rR.data ?? [],
    config: cR.data ?? null,
    arquivado_em: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('wings_eventos_arquivados')
    .insert({
      nome,
      descricao,
      data_evento,
      snapshot,
      total_atleticas: snapshot.atleticas.length,
      total_runs: snapshot.runs.length,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ evento: data })
}

export async function DELETE(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  const supabase = getServiceClient()
  const { error } = await supabase.from('wings_eventos_arquivados').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
