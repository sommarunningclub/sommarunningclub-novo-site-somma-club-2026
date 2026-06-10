import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

import { validateEsplanadaCode, esplanadaAuthError } from '@/lib/auth/admin-codes'

export const dynamic = 'force-dynamic'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// Leitura pública: o formulário consulta se as inscrições estão abertas
export async function GET() {
  const supabase = getClient()
  if (!supabase) return NextResponse.json({ aberto: true })
  const { data } = await supabase
    .from('config_esplanada')
    .select('inscricoes_abertas')
    .limit(1)
    .maybeSingle()
  return NextResponse.json({ aberto: data ? data.inscricoes_abertas !== false : true })
}

// Alteração protegida pelo código (usado no /status)
export async function POST(request: NextRequest) {
  try {
    const { code, aberto } = await request.json()
    if (!process.env.ESPLANADA_ADMIN_SECRET) {
      return NextResponse.json({ error: 'ESPLANADA_ADMIN_SECRET não configurada no servidor.' }, { status: 500 })
    }
    if (!validateEsplanadaCode(code)) {
      return esplanadaAuthError()
    }
    const supabase = getClient()
    if (!supabase) return NextResponse.json({ error: 'Erro de configuração' }, { status: 500 })

    const { error } = await supabase
      .from('config_esplanada')
      .upsert({ id: 1, inscricoes_abertas: !!aberto, updated_at: new Date().toISOString() })

    if (error) {
      const msg = /config_esplanada/.test(error.message) && /(schema cache|does not exist|find the table)/i.test(error.message)
        ? 'A tabela de configuração ainda não foi criada no banco. Rode a migration config_esplanada no Supabase.'
        : error.message
      return NextResponse.json({ error: msg }, { status: 400 })
    }
    return NextResponse.json({ success: true, aberto: !!aberto })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
