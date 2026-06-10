import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

import { validateEsplanadaCode, esplanadaAuthError } from '@/lib/auth/admin-codes'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!process.env.ESPLANADA_ADMIN_SECRET) {
      return NextResponse.json({ error: 'ESPLANADA_ADMIN_SECRET não configurada no servidor.' }, { status: 500 })
    }
    if (!validateEsplanadaCode(code)) {
      return esplanadaAuthError()
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Erro de configuração do banco' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('inscricoes_esplanada_run')
      .select('*')
      .order('data_de_cadastro', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rows = data || []

    // Helpers de agregação
    const countBy = (key: string, norm?: (v: string) => string) => {
      const m: Record<string, number> = {}
      for (const r of rows) {
        let v = (r[key] ?? 'Não informado').toString().trim() || 'Não informado'
        if (norm) v = norm(v)
        m[v] = (m[v] || 0) + 1
      }
      return Object.entries(m)
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label, value }))
    }

    // Inscrições por dia (timeline)
    const porDiaMap: Record<string, number> = {}
    for (const r of rows) {
      const d = r.data_de_cadastro ? String(r.data_de_cadastro).slice(0, 10) : 'Não informado'
      porDiaMap[d] = (porDiaMap[d] || 0) + 1
    }
    const porDia = Object.entries(porDiaMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, value]) => ({ label, value }))

    const stats = {
      total: rows.length,
      porRegiao: countBy('regiao'),
      porSexo: countBy('sexo'),
      porModalidade: countBy('modalidade'),
      porTipoKit: countBy('tipo_kit'),
      porCamiseta: countBy('tamanho_camiseta'),
      porNacionalidade: countBy('nacionalidade'),
      porEstado: countBy('estado'),
      porCidade: countBy('cidade').slice(0, 15),
      porDia,
      // Lista completa (já ordenada do mais recente para o mais antigo) para busca/tabela
      inscritos: rows.map((r) => ({
        id: r.id,
        nome: r.nome,
        cpf: r.cpf,
        email: r.email,
        telefone: r.telefone,
        sexo: r.sexo,
        data_nascimento: r.data_nascimento,
        modalidade: r.modalidade,
        tipo_kit: r.tipo_kit,
        tamanho_camiseta: r.tamanho_camiseta,
        cidade: r.cidade,
        estado: r.estado,
        regiao: r.regiao,
        nacionalidade: r.nacionalidade,
        data_de_cadastro: r.data_de_cadastro,
        status: r.status ?? 'ativo',
        risk_score: r.risk_score ?? 0,
        fraud_reason: r.fraud_reason ?? null,
        duplicate_group_id: r.duplicate_group_id ?? null,
        revisado: r.revisado ?? false,
        observacao_interna: r.observacao_interna ?? null,
        reviewed_at: r.reviewed_at ?? null,
        reviewed_by: r.reviewed_by ?? null,
      })),
      geradoEm: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, stats })
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
