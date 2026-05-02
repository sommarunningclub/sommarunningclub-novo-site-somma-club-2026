'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Lock, LogOut, Plus, Trash2, Users, Trophy, Save, AlertCircle,
  ChevronDown, X, Eye, EyeOff, Pencil, Copy, Camera, ImageIcon,
  Settings, Download, RotateCw, ListOrdered,
} from 'lucide-react'
import Cronometro from './Cronometro'
import { msParaDisplay, displayParaMs, segundosParaMs, MODALIDADES, TIPO_PROVA_LABEL } from '@/lib/wings-cronometragem/tempo'
import type { AtleticaComp, AtletaComp, RunComp } from '@/lib/wings-cronometragem/types'
import type { Fase, Sexo, Modalidade, TipoProva } from '@/lib/wings-cronometragem/tempo'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

type Toast = { tipo: 'ok' | 'erro'; msg: string } | null
type Aba = 'registrar' | 'equipes' | 'runs'

export default function WingsAdminClient() {
  const [logado, setLogado] = useState<boolean | null>(null)
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [erroLogin, setErroLogin] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [atleticas, setAtleticas] = useState<AtleticaComp[]>([])
  const [atletasPorAtletica, setAtletasPorAtletica] = useState<Record<string, AtletaComp[]>>({})
  const [runs, setRuns] = useState<RunComp[]>([])
  const [toast, setToast] = useState<Toast>(null)
  const [modalConfig, setModalConfig] = useState(false)

  const [aba, setAba] = useState<Aba>('registrar')

  useEffect(() => {
    let cancelado = false
    async function probe() {
      const r = await fetch('/api/wings-comp/atleticas?id=00000000-0000-0000-0000-000000000000', {
        method: 'DELETE',
      }).catch(() => null)
      if (cancelado) return
      setLogado(r != null && r.status !== 401)
    }
    probe()
    carregarTudo()
    return () => { cancelado = true }
  }, [])

  async function carregarTudo() {
    try {
      const [aR, atR, rR] = await Promise.all([
        fetch('/api/wings-comp/atleticas').then(r => r.json()),
        fetch('/api/wings-comp/atletas').then(r => r.json()),
        fetch('/api/wings-comp/runs').then(r => r.json()),
      ])
      setAtleticas(aR.atleticas ?? [])
      const lista: AtletaComp[] = atR.atletas ?? []
      const agrupado: Record<string, AtletaComp[]> = {}
      for (const a of lista) (agrupado[a.atletica_id] ??= []).push(a)
      setAtletasPorAtletica(agrupado)
      setRuns(rR.runs ?? [])
    } catch {
      // ignore — vai mostrar listas vazias
    }
  }

  function showToast(t: NonNullable<Toast>) {
    setToast(t)
    setTimeout(() => setToast(null), 3500)
  }

  async function fazerLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoadingLogin(true)
    setErroLogin('')
    try {
      const res = await fetch('/api/wings-comp/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setErroLogin(j.error || 'Senha incorreta.')
        return
      }
      setLogado(true)
    } finally {
      setLoadingLogin(false)
    }
  }

  async function logout() {
    if (!confirm('Sair do painel?')) return
    await fetch('/api/wings-comp/auth', { method: 'DELETE' })
    setLogado(false)
    setSenha('')
  }

  if (logado === null) {
    return (
      <main className="min-h-[100dvh] bg-wfl-navy text-white flex items-center justify-center" style={fontBody}>
        <p className="text-white/60">Carregando…</p>
      </main>
    )
  }

  if (!logado) {
    return (
      <main className="min-h-[100dvh] bg-wfl-navy text-white flex items-center justify-center px-4" style={fontBody}>
        <form
          onSubmit={fazerLogin}
          className="w-full max-w-sm bg-white/5 border border-white/10 p-6 sm:p-8"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-wfl-yellow" />
            <span className="text-xs tracking-[0.3em] uppercase text-wfl-yellow font-bold">Acesso Somma</span>
          </div>
          <h1 className="text-3xl sm:text-4xl uppercase leading-none" style={fontDisplay}>
            Cronometragem
          </h1>
          <p className="mt-2 text-sm text-white/60">Painel restrito da equipe Somma.</p>
          <label htmlFor="senha-input" className="block mt-6 text-xs uppercase tracking-wider text-white/70">
            Senha
          </label>
          <div className="relative mt-1.5">
            <input
              id="senha-input"
              type={showSenha ? 'text' : 'password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-black/30 border border-white/15 px-4 py-3 pr-11 text-base text-white outline-none focus:border-wfl-yellow"
              required
            />
            <button
              type="button"
              onClick={() => setShowSenha(s => !s)}
              className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-white/50 hover:text-white"
              aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {erroLogin && (
            <p className="mt-2 text-sm text-wfl-red flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {erroLogin}
            </p>
          )}
          <button
            type="submit"
            disabled={loadingLogin}
            className="mt-5 w-full min-h-12 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 disabled:opacity-50 text-white text-sm font-bold tracking-[0.2em] uppercase transition-colors"
          >
            {loadingLogin ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] bg-wfl-navy text-white" style={fontBody}>
      <header
        className="border-b border-white/10 bg-black/40 sticky top-0 z-20 backdrop-blur"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">Acesso Somma</p>
            <h1 className="text-lg sm:text-2xl uppercase leading-none truncate" style={fontDisplay}>
              Cronometragem
            </h1>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <a
              href="/wings/ranking"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center min-h-9 min-w-9 sm:px-3 sm:gap-1.5 text-xs font-semibold uppercase tracking-wider text-wfl-yellow hover:bg-white/5 rounded transition-colors"
              aria-label="Abrir ranking ao vivo"
              title="Ranking ao vivo"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Ranking</span>
            </a>
            <button
              onClick={() => setModalConfig(true)}
              className="inline-flex items-center justify-center min-h-9 min-w-9 sm:px-3 sm:gap-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
              aria-label="Configurações"
              title="Configurações"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center min-h-9 min-w-9 sm:px-3 sm:gap-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Tabs (só mobile) */}
        <nav className="lg:hidden border-t border-white/10 grid grid-cols-3" role="tablist">
          {([
            { id: 'registrar', label: 'Run', Icon: Trophy },
            { id: 'equipes', label: 'Equipes', Icon: Users, count: atleticas.length },
            { id: 'runs', label: 'Salvas', Icon: ListOrdered, count: runs.length },
          ] as const).map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={aba === t.id}
              onClick={() => setAba(t.id)}
              className={`min-h-12 inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                aba === t.id ? 'bg-wfl-red text-white' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <t.Icon className="w-4 h-4" /> {t.label}
              {'count' in t && t.count > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 bg-white/20 text-[10px]">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div
        className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
      >
        <div className={`${aba === 'registrar' ? 'block' : 'hidden'} lg:block lg:order-1`}>
          <ColunaRegistrarRun
            atleticas={atleticas}
            atletasPorAtletica={atletasPorAtletica}
            runs={runs}
            showToast={showToast}
            onSaved={carregarTudo}
          />
        </div>
        <div className={`${aba === 'equipes' ? 'block' : 'hidden'} lg:block lg:order-2`}>
          <ColunaAtleticas
            atleticas={atleticas}
            atletasPorAtletica={atletasPorAtletica}
            onChange={carregarTudo}
            showToast={showToast}
          />
        </div>
        <div className={`${aba === 'runs' ? 'block' : 'hidden'} lg:block lg:order-3`}>
          <ColunaRunsSalvas
            runs={runs}
            atleticas={atleticas}
            onChange={carregarTudo}
            showToast={showToast}
          />
        </div>
      </div>

      {modalConfig && (
        <ModalConfig
          atleticas={atleticas}
          atletasPorAtletica={atletasPorAtletica}
          runs={runs}
          onClose={() => setModalConfig(false)}
          onChange={carregarTudo}
          showToast={showToast}
        />
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 -translate-x-1/2 px-4 py-3 text-sm font-semibold border shadow-2xl z-30 max-w-[90vw] ${
            toast.tipo === 'ok'
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-wfl-red border-wfl-red text-white'
          }`}
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        >
          {toast.msg}
        </div>
      )}
    </main>
  )
}

