import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const EVENT_SLUG = 'catcher-run-2026'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      full_name,
      email,
      whatsapp,
      cpf,
      birth_date,
      gender,
      running_level,
      referral_source,
      lgpd_accepted,
    } = body

    // Basic validation
    if (!full_name || !email || !whatsapp || !cpf || !birth_date || !gender || !running_level) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando.' },
        { status: 400 }
      )
    }

    if (!lgpd_accepted) {
      return NextResponse.json(
        { error: 'É necessário aceitar os termos para se inscrever.' },
        { status: 400 }
      )
    }

    // Check for duplicate email in this event
    const emailLimpo = email.trim().toLowerCase()
    const { data: existing } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_slug', EVENT_SLUG)
      .eq('email', emailLimpo)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Você já está inscrito neste evento! Nos vemos no dia 25.' },
        { status: 409 }
      )
    }

    // Check duplicate CPF
    const cpfLimpo = cpf.replace(/\D/g, '')
    const { data: existingCpf } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_slug', EVENT_SLUG)
      .or(`cpf.eq.${cpfLimpo},cpf.eq.${cpf}`)
      .limit(1)

    if (existingCpf && existingCpf.length > 0) {
      return NextResponse.json(
        { error: 'Este CPF já está cadastrado no evento! Nos vemos no dia 25.' },
        { status: 409 }
      )
    }

    // Insert registration
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([
        {
          full_name: full_name.trim(),
          email: emailLimpo,
          whatsapp: whatsapp.replace(/\D/g, ''),
          cpf: cpfLimpo,
          birth_date,
          gender,
          running_level,
          referral_source: referral_source || null,
          lgpd_accepted: true,
          event_slug: EVENT_SLUG,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('[catcher-run] Erro ao inserir inscrição:', error.message)
      return NextResponse.json(
        { error: 'Erro ao salvar inscrição. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('[catcher-run] Erro no servidor:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
