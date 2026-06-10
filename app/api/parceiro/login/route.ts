import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { setParceiroSessionCookie } from '@/lib/auth/parceiro'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { codigo } = await req.json()
    if (!codigo) return NextResponse.json({ error: 'Código obrigatório' }, { status: 400 })

    const codigoNormalizado = codigo.trim().toUpperCase()

    const { data: rows, error } = await supabase
      .from('codigo_parceiro')
      .select('id, nome_parceiro, codigo, ativo')
      .eq('ativo', true)

    if (error) {
      return NextResponse.json({ error: 'Erro ao consultar banco de dados.' }, { status: 500 })
    }

    const parceiro = rows?.find(
      (p) => p.codigo?.trim().toUpperCase() === codigoNormalizado
    )

    if (!parceiro) {
      return NextResponse.json({ error: 'Código inválido ou inativo. Acesso negado.' }, { status: 401 })
    }

    await supabase
      .from('codigo_parceiro')
      .update({ last_access: new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T') + '-03:00' })
      .eq('id', parceiro.id)

    const session = { id: parceiro.id, nome: parceiro.nome_parceiro }
    await setParceiroSessionCookie(session)

    return NextResponse.json({ success: true, parceiro: { id: parceiro.id, nome: parceiro.nome_parceiro } })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
