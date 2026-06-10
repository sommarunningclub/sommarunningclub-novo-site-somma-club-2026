import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

import { validateEsplanadaCode, esplanadaAuthError } from '@/lib/auth/admin-codes'

export const dynamic = 'force-dynamic'

const STATUS_VALIDOS = ['ativo', 'duplicado', 'suspeito', 'cancelado', 'revisao_manual']

export async function POST(request: NextRequest) {
  try {
    const { code, id, status, observacao_interna, reviewed_by } = await request.json()
    if (!process.env.ESPLANADA_ADMIN_SECRET) {
      return NextResponse.json({ error: 'ESPLANADA_ADMIN_SECRET não configurada no servidor.' }, { status: 500 })
    }
    if (!validateEsplanadaCode(code)) return esplanadaAuthError()
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
