import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'
import { isStaffAuthorized } from '@/lib/wings-cronometragem/auth'

export async function GET() {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('wings_comp_atleticas')
    .select('*')
    .order('nome', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ atleticas: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body?.nome || typeof body.nome !== 'string') {
    return NextResponse.json({ error: 'Nome obrigatório.' }, { status: 400 })
  }
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('wings_comp_atleticas')
    .insert({
      nome: body.nome.trim(),
      sigla: body.sigla?.trim() || null,
      cor: body.cor || '#E30D3F',
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ atletica: data })
}

export async function DELETE(req: NextRequest) {
  if (!isStaffAuthorized()) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  const supabase = getServiceClient()
  const { error } = await supabase.from('wings_comp_atleticas').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
