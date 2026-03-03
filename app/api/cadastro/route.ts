import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { nome, email, whatsapp, data_nascimento, sexo, cpf, bairro, cep } = body

    // Validação básica
    if (!nome || !email || !whatsapp) {
      return NextResponse.json(
        { error: 'Nome, email e WhatsApp são obrigatórios' },
        { status: 400 }
      )
    }

    // Inserir na tabela cadastro_site
    const { data, error } = await supabase
      .from('cadastro_site')
      .insert([
        {
          nome_completo: nome,
          email,
          whatsapp,
          data_nascimento,
          sexo,
          cpf: cpf || null,
          bairro: bairro || null,
          cep: cep || null,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Erro ao registrar cadastro' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Cadastro realizado com sucesso', data },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
