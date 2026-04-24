import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventoId = searchParams.get('evento_id')

    if (!eventoId) {
      return NextResponse.json({ habilitada: false }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('eventos')
      .select('transferencia_habilitada')
      .eq('id', eventoId)
      .single()

    if (error || !data) {
      return NextResponse.json({ habilitada: false })
    }

    return NextResponse.json({ habilitada: !!data.transferencia_habilitada })
  } catch {
    return NextResponse.json({ habilitada: false })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { evento_id, habilitada } = await req.json()

    if (!evento_id || typeof habilitada !== 'boolean') {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('eventos')
      .update({ transferencia_habilitada: habilitada })
      .eq('id', evento_id)
      .select('id, transferencia_habilitada')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, habilitada: data.transferencia_habilitada })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
