'use client'

import { useState, useEffect, useCallback } from 'react'
import { SearchBar } from '@/components/ui/search-bar'

const STORAGE_KEY = 'collab_status_auth'

type Bucket = { label: string; value: number }
interface Inscrito {
  id: string
  nome: string
  cpf: string
  email: string
  telefone: string
  sexo: string
  data_nascimento: string
  modalidade: string
  tipo_kit: string
  tamanho_camiseta: string
  cidade: string
  estado: string
  regiao: string
  nacionalidade: string
  data_de_cadastro: string
  status: string
  risk_score: number
  fraud_reason: string | null
  duplicate_group_id: string | null
  revisado: boolean
  observacao_interna: string | null
  reviewed_at: string | null
  reviewed_by: string | null
}

const STATUS_LABEL: Record<string, string> = {
  ativo: 'Ativo', suspeito: 'Suspeito', duplicado: 'Duplicado', revisao_manual: 'Revisão manual', cancelado: 'Cancelado',
}
const STATUS_COLOR: Record<string, string> = {
  ativo: 'bg-green-100 text-green-700',
  suspeito: 'bg-yellow-100 text-yellow-800',
  duplicado: 'bg-red-100 text-red-700',
  revisao_manual: 'bg-blue-100 text-blue-700',
  cancelado: 'bg-zinc-200 text-zinc-600',
}
const STATUS_DOT: Record<string, string> = {
  ativo: 'bg-green-500', suspeito: 'bg-yellow-500', duplicado: 'bg-red-500', revisao_manual: 'bg-blue-500', cancelado: 'bg-zinc-400',
}
interface Stats {
  total: number
  porRegiao: Bucket[]
  porSexo: Bucket[]
  porModalidade: Bucket[]
  porTipoKit: Bucket[]
  porCamiseta: Bucket[]
  porNacionalidade: Bucket[]
  porEstado: Bucket[]
  porCidade: Bucket[]
  porDia: Bucket[]
  inscritos: Inscrito[]
  geradoEm: string
}
interface EmailData {
  resumo: { total: number; entregues: number; bounces: number; taxaEntrega: number; porStatus: Bucket[] }
  lista: { id: string; to: string; status: string; created_at: string }[]
  hasMore: boolean
  geradoEm: string
}

const EMAIL_STATUS_LABEL: Record<string, string> = {
  delivered: 'Entregue', sent: 'Enviado', bounced: 'Bounce (falhou)', complained: 'Spam',
  suppressed: 'Suprimido', opened: 'Aberto', clicked: 'Clicado', delivery_delayed: 'Atrasado',
}
const EMAIL_STATUS_COLOR: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700', opened: 'bg-emerald-100 text-emerald-700',
  clicked: 'bg-teal-100 text-teal-700', sent: 'bg-blue-100 text-blue-700',
  bounced: 'bg-red-100 text-red-700', complained: 'bg-orange-100 text-orange-700',
  suppressed: 'bg-zinc-200 text-zinc-600', delivery_delayed: 'bg-yellow-100 text-yellow-700',
}
const SEXO_LABEL: Record<string, string> = { M: 'Masculino', F: 'Feminino' }
const KIT_LABEL: Record<string, string> = { UNICO: 'Único', UNICO_PCD: 'Único PCD' }
const MOD_LABEL: Record<string, string> = { '3KM': '3 km', '5KM': '5 km', '10KM': '10 km' }
const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

// Mapeia o rótulo exibido no gráfico de volta para o valor do registro
function matchChart(r: Inscrito, f: { field: keyof Inscrito; label: string }): boolean {
  switch (f.field) {
    case 'sexo': return (SEXO_LABEL[r.sexo] || r.sexo) === f.label
    case 'modalidade': return (MOD_LABEL[r.modalidade] || r.modalidade) === f.label
    case 'tipo_kit': return (KIT_LABEL[r.tipo_kit] || r.tipo_kit) === f.label
    default: return String(r[f.field] ?? '') === f.label
  }
}

const fmtCPF = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
const fmtPhone = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 11); if (d.length <= 2) return d; if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}` }
const fmtDate = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 8); if (d.length >= 5) return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`; if (d.length >= 3) return `${d.slice(0,2)}/${d.slice(2)}`; return d }

