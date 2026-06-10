import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/wings/supabase'
import { GENDER_LABEL, CHECKIN_STATUS_LABEL } from '@/lib/wings/validations'
import { isWingsAdminAuthorized } from '@/lib/auth/wings-admin'

export const dynamic = 'force-dynamic'

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET(req: NextRequest) {
  if (!isWingsAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('wings_registrations')
    .select(`
      full_name, phone, cpf, gender,
      checkin_status, checkin_at, checkin_by, registration_token, created_at,
      institution:institutions ( name ),
      atletica:atleticas ( name )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const headers = [
    'Nome', 'Telefone', 'CPF', 'Sexo', 'Instituição', 'Atlética',
    'Status', 'Check-in em', 'Check-in por', 'Token', 'Inscrito em',
  ]
  const rows = (data ?? []).map((r: any) => [
    r.full_name,
    r.phone,
    r.cpf,
    GENDER_LABEL[r.gender as keyof typeof GENDER_LABEL] ?? r.gender,
    r.institution?.name ?? '',
    r.atletica?.name ?? '',
    CHECKIN_STATUS_LABEL[r.checkin_status as keyof typeof CHECKIN_STATUS_LABEL] ?? r.checkin_status,
    r.checkin_at ?? '',
    r.checkin_by ?? '',
    r.registration_token,
    r.created_at,
  ])

  const csv = [headers, ...rows].map(line => line.map(csvEscape).join(',')).join('\n')
  const bom = '﻿' // Excel BR

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="wings-atleticas-2026-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
