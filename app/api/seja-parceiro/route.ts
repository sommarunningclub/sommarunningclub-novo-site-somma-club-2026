import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { nome, email, telefone, tipo_documento, documento, instagram, descricao, razao_social, nome_fantasia, atividade_principal } = await request.json()

    // Validação básica
    if (!nome || !email || !telefone || !tipo_documento || !documento || !instagram || !descricao) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    // Validação de descrição mínima
    if (descricao.trim().length < 50) {
      return NextResponse.json(
        { error: 'Descrição deve ter no mínimo 50 caracteres' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[v0] Variáveis de ambiente Supabase não configuradas')
      return NextResponse.json(
        { error: 'Erro ao configurar banco de dados' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Inserir dados na tabela candidatos_parceiros
    const { data, error } = await supabase
      .from('candidatos_parceiros')
      .insert([
        {
          nome,
          email,
          telefone,
          tipo_documento,
          documento,
          razao_social: razao_social || null,
          nome_fantasia: nome_fantasia || null,
          atividade_principal: atividade_principal || null,
          instagram,
          descricao,
          criado_em: new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T') + '-03:00',
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Erro ao inserir em candidatos_parceiros:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar candidatura: ' + error.message },
        { status: 400 }
      )
    }

    console.log('[v0] Candidatura de parceiro salva com sucesso:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Erro na API seja-parceiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