export default function StatusPage() {
  const [authed, setAuthed] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [emailData, setEmailData] = useState<EmailData | null>(null)
  const [savedCode, setSavedCode] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroEmail, setFiltroEmail] = useState<string | null>(null)
  const [editing, setEditing] = useState<Inscrito | null>(null)
  const [aberto, setAberto] = useState<boolean | null>(null)
  const [togglingInsc, setTogglingInsc] = useState(false)
  const [chartFilter, setChartFilter] = useState<{ field: keyof Inscrito; label: string; titulo: string } | null>(null)
  const [view, setView] = useState<'dashboard' | 'auditoria'>('dashboard')
  const [recalc, setRecalc] = useState(false)
  const [auditMsg, setAuditMsg] = useState('')
  const [reviewing, setReviewing] = useState<Inscrito | null>(null)
  const [fStatus, setFStatus] = useState('')
  const [fModalidade, setFModalidade] = useState('')
  const [fKit, setFKit] = useState('')
  const [fMinScore, setFMinScore] = useState(0)
  const [fTelRep, setFTelRep] = useState(false)
  const [fEmailRep, setFEmailRep] = useState(false)

  useEffect(() => {
    const c = localStorage.getItem(STORAGE_KEY)
    if (c) { setSavedCode(c); setAuthed(true) }
  }, [])

  const fetchStats = useCallback(async (accessCode: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/inscricao-esplanada/stats', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) { localStorage.removeItem(STORAGE_KEY); setAuthed(false); setSavedCode('') }
        throw new Error(data.error || 'Erro ao carregar')
      }
      setStats(data.stats)
      try {
        const er = await fetch('/api/inscricao-esplanada/emails', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: accessCode }),
        })
        if (er.ok) setEmailData(await er.json())
      } catch { /* ignora */ }
      try {
        const cr = await fetch('/api/inscricao-esplanada/config', { cache: 'no-store' })
        if (cr.ok) setAberto((await cr.json()).aberto)
      } catch { /* ignora */ }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (authed && savedCode) fetchStats(savedCode) }, [authed, savedCode, fetchStats])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/inscricao-esplanada/stats', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Código inválido')
      localStorage.setItem(STORAGE_KEY, code)
      setSavedCode(code); setAuthed(true); setStats(data.stats)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Código inválido')
    } finally { setLoading(false) }
  }

  async function toggleInscricoes() {
    const novo = !aberto
    const msg = novo
      ? 'Reabrir as inscrições? O formulário voltará a aceitar novos inscritos.'
      : 'Fechar as inscrições? O formulário será bloqueado e mostrará que as vagas foram preenchidas.'
    if (!window.confirm(msg)) return
    setTogglingInsc(true)
    try {
      const res = await fetch('/api/inscricao-esplanada/config', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: savedCode, aberto: novo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro')
      setAberto(data.aberto)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao alterar')
    } finally { setTogglingInsc(false) }
  }

  async function recalcularAuditoria() {
    setRecalc(true); setAuditMsg('')
    try {
      const res = await fetch('/api/inscricao-esplanada/audit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: savedCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao auditar')
      setAuditMsg(`Auditoria concluída: ${data.resumo.suspeitos} suspeitos, ${data.resumo.duplicados} duplicados, ${data.resumo.grupos} grupos.`)
      await fetchStats(savedCode)
    } catch (e) {
      setAuditMsg(e instanceof Error ? e.message : 'Erro ao auditar')
    } finally { setRecalc(false) }
  }

  async function reviewAction(id: string, novoStatus: string, observacao?: string) {
    const res = await fetch('/api/inscricao-esplanada/review', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: savedCode, id, status: novoStatus, observacao_interna: observacao }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erro ao salvar revisão')
    await fetchStats(savedCode)
  }

  function pickChart(field: keyof Inscrito, label: string, titulo: string) {
    setChartFilter((cur) => (cur && cur.field === field && cur.label === label ? null : { field, label, titulo }))
    setBusca('')
    setTimeout(() => document.getElementById('lista-inscritos')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setAuthed(false); setSavedCode(''); setStats(null); setEmailData(null); setCode(''); setBusca(''); setChartFilter(null)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white text-zinc-900 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black mb-1">Status das inscrições</h1>
          <p className="text-sm text-zinc-500 mb-6">Esplanada Run 2026 · acesso restrito</p>
          <label className="block text-sm font-semibold mb-2">Código de acesso</label>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="••••••••"
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" autoFocus />
          {error && <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-400 text-white font-semibold py-3 rounded-lg transition">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    )
  }

  const termo = busca.trim().toLowerCase()
  const termoCpf = termo.replace(/\D/g, '')
  const searching = termo.length > 0
  const inscritos = stats?.inscritos ?? []
  const filtrados = inscritos.filter((r) => {
    if (!termo) return true
    const campos = [r.nome, r.email, r.telefone, r.cidade, r.estado, r.regiao, r.nacionalidade,
      MOD_LABEL[r.modalidade] || r.modalidade, KIT_LABEL[r.tipo_kit] || r.tipo_kit, r.tamanho_camiseta, SEXO_LABEL[r.sexo] || r.sexo]
      .join(' ').toLowerCase()
    const cpfDigits = (r.cpf || '').replace(/\D/g, '')
    return campos.includes(termo) || (termoCpf.length > 0 && cpfDigits.includes(termoCpf))
  })

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* HEADER com busca geral */}
      <header className="sticky top-0 z-20 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black leading-tight truncate">Status · Esplanada Run 2026</h1>
              {stats && <p className="text-[11px] text-zinc-400 hidden sm:block">Atualizado {new Date(stats.geradoEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => fetchStats(savedCode)} disabled={loading}
                className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition">
                <span className={loading ? 'animate-spin' : ''}>↻</span>
                <span className="hidden sm:inline">{loading ? 'Atualizando…' : 'Atualizar'}</span>
              </button>
              <button onClick={logout} className="text-sm text-zinc-300 hover:text-white px-2 sm:px-3 py-2">Sair</button>
            </div>
          </div>
          <div className="mt-2.5">
            <SearchBar placeholder="Buscar inscrito (nome, CPF, e-mail, cidade…)" value={busca} onSearch={setBusca} />
          </div>
          <div className="flex gap-2 mt-2.5 pb-0.5">
            <button onClick={() => setView('dashboard')} className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition ${view === 'dashboard' ? 'bg-white text-zinc-900' : 'text-zinc-300 hover:text-white'}`}>Visão geral</button>
            <button onClick={() => setView('auditoria')} className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition ${view === 'auditoria' ? 'bg-white text-zinc-900' : 'text-zinc-300 hover:text-white'}`}>🛡️ Auditoria</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        {view === 'auditoria' ? (() => {
          const all = stats?.inscritos ?? []
          // repetições para filtros
          const telCount: Record<string, number> = {}
          const emailCount: Record<string, number> = {}
          all.forEach((r) => {
            const t = (r.telefone || '').replace(/\D/g, ''); if (t) telCount[t] = (telCount[t] || 0) + 1
            const e = (r.email || '').trim().toLowerCase(); if (e) emailCount[e] = (emailCount[e] || 0) + 1
          })
          const t2 = busca.trim().toLowerCase()
          const t2cpf = t2.replace(/\D/g, '')
          const filtrados = all.filter((r) => {
            if (fStatus && r.status !== fStatus) return false
            if (fModalidade && r.modalidade !== fModalidade) return false
            if (fKit && r.tipo_kit !== fKit) return false
            if (fMinScore > 0 && (r.risk_score || 0) < fMinScore) return false
            if (fTelRep && telCount[(r.telefone || '').replace(/\D/g, '')] <= 1) return false
            if (fEmailRep && emailCount[(r.email || '').trim().toLowerCase()] <= 1) return false
            if (t2) {
              const campos = [r.nome, r.email, r.telefone, r.cpf].join(' ').toLowerCase()
              const cpfd = (r.cpf || '').replace(/\D/g, '')
              if (!campos.includes(t2) && !(t2cpf && cpfd.includes(t2cpf))) return false
            }
            return true
          })
          const count = (s: string) => all.filter((r) => r.status === s).length
          // grupos de duplicidade
          const groupsMap: Record<string, Inscrito[]> = {}
          all.forEach((r) => { if (r.duplicate_group_id) { (groupsMap[r.duplicate_group_id] ||= []).push(r) } })
          const grupos = Object.values(groupsMap).filter((g) => g.length > 1).sort((a, b) => b.length - a.length)
          return (
            <AuditoriaPanel
              all={all} filtrados={filtrados} grupos={grupos}
              counts={{ total: all.length, ativo: count('ativo'), suspeito: count('suspeito'), duplicado: count('duplicado'), revisao_manual: count('revisao_manual'), cancelado: count('cancelado') }}
              recalc={recalc} auditMsg={auditMsg} onRecalc={recalcularAuditoria} onReview={setReviewing}
              filters={{ fStatus, setFStatus, fModalidade, setFModalidade, fKit, setFKit, fMinScore, setFMinScore, fTelRep, setFTelRep, fEmailRep, setFEmailRep }}
            />
          )
        })() : searching ? (
          <div>
            <p className="text-sm text-zinc-500 mb-3">
              {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} para <strong className="text-zinc-800">“{busca}”</strong>
            </p>
            <InscritosList lista={filtrados} onSelect={setEditing} termoVazio={false} />
          </div>
        ) : (
          <>
            {/* TOTAL */}
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 text-white p-7 sm:p-10 mb-4 text-center shadow-lg">
              <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase opacity-90">Total de inscritos</p>
              <div className="text-6xl sm:text-8xl font-black leading-none mt-2">{stats?.total ?? '—'}</div>
            </div>

            {/* Controle de inscrições */}
            {aberto !== null && (
              <div className={`rounded-2xl border px-5 py-4 mb-6 flex items-center justify-between gap-3 flex-wrap ${aberto ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${aberto ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-semibold text-sm">
                    {aberto ? 'Inscrições abertas' : 'Inscrições fechadas (formulário bloqueado)'}
                  </span>
                </div>
                <button
                  onClick={toggleInscricoes}
                  disabled={togglingInsc}
                  className={`text-sm font-semibold px-4 py-2 rounded-lg text-white transition disabled:opacity-60 ${aberto ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {togglingInsc ? 'Salvando…' : aberto ? 'Fechar inscrições' : 'Reabrir inscrições'}
                </button>
              </div>
            )}

            {stats && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <QuickCard title="Regiões" value={stats.porRegiao.length} />
                  <QuickCard title="Estados" value={stats.porEstado.length} />
                  <QuickCard title="Cidades" value={stats.porCidade.length >= 15 ? '15+' : stats.porCidade.length} />
                  <QuickCard title="Estrangeiros" value={stats.porNacionalidade.find((x) => x.label === 'Estrangeiro')?.value ?? 0} />
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <ChartCard title="Por região" data={stats.porRegiao} total={stats.total} onPick={(l) => pickChart('regiao', l, 'Região')} active={chartFilter} />
                  <ChartCard title="Por sexo" data={stats.porSexo.map((b) => ({ ...b, label: SEXO_LABEL[b.label] || b.label }))} total={stats.total} onPick={(l) => pickChart('sexo', l, 'Sexo')} active={chartFilter} />
                  <ChartCard title="Por modalidade" data={stats.porModalidade.map((b) => ({ ...b, label: MOD_LABEL[b.label] || b.label }))} total={stats.total} onPick={(l) => pickChart('modalidade', l, 'Modalidade')} active={chartFilter} />
                  <ChartCard title="Por tipo de kit" data={stats.porTipoKit.map((b) => ({ ...b, label: KIT_LABEL[b.label] || b.label }))} total={stats.total} onPick={(l) => pickChart('tipo_kit', l, 'Tipo de kit')} active={chartFilter} />
                  <ChartCard title="Por tamanho de camiseta" data={stats.porCamiseta} total={stats.total} onPick={(l) => pickChart('tamanho_camiseta', l, 'Camiseta')} active={chartFilter} />
                  <ChartCard title="Por nacionalidade" data={stats.porNacionalidade} total={stats.total} onPick={(l) => pickChart('nacionalidade', l, 'Nacionalidade')} active={chartFilter} />
                  <ChartCard title="Por estado" data={stats.porEstado} total={stats.total} onPick={(l) => pickChart('estado', l, 'Estado')} active={chartFilter} />
                  <ChartCard title="Top cidades" data={stats.porCidade} total={stats.total} onPick={(l) => pickChart('cidade', l, 'Cidade')} active={chartFilter} />
                </div>
                <div className="mt-4 sm:mt-6">
                  <ChartCard title="Inscrições por dia" data={stats.porDia} total={stats.total} />
                </div>

                {/* E-MAILS */}
                {emailData && (() => {
                  const emailsFiltrados = filtroEmail ? emailData.lista.filter((e) => e.status === filtroEmail) : emailData.lista
                  return (
                    <div className="mt-8">
                      <h2 className="font-bold text-lg mb-3">Status dos e-mails <span className="text-zinc-400 font-normal text-sm">(Resend)</span></h2>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <QuickCard title="Enviados" value={emailData.resumo.total} />
                        <QuickCard title="Entregues" value={emailData.resumo.entregues} />
                        <QuickCard title="Bounces" value={emailData.resumo.bounces} />
                        <QuickCard title="Taxa de entrega" value={`${emailData.resumo.taxaEntrega}%`} />
                      </div>
                      <div className="flex gap-2 flex-wrap mb-4">
                        <button onClick={() => setFiltroEmail(null)}
                          className={`text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium border transition ${filtroEmail === null ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400'}`}>
                          Todos: {emailData.resumo.total}
                        </button>
                        {emailData.resumo.porStatus.map((s) => {
                          const active = filtroEmail === s.label
                          return (
                            <button key={s.label} onClick={() => setFiltroEmail(active ? null : s.label)}
                              className={`text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium border transition ${active ? 'ring-2 ring-offset-1 ring-orange-500 ' : 'hover:opacity-80 '}${EMAIL_STATUS_COLOR[s.label] || 'bg-zinc-100 text-zinc-600'} border-transparent`}>
                              {EMAIL_STATUS_LABEL[s.label] || s.label}: {s.value}
                            </button>
                          )
                        })}
                      </div>
                      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                        <div className="px-4 sm:px-5 py-3 border-b border-zinc-100 flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-zinc-700">
                            {filtroEmail ? (EMAIL_STATUS_LABEL[filtroEmail] || filtroEmail) : 'Todos os e-mails'}
                            <span className="text-zinc-400 font-normal"> · {emailsFiltrados.length}</span>
                          </span>
                          {filtroEmail && <button onClick={() => setFiltroEmail(null)} className="text-xs text-orange-600 hover:underline">limpar filtro</button>}
                        </div>
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-zinc-50 text-zinc-500 text-left">
                              <tr><th className="px-4 py-3 font-semibold">Destinatário</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Enviado em</th></tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                              {emailsFiltrados.map((e) => (
                                <tr key={e.id} className="hover:bg-zinc-50">
                                  <td className="px-4 py-3 font-medium break-all">{e.to}</td>
                                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${EMAIL_STATUS_COLOR[e.status] || 'bg-zinc-100 text-zinc-600'}`}>{EMAIL_STATUS_LABEL[e.status] || e.status}</span></td>
                                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{e.created_at ? new Date(e.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="sm:hidden divide-y divide-zinc-100">
                          {emailsFiltrados.map((e) => (
                            <div key={e.id} className="px-4 py-3">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${EMAIL_STATUS_COLOR[e.status] || 'bg-zinc-100 text-zinc-600'}`}>{EMAIL_STATUS_LABEL[e.status] || e.status}</span>
                                <span className="text-xs text-zinc-400">{e.created_at ? new Date(e.created_at).toLocaleDateString('pt-BR') : '—'}</span>
                              </div>
                              <p className="text-sm font-medium break-all">{e.to}</p>
                            </div>
                          ))}
                        </div>
                        {emailsFiltrados.length === 0 && <p className="px-4 py-10 text-center text-zinc-400 text-sm">Nenhum e-mail neste filtro.</p>}
                      </div>
                    </div>
                  )
                })()}

                {/* INSCRITOS */}
                {(() => {
                  const listaInscritos = chartFilter ? inscritos.filter((r) => matchChart(r, chartFilter)) : inscritos
                  return (
                    <div className="mt-8" id="lista-inscritos">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <h2 className="font-bold text-lg">Inscrições <span className="text-zinc-400 font-normal text-sm">({listaInscritos.length}) · toque para ver e editar</span></h2>
                        {chartFilter && (
                          <button onClick={() => setChartFilter(null)} className="inline-flex items-center gap-2 text-sm bg-orange-100 text-orange-700 font-medium px-3 py-1.5 rounded-full hover:bg-orange-200 transition">
                            {chartFilter.titulo}: {chartFilter.label} <span className="text-base leading-none">✕</span>
                          </button>
                        )}
                      </div>
                      <InscritosList lista={listaInscritos} onSelect={setEditing} termoVazio={!chartFilter} />
                    </div>
                  )
                })()}
              </>
            )}
          </>
        )}
      </main>

      {editing && (
        <EditModal
          inscrito={editing}
          code={savedCode}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchStats(savedCode) }}
        />
      )}

      {reviewing && (
        <ReviewModal
          inscrito={reviewing}
          all={stats?.inscritos ?? []}
          onClose={() => setReviewing(null)}
          onAction={async (st, obs) => { await reviewAction(reviewing.id, st, obs); setReviewing(null) }}
          onEdit={() => { const r = reviewing; setReviewing(null); setEditing(r) }}
        />
      )}
    </div>
  )
}

