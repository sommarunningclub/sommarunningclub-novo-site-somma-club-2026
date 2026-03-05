import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { nome_completo, email, cpf, whatsapp, data_nascimento, sexo } = await request.json()

    // Validação básica
    if (!nome_completo || !email || !cpf || !whatsapp) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando: nome_completo, email, cpf, whatsapp' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[v0] Variáveis de ambiente Supabase não configuradas')
      return NextResponse.json(
        { error: 'Erro ao configurar banco de dados' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Inserir dados na tabela cadastro_site com data de cadastro
    const { data, error } = await supabase
      .from('cadastro_site')
      .insert([
        {
          nome_completo,
          email,
          cpf,
          whatsapp,
          data_nascimento: data_nascimento || null,
          sexo: sexo || null,
          cep: null,
          data_de_cadastro: new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T') + '-03:00',
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Erro ao inserir em cadastro_site:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar cadastro: ' + error.message },
        { status: 400 }
      )
    }

    console.log('[v0] Cadastro salvo com sucesso:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Erro na API de cadastro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
