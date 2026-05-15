import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function syncToCadastroSite(params: {
  nome_completo: string
  email: string
  cpf: string
  telefone: string
  sexo: string
}) {
  const cpfDigits = String(params.cpf).replace(/\D/g, '')
  if (cpfDigits.length !== 11) return

  const cpfFormatted = cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

  // Verifica se CPF já existe em qualquer formato salvo historicamente
  const { data: existing, error: checkError } = await supabase
    .from('cadastro_site')
    .select('id')
    .in('cpf', [cpfDigits, cpfFormatted, params.cpf])
    .limit(1)

  if (checkError) {
    console.error('[v0] Erro ao verificar cadastro_site:', checkError)
    return
  }

  if (existing && existing.length > 0) return

  const dataCadastro = new Date()
    .toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
    .replace(' ', 'T') + '-03:00'

  const { error: insertError } = await supabase.from('cadastro_site').insert([
    {
      nome_completo: params.nome_completo,
      email: params.email,
      cpf: cpfFormatted,
      whatsapp: params.telefone,
      data_nascimento: null,
      sexo: params.sexo || null,
      cep: null,
      data_de_cadastro: dataCadastro,
    },
  ])

  if (insertError && (insertError as { code?: string }).code !== '23505') {
    console.error('[v0] Erro ao inserir em cadastro_site via checkin:', insertError)
  }
}

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
      evento_id,
    } = body

    // Validação básica
    if (!nome_completo || !email || !telefone || !cpf || !sexo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar duplicidade: mesmo CPF + mesmo evento
    if (evento_id) {
      const cpfLimpo = cpf.replace(/\D/g, '')
      const { data: existing } = await supabase
        .from('checkins')
        .select('id')
        .eq('evento_id', evento_id)
        .or(`cpf.eq.${cpfLimpo},cpf.eq.${cpf}`)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Você já está inscrito neste evento. Cada CPF pode ser cadastrado apenas uma vez por evento.' },
          { status: 409 }
        )
      }
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
          pelotao: pelotao || null,
          data_do_evento: data_do_evento || '',
          nome_do_evento: nome_do_evento || '',
          evento_id: evento_id || null,
          data_hora_checkin: new Date().toISOString(),
          validacao_do_checkin: false,
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Erro ao inserir check-in:', error.message, error.details, error.hint)
      return NextResponse.json(
        { error: `Erro ao salvar check-in: ${error.message}` },
        { status: 500 }
      )
    }

    // Sincroniza com cadastro_site se o CPF ainda não estiver lá.
    // Não bloqueia a resposta: falhas aqui não devem afetar o check-in.
    syncToCadastroSite({ nome_completo, email, cpf, telefone, sexo }).catch((err) => {
      console.error('[v0] Falha ao sincronizar com cadastro_site:', err)
    })

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