function AuditoriaPanel({ all, filtrados, grupos, counts, recalc, auditMsg, onRecalc, onReview, filters }: {
  all: Inscrito[]
  filtrados: Inscrito[]
  grupos: Inscrito[][]
  counts: { total: number; ativo: number; suspeito: number; duplicado: number; revisao_manual: number; cancelado: number }
  recalc: boolean
  auditMsg: string
  onRecalc: () => void
  onReview: (i: Inscrito) => void
  filters: {
    fStatus: string; setFStatus: (v: string) => void
    fModalidade: string; setFModalidade: (v: string) => void
    fKit: string; setFKit: (v: string) => void
    fMinScore: number; setFMinScore: (v: number) => void
    fTelRep: boolean; setFTelRep: (v: boolean) => void
    fEmailRep: boolean; setFEmailRep: (v: boolean) => void
  }
}) {
  const f = filters
  const sel = 'px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500'
  return (
    <div>
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <button onClick={() => f.setFStatus('')} className={`text-left bg-white rounded-2xl border p-4 transition ${f.fStatus === '' ? 'border-zinc-900' : 'border-zinc-200 hover:border-zinc-300'}`}>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Total</p>
          <p className="text-2xl sm:text-3xl font-black mt-1">{counts.total}</p>
        </button>
        {(['ativo', 'suspeito', 'duplicado', 'revisao_manual'] as const).map((s) => (
          <button key={s} onClick={() => f.setFStatus(f.fStatus === s ? '' : s)} className={`text-left bg-white rounded-2xl border p-4 transition ${f.fStatus === s ? 'border-zinc-900' : 'border-zinc-200 hover:border-zinc-300'}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />{STATUS_LABEL[s]}</p>
            <p className="text-2xl sm:text-3xl font-black mt-1">{counts[s]}</p>
          </button>
        ))}
      </div>

      {/* Barra de ação */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="text-sm text-zinc-500">{auditMsg || 'Recalcule para detectar duplicidades e atualizar os scores.'}</div>
        <button onClick={onRecalc} disabled={recalc} className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <span className={recalc ? 'animate-spin' : ''}>⟳</span>{recalc ? 'Auditando…' : 'Recalcular auditoria'}
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <select className={sel} value={f.fStatus} onChange={(e) => f.setFStatus(e.target.value)}>
          <option value="">Status: todos</option>
          {Object.keys(STATUS_LABEL).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <select className={sel} value={f.fModalidade} onChange={(e) => f.setFModalidade(e.target.value)}>
          <option value="">Modalidade: todas</option>
          <option value="3KM">3 km</option><option value="5KM">5 km</option><option value="10KM">10 km</option>
        </select>
        <select className={sel} value={f.fKit} onChange={(e) => f.setFKit(e.target.value)}>
          <option value="">Kit: todos</option>
          <option value="UNICO">Único</option><option value="UNICO_PCD">Único PCD</option>
        </select>
        <select className={sel} value={f.fMinScore} onChange={(e) => f.setFMinScore(Number(e.target.value))}>
          <option value={0}>Score: qualquer</option>
          <option value={50}>Score ≥ 50</option>
          <option value={70}>Score ≥ 70 (suspeito)</option>
          <option value={100}>Score ≥ 100 (duplicado)</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer"><input type="checkbox" checked={f.fTelRep} onChange={(e) => f.setFTelRep(e.target.checked)} className="w-4 h-4 accent-orange-500" />Telefone repetido</label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer"><input type="checkbox" checked={f.fEmailRep} onChange={(e) => f.setFEmailRep(e.target.checked)} className="w-4 h-4 accent-orange-500" />E-mail repetido</label>
      </div>

      {/* Grupos de duplicidade */}
      {grupos.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-3">Grupos de possível duplicidade <span className="text-zinc-400 font-normal text-sm">({grupos.length})</span></h3>
          <div className="space-y-3">
            {grupos.map((g, gi) => (
              <div key={gi} className="bg-white rounded-2xl border border-red-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 text-sm font-semibold text-red-700">Grupo #{gi + 1} · {g.length} registros</div>
                <div className="divide-y divide-zinc-100">
                  {g.map((r) => (
                    <button key={r.id} onClick={() => onReview(r)} className="w-full text-left px-4 py-3 hover:bg-zinc-50 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{r.nome}</p>
                        <p className="text-xs text-zinc-500">{r.cpf} · {r.telefone} · {r.data_nascimento}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-zinc-500">{r.risk_score}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[r.status] || 'bg-zinc-100'}`}>{STATUS_LABEL[r.status] || r.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de auditoria */}
      <h3 className="font-bold mb-3">Inscrições <span className="text-zinc-400 font-normal text-sm">({filtrados.length} de {all.length}) · toque para revisar</span></h3>
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500 text-left">
              <tr>
                <th className="px-3 py-3 font-semibold">Nome</th><th className="px-3 py-3 font-semibold">CPF</th>
                <th className="px-3 py-3 font-semibold">Telefone</th><th className="px-3 py-3 font-semibold">E-mail</th>
                <th className="px-3 py-3 font-semibold">Mod.</th><th className="px-3 py-3 font-semibold">Kit</th>
                <th className="px-3 py-3 font-semibold">Score</th><th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Motivo</th><th className="px-3 py-3 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtrados.map((r) => (
                <tr key={r.id} onClick={() => onReview(r)} className="hover:bg-orange-50 cursor-pointer">
                  <td className="px-3 py-2.5 font-medium">{r.nome}{r.revisado && <span title="Revisado" className="ml-1 text-blue-500">✓</span>}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-zinc-600">{r.cpf}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-zinc-600">{r.telefone}</td>
                  <td className="px-3 py-2.5 text-zinc-600 max-w-[160px] truncate">{r.email}</td>
                  <td className="px-3 py-2.5">{MOD_LABEL[r.modalidade] || r.modalidade}</td>
                  <td className="px-3 py-2.5">{KIT_LABEL[r.tipo_kit] || r.tipo_kit}</td>
                  <td className="px-3 py-2.5"><span className={`font-bold ${r.risk_score >= 100 ? 'text-red-600' : r.risk_score >= 70 ? 'text-yellow-600' : 'text-zinc-400'}`}>{r.risk_score}</span></td>
                  <td className="px-3 py-2.5"><span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLOR[r.status] || 'bg-zinc-100'}`}>{STATUS_LABEL[r.status] || r.status}</span></td>
                  <td className="px-3 py-2.5 text-xs text-zinc-500 max-w-[180px] truncate">{r.fraud_reason || '—'}</td>
                  <td className="px-3 py-2.5 text-zinc-500 whitespace-nowrap">{r.data_de_cadastro ? new Date(r.data_de_cadastro).toLocaleDateString('pt-BR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-zinc-100">
          {filtrados.map((r) => (
            <button key={r.id} onClick={() => onReview(r)} className="w-full text-left px-4 py-3 active:bg-orange-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{r.nome}{r.revisado && <span className="ml-1 text-blue-500">✓</span>}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{r.cpf} · {r.telefone}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[r.status] || 'bg-zinc-100'}`}>{STATUS_LABEL[r.status] || r.status}</span>
                  <span className={`text-xs font-bold ${r.risk_score >= 100 ? 'text-red-600' : r.risk_score >= 70 ? 'text-yellow-600' : 'text-zinc-400'}`}>score {r.risk_score}</span>
                </div>
              </div>
              {r.fraud_reason && <p className="text-xs text-zinc-500 mt-1.5">⚠ {r.fraud_reason}</p>}
            </button>
          ))}
        </div>
        {filtrados.length === 0 && <p className="px-4 py-10 text-center text-zinc-400 text-sm">Nenhum inscrito com esses filtros.</p>}
      </div>
    </div>
  )
}

