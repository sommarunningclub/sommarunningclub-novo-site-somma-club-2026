import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { cpf } = await req.json()
    if (!cpf) return NextResponse.json({ error: 'CPF obrigatório' }, { status: 400 })

    const cpfLimpo = cpf.replace(/\D/g, '')

    const { data, error } = await supabase
      .from('dados_insiders')
      .select('id, nome, cpf')
      .or(`cpf.eq.${cpf},cpf.eq.${cpfLimpo}`)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'CPF não encontrado. Acesso negado.' }, { status: 401 })
    }

    return NextResponse.json({ success: true, insider: { id: data.id, nome: data.nome } })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
