'use client'

import { useEffect, useState, useCallback } from 'react'
import { Lock, Search, Plus, Pencil, Users, UserCheck, UserX, Power, X, RefreshCw } from 'lucide-react'
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
  data_de_cadastro?: string
}
type Stats = { total: number; conhece: number; nao_conhece: number; inscricoes_abertas: boolean }

const INPUT = 'w-full rounded-md bg-[#0c0c0c] px-4 py-2.5 text-sm text-white placeholder:text-[#666] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF2C03] transition'

export default function AdminPage() {
  const [code, setCode] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [rows, setRows] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [saving, setSaving] = useState(false)

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
    try {
      const [st, ls] = await Promise.all([
        callAdmin('stats', {}, theCode),
        callAdmin('list', { search: s }, theCode),
      ])
      setStats(st)
      setRows(ls.rows ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [callAdmin])

  // auto-login se já tiver código salvo
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('shk_admin_code') : null
    if (saved) {
      setCode(saved)
      callAdmin('stats', {}, saved)
        .then(() => { setAuthed(true); loadList('', saved) })
        .catch(() => sessionStorage.removeItem('shk_admin_code'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await callAdmin('stats')
      sessionStorage.setItem('shk_admin_code', code)
      setAuthed(true)
      loadList('')
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Erro')
    }
  }

  const toggleConfig = async () => {
    if (!stats) return
    try {
      await callAdmin('config_set', { inscricoes_abertas: !stats.inscricoes_abertas })
      setStats({ ...stats, inscricoes_abertas: !stats.inscricoes_abertas })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    }
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    setError('')
    try {
      await callAdmin('upsert', { row: editing })
      setEditing(null)
      loadList(search)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setSaving(false)
    }
  }

  /* ---------- LOGIN ---------- */
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-8">
          <Lock className="mb-4 h-8 w-8 text-[#FF2C03]" />
          <h1 className="text-2xl font-bold">Admin · Shake Out</h1>
          <p className="mt-1 text-sm text-[#A1A1A1]">Acesso restrito.</p>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de acesso" className={`${INPUT} mt-6`} autoFocus />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button type="submit" className="mt-4 w-full rounded-md bg-[#FF2C03] py-3 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35]">ENTRAR</button>
        </form>
      </main>
    )
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Shake Out · Inscritos</h1>
          <button onClick={() => loadList(search)} className="flex items-center gap-2 rounded-md border border-[#2A2A2A] px-4 py-2 text-sm transition hover:border-white/40">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat icon={Users} label="Total de inscritos" value={stats?.total ?? '—'} />
          <Stat icon={UserCheck} label="Já conheciam o Somma" value={stats?.conhece ?? '—'} />
          <Stat icon={UserX} label="Não conheciam" value={stats?.nao_conhece ?? '—'} />
        </div>

        {/* Toggle inscrições */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#2A2A2A] bg-[#0e0e0e] p-5">
          <div>
            <p className="text-sm font-semibold">Estado das inscrições</p>
            <p className="text-sm text-[#A1A1A1]">
              {stats?.inscricoes_abertas ? 'Abertas — o formulário está recebendo check-ins.' : 'Encerradas — o formulário mostra “vagas encerradas”.'}
            </p>
          </div>
          <button onClick={toggleConfig}
            className={`flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold tracking-wider transition ${stats?.inscricoes_abertas ? 'bg-red-600 hover:bg-red-700' : 'bg-[#FF2C03] hover:bg-[#ff4d35]'}`}>
            <Power className="h-4 w-4" />
            {stats?.inscricoes_abertas ? 'ENCERRAR VAGAS' : 'REABRIR VAGAS'}
          </button>
        </div>

        {/* Busca + adicionar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadList(search)}
              placeholder="Buscar por nome ou CPF…"
              className={`${INPUT} pl-9`}
            />
          </div>
          <button onClick={() => loadList(search)} className="rounded-md border border-[#2A2A2A] px-4 py-2.5 text-sm transition hover:border-white/40">Buscar</button>
          <button onClick={() => setEditing({ conhecia_somma: false, aceite_lgpd: true, status: 'confirmado' })}
            className="flex items-center gap-2 rounded-md bg-[#FF2C03] px-4 py-2.5 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35]">
            <Plus className="h-4 w-4" /> ADICIONAR
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        {/* Tabela */}
        <div className="overflow-x-auto rounded-xl border border-[#2A2A2A]">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-[#111] text-[10px] uppercase tracking-widest text-[#888]">
              <tr>
                {['Nome', 'CPF', 'E-mail', 'Telefone', 'UF', 'Sexo', 'Conhecia', 'Status', ''].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[#1c1c1c] hover:bg-[#0e0e0e]">
                  <td className="px-3 py-2.5">{r.nome_completo}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{r.cpf ? formatCPF(r.cpf) : '—'}</td>
                  <td className="px-3 py-2.5 text-[#A1A1A1]">{r.email}</td>
                  <td className="px-3 py-2.5 text-[#A1A1A1]">{r.telefone}</td>
                  <td className="px-3 py-2.5">{r.uf || '—'}</td>
                  <td className="px-3 py-2.5 capitalize">{r.sexo || '—'}</td>
                  <td className="px-3 py-2.5">{r.conhecia_somma ? 'Sim' : 'Não'}</td>
                  <td className="px-3 py-2.5">{r.status}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button onClick={() => setEditing(r)} className="text-[#FF2C03] hover:text-[#ff4d35]" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={9} className="px-3 py-10 text-center text-[#666]">{loading ? 'Carregando…' : 'Nenhum inscrito encontrado.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#666]">{rows.length} registro(s) exibido(s).</p>
      </div>

      {/* Modal editar/adicionar */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => !saving && setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing.id ? 'Editar inscrito' : 'Novo inscrito'}</h2>
              <button onClick={() => setEditing(null)} aria-label="Fechar"><X className="h-5 w-5 text-[#888]" /></button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className={`${INPUT} sm:col-span-2`} placeholder="Nome completo" value={editing.nome_completo ?? ''} onChange={(e) => setEditing({ ...editing, nome_completo: e.target.value })} />
              <input className={INPUT} placeholder="CPF" value={editing.cpf ? formatCPF(editing.cpf) : ''} onChange={(e) => setEditing({ ...editing, cpf: e.target.value.replace(/\D/g, '') })} />
              <input className={INPUT} placeholder="E-mail" value={editing.email ?? ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              <input className={INPUT} placeholder="Telefone" value={editing.telefone ?? ''} onChange={(e) => setEditing({ ...editing, telefone: e.target.value })} />
              <select className={`${INPUT} appearance-none`} value={editing.uf ?? ''} onChange={(e) => setEditing({ ...editing, uf: e.target.value })}>
                <option value="">UF</option>
                {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <select className={`${INPUT} appearance-none`} value={editing.sexo ?? ''} onChange={(e) => setEditing({ ...editing, sexo: e.target.value })}>
                <option value="">Sexo</option>
                {SEXOS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
              <select className={`${INPUT} appearance-none`} value={editing.status ?? 'confirmado'} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                <option value="confirmado">confirmado</option>
                <option value="cancelado">cancelado</option>
              </select>
            </div>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 text-sm text-[#A1A1A1]">
                <input type="checkbox" className="h-4 w-4 accent-[#FF2C03]" checked={!!editing.conhecia_somma} onChange={(e) => setEditing({ ...editing, conhecia_somma: e.target.checked })} />
                Já conhecia o Somma Club
              </label>
              <label className="flex items-center gap-2 text-sm text-[#A1A1A1]">
                <input type="checkbox" className="h-4 w-4 accent-[#FF2C03]" checked={!!editing.aceite_comunicacoes} onChange={(e) => setEditing({ ...editing, aceite_comunicacoes: e.target.checked })} />
                Aceita comunicações
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} disabled={saving} className="rounded-md border border-[#2A2A2A] px-5 py-2.5 text-sm transition hover:border-white/40">Cancelar</button>
              <button onClick={save} disabled={saving} className="rounded-md bg-[#FF2C03] px-6 py-2.5 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35] disabled:opacity-50">{saving ? 'Salvando…' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#0e0e0e] p-5">
      <Icon className="mb-3 h-6 w-6 text-[#FF2C03]" />
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-[#A1A1A1]">{label}</p>
    </div>
  )
}
