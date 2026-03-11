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

    // Inserir dados na tabela crm_leads
    const { data: crmData, error: crmError } = await supabase
      .from('crm_leads')
      .insert([
        {
          name: nome,
          email,
          phone: telefone,
          cnpj: tipo_documento === 'cnpj' ? documento : null,
          company_name: nome_fantasia || razao_social || null,
          description: descricao,
          stage: 'novo_lead',
          position: 0,
          created_by: 'website',
          origem: 'site',
        },
      ])
      .select()

    if (crmError) {
      console.error('[v0] Erro ao inserir em crm_leads:', crmError)
      // Não retorna erro, pois o lead foi criado na tabela principal
      console.log('[v0] Lead não foi sincronizado com CRM, mas candidatura foi salva')
    }

    console.log('[v0] Candidatura de parceiro salva com sucesso:', data)
    if (crmData) {
      console.log('[v0] Lead sincronizado com CRM:', crmData)
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Erro na API seja-parceiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
