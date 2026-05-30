import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ACCESS_CODE = 'somma@2026'
const STATUS_VALIDOS = ['ativo', 'duplicado', 'suspeito', 'cancelado', 'revisao_manual']

export async function POST(request: NextRequest) {
  try {
    const { code, id, status, observacao_interna, reviewed_by } = await request.json()
    if (code !== ACCESS_CODE) return NextResponse.json({ error: 'Código inválido' }, { status: 401 })
    if (!id) return NextResponse.json({ error: 'ID não informado' }, { status: 400 })
    if (status && !STATUS_VALIDOS.includes(status)) return NextResponse.json({ error: 'Status inválido' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ error: 'Erro de configuração' }, { status: 500 })
    const supabase = createClient(url, key)

    const patch: Record<string, unknown> = {
      revisado: true,
      reviewed_at: new Date().toISOString(),
      reviewed_by: (reviewed_by && String(reviewed_by).trim()) || 'painel-status',
    }
    if (status) patch.status = status
    if (observacao_interna !== undefined) patch.observacao_interna = String(observacao_interna)

    const { data, error } = await supabase
      .from('inscricoes_esplanada_run')
      .update(patch)
      .eq('id', id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    if (!data || data.length === 0) return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 })
    return NextResponse.json({ success: true, data: data[0] })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
