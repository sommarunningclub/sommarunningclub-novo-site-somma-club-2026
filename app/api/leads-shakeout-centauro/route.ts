import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ORIGEM = 'shakeout-centauro-somma-rj'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const nome_completo = String(body.nome_completo ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const telefone = String(body.telefone ?? '').trim()
    const cidade = String(body.cidade ?? '').trim()
    const instagram = body.instagram ? String(body.instagram).trim().replace(/^@/, '') : null
    const conhecia_somma = Boolean(body.conhecia_somma)
    const aceite_comunicacoes = Boolean(body.aceite_comunicacoes)

    // Validação de obrigatórios
    if (!nome_completo || !email || !telefone || !cidade) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando: nome, e-mail, WhatsApp e cidade.' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      console.error('[shakeout] Variáveis de ambiente Supabase não configuradas')
      return NextResponse.json({ error: 'Erro ao configurar banco de dados' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    // Dedup suave por e-mail nesta ativação: se já existe, trata como sucesso (idempotente)
    const { data: existing, error: checkError } = await supabase
      .from('leads_shakeout_centauro')
      .select('id')
      .eq('origem', ORIGEM)
      .eq('email', email)
      .limit(1)

    if (checkError) {
      console.error('[shakeout] Erro ao verificar check-in existente:', checkError)
      return NextResponse.json(
        { error: 'Erro ao validar check-in: ' + checkError.message },
        { status: 500 }
      )
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: true, already: true })
    }

    const { data, error } = await supabase
      .from('leads_shakeout_centauro')
      .insert([
        {
          nome_completo,
          email,
          telefone,
          cidade,
          instagram,
          conhecia_somma,
          aceite_comunicacoes,
          status: 'confirmado',
          origem: ORIGEM,
        },
      ])
      .select()

    if (error) {
      console.error('[shakeout] Erro ao inserir check-in:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar check-in: ' + error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[shakeout] Erro na API de check-in:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
