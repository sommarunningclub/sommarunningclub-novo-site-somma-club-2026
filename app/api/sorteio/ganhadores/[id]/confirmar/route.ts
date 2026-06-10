import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { requireInsiderAuth } from '@/lib/auth/insider'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireInsiderAuth()
  if (!auth.ok) return auth.response

  try {
    const { id } = await params

    const { error } = await supabase
      .from('sorteio_ganhadores')
      .update({
        status: 'confirmado',
        confirmado_em: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
