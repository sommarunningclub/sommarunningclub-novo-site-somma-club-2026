import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      nome_completo,
      email,
      telefone,
      cpf,
      sexo,
      pelotao,
      data_do_evento,
      nome_do_evento,
    } = body

    // Validação básica
    if (!nome_completo || !email || !telefone || !cpf || !sexo || !pelotao) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Inserir na tabela checkins
    const { data, error } = await supabase
      .from('checkins')
      .insert([
        {
          nome_completo,
          email,
          telefone,
          cpf,
          sexo,
          pelotao,
          data_do_evento: data_do_evento || '2026-03-07',
          nome_do_evento: nome_do_evento || 'Somma Club',
          data_hora_checkin: new Date().toISOString(),
          validacao_do_checkin: false,
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Erro ao inserir check-in:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar check-in' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Erro no servidor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
