import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { isValidCPF } from '@/lib/cpf'

const ORIGEM = 'shakeout-centauro-somma-rj'
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const nome_completo = String(body.nome_completo ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const telefone = String(body.telefone ?? '').trim()
    const uf = String(body.uf ?? '').trim().toUpperCase()
    const cpfDigits = String(body.cpf ?? '').replace(/\D/g, '')
    const conhecia_somma = Boolean(body.conhecia_somma)
    const aceite_lgpd = Boolean(body.aceite_lgpd)
    const aceite_comunicacoes = Boolean(body.aceite_comunicacoes)

    // Validação
    if (!nome_completo || !email || !telefone || !uf || !cpfDigits) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
    }
    if (!UFS.includes(uf)) {
      return NextResponse.json({ error: 'UF inválida.' }, { status: 400 })
    }
    if (!isValidCPF(cpfDigits)) {
      return NextResponse.json({ error: 'CPF inválido. Confira os números digitados.' }, { status: 400 })
    }
    if (!aceite_lgpd) {
      return NextResponse.json({ error: 'É necessário aceitar os termos da LGPD.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      console.error('[shakeout] Variáveis de ambiente Supabase não configuradas')
      return NextResponse.json({ error: 'Erro ao configurar banco de dados' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    // Dedup por CPF nesta ativação (idempotente)
    const { data: existing, error: checkError } = await supabase
      .from('leads_shakeout_centauro')
      .select('id')
      .eq('origem', ORIGEM)
      .eq('cpf', cpfDigits)
      .limit(1)

    if (checkError) {
      console.error('[shakeout] Erro ao verificar check-in existente:', checkError)
      return NextResponse.json({ error: 'Erro ao validar check-in: ' + checkError.message }, { status: 500 })
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
          uf,
          cpf: cpfDigits,
          conhecia_somma,
          aceite_lgpd,
          aceite_comunicacoes,
          status: 'confirmado',
          origem: ORIGEM,
        },
      ])
      .select()

    if (error) {
      console.error('[shakeout] Erro ao inserir check-in:', error)
      return NextResponse.json({ error: 'Erro ao salvar check-in: ' + error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[shakeout] Erro na API de check-in:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
