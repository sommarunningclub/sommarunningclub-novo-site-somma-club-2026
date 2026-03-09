import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busca = searchParams.get('busca') || ''

    let query = supabase
      .from('cadastro_site')
      .select('id, nome_completo, email, whatsapp, cpf, sexo, data_nascimento, cep, data_de_cadastro')
      .order('id', { ascending: false })

    if (busca) {
      query = query.or(
        `nome_completo.ilike.%${busca}%,email.ilike.%${busca}%,cpf.ilike.%${busca}%,whatsapp.ilike.%${busca}%`
      )
    }

    const { data, error } = await query.limit(200)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ membros: data || [] })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
