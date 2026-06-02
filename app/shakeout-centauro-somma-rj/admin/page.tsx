'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Lock, Search, Plus, Pencil, Trash2, Users, UserCheck, UserX, Sparkles,
  Power, X, RefreshCw, LogOut, ChevronRight, Check, AlertCircle, Loader2, Trophy,
} from 'lucide-react'
import { formatCPF } from '@/lib/cpf'

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const SEXOS = [
  { v: 'masculino', label: 'Masculino' },
  { v: 'feminino', label: 'Feminino' },
  { v: 'outro', label: 'Outro' },
  { v: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
]

type Lead = {
  id?: string
  nome_completo?: string
  email?: string
  telefone?: string
  cpf?: string
  uf?: string
  sexo?: string
  conhecia_somma?: boolean
  aceite_lgpd?: boolean
  aceite_comunicacoes?: boolean
  status?: string
  origem?: string
  data_de_cadastro?: string
}
type Stats = { total: number; conhece: number; nao_conhece: number; recentes: number; inscricoes_abertas: boolean }

const INPUT = 'w-full rounded-lg bg-[#0c0c0c] px-4 py-3 text-base sm:text-sm text-white placeholder:text-[#666] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF2C03] transition'

const sexoLabel = (v?: string) => SEXOS.find((s) => s.v === v)?.label ?? '—'
const fmtDate = (s?: string) => {
  if (!s) return '—'
  try { return new Date(s).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) } catch { return s }
}

