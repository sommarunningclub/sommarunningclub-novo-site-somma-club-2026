import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { computeScore, statusFromScore, buildDuplicateGroups, type InscritoFraud } from '@/lib/esplanada-fraud'
import { validateEsplanadaCode, esplanadaAuthError } from '@/lib/auth/admin-codes'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!process.env.ESPLANADA_ADMIN_SECRET) {
      return NextResponse.json({ error: 'ESPLANADA_ADMIN_SECRET não configurada no servidor.' }, { status: 500 })
    }
    if (!validateEsplanadaCode(code)) {
      return esplanadaAuthError()
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ error: 'Erro de configuração' }, { status: 500 })
    const supabase = createClient(url, key)

    const { data, error } = await supabase
      .from('inscricoes_esplanada_run')
      .select('id, nome, cpf, email, telefone, data_nascimento, cidade, estado, status, revisado, risk_score, fraud_reason, duplicate_group_id')
    if (error) {
      const msg = /(schema cache|does not exist|column)/i.test(error.message)
        ? 'As colunas de auditoria ainda não foram criadas. Rode a migration de auditoria no Supabase.'
        : error.message
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const rows = (data || []) as (InscritoFraud & { status?: string; revisado?: boolean })[]

    // Grupos de duplicidade (union-find por sinais fortes); group id = id do registro raiz
    const groups = buildDuplicateGroups(rows)
    const memberToGroup = new Map<string, string>()
    groups.forEach((members, root) => members.forEach((m) => memberToGroup.set(m, root)))

    const payloads = rows.map((r) => {
      const { score, reasons } = computeScore(r, rows)
      const autoStatus = statusFromScore(score)
      const group = memberToGroup.get(r.id) || null
      // Revisão manual sempre vence sobre o status automático
      const finalStatus = r.revisado ? (r.status || 'ativo') : autoStatus
      return {
        id: r.id,
        status: finalStatus,
        risk_score: score,
        fraud_reason: reasons.length ? reasons.join(' + ') : null,
        duplicate_group_id: group,
      }
    })

    // Persiste com UPDATE por linha (upsert exigiria todas as colunas NOT NULL).
    // Atualiza apenas o que mudou, em lotes paralelos.
    const existing = new Map(rows.map((r) => [r.id, r]))
    const mudou = payloads.filter((p) => {
      const e = existing.get(p.id) as Record<string, unknown>
      return !e || e.status !== p.status || e.risk_score !== p.risk_score || e.fraud_reason !== p.fraud_reason || e.duplicate_group_id !== p.duplicate_group_id
    })
    const chunkSize = 25
    for (let i = 0; i < mudou.length; i += chunkSize) {
      const chunk = mudou.slice(i, i + chunkSize)
      const results = await Promise.all(chunk.map((p) =>
        supabase.from('inscricoes_esplanada_run')
          .update({ status: p.status, risk_score: p.risk_score, fraud_reason: p.fraud_reason, duplicate_group_id: p.duplicate_group_id })
          .eq('id', p.id),
      ))
      const failed = results.find((r) => r.error)
      if (failed?.error) return NextResponse.json({ error: 'Erro ao salvar auditoria: ' + failed.error.message }, { status: 400 })
    }

    const resumo = {
      total: payloads.length,
      suspeitos: payloads.filter((p) => p.status === 'suspeito').length,
      duplicados: payloads.filter((p) => p.status === 'duplicado').length,
      grupos: groups.size,
      geradoEm: new Date().toISOString(),
    }
    return NextResponse.json({ success: true, resumo })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
