import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[v0] Corpo completo recebido:', body)

    const { nome, email, whatsapp, data_nascimento, sexo, cpf, cep } = body

    // Validação com conversão para string e trim
    const nomeTrimmed = String(nome || '').trim()
    const emailTrimmed = String(email || '').trim()
    const whatsappTrimmed = String(whatsapp || '').trim()

    console.log('[v0] Valores após validação:', {
      nomeTrimmed: `"${nomeTrimmed}" (comprimento: ${nomeTrimmed.length})`,
      emailTrimmed: `"${emailTrimmed}" (comprimento: ${emailTrimmed.length})`,
      whatsappTrimmed: `"${whatsappTrimmed}" (comprimento: ${whatsappTrimmed.length})`
    })

    if (!nomeTrimmed || !emailTrimmed || !whatsappTrimmed) {
      console.error('[v0] Validação falhou - campo obrigatório vazio')
      return NextResponse.json(
        { error: 'Nome, email e WhatsApp são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('[v0] Validação passou, inserindo no Supabase...')

    // Inserir na tabela cadastro_site (sem bairro - já foi deletado)
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

    console.log('[v0] Cadastro realizado com sucesso:', data)
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
