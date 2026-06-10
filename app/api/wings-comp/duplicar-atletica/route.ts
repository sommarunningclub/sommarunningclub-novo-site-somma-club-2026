import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'
import { isStaffAuthorized } from '@/lib/wings-cronometragem/auth'

// POST /api/wings-comp/duplicar-atletica { id }
// Cria uma cópia da atlética com sufixo "(2)", incluindo os atletas cadastrados.
// Útil para baterias paralelas ou quando precisa de uma equipe espelho.
export async function POST(req: NextRequest) {
  if (!(await isStaffAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  const supabase = getServiceClient()
  const { data: orig, error: errOrig } = await supabase
    .from('wings_comp_atleticas')
    .select('*')
    .eq('id', body.id)
    .single()
  if (errOrig || !orig) return NextResponse.json({ error: 'Atlética não encontrada.' }, { status: 404 })

  const { data: atletas } = await supabase
    .from('wings_comp_atletas')
    .select('*')
    .eq('atletica_id', body.id)

  // Encontra próximo sufixo livre
  const baseNome = orig.nome.replace(/ \(\d+\)$/, '')
  const { data: similares } = await supabase
    .from('wings_comp_atleticas')
    .select('nome')
    .ilike('nome', `${baseNome}%`)
  let n = 2
  while ((similares ?? []).some(s => s.nome === `${baseNome} (${n})`)) n++

  const { data: nova, error: errNova } = await supabase
    .from('wings_comp_atleticas')
    .insert({
      nome: `${baseNome} (${n})`,
      sigla: orig.sigla,
      cor: orig.cor,
      foto_url: orig.foto_url,
    })
    .select('*')
    .single()
  if (errNova) return NextResponse.json({ error: errNova.message }, { status: 500 })

  if (atletas && atletas.length > 0) {
    const novosAtletas = atletas.map(a => ({
      atletica_id: nova.id,
      nome: a.nome,
      sexo: a.sexo,
      modalidade: a.modalidade,
    }))
    const { error: errCopy } = await supabase.from('wings_comp_atletas').insert(novosAtletas)
    if (errCopy) {
      // rollback parcial
      await supabase.from('wings_comp_atleticas').delete().eq('id', nova.id)
      return NextResponse.json({ error: errCopy.message }, { status: 500 })
    }
  }

  return NextResponse.json({ atletica: nova, atletas_copiados: atletas?.length ?? 0 })
}
