import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendInscricaoEsplanadaEmail } from '@/lib/emails/inscricao-esplanada'
import { computeScore, statusFromScore } from '@/lib/esplanada-fraud'

const SEXO = ['M', 'F']
const TIPO_KIT = ['UNICO', 'UNICO_PCD']
const MODALIDADE = ['3KM', '5KM', '10KM']
const CAMISETA = ['P', 'M', 'G', 'GG', 'XG']
const NACIONALIDADE = ['Brasileiro', 'Estrangeiro']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nome,
      email,
      cpf,
      telefone,
      sexo,
      data_nascimento,
      tipo_kit,
      modalidade,
      tamanho_camiseta,
      cidade,
      estado,
      regiao,
      nacionalidade,
    } = body

    // Validação de obrigatórios
    const obrigatorios = { nome, email, cpf, telefone, sexo, data_nascimento, tipo_kit, modalidade, tamanho_camiseta, cidade, estado, regiao, nacionalidade }
    for (const [campo, valor] of Object.entries(obrigatorios)) {
      if (!valor || String(valor).trim() === '') {
        return NextResponse.json({ error: `Campo obrigatório faltando: ${campo}` }, { status: 400 })
      }
    }

    const cpfDigits = String(cpf).replace(/\D/g, '')
    if (cpfDigits.length !== 11) {
      return NextResponse.json({ error: 'CPF inválido. Informe os 11 dígitos.' }, { status: 400 })
    }
    const cpfFormatted = cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

    // Validação de domínios (dropdowns)
    if (!SEXO.includes(sexo)) return NextResponse.json({ error: 'Sexo inválido' }, { status: 400 })
    if (!TIPO_KIT.includes(tipo_kit)) return NextResponse.json({ error: 'Tipo de kit inválido' }, { status: 400 })
    if (!MODALIDADE.includes(modalidade)) return NextResponse.json({ error: 'Modalidade inválida' }, { status: 400 })
    if (!CAMISETA.includes(tamanho_camiseta)) return NextResponse.json({ error: 'Tamanho de camiseta inválido' }, { status: 400 })
    if (!NACIONALIDADE.includes(nacionalidade)) return NextResponse.json({ error: 'Nacionalidade inválida' }, { status: 400 })

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      console.error('[esplanada] Variáveis de ambiente Supabase não configuradas')
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceKey)

    // Inscrições fechadas?
    const { data: cfg } = await supabase
      .from('config_esplanada')
      .select('inscricoes_abertas')
      .limit(1)
      .maybeSingle()
    if (cfg && cfg.inscricoes_abertas === false) {
      return NextResponse.json({ error: 'INSCRICOES_FECHADAS', message: 'As inscrições foram encerradas. Todas as vagas foram preenchidas.' }, { status: 403 })
    }

    // CPF é o identificador principal: bloqueio rígido por CPF.
    const emailNorm = String(email).trim().toLowerCase()
    const telefoneNorm = String(telefone).trim()
    const { data: todos } = await supabase
      .from('inscricoes_esplanada_run')
      .select('id, nome, cpf, email, telefone, data_nascimento, cidade, estado')

    const lista = todos || []
    const cpfDup = lista.some((r) => (r.cpf || '').replace(/\D/g, '') === cpfDigits)
    if (cpfDup) {
      return NextResponse.json({ error: 'Já existe uma inscrição vinculada a este CPF.' }, { status: 409 })
    }

    // E-mail / telefone / nome NÃO bloqueiam: apenas calculam score e marcam suspeito.
    const novo = {
      id: 'novo',
      nome: String(nome).trim(),
      cpf: cpfFormatted,
      email: emailNorm,
      telefone: telefoneNorm,
      data_nascimento: String(data_nascimento).trim(),
      cidade: String(cidade).trim(),
      estado: String(estado).trim(),
    }
    const { score, reasons } = computeScore(novo, lista as never)
    const statusInicial = statusFromScore(score)

    const { data, error } = await supabase
      .from('inscricoes_esplanada_run')
      .insert([
        {
          nome: String(nome).trim(),
          email: String(email).trim().toLowerCase(),
          cpf: cpfFormatted,
          telefone: String(telefone).trim(),
          sexo,
          data_nascimento: String(data_nascimento).trim(),
          tipo_kit,
          modalidade,
          tamanho_camiseta,
          cidade: String(cidade).trim(),
          estado: String(estado).trim(),
          regiao,
          nacionalidade,
          status: statusInicial,
          risk_score: score,
          fraud_reason: reasons.length ? reasons.join(' + ') : null,
          data_de_cadastro: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('[esplanada] Erro ao inserir inscrição:', error)
      return NextResponse.json({ error: 'Erro ao salvar inscrição: ' + error.message }, { status: 400 })
    }

    // Dispara e-mail de confirmação (não bloqueia a resposta em caso de falha)
    try {
      await sendInscricaoEsplanadaEmail({
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        cpf: cpfFormatted,
        modalidade,
        tipo_kit,
        tamanho_camiseta,
      })
    } catch (mailErr) {
      console.error('[esplanada] E-mail de confirmação falhou (inscrição salva mesmo assim):', mailErr)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[esplanada] Erro na API de inscrição:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
