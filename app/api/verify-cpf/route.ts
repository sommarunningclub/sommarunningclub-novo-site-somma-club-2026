import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { cpf } = await request.json()

    if (!cpf) {
      return NextResponse.json({ found: false, error: 'CPF não informado' }, { status: 400 })
    }

    // Normaliza o CPF removendo pontuação para comparação
    const cpfLimpo = cpf.replace(/\D/g, '')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ found: false, error: 'Erro de configuração' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Busca pelo CPF com ou sem formatação
    const { data, error } = await supabase
      .from('cadastro_site')
      .select('cpf')
      .or(`cpf.eq.${cpfLimpo},cpf.eq.${cpf}`)
      .limit(1)

    if (error) {
      console.error('[v0] Erro ao buscar CPF:', error)
      return NextResponse.json({ found: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ found: data && data.length > 0 })
  } catch (error) {
    console.error('[v0] Erro na API verify-cpf:', error)
    return NextResponse.json({ found: false, error: 'Erro interno' }, { status: 500 })
  }
}
