'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Search, Plus, Users, UserCheck, UserX, Sparkles, X, RefreshCw,
  ChevronRight, Check, AlertCircle, Loader2, Eye, LogOut, Home,
} from 'lucide-react'
import { formatCPF } from '@/lib/cpf'
import { CentauroLogo } from '@/components/shakeout/centauro-logo'
import { InteractiveMenu } from '@/components/ui/modern-mobile-menu'

const LOGO_SOMMA = '/Logo_Nova_Somma_Branca_Laranja.svg'
const LOGO_DOPA = 'https://seekdopa.com/cdn/shop/files/DOPA_Logo_Cinza_Original.png?v=1728398053&width=600'

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const SEXOS = [
  { v: 'masculino', label: 'Masculino' }, { v: 'feminino', label: 'Feminino' },
  { v: 'outro', label: 'Outro' }, { v: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
]
const INPUT = 'w-full rounded-lg bg-[#0c0c0c] px-4 py-3 text-base sm:text-sm text-white placeholder:text-[#666] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF2C03] transition'

type Lead = { id?: string; nome_completo?: string; email?: string; telefone?: string; cpf?: string; uf?: string; sexo?: string; conhecia_somma?: boolean; aceite_comunicacoes?: boolean; status?: string; origem?: string; data_de_cadastro?: string }
type Stats = { total: number; conhece: number; nao_conhece: number; recentes: number }

const sexoLabel = (v?: string) => SEXOS.find((s) => s.v === v)?.label ?? '—'
const fmtDate = (s?: string) => { if (!s) return '—'; try { return new Date(s).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) } catch { return s } }

