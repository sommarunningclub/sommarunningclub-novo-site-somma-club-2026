import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { isValidCPF } from '@/lib/cpf'

const ORIGEM = 'shakeout-centauro-somma-rj'
const ADMIN_CODE = process.env.SHAKEOUT_ADMIN_CODE || 'somma@shakeout2026'
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const SEXOS = ['masculino', 'feminino', 'outro', 'prefiro-nao-dizer']

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase não configurado')
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, code } = body as { action: string; code: string }

    if (code !== ADMIN_CODE) {
      return NextResponse.json({ error: 'Código de acesso inválido.' }, { status: 401 })
    }

    const supabase = db()

    // ---- Estatísticas + estado das inscrições ----
    if (action === 'stats') {
      const base = () => supabase.from('leads_shakeout_centauro').select('*', { count: 'exact', head: true }).eq('origem', ORIGEM)
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const [{ count: total }, { count: conhece }, { count: naoConhece }, { count: recentes }] = await Promise.all([
        base(),
        base().eq('conhecia_somma', true),
        base().eq('conhecia_somma', false),
        base().gte('data_de_cadastro', last24h),
      ])
      const { data: cfg } = await supabase.from('config_shakeout').select('inscricoes_abertas').eq('id', 1).maybeSingle()
      return NextResponse.json({
        total: total ?? 0,
        conhece: conhece ?? 0,
        nao_conhece: naoConhece ?? 0,
        recentes: recentes ?? 0,
        inscricoes_abertas: cfg?.inscricoes_abertas ?? true,
      })
    }

    // ---- Listagem com busca por CPF ou nome ----
    if (action === 'list') {
      const search = String(body.search ?? '').trim()
      let q = supabase.from('leads_shakeout_centauro').select('*').eq('origem', ORIGEM).order('data_de_cadastro', { ascending: false }).limit(1000)
      if (search) {
        const digits = search.replace(/\D/g, '')
        if (digits.length >= 3) q = q.or(`nome_completo.ilike.%${search}%,cpf.ilike.%${digits}%`)
        else q = q.ilike('nome_completo', `%${search}%`)
      }
      const { data, error } = await q
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ rows: data })
    }

    // ---- Abrir / encerrar inscrições ----
    if (action === 'config_set') {
      const aberto = Boolean(body.inscricoes_abertas)
      const { error } = await supabase
        .from('config_shakeout')
        .upsert({ id: 1, inscricoes_abertas: aberto, updated_at: new Date().toISOString() })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, inscricoes_abertas: aberto })
    }

    // ---- Criar / editar participante ----
    if (action === 'upsert') {
      const r = body.row ?? {}
      const nome_completo = String(r.nome_completo ?? '').trim()
      const email = String(r.email ?? '').trim().toLowerCase()
      const telefone = String(r.telefone ?? '').trim()
      const uf = String(r.uf ?? '').trim().toUpperCase()
      const sexo = String(r.sexo ?? '').trim().toLowerCase()
      const cpfDigits = String(r.cpf ?? '').replace(/\D/g, '')

      if (!nome_completo || !email || !telefone) {
        return NextResponse.json({ error: 'Nome, e-mail e telefone são obrigatórios.' }, { status: 400 })
      }
      if (cpfDigits && !isValidCPF(cpfDigits)) {
        return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 })
      }
      if (uf && !UFS.includes(uf)) {
        return NextResponse.json({ error: 'UF inválida.' }, { status: 400 })
      }
      if (sexo && !SEXOS.includes(sexo)) {
        return NextResponse.json({ error: 'Sexo inválido.' }, { status: 400 })
      }

      // Bloqueia CPF/e-mail duplicado (ignorando o próprio registro ao editar)
      const orParts: string[] = []
      if (cpfDigits) orParts.push(`cpf.eq.${cpfDigits}`)
      if (email) orParts.push(`email.eq.${email}`)
      if (orParts.length) {
        let dupQ = supabase.from('leads_shakeout_centauro').select('id, cpf, email').eq('origem', ORIGEM).or(orParts.join(','))
        if (r.id) dupQ = dupQ.neq('id', r.id)
        const { data: dups } = await dupQ.limit(5)
        if (dups && dups.length > 0) {
          const cpfDup = dups.some((d) => d.cpf === cpfDigits)
          return NextResponse.json(
            { error: cpfDup ? 'Já existe um inscrito com este CPF.' : 'Já existe um inscrito com este e-mail.' },
            { status: 409 }
          )
        }
      }

      const record = {
        nome_completo,
        email,
        telefone,
        uf: uf || null,
        sexo: sexo || null,
        cpf: cpfDigits || null,
        conhecia_somma: Boolean(r.conhecia_somma),
        aceite_lgpd: Boolean(r.aceite_lgpd),
        aceite_comunicacoes: Boolean(r.aceite_comunicacoes),
        status: String(r.status ?? 'confirmado'),
        origem: ORIGEM,
      }

      if (r.id) {
        const { error } = await supabase.from('leads_shakeout_centauro').update(record).eq('id', r.id)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
        return NextResponse.json({ success: true, id: r.id })
      }
      const { data, error } = await supabase.from('leads_shakeout_centauro').insert([record]).select('id')
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ success: true, id: data?.[0]?.id })
    }

    // ---- Apagar inscrição ----
    if (action === 'delete') {
      const id = body.id
      if (!id) return NextResponse.json({ error: 'ID não informado.' }, { status: 400 })
      const { error } = await supabase.from('leads_shakeout_centauro').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Ação desconhecida.' }, { status: 400 })
  } catch (e) {
    console.error('[shakeout-admin] erro:', e)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