export default function AdminPage() {
  const [code, setCode] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [rows, setRows] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('')

  // modal de detalhe
  const [selected, setSelected] = useState<Lead | null>(null)
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [draft, setDraft] = useState<Lead>({})
  const [saving, setSaving] = useState(false)

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2600) }

  const callAdmin = useCallback(async (action: string, payload: Record<string, unknown> = {}, theCode?: string) => {
    const res = await fetch('/api/leads-shakeout-centauro/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, code: theCode ?? code, ...payload }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erro')
    return data
  }, [code])

  const loadList = useCallback(async (s = '', theCode?: string) => {
    setLoading(true)
    setError('')
    try {
      const [st, ls] = await Promise.all([callAdmin('stats', {}, theCode), callAdmin('list', { search: s }, theCode)])
      setStats(st)
      setRows(ls.rows ?? [])
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [callAdmin])

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('shk_admin_code') : null
    if (saved) {
      setCode(saved)
      callAdmin('stats', {}, saved).then(() => { setAuthed(true); loadList('', saved) }).catch(() => sessionStorage.removeItem('shk_admin_code'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErr('')
    try {
      await callAdmin('stats')
      sessionStorage.setItem('shk_admin_code', code)
      setAuthed(true)
      loadList('')
    } catch (e2) {
      setLoginErr(e2 instanceof Error ? e2.message : 'Erro')
    }
  }

  const logout = () => {
    sessionStorage.removeItem('shk_admin_code')
    setAuthed(false)
    setCode('')
    setRows([])
    setStats(null)
    setSelected(null)
  }

  const toggleConfig = async () => {
    if (!stats) return
    try {
      await callAdmin('config_set', { inscricoes_abertas: !stats.inscricoes_abertas })
      setStats({ ...stats, inscricoes_abertas: !stats.inscricoes_abertas })
      showToast(stats.inscricoes_abertas ? 'Inscrições encerradas' : 'Inscrições reabertas')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    }
  }

  const openDetail = (lead: Lead) => { setSelected(lead); setMode('view'); setError('') }
  const openNew = () => { setSelected({ conhecia_somma: false, aceite_lgpd: true, status: 'confirmado' }); setDraft({ conhecia_somma: false, aceite_lgpd: true, status: 'confirmado' }); setMode('edit'); setError('') }
  const startEdit = () => { setDraft({ ...selected }); setMode('edit') }
  const closeModal = () => { if (!saving) { setSelected(null); setMode('view'); setError('') } }

  const saveDraft = async () => {
    setSaving(true)
    setError('')
    try {
      await callAdmin('upsert', { row: draft })
      setSelected(null)
      setMode('view')
      showToast(draft.id ? 'Inscrição atualizada' : 'Inscrição adicionada')
      loadList(search)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setSaving(false)
    }
  }

  const doDelete = async () => {
    if (!selected?.id) return
    if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) return
    setSaving(true)
    try {
      await callAdmin('delete', { id: selected.id })
      setSelected(null)
      showToast('Inscrição deletada')
      loadList(search)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- LOGIN ---------------- */
  if (!authed) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-black px-5 text-white">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-7 sm:p-8">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF2C03]/10"><Lock className="h-6 w-6 text-[#FF2C03]" /></span>
          <h1 className="mt-4 text-2xl font-bold">Admin · Shake Out</h1>
          <p className="mt-1 text-sm text-[#A1A1A1]">Acesso restrito. Informe o código.</p>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de acesso" className={`${INPUT} mt-6`} autoFocus />
          {loginErr && <p className="mt-3 flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{loginErr}</p>}
          <button type="submit" className="mt-4 w-full rounded-lg bg-[#FF2C03] py-3.5 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35]">ENTRAR</button>
        </form>
      </main>
    )
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <main className="min-h-[100svh] bg-black pb-16 text-white">
      {/* topo fixo */}
      <header className="sticky top-0 z-30 border-b border-[#1c1c1c] bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div>
            <h1 className="text-base font-bold leading-tight sm:text-lg">Shake Out · Admin</h1>
            <p className="text-[11px] text-[#888]">Atualizado às {lastUpdate || '—'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/shakeout-centauro-somma-rj/admin/sorteio" className="flex items-center gap-1.5 rounded-lg bg-[#FF2C03]/15 px-3 py-2 text-xs font-semibold text-[#FF2C03] transition hover:bg-[#FF2C03]/25">
              <Trophy className="h-4 w-4" /> <span className="hidden sm:inline">Sorteio</span>
            </Link>
            <button onClick={() => loadList(search)} disabled={loading} className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs font-semibold transition hover:border-white/40 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Atualizar</span>
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs font-semibold text-[#A1A1A1] transition hover:border-red-500/50 hover:text-red-400">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        {/* Dashboard */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Users} label="Inscritos" value={stats?.total} loading={loading} />
          <StatCard icon={UserCheck} label="Conhecem o Somma" value={stats?.conhece} loading={loading} />
          <StatCard icon={UserX} label="Não conheciam" value={stats?.nao_conhece} loading={loading} />
          <StatCard icon={Sparkles} label="Últimas 24h" value={stats?.recentes} loading={loading} />
        </div>

        {/* Toggle inscrições */}
        <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${stats?.inscricoes_abertas ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <Power className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Inscrições {stats?.inscricoes_abertas ? 'abertas' : 'encerradas'}</p>
              <p className="text-xs text-[#A1A1A1]">{stats?.inscricoes_abertas ? 'O formulário está recebendo check-ins.' : 'O formulário mostra “vagas encerradas”.'}</p>
            </div>
          </div>
          <button onClick={toggleConfig}
            className={`rounded-lg px-5 py-3 text-sm font-bold tracking-wider transition ${stats?.inscricoes_abertas ? 'bg-red-600 hover:bg-red-700' : 'bg-[#FF2C03] hover:bg-[#ff4d35]'}`}>
            {stats?.inscricoes_abertas ? 'ENCERRAR VAGAS' : 'REABRIR VAGAS'}
          </button>
        </div>

        {/* Busca + adicionar */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadList(search)} placeholder="Buscar por nome ou CPF…" className={`${INPUT} pl-9`} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadList(search)} className="flex-1 rounded-lg border border-[#2A2A2A] px-4 py-3 text-sm font-semibold transition hover:border-white/40 sm:flex-none">Buscar</button>
            <button onClick={openNew} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FF2C03] px-4 py-3 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35] sm:flex-none">
              <Plus className="h-4 w-4" /> ADICIONAR
            </button>
          </div>
        </div>

        {error && !selected && (
          <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{error}</p>
        )}

        {/* Lista */}
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[#888]"><Loader2 className="h-5 w-5 animate-spin" /> Carregando…</div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2A2A2A] py-16 text-center text-[#666]">
              <Users className="mx-auto mb-3 h-8 w-8 opacity-40" />
              Nenhum inscrito encontrado.
            </div>
          ) : (
            <>
              {/* Mobile: cards */}
              <div className="space-y-2 md:hidden">
                {rows.map((r) => (
                  <button key={r.id} onClick={() => openDetail(r)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#2A2A2A] bg-[#0e0e0e] p-4 text-left transition active:bg-[#151515]">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{r.nome_completo}</p>
                      <p className="mt-0.5 truncate text-xs text-[#A1A1A1]">{r.cpf ? formatCPF(r.cpf) : r.email}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <StatusBadge status={r.status} />
                        <span className="text-[11px] text-[#666]">{r.uf || '—'}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[#666]" />
                  </button>
                ))}
              </div>

              {/* Desktop: tabela */}
              <div className="hidden overflow-hidden rounded-2xl border border-[#2A2A2A] md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#111] text-[10px] uppercase tracking-widest text-[#888]">
                    <tr>{['Nome', 'CPF', 'E-mail', 'UF', 'Conhecia', 'Status', ''].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} onClick={() => openDetail(r)} className="cursor-pointer border-t border-[#1c1c1c] transition hover:bg-[#0e0e0e]">
                        <td className="px-4 py-3 font-medium text-white hover:text-[#FF2C03]">{r.nome_completo}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#A1A1A1]">{r.cpf ? formatCPF(r.cpf) : '—'}</td>
                        <td className="px-4 py-3 text-[#A1A1A1]">{r.email}</td>
                        <td className="px-4 py-3">{r.uf || '—'}</td>
                        <td className="px-4 py-3">{r.conhecia_somma ? 'Sim' : 'Não'}</td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3 text-right"><ChevronRight className="ml-auto h-4 w-4 text-[#666]" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-[#666]">{rows.length} registro(s).</p>
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-full border border-[#FF2C03]/40 bg-[#111] px-5 py-2.5 text-sm font-medium text-white shadow-lg">
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF2C03]" />{toast}</span>
        </div>
      )}

      {/* Modal detalhe / edição */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[92svh] w-full overflow-y-auto rounded-t-2xl border border-[#2A2A2A] bg-[#0e0e0e] sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#1c1c1c] bg-[#0e0e0e] px-5 py-4">
              <h2 className="text-lg font-bold">{mode === 'edit' ? (selected.id ? 'Editar inscrição' : 'Nova inscrição') : 'Detalhes do inscrito'}</h2>
              <button onClick={closeModal} aria-label="Fechar" className="rounded-md p-1 text-[#888] hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="px-5 py-5">
              {error && <p className="mb-3 flex items-center gap-1.5 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{error}</p>}

              {mode === 'view' ? (
                <>
                  <dl className="divide-y divide-[#1c1c1c]">
                    {[
                      ['Nome', selected.nome_completo],
                      ['E-mail', selected.email],
                      ['Telefone', selected.telefone],
                      ['CPF', selected.cpf ? formatCPF(selected.cpf) : '—'],
                      ['UF', selected.uf || '—'],
                      ['Sexo', sexoLabel(selected.sexo)],
                      ['Conhecia o Somma', selected.conhecia_somma ? 'Sim' : 'Não'],
                      ['Aceite LGPD', selected.aceite_lgpd ? 'Sim' : 'Não'],
                      ['Comunicações', selected.aceite_comunicacoes ? 'Sim' : 'Não'],
                      ['Cadastro', fmtDate(selected.data_de_cadastro)],
                      ['Origem', selected.origem],
                    ].map(([k, v]) => (
                      <div key={k as string} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                        <dt className="shrink-0 text-[#A1A1A1]">{k}</dt>
                        <dd className="break-all text-right font-medium text-white">{v || '—'}</dd>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2.5 text-sm">
                      <dt className="text-[#A1A1A1]">Status</dt>
                      <dd><StatusBadge status={selected.status} /></dd>
                    </div>
                  </dl>

                  <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button onClick={startEdit} className="flex items-center justify-center gap-2 rounded-lg bg-[#FF2C03] py-3 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35]"><Pencil className="h-4 w-4" /> EDITAR</button>
                    <button onClick={doDelete} disabled={saving} className="flex items-center justify-center gap-2 rounded-lg border border-red-900/60 bg-red-950/30 py-3 text-sm font-bold tracking-wider text-red-400 transition hover:bg-red-950/60 disabled:opacity-50"><Trash2 className="h-4 w-4" /> DELETAR</button>
                    <button onClick={closeModal} className="flex items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] py-3 text-sm font-bold tracking-wider transition hover:border-white/40">FECHAR</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input className={`${INPUT} sm:col-span-2`} placeholder="Nome completo" value={draft.nome_completo ?? ''} onChange={(e) => setDraft({ ...draft, nome_completo: e.target.value })} />
                    <input className={INPUT} placeholder="CPF" inputMode="numeric" value={draft.cpf ? formatCPF(draft.cpf) : ''} onChange={(e) => setDraft({ ...draft, cpf: e.target.value.replace(/\D/g, '') })} />
                    <input className={INPUT} placeholder="E-mail" value={draft.email ?? ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                    <input className={INPUT} placeholder="Telefone" value={draft.telefone ?? ''} onChange={(e) => setDraft({ ...draft, telefone: e.target.value })} />
                    <select className={`${INPUT} appearance-none`} value={draft.uf ?? ''} onChange={(e) => setDraft({ ...draft, uf: e.target.value })}>
                      <option value="">UF</option>{UFS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <select className={`${INPUT} appearance-none`} value={draft.sexo ?? ''} onChange={(e) => setDraft({ ...draft, sexo: e.target.value })}>
                      <option value="">Sexo</option>{SEXOS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                    </select>
                    <select className={`${INPUT} appearance-none`} value={draft.status ?? 'confirmado'} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                      <option value="confirmado">confirmado</option><option value="cancelado">cancelado</option>
                    </select>
                  </div>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2 text-sm text-[#A1A1A1]"><input type="checkbox" className="h-4 w-4 accent-[#FF2C03]" checked={!!draft.conhecia_somma} onChange={(e) => setDraft({ ...draft, conhecia_somma: e.target.checked })} /> Já conhecia o Somma Club</label>
                    <label className="flex items-center gap-2 text-sm text-[#A1A1A1]"><input type="checkbox" className="h-4 w-4 accent-[#FF2C03]" checked={!!draft.aceite_comunicacoes} onChange={(e) => setDraft({ ...draft, aceite_comunicacoes: e.target.checked })} /> Aceita comunicações</label>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button onClick={() => (selected.id ? setMode('view') : closeModal())} disabled={saving} className="flex-1 rounded-lg border border-[#2A2A2A] py-3 text-sm font-bold tracking-wider transition hover:border-white/40 disabled:opacity-50">CANCELAR</button>
                    <button onClick={saveDraft} disabled={saving} className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-[#FF2C03] py-3 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35] disabled:opacity-50">
                      {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> SALVANDO…</> : 'SALVAR'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function StatCard({ icon: Icon, label, value, loading }: { icon: React.ElementType; label: string; value?: number; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-4 sm:p-5">
      <Icon className="mb-2 h-5 w-5 text-[#FF2C03] sm:mb-3 sm:h-6 sm:w-6" />
      <p className="text-2xl font-bold sm:text-3xl">{loading && value === undefined ? '…' : value ?? '—'}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-widest text-[#A1A1A1] sm:text-xs">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status?: string }) {
  const cancel = status === 'cancelado'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cancel ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
      {status ?? 'confirmado'}
    </span>
  )
}