// =====================================================================
// COLUNA — Registrar Run
// =====================================================================

function ColunaRegistrarRun({
  atleticas,
  atletasPorAtletica,
  runs,
  showToast,
  onSaved,
}: {
  atleticas: AtleticaComp[]
  atletasPorAtletica: Record<string, AtletaComp[]>
  runs: RunComp[]
  showToast: (t: NonNullable<Toast>) => void
  onSaved: () => Promise<void>
}) {
  const [atleticaId, setAtleticaId] = useState('')
  const [fase, setFase] = useState<Fase>('classificatoria')
  const [tipoProva, setTipoProva] = useState<TipoProva>('normal')
  const [bateriaStr, setBateriaStr] = useState('')
  const [raiaStr, setRaiaStr] = useState('')
  const [tempoStr, setTempoStr] = useState('')
  const [pen, setPen] = useState<[string, string, string, string]>(['0', '0', '0', '0'])
  const [obs, setObs] = useState('')
  const [salvando, setSalvando] = useState(false)

  const tempoBrutoMs = displayParaMs(tempoStr)
  const tempoBrutoValido = !isNaN(tempoBrutoMs) && tempoBrutoMs > 0
  // Penalidades só fazem sentido na prova dinâmica
  const penalidadesMs = (tipoProva === 'dinamico'
    ? pen.map(s => {
        const n = Number(String(s).replace(',', '.'))
        return isNaN(n) ? 0 : segundosParaMs(n)
      })
    : [0, 0, 0, 0]) as [number, number, number, number]
  const totalPenalidades = penalidadesMs.reduce((a, b) => a + b, 0)
  const tempoFinalMs = tempoBrutoValido ? tempoBrutoMs + totalPenalidades : 0

  const atleticaSelecionada = atleticas.find(a => a.id === atleticaId)
  const atletasDaAtletica = atleticaId ? atletasPorAtletica[atleticaId] ?? [] : []
  const equipeIncompleta =
    atleticaId &&
    (atletasDaAtletica.filter(a => a.sexo === 'M').length < 2 ||
      atletasDaAtletica.filter(a => a.sexo === 'F').length < 2)

  // Indicador de progresso da equipe selecionada nesta fase
  const runsDaEquipeNaFase = atleticaId
    ? runs.filter(r => r.atletica_id === atleticaId && r.fase === fase)
    : []
  const temNormal = runsDaEquipeNaFase.some(r => r.tipo_prova === 'normal')
  const temDinamico = runsDaEquipeNaFase.some(r => r.tipo_prova === 'dinamico')

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!atleticaId) return showToast({ tipo: 'erro', msg: 'Selecione uma atlética.' })
    if (!tempoBrutoValido) return showToast({ tipo: 'erro', msg: 'Tempo bruto inválido.' })
    setSalvando(true)
    try {
      const res = await fetch('/api/wings-comp/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atletica_id: atleticaId,
          fase,
          tipo_prova: tipoProva,
          bateria: bateriaStr ? Number(bateriaStr) : null,
          raia: raiaStr ? Number(raiaStr) : null,
          tempo_bruto_ms: tempoBrutoMs,
          penalidade_1_ms: penalidadesMs[0],
          penalidade_2_ms: penalidadesMs[1],
          penalidade_3_ms: penalidadesMs[2],
          penalidade_4_ms: penalidadesMs[3],
          observacoes: obs,
        }),
      })
      const j = await res.json()
      if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar.' })
      showToast({ tipo: 'ok', msg: `✅ ${TIPO_PROVA_LABEL[tipoProva]} da ${atleticaSelecionada?.nome ?? 'equipe'} salva!` })
      setTempoStr('')
      setPen(['0', '0', '0', '0'])
      setObs('')
      // bateria fica preenchida pra próxima run (mesmo bateria, equipe diferente)
      setRaiaStr('')
      await onSaved()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="bg-white/5 border border-white/10 p-4 sm:p-5">
      <h2 className="text-lg sm:text-2xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
        <Trophy className="w-5 h-5 text-wfl-yellow" /> Registrar Run
      </h2>

      <div className="mt-4">
        <Cronometro onTempoCapturado={ms => setTempoStr(msParaDisplay(ms))} />
      </div>

      <form onSubmit={salvar} className="mt-4 space-y-4">
        <div>
          <label htmlFor="select-atletica" className="text-[10px] uppercase tracking-wider text-white/60">
            Atlética
          </label>
          <div className="relative">
            <select
              id="select-atletica"
              value={atleticaId}
              onChange={e => setAtleticaId(e.target.value)}
              required
              className="mt-1 w-full min-h-12 appearance-none bg-black/40 border border-white/15 pl-3 pr-9 text-base text-white outline-none focus:border-wfl-yellow"
            >
              <option value="">Selecione…</option>
              {atleticas.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none mt-0.5" />
          </div>
          {equipeIncompleta && (
            <p className="mt-1 text-[10px] text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Equipe ainda não está completa (mínimo 2M + 2F).
            </p>
          )}

          {/* Indicador de progresso da equipe na fase: ✓ Normal · ⏳ Dinâmica */}
          {atleticaId && (
            <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider">
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 ${
                  temNormal ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'
                }`}
              >
                {temNormal ? '✓' : '○'} Normal
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 ${
                  temDinamico ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'
                }`}
              >
                {temDinamico ? '✓' : '○'} Dinâmica
              </span>
              {temNormal && temDinamico && (
                <span className="text-emerald-400">· combinada disponível</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Fase</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['classificatoria', 'final'] as Fase[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFase(f)}
                className={`min-h-11 text-xs font-bold uppercase tracking-wider transition-colors ${
                  fase === f ? 'bg-wfl-red text-white' : 'bg-black/40 text-white/60 hover:bg-black/60'
                }`}
              >
                {f === 'classificatoria' ? 'Classificatória' : 'Final'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Tipo da prova</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['normal', 'dinamico'] as TipoProva[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTipoProva(t)}
                className={`min-h-11 text-xs font-bold uppercase tracking-wider transition-colors ${
                  tipoProva === t
                    ? t === 'normal'
                      ? 'bg-wfl-yellow text-wfl-navy'
                      : 'bg-wfl-red text-white'
                    : 'bg-black/40 text-white/60 hover:bg-black/60'
                }`}
              >
                {t === 'normal' ? 'Atletismo' : 'Dinâmica'}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[10px] text-white/40">
            {tipoProva === 'normal'
              ? '4×100m corrida tradicional. Sem penalidades por modalidade.'
              : '4×100m com 4 estilos: saltada · lateral E · costas · lateral D.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="input-bateria" className="text-[10px] uppercase tracking-wider text-white/60">
              Bateria <span className="text-white/30">(opcional)</span>
            </label>
            <input
              id="input-bateria"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={bateriaStr}
              onChange={e => setBateriaStr(e.target.value)}
              placeholder="1"
              className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="input-raia" className="text-[10px] uppercase tracking-wider text-white/60">
              Raia <span className="text-white/30">(1–8)</span>
            </label>
            <input
              id="input-raia"
              type="number"
              inputMode="numeric"
              min="1"
              max="8"
              step="1"
              value={raiaStr}
              onChange={e => setRaiaStr(e.target.value)}
              placeholder="1"
              className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow tabular-nums"
            />
          </div>
        </div>

        <div>
          <label htmlFor="input-tempo" className="text-[10px] uppercase tracking-wider text-white/60">
            Tempo bruto · MM:SS.ms
          </label>
          <input
            id="input-tempo"
            value={tempoStr}
            onChange={e => setTempoStr(e.target.value)}
            placeholder="01:23.456"
            inputMode="decimal"
            className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-lg font-mono tabular-nums text-white outline-none focus:border-wfl-yellow"
          />
          {tempoStr && !tempoBrutoValido && (
            <p className="mt-1 text-[10px] text-wfl-red">Use o formato MM:SS.ms (ex: 01:23.456).</p>
          )}
        </div>

        {tipoProva === 'dinamico' && (
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/60">
              Penalidades por modalidade (segundos)
            </label>
            <div className="mt-1 space-y-1.5">
              {MODALIDADES.map((m, i) => (
                <div key={m.num} className="flex items-center gap-2 bg-black/30 border border-white/5 px-2 py-1.5">
                  <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-wfl-yellow/20 text-wfl-yellow text-xs font-bold">
                    {m.num}
                  </span>
                  <span className="flex-1 text-xs text-white/70 truncate">{m.nome}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    value={pen[i]}
                    onChange={e => {
                      const novo = [...pen] as typeof pen
                      novo[i] = e.target.value
                      setPen(novo)
                    }}
                    className="w-20 min-h-9 bg-black/50 border border-white/10 px-2 text-sm text-white outline-none focus:border-wfl-yellow text-right tabular-nums"
                  />
                  <span className="text-[10px] text-white/40 w-2">s</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="input-obs" className="text-[10px] uppercase tracking-wider text-white/60">
            Observações <span className="text-white/30">(opcional)</span>
          </label>
          <input
            id="input-obs"
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="mt-1 w-full min-h-11 bg-black/40 border border-white/15 px-3 text-sm text-white outline-none focus:border-wfl-yellow"
          />
        </div>

        <div className="bg-black/50 border border-white/10 p-3">
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-white/50">
            <span>Tempo bruto</span>
            <span className="font-mono text-sm text-white tabular-nums">
              {tempoBrutoValido ? msParaDisplay(tempoBrutoMs) : '--:--.---'}
            </span>
          </div>
          {tipoProva === 'dinamico' && (
            <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-white/50 mt-1">
              <span>Σ Penalidades</span>
              <span className="font-mono text-sm text-white tabular-nums">+{(totalPenalidades / 1000).toFixed(2)}s</span>
            </div>
          )}
          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-wfl-yellow font-bold">
              Tempo {tipoProva === 'normal' ? '(atletismo)' : '(dinâmica)'}
            </span>
            <span
              className={`font-mono text-3xl font-bold tabular-nums leading-none ${
                totalPenalidades > 0 ? 'text-wfl-red' : 'text-wfl-yellow'
              }`}
            >
              {tempoBrutoValido ? msParaDisplay(tempoFinalMs) : '--:--.---'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!tempoBrutoValido || !atleticaId || salvando}
          className="w-full min-h-14 inline-flex items-center justify-center gap-2 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold tracking-[0.2em] uppercase transition-colors"
        >
          <Save className="w-4 h-4" />
          {salvando ? 'Salvando…' : 'Salvar Run'}
        </button>
      </form>
    </section>
  )
}

// =====================================================================
// COLUNA — Equipes
// =====================================================================

function ColunaAtleticas({
  atleticas,
  atletasPorAtletica,
  onChange,
  showToast,
}: {
  atleticas: AtleticaComp[]
  atletasPorAtletica: Record<string, AtletaComp[]>
  onChange: () => Promise<void>
  showToast: (t: NonNullable<Toast>) => void
}) {
  const [modalAtleticaCriar, setModalAtleticaCriar] = useState(false)
  const [modalAtleticaEditar, setModalAtleticaEditar] = useState<AtleticaComp | null>(null)
  const [modalAtleta, setModalAtleta] = useState<{ atletica: AtleticaComp; editar?: AtletaComp } | null>(null)
  const [expandida, setExpandida] = useState<string | null>(null)

  async function removerAtletica(a: AtleticaComp) {
    if (!confirm(`Remover a atlética "${a.nome}"?\nIsso apaga atletas e runs associados.`)) return
    const res = await fetch(`/api/wings-comp/atleticas?id=${a.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      return showToast({ tipo: 'erro', msg: j.error || 'Erro ao remover.' })
    }
    showToast({ tipo: 'ok', msg: 'Atlética removida.' })
    await onChange()
  }

  async function duplicar(a: AtleticaComp) {
    const res = await fetch('/api/wings-comp/duplicar-atletica', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: a.id }),
    })
    const j = await res.json()
    if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao duplicar.' })
    showToast({ tipo: 'ok', msg: `✅ Duplicada como "${j.atletica.nome}" (${j.atletas_copiados} atletas copiados).` })
    await onChange()
  }

  return (
    <section className="bg-white/5 border border-white/10 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-2xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
          <Users className="w-5 h-5 text-wfl-yellow" /> Equipes
          <span className="text-xs sm:text-sm text-white/40 font-normal" style={fontBody}>
            ({atleticas.length})
          </span>
        </h2>
        <button
          onClick={() => setModalAtleticaCriar(true)}
          className="inline-flex items-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 text-white px-3 py-2 min-h-9 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nova
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {atleticas.length === 0 && (
          <li className="text-sm text-white/40 text-center py-8 border border-dashed border-white/10">
            Nenhuma equipe ainda. Toque em <strong className="text-white/60">Nova</strong> pra começar.
          </li>
        )}
        {atleticas.map(a => {
          const atletas = atletasPorAtletica[a.id] ?? []
          const masc = atletas.filter(at => at.sexo === 'M').length
          const fem = atletas.filter(at => at.sexo === 'F').length
          const completo = masc === 2 && fem === 2
          const aberta = expandida === a.id

          return (
            <li key={a.id} className="bg-black/20 border border-white/10">
              <div className="flex items-stretch">
                <span
                  className="w-1.5 flex-shrink-0"
                  style={{ backgroundColor: a.cor }}
                  aria-hidden
                />
                <button
                  onClick={() => setExpandida(aberta ? null : a.id)}
                  className="flex-1 flex items-center gap-3 px-3 py-2.5 min-h-12 text-left hover:bg-white/5 transition-colors"
                  aria-expanded={aberta}
                >
                  <AvatarAtletica a={a} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-semibold truncate">{a.nome}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] uppercase tracking-wider">
                      {a.sigla && <span className="text-white/40">{a.sigla}</span>}
                      <span className={`inline-flex items-center gap-1 ${completo ? 'text-emerald-400' : 'text-white/40'}`}>
                        {masc}M · {fem}F
                        {completo && <span aria-hidden>✓</span>}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform ${aberta ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </div>

              {aberta && (
                <div className="border-t border-white/5 bg-black/30">
                  {/* Ações */}
                  <div className="px-2 py-2 grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setModalAtleticaEditar(a)}
                      className="min-h-10 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Editar
                    </button>
                    <button
                      onClick={() => duplicar(a)}
                      className="min-h-10 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Copy className="w-3 h-3" /> Duplicar
                    </button>
                    <button
                      onClick={() => removerAtletica(a)}
                      className="min-h-10 inline-flex items-center justify-center gap-1.5 bg-wfl-red/20 hover:bg-wfl-red/40 text-wfl-red text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Excluir
                    </button>
                  </div>

                  <ListaAtletas
                    atletica={a}
                    atletas={atletas}
                    onAddNovo={() => setModalAtleta({ atletica: a })}
                    onEditar={(at) => setModalAtleta({ atletica: a, editar: at })}
                    onChange={onChange}
                    showToast={showToast}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {modalAtleticaCriar && (
        <ModalAtletica
          onClose={() => setModalAtleticaCriar(false)}
          onSaved={async (nova) => {
            showToast({ tipo: 'ok', msg: `✅ ${nova.nome} cadastrada.` })
            setModalAtleticaCriar(false)
            await onChange()
            setExpandida(nova.id)
          }}
          showToast={showToast}
        />
      )}
      {modalAtleticaEditar && (
        <ModalAtletica
          atletica={modalAtleticaEditar}
          onClose={() => setModalAtleticaEditar(null)}
          onSaved={async () => {
            showToast({ tipo: 'ok', msg: '✅ Atlética atualizada.' })
            setModalAtleticaEditar(null)
            await onChange()
          }}
          showToast={showToast}
        />
      )}
      {modalAtleta && (
        <ModalAtleta
          atletica={modalAtleta.atletica}
          atletasExistentes={atletasPorAtletica[modalAtleta.atletica.id] ?? []}
          editar={modalAtleta.editar}
          onClose={() => setModalAtleta(null)}
          onSaved={async (nome, edicao) => {
            showToast({ tipo: 'ok', msg: `✅ ${nome} ${edicao ? 'atualizado' : 'adicionado'}.` })
            setModalAtleta(null)
            await onChange()
          }}
          showToast={showToast}
        />
      )}
    </section>
  )
}

function AvatarAtletica({ a, size = 40 }: { a: AtleticaComp; size?: number }) {
  return (
    <div
      className="relative overflow-hidden bg-black/40 flex-shrink-0 border-2"
      style={{
        width: size,
        height: size,
        borderColor: a.cor,
        borderRadius: '9999px',
      }}
    >
      {a.foto_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.foto_url} alt={a.nome} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-xs font-bold text-white/80"
          style={{ backgroundColor: `${a.cor}33` }}
        >
          <span style={fontDisplay}>{(a.sigla || a.nome).slice(0, 2).toUpperCase()}</span>
        </div>
      )}
    </div>
  )
}

function ListaAtletas({
  atletica,
  atletas,
  onAddNovo,
  onEditar,
  onChange,
  showToast,
}: {
  atletica: AtleticaComp
  atletas: AtletaComp[]
  onAddNovo: () => void
  onEditar: (a: AtletaComp) => void
  onChange: () => Promise<void>
  showToast: (t: NonNullable<Toast>) => void
}) {
  async function remover(a: AtletaComp) {
    if (!confirm(`Remover ${a.nome}?`)) return
    const res = await fetch(`/api/wings-comp/atletas?id=${a.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      return showToast({ tipo: 'erro', msg: j.error || 'Erro ao remover.' })
    }
    await onChange()
  }

  void atletica // não-usado mas mantém assinatura

  return (
    <div className="px-3 pb-3 pt-1">
      {atletas.length === 0 ? (
        <p className="text-xs text-white/40 text-center py-3">
          Sem atletas. Adicione 2M + 2F em modalidades distintas.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {atletas
            .slice()
            .sort((a, b) => a.modalidade - b.modalidade)
            .map(a => {
              const mod = MODALIDADES.find(m => m.num === a.modalidade)
              return (
                <li key={a.id} className="flex items-center gap-2 bg-black/30 px-2.5 py-1.5 min-h-11 text-sm">
                  <span
                    className={`w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      a.sexo === 'M' ? 'bg-blue-500/30 text-blue-200' : 'bg-pink-500/30 text-pink-200'
                    }`}
                  >
                    {a.sexo}
                  </span>
                  <span
                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold bg-wfl-yellow/20 text-wfl-yellow"
                    title={mod?.nome}
                  >
                    {a.modalidade}
                  </span>
                  <span className="flex-1 truncate">{a.nome}</span>
                  <button
                    onClick={() => onEditar(a)}
                    className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white"
                    aria-label={`Editar ${a.nome}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remover(a)}
                    className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-wfl-red"
                    aria-label={`Remover ${a.nome}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              )
            })}
        </ul>
      )}
      <button
        onClick={onAddNovo}
        disabled={atletas.length >= 4}
        className="mt-2 w-full inline-flex items-center justify-center gap-1.5 min-h-11 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {atletas.length >= 4 ? 'Equipe completa (4 atletas)' : 'Adicionar atleta'}
      </button>
    </div>
  )
}

// =====================================================================
// COLUNA — Runs Salvas
// =====================================================================

function ColunaRunsSalvas({
  runs,
  atleticas,
  onChange,
  showToast,
}: {
  runs: RunComp[]
  atleticas: AtleticaComp[]
  onChange: () => Promise<void>
  showToast: (t: NonNullable<Toast>) => void
}) {
  const [filtroFase, setFiltroFase] = useState<'todas' | Fase>('todas')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | TipoProva>('todos')
  const [editar, setEditar] = useState<RunComp | null>(null)

  const runsFiltradas = runs
    .filter(r => filtroFase === 'todas' || r.fase === filtroFase)
    .filter(r => filtroTipo === 'todos' || r.tipo_prova === filtroTipo)
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  async function excluir(r: RunComp) {
    const a = atleticas.find(x => x.id === r.atletica_id)
    if (!confirm(`Excluir run ${msParaDisplay(r.tempo_final_ms)} de ${a?.nome ?? 'equipe'}?`)) return
    const res = await fetch(`/api/wings-comp/runs?id=${r.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      return showToast({ tipo: 'erro', msg: j.error || 'Erro ao excluir.' })
    }
    showToast({ tipo: 'ok', msg: 'Run excluída.' })
    await onChange()
  }

  return (
    <section className="bg-white/5 border border-white/10 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-lg sm:text-2xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
          <ListOrdered className="w-5 h-5 text-wfl-yellow" /> Runs salvas
          <span className="text-xs sm:text-sm text-white/40 font-normal" style={fontBody}>
            ({runsFiltradas.length})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-2">
        {(['todas', 'classificatoria', 'final'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltroFase(f)}
            className={`min-h-9 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              filtroFase === f ? 'bg-wfl-red text-white' : 'bg-black/40 text-white/60 hover:bg-black/60'
            }`}
          >
            {f === 'todas' ? 'Todas' : f === 'classificatoria' ? 'Classific.' : 'Final'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 mb-3">
        {(['todos', 'normal', 'dinamico'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFiltroTipo(t)}
            className={`min-h-9 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              filtroTipo === t
                ? t === 'normal'
                  ? 'bg-wfl-yellow text-wfl-navy'
                  : 'bg-wfl-red text-white'
                : 'bg-black/40 text-white/60 hover:bg-black/60'
            }`}
          >
            {t === 'todos' ? 'Tipo: todos' : t === 'normal' ? 'Atletismo' : 'Dinâmica'}
          </button>
        ))}
      </div>

      <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
        {runsFiltradas.length === 0 && (
          <li className="text-sm text-white/40 text-center py-8 border border-dashed border-white/10">
            Nenhuma run nesta fase.
          </li>
        )}
        {runsFiltradas.map(r => {
          const a = atleticas.find(x => x.id === r.atletica_id)
          const totalPen =
            r.penalidade_1_ms + r.penalidade_2_ms + r.penalidade_3_ms + r.penalidade_4_ms
          return (
            <li key={r.id} className="flex items-center gap-2 bg-black/30 border border-white/5 px-2 py-2">
              {a && <AvatarAtletica a={a} size={32} />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate">{a?.nome ?? '—'}</p>
                  <span
                    className={`flex-shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      r.tipo_prova === 'normal'
                        ? 'bg-wfl-yellow/20 text-wfl-yellow'
                        : 'bg-wfl-red/30 text-white'
                    }`}
                  >
                    {r.tipo_prova === 'normal' ? 'Atletismo' : 'Dinâmica'}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  {r.fase === 'classificatoria' ? 'Class.' : 'Final'}
                  {r.bateria != null && <> · Bat. {r.bateria}</>}
                  {r.raia != null && <> · R{r.raia}</>}
                  {' · '}
                  {new Date(r.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right tabular-nums">
                <div className={`font-mono text-sm font-bold ${totalPen > 0 ? 'text-wfl-red' : 'text-wfl-yellow'}`}>
                  {msParaDisplay(r.tempo_final_ms)}
                </div>
                {totalPen > 0 && (
                  <div className="text-[9px] text-white/40">+{(totalPen / 1000).toFixed(1)}s</div>
                )}
              </div>
              <button
                onClick={() => setEditar(r)}
                className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white"
                aria-label="Editar run"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => excluir(r)}
                className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-wfl-red"
                aria-label="Excluir run"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          )
        })}
      </ul>

      {editar && (
        <ModalEditarRun
          run={editar}
          atletica={atleticas.find(a => a.id === editar.atletica_id)}
          onClose={() => setEditar(null)}
          onSaved={async () => {
            showToast({ tipo: 'ok', msg: '✅ Run atualizada.' })
            setEditar(null)
            await onChange()
          }}
          showToast={showToast}
        />
      )}
    </section>
  )
}

// =====================================================================
// MODAIS
// =====================================================================

function ModalShell({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-3 sm:p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full sm:max-w-md bg-wfl-navy border border-white/15 shadow-2xl my-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/10 sticky top-0 bg-wfl-navy z-10">
          <h3 className="text-base sm:text-lg uppercase leading-none truncate" style={fontDisplay}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white flex-shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  )
}

function ModalAtletica({
  atletica,
  onClose,
  onSaved,
  showToast,
}: {
  atletica?: AtleticaComp
  onClose: () => void
  onSaved: (a: AtleticaComp) => void
  showToast: (t: NonNullable<Toast>) => void
}) {
  const editando = !!atletica
  const [nome, setNome] = useState(atletica?.nome ?? '')
  const [sigla, setSigla] = useState(atletica?.sigla ?? '')
  const [cor, setCor] = useState(atletica?.cor ?? '#E30D3F')
  const [fotoUrl, setFotoUrl] = useState<string | null>(atletica?.foto_url ?? null)
  const [salvando, setSalvando] = useState(false)
  const [uploadando, setUploadando] = useState(false)

  const inputArquivoRef = useRef<HTMLInputElement>(null)
  const inputCameraRef = useRef<HTMLInputElement>(null)

  async function uploadFoto(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      return showToast({ tipo: 'erro', msg: 'Imagem muito grande. Máximo 5 MB.' })
    }
    setUploadando(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/wings-comp/upload-foto', { method: 'POST', body: fd })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao enviar foto.' })
        return
      }
      setFotoUrl(j.url)
    } finally {
      setUploadando(false)
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      const url = '/api/wings-comp/atleticas'
      const method = editando ? 'PATCH' : 'POST'
      const body = editando
        ? { id: atletica!.id, nome, sigla, cor, foto_url: fotoUrl }
        : { nome, sigla, cor, foto_url: fotoUrl }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const j = await res.json()
      if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar.' })
      onSaved(j.atletica)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title={editando ? `Editar · ${atletica!.nome}` : 'Nova atlética'}>
      <form onSubmit={salvar} className="space-y-4">
        {/* Foto */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Foto da equipe</label>
          <div className="mt-1.5 flex items-center gap-3">
            <div
              className="relative w-20 h-20 overflow-hidden border-2 bg-black/40 flex-shrink-0"
              style={{ borderColor: cor, borderRadius: '9999px' }}
            >
              {fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: `${cor}33` }}
                >
                  <ImageIcon className="w-7 h-7 text-white/40" />
                </div>
              )}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => inputCameraRef.current?.click()}
                disabled={uploadando}
                className="min-h-11 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                <Camera className="w-3.5 h-3.5" /> Câmera
              </button>
              <button
                type="button"
                onClick={() => inputArquivoRef.current?.click()}
                disabled={uploadando}
                className="min-h-11 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Galeria
              </button>
              {fotoUrl && (
                <button
                  type="button"
                  onClick={() => setFotoUrl(null)}
                  disabled={uploadando}
                  className="col-span-2 min-h-9 inline-flex items-center justify-center gap-1 text-white/50 hover:text-wfl-red text-[10px] uppercase tracking-wider transition-colors"
                >
                  <X className="w-3 h-3" /> Remover foto
                </button>
              )}
              {uploadando && <p className="col-span-2 text-[10px] text-wfl-yellow">Enviando…</p>}
            </div>
            <input
              ref={inputCameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) uploadFoto(f)
                e.target.value = ''
              }}
            />
            <input
              ref={inputArquivoRef}
              type="file"
              accept="image/*"
              hidden
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) uploadFoto(f)
                e.target.value = ''
              }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-white/40">JPG, PNG ou WEBP até 5 MB.</p>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Nome</label>
          <input
            required
            autoFocus={!editando}
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Halterada"
            className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60">Sigla</label>
            <input
              value={sigla}
              onChange={e => setSigla(e.target.value.toUpperCase())}
              placeholder="HAL"
              maxLength={6}
              className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60">Cor</label>
            <input
              type="color"
              value={cor}
              onChange={e => setCor(e.target.value)}
              className="mt-1 w-16 h-12 bg-black/40 border border-white/15 cursor-pointer p-1"
              aria-label="Cor da atlética"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || !nome.trim() || uploadando}
            className="min-h-12 bg-wfl-red hover:bg-wfl-red/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {salvando ? 'Salvando…' : editando ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function ModalAtleta({
  atletica,
  atletasExistentes,
  editar,
  onClose,
  onSaved,
  showToast,
}: {
  atletica: AtleticaComp
  atletasExistentes: AtletaComp[]
  editar?: AtletaComp
  onClose: () => void
  onSaved: (nome: string, edicao: boolean) => void
  showToast: (t: NonNullable<Toast>) => void
}) {
  const editando = !!editar
  const masc = atletasExistentes.filter(a => a.sexo === 'M' && a.id !== editar?.id).length
  const fem = atletasExistentes.filter(a => a.sexo === 'F' && a.id !== editar?.id).length
  const modalidadesUsadas = new Set(
    atletasExistentes.filter(a => a.id !== editar?.id).map(a => a.modalidade)
  )

  const sexoSugerido: Sexo = editar?.sexo ?? (masc < 2 ? 'M' : 'F')
  const modSugerida: Modalidade =
    editar?.modalidade ??
    (([1, 2, 3, 4] as Modalidade[]).find(n => !modalidadesUsadas.has(n)) ?? 1)

  const [nome, setNome] = useState(editar?.nome ?? '')
  const [sexo, setSexo] = useState<Sexo>(sexoSugerido)
  const [modalidade, setModalidade] = useState<Modalidade>(modSugerida)
  const [salvando, setSalvando] = useState(false)

  const sexoMascCheio = !editando && masc >= 2
  const sexoFemCheio = !editando && fem >= 2

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      const url = '/api/wings-comp/atletas'
      const method = editando ? 'PATCH' : 'POST'
      const body = editando
        ? { id: editar!.id, nome, sexo, modalidade }
        : { atletica_id: atletica.id, nome, sexo, modalidade }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const j = await res.json()
      if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar atleta.' })
      onSaved(j.atleta.nome, editando)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title={editando ? `Editar atleta · ${atletica.nome}` : `Atleta · ${atletica.nome}`}>
      <p className="text-xs text-white/60 mb-4">
        {masc + (sexo === 'M' && !editando ? 1 : 0)}M ·{' '}
        {fem + (sexo === 'F' && !editando ? 1 : 0)}F
      </p>
      <form onSubmit={salvar} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Nome</label>
          <input
            required
            autoFocus
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Sexo</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSexo('M')}
              disabled={sexoMascCheio}
              className={`min-h-12 text-sm font-bold uppercase tracking-wider transition-colors ${
                sexo === 'M'
                  ? 'bg-blue-500 text-white'
                  : 'bg-black/40 text-white/60 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              Masculino {masc + (sexo === 'M' && !editando ? 1 : 0)}/2
            </button>
            <button
              type="button"
              onClick={() => setSexo('F')}
              disabled={sexoFemCheio}
              className={`min-h-12 text-sm font-bold uppercase tracking-wider transition-colors ${
                sexo === 'F'
                  ? 'bg-pink-500 text-white'
                  : 'bg-black/40 text-white/60 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              Feminino {fem + (sexo === 'F' && !editando ? 1 : 0)}/2
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60">Modalidade</label>
          <div className="mt-1 grid grid-cols-1 gap-1.5">
            {MODALIDADES.map(m => {
              const usadaPorOutro = modalidadesUsadas.has(m.num as Modalidade)
              const ativa = modalidade === m.num
              return (
                <button
                  key={m.num}
                  type="button"
                  onClick={() => setModalidade(m.num as Modalidade)}
                  disabled={usadaPorOutro}
                  className={`flex items-center gap-2 px-3 min-h-11 text-left text-sm transition-colors ${
                    ativa
                      ? 'bg-wfl-yellow text-wfl-navy font-bold'
                      : 'bg-black/40 text-white/70 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      ativa ? 'bg-wfl-navy text-wfl-yellow' : 'bg-white/10 text-wfl-yellow'
                    }`}
                  >
                    {m.num}
                  </span>
                  <span className="flex-1">{m.nome}</span>
                  {usadaPorOutro && <span className="text-[10px] uppercase tracking-wider">Em uso</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || !nome.trim()}
            className="min-h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {salvando ? 'Salvando…' : editando ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function ModalEditarRun({
  run,
  atletica,
  onClose,
  onSaved,
  showToast,
}: {
  run: RunComp
  atletica?: AtleticaComp
  onClose: () => void
  onSaved: () => void
  showToast: (t: NonNullable<Toast>) => void
}) {
  const [fase, setFase] = useState<Fase>(run.fase)
  const [tipoProva, setTipoProva] = useState<TipoProva>(run.tipo_prova)
  const [bateriaStr, setBateriaStr] = useState(run.bateria != null ? String(run.bateria) : '')
  const [raiaStr, setRaiaStr] = useState(run.raia != null ? String(run.raia) : '')
  const [tempoStr, setTempoStr] = useState(msParaDisplay(run.tempo_bruto_ms))
  const [pen, setPen] = useState<[string, string, string, string]>([
    (run.penalidade_1_ms / 1000).toString(),
    (run.penalidade_2_ms / 1000).toString(),
    (run.penalidade_3_ms / 1000).toString(),
    (run.penalidade_4_ms / 1000).toString(),
  ])
  const [obs, setObs] = useState(run.observacoes ?? '')
  const [salvando, setSalvando] = useState(false)

  const tempoBrutoMs = displayParaMs(tempoStr)
  const valido = !isNaN(tempoBrutoMs) && tempoBrutoMs > 0

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!valido) return showToast({ tipo: 'erro', msg: 'Tempo inválido.' })
    setSalvando(true)
    try {
      const penMs = pen.map(s => {
        const n = Number(String(s).replace(',', '.'))
        return isNaN(n) ? 0 : segundosParaMs(n)
      })
      const res = await fetch('/api/wings-comp/runs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: run.id,
          fase,
          tipo_prova: tipoProva,
          bateria: bateriaStr === '' ? null : Number(bateriaStr),
          raia: raiaStr === '' ? null : Number(raiaStr),
          tempo_bruto_ms: tempoBrutoMs,
          penalidade_1_ms: penMs[0],
          penalidade_2_ms: penMs[1],
          penalidade_3_ms: penMs[2],
          penalidade_4_ms: penMs[3],
          observacoes: obs,
        }),
      })
      const j = await res.json()
      if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao atualizar.' })
      onSaved()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title={`Editar run · ${atletica?.nome ?? '—'}`}>
      <form onSubmit={salvar} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Fase</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['classificatoria', 'final'] as Fase[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFase(f)}
                className={`min-h-11 text-xs font-bold uppercase tracking-wider transition-colors ${
                  fase === f ? 'bg-wfl-red text-white' : 'bg-black/40 text-white/60 hover:bg-black/60'
                }`}
              >
                {f === 'classificatoria' ? 'Classificatória' : 'Final'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Tipo da prova</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['normal', 'dinamico'] as TipoProva[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTipoProva(t)}
                className={`min-h-11 text-xs font-bold uppercase tracking-wider transition-colors ${
                  tipoProva === t
                    ? t === 'normal'
                      ? 'bg-wfl-yellow text-wfl-navy'
                      : 'bg-wfl-red text-white'
                    : 'bg-black/40 text-white/60 hover:bg-black/60'
                }`}
              >
                {t === 'normal' ? 'Atletismo' : 'Dinâmica'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/60">
              Bateria <span className="text-white/30">(opcional)</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={bateriaStr}
              onChange={e => setBateriaStr(e.target.value)}
              className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow tabular-nums"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/60">
              Raia <span className="text-white/30">(1–8)</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="8"
              step="1"
              value={raiaStr}
              onChange={e => setRaiaStr(e.target.value)}
              className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-base text-white outline-none focus:border-wfl-yellow tabular-nums"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Tempo bruto · MM:SS.ms</label>
          <input
            value={tempoStr}
            onChange={e => setTempoStr(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full min-h-12 bg-black/40 border border-white/15 px-3 text-lg font-mono tabular-nums text-white outline-none focus:border-wfl-yellow"
          />
        </div>

        {tipoProva === 'dinamico' && (
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/60">Penalidades (s)</label>
            <div className="mt-1 space-y-1.5">
              {MODALIDADES.map((m, i) => (
                <div key={m.num} className="flex items-center gap-2 bg-black/30 border border-white/5 px-2 py-1.5">
                  <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-wfl-yellow/20 text-wfl-yellow text-xs font-bold">
                    {m.num}
                  </span>
                  <span className="flex-1 text-xs text-white/70 truncate">{m.nome}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    value={pen[i]}
                    onChange={e => {
                      const novo = [...pen] as typeof pen
                      novo[i] = e.target.value
                      setPen(novo)
                    }}
                    className="w-20 min-h-9 bg-black/50 border border-white/10 px-2 text-sm text-white outline-none focus:border-wfl-yellow text-right tabular-nums"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Observações</label>
          <input
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="mt-1 w-full min-h-11 bg-black/40 border border-white/15 px-3 text-sm text-white outline-none focus:border-wfl-yellow"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || !valido}
            className="min-h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider"
          >
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function ModalConfig({
  atleticas,
  atletasPorAtletica,
  runs,
  onClose,
  onChange,
  showToast,
}: {
  atleticas: AtleticaComp[]
  atletasPorAtletica: Record<string, AtletaComp[]>
  runs: RunComp[]
  onClose: () => void
  onChange: () => Promise<void>
  showToast: (t: NonNullable<Toast>) => void
}) {
  const [resetando, setResetando] = useState(false)

  function exportarCSV() {
    const linhas = [
      ['Atletica', 'Sigla', 'Fase', 'Tipo', 'Bateria', 'Raia', 'Tempo Bruto (ms)', 'Pen 1', 'Pen 2', 'Pen 3', 'Pen 4', 'Tempo Final (ms)', 'Observações', 'Criado em'],
    ]
    const ordenadas = runs
      .slice()
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    for (const r of ordenadas) {
      const a = atleticas.find(x => x.id === r.atletica_id)
      linhas.push([
        a?.nome ?? '—',
        a?.sigla ?? '',
        r.fase,
        r.tipo_prova,
        r.bateria != null ? String(r.bateria) : '',
        r.raia != null ? String(r.raia) : '',
        String(r.tempo_bruto_ms),
        String(r.penalidade_1_ms),
        String(r.penalidade_2_ms),
        String(r.penalidade_3_ms),
        String(r.penalidade_4_ms),
        String(r.tempo_final_ms),
        (r.observacoes ?? '').replace(/[\r\n]+/g, ' '),
        new Date(r.created_at).toISOString(),
      ])
    }
    const csv = linhas
      .map(l => l.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
    link.href = url
    link.download = `wings-runs-${ts}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    showToast({ tipo: 'ok', msg: '✅ CSV exportado.' })
  }

  async function resetar(escopo: 'runs' | 'tudo') {
    const aviso =
      escopo === 'runs'
        ? `Apagar TODAS as ${runs.length} runs? Equipes serão mantidas.`
        : `RESETAR TUDO?\nIsso apaga ${atleticas.length} equipes, ${Object.values(atletasPorAtletica).flat().length} atletas e ${runs.length} runs.\nNão tem como desfazer.`
    if (!confirm(aviso)) return
    const confirma2 = prompt(`Para confirmar, digite ZERAR:`)
    if (confirma2 !== 'ZERAR') return showToast({ tipo: 'erro', msg: 'Cancelado — confirmação inválida.' })

    setResetando(true)
    try {
      const res = await fetch('/api/wings-comp/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escopo, confirmacao: 'ZERAR' }),
      })
      const j = await res.json()
      if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao resetar.' })
      showToast({ tipo: 'ok', msg: `✅ ${escopo === 'runs' ? 'Runs apagadas' : 'Tudo zerado'}.` })
      await onChange()
      onClose()
    } finally {
      setResetando(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title="Configurações">
      <div className="space-y-4">
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-white/60 font-bold mb-2">Backup</h4>
          <button
            onClick={exportarCSV}
            className="w-full min-h-12 inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Download className="w-4 h-4" /> Exportar todas as runs (CSV)
          </button>
          <p className="mt-1 text-[10px] text-white/40">
            Salva uma cópia de segurança antes de zerar. Compatível com Excel/Sheets.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-wfl-red font-bold mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Zona de risco
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => resetar('runs')}
              disabled={resetando || runs.length === 0}
              className="w-full min-h-12 inline-flex items-center justify-center gap-2 bg-amber-600/20 hover:bg-amber-600/40 disabled:opacity-40 disabled:cursor-not-allowed text-amber-200 border border-amber-600/40 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Apagar só as runs ({runs.length})
            </button>
            <button
              onClick={() => resetar('tudo')}
              disabled={resetando}
              className="w-full min-h-12 inline-flex items-center justify-center gap-2 bg-wfl-red/20 hover:bg-wfl-red/40 disabled:opacity-40 disabled:cursor-not-allowed text-wfl-red border border-wfl-red/40 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Resetar tudo (equipes, atletas e runs)
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/40">
            Operação irreversível. Vai pedir confirmação digitando <code className="text-wfl-yellow">ZERAR</code>.
          </p>
        </div>
      </div>
    </ModalShell>
  )
}
