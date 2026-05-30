import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ACCESS_CODE = 'somma@2026'
const SEXO = ['M', 'F']
const TIPO_KIT = ['UNICO', 'UNICO_PCD']
const MODALIDADE = ['3KM', '5KM', '10KM']
const CAMISETA = ['P', 'M', 'G', 'GG', 'XG']
const NACIONALIDADE = ['Brasileiro', 'Estrangeiro']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, id, dados } = body

    if (code !== ACCESS_CODE) {
      return NextResponse.json({ error: 'Código inválido' }, { status: 401 })
    }
    if (!id) {
      return NextResponse.json({ error: 'ID não informado' }, { status: 400 })
    }

    const {
      nome, email, cpf, telefone, sexo, data_nascimento,
      tipo_kit, modalidade, tamanho_camiseta, cidade, estado, regiao, nacionalidade,
    } = dados || {}

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

    if (!SEXO.includes(sexo)) return NextResponse.json({ error: 'Sexo inválido' }, { status: 400 })
    if (!TIPO_KIT.includes(tipo_kit)) return NextResponse.json({ error: 'Tipo de kit inválido' }, { status: 400 })
    if (!MODALIDADE.includes(modalidade)) return NextResponse.json({ error: 'Modalidade inválida' }, { status: 400 })
    if (!CAMISETA.includes(tamanho_camiseta)) return NextResponse.json({ error: 'Tamanho de camiseta inválido' }, { status: 400 })
    if (!NACIONALIDADE.includes(nacionalidade)) return NextResponse.json({ error: 'Nacionalidade inválida' }, { status: 400 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Erro de configuração do banco' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('inscricoes_esplanada_run')
      .update({
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
        estado,
        regiao,
        nacionalidade,
      })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: 'Erro ao atualizar: ' + error.message }, { status: 400 })
    }
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