export default function ParceiroPage() {
  const [codigo, setCodigo] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [nome, setNome] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [rows, setRows] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Lead>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2600) }

  const call = useCallback(async (action: string, payload: Record<string, unknown> = {}, theCode?: string) => {
    const res = await fetch('/api/leads-shakeout-centauro/parceiro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, codigo: theCode ?? codigo, ...payload }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erro')
    return data
  }, [codigo])

  const loadData = useCallback(async (s = '', theCode?: string) => {
    setLoading(true)
    try {
      const d = await call('data', { search: s }, theCode)
      setNome(d.parceiro); setStats(d.stats); setRows(d.rows ?? [])
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally { setLoading(false) }
  }, [call])

  // auto-login via ?codigo= ou sessão
  useEffect(() => {
    const url = new URLSearchParams(window.location.search)
    const c = url.get('codigo') || sessionStorage.getItem('shk_parceiro_codigo')
    if (c) {
      setCodigo(c)
      call('data', {}, c).then((d) => { setNome(d.parceiro); setStats(d.stats); setRows(d.rows ?? []); setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })); setAuthed(true); sessionStorage.setItem('shk_parceiro_codigo', c) }).catch(() => sessionStorage.removeItem('shk_parceiro_codigo'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // auto-refresh (realtime) a cada 15s
  useEffect(() => {
    if (!authed) return
    const t = setInterval(() => loadData(search), 15000)
    return () => clearInterval(t)
  }, [authed, search, loadData])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErr('')
    try { await call('data', {}, codigo); sessionStorage.setItem('shk_parceiro_codigo', codigo); setAuthed(true); loadData('', codigo) }
    catch (e2) { setLoginErr(e2 instanceof Error ? e2.message : 'Erro') }
  }

  const logout = () => {
    sessionStorage.removeItem('shk_parceiro_codigo')
    setAuthed(false); setCodigo(''); setRows([]); setStats(null); setSelected(null); setAdding(false)
  }

  const saveAdd = async () => {
    setSaving(true); setError('')
    try { await call('add', { row: draft }); setAdding(false); setDraft({}); showToast('Inscrito adicionado'); loadData(search) }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro') }
    finally { setSaving(false) }
  }

  if (!authed) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-black px-5 text-white">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-7 sm:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <img src={LOGO_DOPA} alt="Casa Dopa" className="h-4 w-auto [filter:brightness(0)_invert(1)]" />
            <span className="text-white/20">|</span>
            <CentauroLogo className="h-3.5 w-auto text-white" />
            <span className="text-white/20">|</span>
            <img src={LOGO_SOMMA} alt="Somma Club" className="h-6 w-auto" />
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF2C03]/10"><Eye className="h-6 w-6 text-[#FF2C03]" /></span>
          <h1 className="mt-4 text-2xl font-bold">Painel do Parceiro</h1>
          <p className="mt-1 text-sm text-[#A1A1A1]">Acompanhe os check-ins em tempo real.</p>
          <input type="password" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código de acesso" className={`${INPUT} mt-6`} autoFocus />
          {loginErr && <p className="mt-3 flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{loginErr}</p>}
          <button type="submit" className="mt-4 w-full rounded-lg bg-[#FF2C03] py-3.5 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35]">ENTRAR</button>
        </form>
      </main>
    )
  }

  const partnerMenu = [
    { label: 'Início', icon: Home, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Atualizar', icon: RefreshCw, action: () => loadData(search) },
    { label: 'Adicionar', icon: Plus, action: () => { setDraft({ conhecia_somma: false }); setAdding(true); setError('') } },
    { label: 'Sair', icon: LogOut, action: logout },
  ]

  return (
    <main className="min-h-[100svh] bg-black pb-28 text-white lg:pb-16">
      <header className="sticky top-0 z-30 border-b border-[#1c1c1c] bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div>
            <h1 className="flex items-center gap-2 text-base font-bold leading-tight sm:text-lg"><Eye className="h-4 w-4 text-[#FF2C03]" /> {nome || 'Parceiro'}</h1>
            <p className="text-[11px] text-[#888]">Tempo real · atualizado às {lastUpdate || '—'}</p>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <button onClick={() => loadData(search)} disabled={loading} className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs font-semibold transition hover:border-white/40 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Atualizar</span>
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-2 text-xs font-semibold text-[#A1A1A1] transition hover:border-red-500/50 hover:text-red-400">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={Users} label="Inscritos" value={stats?.total} />
          <Stat icon={UserCheck} label="Conhecem o Somma" value={stats?.conhece} />
          <Stat icon={UserX} label="Não conheciam" value={stats?.nao_conhece} />
          <Stat icon={Sparkles} label="Últimas 24h" value={stats?.recentes} />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadData(search)} placeholder="Buscar por nome ou CPF…" className={`${INPUT} pl-9`} />
          </div>
          <button onClick={() => { setDraft({ conhecia_somma: false }); setAdding(true); setError('') }} className="flex items-center justify-center gap-2 rounded-lg bg-[#FF2C03] px-4 py-3 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35]">
            <Plus className="h-4 w-4" /> ADICIONAR
          </button>
        </div>

        <div className="mt-4">
          {loading && rows.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[#888]"><Loader2 className="h-5 w-5 animate-spin" /> Carregando…</div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2A2A2A] py-16 text-center text-[#666]"><Users className="mx-auto mb-3 h-8 w-8 opacity-40" /> Nenhum inscrito ainda.</div>
          ) : (
            <>
              <div className="space-y-2 md:hidden">
                {rows.map((r) => (
                  <button key={r.id} onClick={() => setSelected(r)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#2A2A2A] bg-[#0e0e0e] p-4 text-left transition active:bg-[#151515]">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{r.nome_completo}</p>
                      <p className="mt-0.5 truncate text-xs text-[#A1A1A1]">{r.cpf ? formatCPF(r.cpf) : r.email}</p>
                      <span className="mt-1.5 inline-block text-[11px] text-[#666]">{r.uf || '—'} · {fmtDate(r.data_de_cadastro)}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[#666]" />
                  </button>
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-2xl border border-[#2A2A2A] md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#111] text-[10px] uppercase tracking-widest text-[#888]"><tr>{['Nome','CPF','E-mail','UF','Conhecia','Cadastro',''].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} onClick={() => setSelected(r)} className="cursor-pointer border-t border-[#1c1c1c] transition hover:bg-[#0e0e0e]">
                        <td className="px-4 py-3 font-medium hover:text-[#FF2C03]">{r.nome_completo}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#A1A1A1]">{r.cpf ? formatCPF(r.cpf) : '—'}</td>
                        <td className="px-4 py-3 text-[#A1A1A1]">{r.email}</td>
                        <td className="px-4 py-3">{r.uf || '—'}</td>
                        <td className="px-4 py-3">{r.conhecia_somma ? 'Sim' : 'Não'}</td>
                        <td className="px-4 py-3 text-[#A1A1A1]">{fmtDate(r.data_de_cadastro)}</td>
                        <td className="px-4 py-3 text-right"><ChevronRight className="ml-auto h-4 w-4 text-[#666]" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-[#666]">{rows.length} registro(s) · visão somente leitura.</p>
            </>
          )}
        </div>
      </div>

      {toast && <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-full border border-[#FF2C03]/40 bg-[#111] px-5 py-2.5 text-sm font-medium shadow-lg"><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF2C03]" />{toast}</span></div>}

      {/* Menu inferior animado (mobile) */}
      <div className="shk-menu-wrap fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <InteractiveMenu items={partnerMenu.map(({ label, icon }) => ({ label, icon }))} accentColor="#FF2C03" onItemClick={(i) => partnerMenu[i].action()} />
      </div>

      {/* Detalhe (somente leitura) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[92svh] w-full overflow-y-auto rounded-t-2xl border border-[#2A2A2A] bg-[#0e0e0e] sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#1c1c1c] bg-[#0e0e0e] px-5 py-4">
              <h2 className="text-lg font-bold">Detalhes do inscrito</h2>
              <button onClick={() => setSelected(null)} aria-label="Fechar" className="rounded-md p-1 text-[#888] hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-5 py-5">
              <dl className="divide-y divide-[#1c1c1c]">
                {[['Nome', selected.nome_completo],['E-mail', selected.email],['Telefone', selected.telefone],['CPF', selected.cpf ? formatCPF(selected.cpf) : '—'],['UF', selected.uf || '—'],['Sexo', sexoLabel(selected.sexo)],['Conhecia o Somma', selected.conhecia_somma ? 'Sim' : 'Não'],['Status', selected.status],['Cadastro', fmtDate(selected.data_de_cadastro)]].map(([k, v]) => (
                  <div key={k as string} className="flex items-baseline justify-between gap-4 py-2.5 text-sm"><dt className="shrink-0 text-[#A1A1A1]">{k}</dt><dd className="break-all text-right font-medium">{v || '—'}</dd></div>
                ))}
              </dl>
              <button onClick={() => setSelected(null)} className="mt-6 w-full rounded-lg border border-[#2A2A2A] py-3 text-sm font-bold tracking-wider transition hover:border-white/40">FECHAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Adicionar */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={() => !saving && setAdding(false)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[92svh] w-full overflow-y-auto rounded-t-2xl border border-[#2A2A2A] bg-[#0e0e0e] sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#1c1c1c] bg-[#0e0e0e] px-5 py-4">
              <h2 className="text-lg font-bold">Novo inscrito</h2>
              <button onClick={() => setAdding(false)} aria-label="Fechar" className="rounded-md p-1 text-[#888] hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-5 py-5">
              {error && <p className="mb-3 flex items-center gap-1.5 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{error}</p>}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input className={`${INPUT} sm:col-span-2`} placeholder="Nome completo" value={draft.nome_completo ?? ''} onChange={(e) => setDraft({ ...draft, nome_completo: e.target.value })} />
                <input className={INPUT} placeholder="CPF" inputMode="numeric" value={draft.cpf ? formatCPF(draft.cpf) : ''} onChange={(e) => setDraft({ ...draft, cpf: e.target.value.replace(/\D/g, '') })} />
                <input className={INPUT} placeholder="E-mail" value={draft.email ?? ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                <input className={INPUT} placeholder="Telefone" value={draft.telefone ?? ''} onChange={(e) => setDraft({ ...draft, telefone: e.target.value })} />
                <select className={`${INPUT} appearance-none`} value={draft.uf ?? ''} onChange={(e) => setDraft({ ...draft, uf: e.target.value })}><option value="">UF</option>{UFS.map((u) => <option key={u} value={u}>{u}</option>)}</select>
                <select className={`${INPUT} appearance-none`} value={draft.sexo ?? ''} onChange={(e) => setDraft({ ...draft, sexo: e.target.value })}><option value="">Sexo</option>{SEXOS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}</select>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-[#A1A1A1]"><input type="checkbox" className="h-4 w-4 accent-[#FF2C03]" checked={!!draft.conhecia_somma} onChange={(e) => setDraft({ ...draft, conhecia_somma: e.target.checked })} /> Já conhecia o Somma Club</label>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setAdding(false)} disabled={saving} className="flex-1 rounded-lg border border-[#2A2A2A] py-3 text-sm font-bold tracking-wider transition hover:border-white/40 disabled:opacity-50">CANCELAR</button>
                <button onClick={saveAdd} disabled={saving} className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-[#FF2C03] py-3 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35] disabled:opacity-50">{saving ? <><Loader2 className="h-4 w-4 animate-spin" /> SALVANDO…</> : 'ADICIONAR'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: number }) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-4 sm:p-5">
      <Icon className="mb-2 h-5 w-5 text-[#FF2C03] sm:mb-3 sm:h-6 sm:w-6" />
      <p className="text-2xl font-bold sm:text-3xl">{value ?? '—'}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-widest text-[#A1A1A1] sm:text-xs">{label}</p>
    </div>
  )
}
