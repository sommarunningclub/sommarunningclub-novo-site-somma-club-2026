'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Sparkles, Loader2, AlertCircle, Lock } from 'lucide-react'
import SorteioMachine from '@/components/sorteio/SorteioMachine'
import GanhadorCard from '@/components/sorteio/GanhadorCard'
import SorteioHistorico from '@/components/sorteio/SorteioHistorico'
import type { Ganhador, Sorteio } from '@/lib/sorteio/types'

const CONHECE_OPTS = [
  { v: 'todos', label: 'Todos os inscritos' },
  { v: 'sim', label: 'Só quem CONHECE o Somma' },
  { v: 'nao', label: 'Só quem NÃO conhece o Somma' },
]
const INPUT = 'w-full rounded-lg bg-[#0c0c0c] px-4 py-3 text-base sm:text-sm text-white placeholder:text-[#666] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF2C03] transition'

export default function SorteioPage() {
  const [code, setCode] = useState<string | null>(null)
  const [conhece, setConhece] = useState('todos')
  const [titulo, setTitulo] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [elegiveis, setElegiveis] = useState<number | null>(null)
  const [sorteando, setSorteando] = useState(false)
  const [nomesAnimacao, setNomesAnimacao] = useState<string[]>([])
  const [ganhadores, setGanhadores] = useState<Ganhador[]>([])
  const [historico, setHistorico] = useState<Sorteio[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const pending = useRef<Ganhador[]>([])

  useEffect(() => { setCode(sessionStorage.getItem('shk_admin_code')) }, [])

  const call = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    const res = await fetch('/api/leads-shakeout-centauro/sorteio', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, code, ...payload }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erro')
    return data
  }, [code])

  const loadStats = useCallback(async (c: string) => {
    try { const d = await call('participants', { conhece: c }); setElegiveis(d.stats.total) } catch { /* ignore */ }
  }, [call])

  const loadHistorico = useCallback(async () => {
    try { const d = await call('historico'); setHistorico(d.sorteios ?? []) } catch { /* ignore */ }
  }, [call])

  useEffect(() => { if (code) { loadStats(conhece); loadHistorico() } }, [code]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (code) loadStats(conhece) }, [conhece]) // eslint-disable-line react-hooks/exhaustive-deps

  const sortear = async () => {
    setError('')
    if (!titulo.trim()) return setError('Informe o título/prêmio do sorteio.')
    if (quantidade < 1) return setError('Quantidade inválida.')
    setLoading(true)
    try {
      const d = await call('sortear', { titulo, quantidade, conhece, criado_por: 'Admin Shake Out' })
      const gs: Ganhador[] = d.sorteio.ganhadores
      pending.current = gs
      setGanhadores([])
      setNomesAnimacao(gs.map((g) => g.checkin?.nome_completo || '???'))
      setSorteando(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }

  const onAnimacaoCompleta = () => {
    setSorteando(false)
    setGanhadores(pending.current)
    loadHistorico()
  }

  const onConfirmar = async (id: string) => { await call('confirmar', { id }) }
  const onAusente = async (id: string) => { await call('ausente', { id }) }
  const onResorteio = async (id: string): Promise<Ganhador | null> => {
    const d = await call('resorteio', { id }); loadHistorico(); return d.ganhador ?? null
  }
  const onLimparHistorico = async () => { await call('limpar'); setHistorico([]) }

  // sem sessão -> manda logar no admin
  if (code === null) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Lock className="mb-4 h-9 w-9 text-[#FF2C03]" />
        <p className="text-lg font-semibold">Sessão necessária</p>
        <p className="mt-1 text-sm text-[#A1A1A1]">Faça login no admin para acessar o sorteio.</p>
        <Link href="/shakeout-centauro-somma-rj/admin" className="mt-5 rounded-lg bg-[#FF2C03] px-6 py-3 text-sm font-bold tracking-wider">IR PARA O ADMIN</Link>
      </main>
    )
  }

  return (
    <main className="min-h-[100svh] bg-black pb-16 text-white">
      <header className="sticky top-0 z-30 border-b border-[#1c1c1c] bg-black/90 px-4 py-3.5 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link href="/shakeout-centauro-somma-rj/admin" className="rounded-lg border border-[#2A2A2A] p-2 transition hover:border-white/40" aria-label="Voltar"><ArrowLeft className="h-4 w-4" /></Link>
          <h1 className="flex items-center gap-2 text-base font-bold sm:text-lg"><Trophy className="h-5 w-5 text-[#FF2C03]" /> Sorteio · Shake Out</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        {/* Config do sorteio */}
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#A1A1A1]">Quem participa</label>
          <select value={conhece} onChange={(e) => setConhece(e.target.value)} className={`${INPUT} appearance-none`}>
            {CONHECE_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
          </select>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-[#A1A1A1]">
            <Sparkles className="h-4 w-4 text-[#FF2C03]" />
            {elegiveis === null ? 'Calculando elegíveis…' : <><strong className="text-white">{elegiveis}</strong> participante(s) elegível(is)</>}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={INPUT} placeholder="Título / prêmio (ex: Kit Centauro)" />
            <input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))} className={`${INPUT} sm:w-28`} placeholder="Qtd" aria-label="Quantidade" />
          </div>

          {error && <p className="mt-3 flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{error}</p>}

          <button onClick={sortear} disabled={loading || sorteando}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF2C03] py-4 text-sm font-bold tracking-wider transition hover:bg-[#ff4d35] disabled:opacity-50">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> SORTEANDO…</> : <><Trophy className="h-4 w-4" /> SORTEAR</>}
          </button>
        </div>

        {/* Animação */}
        {sorteando && nomesAnimacao.length > 0 && (
          <div className="mt-5">
            <SorteioMachine nomes={nomesAnimacao} onComplete={onAnimacaoCompleta} />
          </div>
        )}

        {/* Ganhadores */}
        {!sorteando && ganhadores.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Trophy className="h-5 w-5 text-[#FF2C03]" /> Ganhadores</h2>
            <div className="space-y-3">
              {ganhadores.map((g) => (
                <GanhadorCard key={g.id} ganhador={g} onConfirmar={onConfirmar} onAusente={onAusente} onResorteio={onResorteio} />
              ))}
            </div>
          </div>
        )}

        {/* Histórico */}
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-bold">Histórico</h2>
          <SorteioHistorico sorteios={historico} onLimparHistorico={onLimparHistorico} />
        </div>
      </div>
    </main>
  )
}
