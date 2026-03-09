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

    // Normaliza: remove tudo que não é dígito
    const cpfLimpo = cpf.replace(/\D/g, '')

    // Busca todos os insiders e filtra no JS para comparar CPF normalizado
    const { data: insiders, error } = await supabase
      .from('dados_insiders')
      .select('id, nome, cpf')

    if (error) {
      console.log('[v0] Erro ao buscar insiders:', error)
      return NextResponse.json({ error: 'Erro ao consultar banco de dados.' }, { status: 500 })
    }

    // Compara CPF removendo formatação de ambos os lados
    const insider = insiders?.find(
      (i) => i.cpf && i.cpf.replace(/\D/g, '') === cpfLimpo
    )

    if (!insider) {
      return NextResponse.json({ error: 'CPF não encontrado. Acesso negado.' }, { status: 401 })
    }

    return NextResponse.json({ success: true, insider: { id: insider.id, nome: insider.nome } })
  } catch (err) {
    console.log('[v0] Erro interno no login:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