function ReviewModal({ inscrito, all, onClose, onAction, onEdit }: { inscrito: Inscrito; all: Inscrito[]; onClose: () => void; onAction: (status: string, obs?: string) => Promise<void>; onEdit: () => void }) {
  const [obs, setObs] = useState(inscrito.observacao_interna || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const relacionados = all.filter((r) => r.id !== inscrito.id && inscrito.duplicate_group_id && r.duplicate_group_id === inscrito.duplicate_group_id)

  async function act(status: string) {
    setBusy(true); setErr('')
    try { await onAction(status, obs) }
    catch (e) { setErr(e instanceof Error ? e.message : 'Erro'); setBusy(false) }
  }

  const acoes: { label: string; status: string; cls: string }[] = [
    { label: 'Ativo', status: 'ativo', cls: 'bg-green-600 hover:bg-green-700' },
    { label: 'Suspeito', status: 'suspeito', cls: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: 'Duplicado', status: 'duplicado', cls: 'bg-red-500 hover:bg-red-600' },
    { label: 'Revisão manual', status: 'revisao_manual', cls: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Cancelar inscrição', status: 'cancelado', cls: 'bg-zinc-500 hover:bg-zinc-600' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl sm:my-8 max-h-[100dvh] sm:max-h-[90vh] flex flex-col mt-auto sm:mt-0 rounded-t-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h2 className="font-black text-lg truncate">{inscrito.nome}</h2>
            <p className="text-xs text-zinc-500">{inscrito.cpf} · score <strong>{inscrito.risk_score}</strong></p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 text-2xl leading-none px-2" aria-label="Fechar">✕</button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[inscrito.status] || 'bg-zinc-100'}`}>{STATUS_LABEL[inscrito.status] || inscrito.status}</span>
            {inscrito.revisado && <span className="text-xs text-blue-600">✓ revisado {inscrito.reviewed_at ? `em ${new Date(inscrito.reviewed_at).toLocaleDateString('pt-BR')}` : ''}</span>}
          </div>
          {inscrito.fraud_reason && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800">⚠ Motivo: {inscrito.fraud_reason}</div>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span className="text-zinc-400 text-xs block">Telefone</span>{inscrito.telefone}</div>
            <div><span className="text-zinc-400 text-xs block">Nascimento</span>{inscrito.data_nascimento}</div>
            <div className="col-span-2"><span className="text-zinc-400 text-xs block">E-mail</span>{inscrito.email}</div>
            <div><span className="text-zinc-400 text-xs block">Modalidade</span>{MOD_LABEL[inscrito.modalidade] || inscrito.modalidade}</div>
            <div><span className="text-zinc-400 text-xs block">Kit / Camiseta</span>{KIT_LABEL[inscrito.tipo_kit] || inscrito.tipo_kit} · {inscrito.tamanho_camiseta}</div>
            <div className="col-span-2"><span className="text-zinc-400 text-xs block">Cidade</span>{inscrito.cidade}/{inscrito.estado} · {inscrito.regiao}</div>
          </div>

          {relacionados.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Possíveis duplicados ({relacionados.length})</p>
              <div className="space-y-1.5">
                {relacionados.map((r) => (
                  <div key={r.id} className="text-sm bg-zinc-50 rounded-lg px-3 py-2">
                    <p className="font-medium">{r.nome}</p>
                    <p className="text-xs text-zinc-500">{r.cpf} · {r.telefone} · {r.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400 block mb-1.5">Observação interna (auditoria)</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={2} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-base [font-size:16px] focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Anotação para a equipe…" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Marcar como</p>
            <div className="grid grid-cols-2 gap-2">
              {acoes.map((a) => (
                <button key={a.status} onClick={() => act(a.status)} disabled={busy} className={`py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition ${a.cls}`}>{a.label}</button>
              ))}
              <button onClick={onEdit} className="py-2.5 rounded-lg border border-zinc-300 text-zinc-700 text-sm font-semibold hover:bg-zinc-50">✏️ Editar dados</button>
            </div>
            {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-zinc-100 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button onClick={onClose} className="w-full py-3 rounded-lg border border-zinc-300 font-semibold text-zinc-700 hover:bg-zinc-50">Fechar</button>
        </div>
      </div>
    </div>
  )
}

function InscritosList({ lista, onSelect, termoVazio }: { lista: Inscrito[]; onSelect: (i: Inscrito) => void; termoVazio: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-500 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th><th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">CPF</th><th className="px-4 py-3 font-semibold">Modalidade</th>
              <th className="px-4 py-3 font-semibold">Kit</th><th className="px-4 py-3 font-semibold">Camiseta</th>
              <th className="px-4 py-3 font-semibold">Cidade/UF</th><th className="px-4 py-3 font-semibold">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {lista.map((r, i) => (
              <tr key={r.id} onClick={() => onSelect(r)} className="hover:bg-orange-50 cursor-pointer transition">
                <td className="px-4 py-3 text-zinc-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{r.nome}</td>
                <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{r.cpf}</td>
                <td className="px-4 py-3">{MOD_LABEL[r.modalidade] || r.modalidade}</td>
                <td className="px-4 py-3">{KIT_LABEL[r.tipo_kit] || r.tipo_kit}</td>
                <td className="px-4 py-3">{r.tamanho_camiseta}</td>
                <td className="px-4 py-3">{r.cidade}/{r.estado}</td>
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{r.data_de_cadastro ? new Date(r.data_de_cadastro).toLocaleDateString('pt-BR') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="sm:hidden divide-y divide-zinc-100">
        {lista.map((r, i) => (
          <button key={r.id} onClick={() => onSelect(r)} className="w-full text-left px-4 py-4 active:bg-orange-50 transition">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900 truncate">{i + 1}. {r.nome}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{r.cpf}</p>
              </div>
              <span className="text-xs text-zinc-400 whitespace-nowrap">{r.data_de_cadastro ? new Date(r.data_de_cadastro).toLocaleDateString('pt-BR') : '—'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">{MOD_LABEL[r.modalidade] || r.modalidade}</span>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">Kit {KIT_LABEL[r.tipo_kit] || r.tipo_kit}</span>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">Camiseta {r.tamanho_camiseta}</span>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{r.cidade}/{r.estado}</span>
            </div>
          </button>
        ))}
      </div>
      {lista.length === 0 && (
        <p className="px-4 py-10 text-center text-zinc-400 text-sm">{termoVazio ? 'Nenhuma inscrição ainda.' : 'Nenhum inscrito encontrado para a busca.'}</p>
      )}
    </div>
  )
}

function EditModal({ inscrito, code, onClose, onSaved }: { inscrito: Inscrito; code: string; onClose: () => void; onSaved: () => void }) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [form, setForm] = useState({ ...inscrito })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const upd = <K extends keyof Inscrito>(k: K, v: Inscrito[K]) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  async function save() {
    setSaving(true); setErr('')
    try {
      const res = await fetch('/api/inscricao-esplanada/update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, id: inscrito.id, dados: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar')
      setMode('view')
      onSaved()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  function cancelEdit() {
    setForm({ ...inscrito })
    setErr('')
    setMode('view')
  }

  const inp = 'w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 [font-size:16px]'
  const lbl = 'block text-xs font-semibold text-zinc-500 mb-1.5'

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="py-2.5 border-b border-zinc-100 last:border-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="text-sm text-zinc-900 mt-0.5 break-words">{value || '—'}</p>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl sm:my-8 max-h-[100dvh] sm:max-h-[90vh] flex flex-col mt-auto sm:mt-0 rounded-t-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h2 className="font-black text-lg truncate">{mode === 'view' ? 'Detalhes da inscrição' : 'Editar inscrição'}</h2>
            <p className="text-xs text-zinc-500 truncate">Inscrito em {inscrito.data_de_cadastro ? new Date(inscrito.data_de_cadastro).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '—'}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 text-2xl leading-none px-2" aria-label="Fechar">✕</button>
        </div>

        {mode === 'view' ? (
          <>
            <div className="overflow-y-auto px-5 py-3">
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">{MOD_LABEL[form.modalidade] || form.modalidade}</span>
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">Kit {KIT_LABEL[form.tipo_kit] || form.tipo_kit}</span>
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">Camiseta {form.tamanho_camiseta}</span>
              </div>
              <Field label="Nome completo" value={form.nome} />
              <div className="grid grid-cols-2 gap-x-4">
                <Field label="CPF" value={form.cpf} />
                <Field label="Telefone" value={form.telefone} />
              </div>
              <Field label="E-mail" value={form.email} />
              <div className="grid grid-cols-2 gap-x-4">
                <Field label="Sexo" value={SEXO_LABEL[form.sexo] || form.sexo} />
                <Field label="Nascimento" value={form.data_nascimento} />
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <Field label="Modalidade" value={MOD_LABEL[form.modalidade] || form.modalidade} />
                <Field label="Tipo de kit" value={KIT_LABEL[form.tipo_kit] || form.tipo_kit} />
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <Field label="Camiseta" value={form.tamanho_camiseta} />
                <Field label="Nacionalidade" value={form.nacionalidade} />
              </div>
              <div className="grid grid-cols-3 gap-x-4">
                <Field label="Cidade" value={form.cidade} />
                <Field label="UF" value={form.estado} />
                <Field label="Região" value={form.regiao} />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-zinc-100 flex gap-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button onClick={onClose} className="flex-1 py-3 rounded-lg border border-zinc-300 font-semibold text-zinc-700 hover:bg-zinc-50">Fechar</button>
              <button onClick={() => setMode('edit')} className="flex-1 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-flex items-center justify-center gap-2">✏️ Editar</button>
            </div>
          </>
        ) : (
          <>
            <div className="overflow-y-auto px-5 py-5 space-y-4">
              <div>
                <label className={lbl}>Nome completo</label>
                <input className={inp} value={form.nome} onChange={(e) => upd('nome', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>CPF</label><input className={inp} inputMode="numeric" value={form.cpf} onChange={(e) => upd('cpf', fmtCPF(e.target.value))} maxLength={14} /></div>
                <div><label className={lbl}>Telefone</label><input className={inp} inputMode="tel" value={form.telefone} onChange={(e) => upd('telefone', fmtPhone(e.target.value))} maxLength={15} /></div>
              </div>
              <div><label className={lbl}>E-mail</label><input className={inp} type="email" value={form.email} onChange={(e) => upd('email', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Sexo</label>
                  <select className={inp} value={form.sexo} onChange={(e) => upd('sexo', e.target.value)}>
                    <option value="M">Masculino</option><option value="F">Feminino</option>
                  </select>
                </div>
                <div><label className={lbl}>Nascimento</label><input className={inp} inputMode="numeric" value={form.data_nascimento} onChange={(e) => upd('data_nascimento', fmtDate(e.target.value))} maxLength={10} placeholder="DD/MM/AAAA" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Modalidade</label>
                  <select className={inp} value={form.modalidade} onChange={(e) => upd('modalidade', e.target.value)}>
                    <option value="3KM">3 km</option><option value="5KM">5 km</option><option value="10KM">10 km</option>
                  </select>
                </div>
                <div><label className={lbl}>Tipo de kit</label>
                  <select className={inp} value={form.tipo_kit} onChange={(e) => upd('tipo_kit', e.target.value)}>
                    <option value="UNICO">Único</option><option value="UNICO_PCD">Único PCD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Camiseta</label>
                  <select className={inp} value={form.tamanho_camiseta} onChange={(e) => upd('tamanho_camiseta', e.target.value)}>
                    {['P','M','G','GG','XG'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className={lbl}>Nacionalidade</label>
                  <select className={inp} value={form.nacionalidade} onChange={(e) => upd('nacionalidade', e.target.value)}>
                    <option value="Brasileiro">Brasileiro</option><option value="Estrangeiro">Estrangeiro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1"><label className={lbl}>Cidade</label><input className={inp} value={form.cidade} onChange={(e) => upd('cidade', e.target.value)} /></div>
                <div><label className={lbl}>UF</label>
                  <select className={inp} value={form.estado} onChange={(e) => upd('estado', e.target.value)}>
                    {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
                <div><label className={lbl}>Região</label>
                  <select className={inp} value={form.regiao} onChange={(e) => upd('regiao', e.target.value)}>
                    {REGIOES.map((rg) => <option key={rg} value={rg}>{rg}</option>)}
                  </select>
                </div>
              </div>
              {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{err}</div>}
            </div>
            <div className="px-5 py-4 border-t border-zinc-100 flex gap-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button onClick={cancelEdit} className="flex-1 py-3 rounded-lg border border-zinc-300 font-semibold text-zinc-700 hover:bg-zinc-50">Cancelar</button>
              <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-400 text-white font-semibold">{saving ? 'Salvando…' : 'Salvar'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function QuickCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5">
      <p className="text-xs font-bold tracking-wide uppercase text-zinc-400">{title}</p>
      <p className="text-2xl sm:text-3xl font-black mt-1">{value}</p>
    </div>
  )
}

function ChartCard({ title, data, total, onPick, active }: { title: string; data: Bucket[]; total: number; onPick?: (label: string) => void; active?: { titulo: string; label: string } | null }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const clickable = !!onPick
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5">
      <h3 className="font-bold mb-4">{title}</h3>
      {data.length === 0 ? <p className="text-sm text-zinc-400">Sem dados.</p> : (
        <div className="space-y-3">
          {data.map((d, i) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
            const isActive = active && active.titulo === title && active.label === d.label
            const Row = (
              <>
                <div className="flex justify-between text-sm mb-1">
                  <span className={`truncate pr-2 ${isActive ? 'text-orange-600 font-semibold' : 'text-zinc-700'}`}>{d.label}</span>
                  <span className="text-zinc-500 font-medium whitespace-nowrap">{d.value} · {pct}%</span>
                </div>
                <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${isActive ? 'bg-orange-600' : 'bg-orange-500'}`} style={{ width: `${(d.value / max) * 100}%` }} />
                </div>
              </>
            )
            return clickable ? (
              <button key={i} onClick={() => onPick!(d.label)} className={`w-full text-left rounded-lg -mx-1 px-1 py-0.5 transition hover:bg-orange-50 ${isActive ? 'bg-orange-50' : ''}`} title={`Filtrar por ${d.label}`}>
                {Row}
              </button>
            ) : (
              <div key={i}>{Row}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
