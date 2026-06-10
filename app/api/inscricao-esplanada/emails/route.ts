import { NextRequest, NextResponse } from 'next/server'
import { validateEsplanadaCode, esplanadaAuthError } from '@/lib/auth/admin-codes'

export const dynamic = 'force-dynamic'

interface ResendEmail {
  id: string
  to: string[]
  subject: string
  created_at: string
  last_event: string
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!process.env.ESPLANADA_ADMIN_SECRET) {
      return NextResponse.json({ error: 'ESPLANADA_ADMIN_SECRET não configurada no servidor.' }, { status: 500 })
    }
    if (!validateEsplanadaCode(code)) {
      return esplanadaAuthError()
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Resend não configurado' }, { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails?limit=100', {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Falha ao consultar Resend' }, { status: 502 })
    }
    const json = await res.json()
    const all: ResendEmail[] = json.data || []

    // Só os e-mails da collab Esplanada Run
    const emails = all.filter((e) => (e.subject || '').toLowerCase().includes('esplanada run'))

    const statusCount: Record<string, number> = {}
    for (const e of emails) {
      const s = e.last_event || 'desconhecido'
      statusCount[s] = (statusCount[s] || 0) + 1
    }

    const total = emails.length
    const entregues = statusCount['delivered'] || 0
    const bounces = statusCount['bounced'] || 0
    const taxaEntrega = total > 0 ? Math.round((entregues / total) * 100) : 0

    const lista = emails.map((e) => ({
      id: e.id,
      to: e.to?.[0] || '',
      status: e.last_event || 'desconhecido',
      created_at: e.created_at,
    }))

    return NextResponse.json({
      success: true,
      resumo: {
        total,
        entregues,
        bounces,
        taxaEntrega,
        porStatus: Object.entries(statusCount).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
      },
      lista,
      hasMore: json.has_more === true,
      geradoEm: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
