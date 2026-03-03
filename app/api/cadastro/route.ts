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

    // Validação básica com trim
    const nomeTrimmed = nome?.trim()
    const emailTrimmed = email?.trim()
    const whatsappTrimmed = whatsapp?.trim()

    if (!nomeTrimmed || !emailTrimmed || !whatsappTrimmed) {
      console.error('[v0] Validação falhou:', { nome: nomeTrimmed, email: emailTrimmed, whatsapp: whatsappTrimmed })
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
          nome_completo: nomeTrimmed,
          email: emailTrimmed,
          whatsapp: whatsappTrimmed,
          data_nascimento: data_nascimento || null,
          sexo: sexo || null,
          cpf: cpf || null,
          bairro: bairro || null,
          cep: cep || null,
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json(
        { error: 'Erro ao registrar cadastro: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Cadastro realizado com sucesso', data },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
