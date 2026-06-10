import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'
import { isStaffAuthorized } from '@/lib/wings-cronometragem/auth'

// POST /api/wings-comp/reset
// Body: { escopo: 'runs' | 'tudo', confirmacao: 'ZERAR' }
//   - 'runs'  → apaga só as runs (mantém atléticas e atletas cadastrados)
//   - 'tudo'  → apaga runs + atletas + atléticas (recomeça do zero)
export async function POST(req: NextRequest) {
  if (!(await isStaffAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (body?.confirmacao !== 'ZERAR') {
    return NextResponse.json(
      { error: 'Confirmação obrigatória. Envie {"confirmacao":"ZERAR"}.' },
      { status: 400 }
    )
  }
  if (body.escopo !== 'runs' && body.escopo !== 'tudo') {
    return NextResponse.json({ error: 'escopo deve ser "runs" ou "tudo".' }, { status: 400 })
  }

  const supabase = getServiceClient()

  // Delete não suporta WHERE TRUE em supabase-js; usamos não-NULL no PK.
  const { error: errRuns } = await supabase
    .from('wings_comp_runs')
    .delete()
    .not('id', 'is', null)
  if (errRuns) return NextResponse.json({ error: errRuns.message }, { status: 500 })

  if (body.escopo === 'tudo') {
    const { error: errAtletas } = await supabase
      .from('wings_comp_atletas')
      .delete()
      .not('id', 'is', null)
    if (errAtletas) return NextResponse.json({ error: errAtletas.message }, { status: 500 })

    const { error: errAtleticas } = await supabase
      .from('wings_comp_atleticas')
      .delete()
      .not('id', 'is', null)
    if (errAtleticas) return NextResponse.json({ error: errAtleticas.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, escopo: body.escopo })
}
