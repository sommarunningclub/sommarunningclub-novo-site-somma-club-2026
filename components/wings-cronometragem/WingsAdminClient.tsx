'use client'

import { useEffect, useState } from 'react'
import { Lock, LogOut, Plus, Trash2, Users, Trophy, Save, AlertCircle } from 'lucide-react'
import Cronometro from './Cronometro'
import { msParaDisplay, displayParaMs, segundosParaMs, MODALIDADES } from '@/lib/wings-cronometragem/tempo'
import type { AtleticaComp, AtletaComp } from '@/lib/wings-cronometragem/types'
import type { Fase, Sexo, Modalidade } from '@/lib/wings-cronometragem/tempo'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

type Toast = { tipo: 'ok' | 'erro'; msg: string } | null

export default function WingsAdminClient() {
  const [logado, setLogado] = useState<boolean | null>(null)
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [atleticas, setAtleticas] = useState<AtleticaComp[]>([])
  const [atletasPorAtletica, setAtletasPorAtletica] = useState<Record<string, AtletaComp[]>>({})
  const [toast, setToast] = useState<Toast>(null)

  // Carrega listas (públicas) e detecta sessão tentando uma escrita inócua.
  useEffect(() => {
    let cancelado = false
    async function probe() {
      // Probe de sessão: DELETE de id inexistente. Se sessão OK → 500/200; se sem sessão → 401.
      const r = await fetch('/api/wings-comp/atleticas?id=00000000-0000-0000-0000-000000000000', {
        method: 'DELETE',
      }).catch(() => null)
      if (cancelado) return
      setLogado(r != null && r.status !== 401)
    }
    probe()

    fetch('/api/wings-comp/atleticas')
      .then(r => r.json())
      .then(j => !cancelado && setAtleticas(j.atleticas ?? []))
      .catch(() => {})
    fetch('/api/wings-comp/atletas')
      .then(r => r.json())
      .then(j => {
        if (cancelado) return
        const lista: AtletaComp[] = j.atletas ?? []
        const agrupado: Record<string, AtletaComp[]> = {}
        for (const a of lista) {
          ;(agrupado[a.atletica_id] ??= []).push(a)
        }
        setAtletasPorAtletica(agrupado)
      })
      .catch(() => {})
    return () => { cancelado = true }
  }, [])

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
    await fetch('/api/wings-comp/auth', { method: 'DELETE' })
    setLogado(false)
    setSenha('')
  }

  async function recarregarAtleticas() {
    const j = await fetch('/api/wings-comp/atleticas').then(r => r.json())
    setAtleticas(j.atleticas ?? [])
  }

  async function recarregarAtletas(atletica_id: string) {
    const j = await fetch(`/api/wings-comp/atletas?atletica_id=${atletica_id}`).then(r => r.json())
    setAtletasPorAtletica(prev => ({ ...prev, [atletica_id]: j.atletas ?? [] }))
  }

  if (logado === null) {
    return (
      <main className="min-h-screen bg-wfl-navy text-white flex items-center justify-center" style={fontBody}>
        <p className="text-white/60">Carregando…</p>
      </main>
    )
  }

  if (!logado) {
    return (
      <main className="min-h-screen bg-wfl-navy text-white flex items-center justify-center px-4" style={fontBody}>
        <form onSubmit={fazerLogin} className="w-full max-w-sm bg-white/5 border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-wfl-yellow" />
            <span className="text-xs tracking-[0.3em] uppercase text-wfl-yellow font-bold">Acesso Somma</span>
          </div>
          <h1 className="text-3xl sm:text-4xl uppercase leading-none" style={fontDisplay}>
            Cronometragem
          </h1>
          <p className="mt-2 text-sm text-white/60">Painel restrito da equipe Somma.</p>
          <label className="block mt-6 text-xs uppercase tracking-wider text-white/70">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            autoComplete="current-password"
            className="mt-1.5 w-full bg-black/30 border border-white/15 px-4 py-3 text-base text-white outline-none focus:border-wfl-yellow"
            required
          />
          {erroLogin && (
            <p className="mt-2 text-sm text-wfl-red flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {erroLogin}
            </p>
          )}
          <button
            type="submit"
            disabled={loadingLogin}
            className="mt-5 w-full bg-wfl-red hover:bg-wfl-red/90 disabled:opacity-50 text-white py-3.5 text-sm font-bold tracking-[0.2em] uppercase transition-colors"
          >
            {loadingLogin ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-wfl-navy text-white pb-24" style={fontBody}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">Acesso Somma</p>
            <h1 className="text-xl sm:text-2xl uppercase leading-none" style={fontDisplay}>
              Cronometragem
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/wings/ranking"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-wfl-yellow hover:underline"
            >
              <Trophy className="w-3.5 h-3.5" /> Ranking ao vivo
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ColunaAtleticas
          atleticas={atleticas}
          atletasPorAtletica={atletasPorAtletica}
          onAtleticaChange={recarregarAtleticas}
          onAtletaChange={recarregarAtletas}
          showToast={showToast}
        />
        <ColunaRegistrarRun atleticas={atleticas} showToast={showToast} />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 text-sm font-semibold border ${
            toast.tipo === 'ok'
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-wfl-red border-wfl-red text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </main>
  )
}

// =====================================================================
// COLUNA ESQUERDA — Gestão de Atléticas e Atletas
// =====================================================================

function ColunaAtleticas({
  atleticas,
  atletasPorAtletica,
  onAtleticaChange,
  onAtletaChange,
  showToast,
}: {
  atleticas: AtleticaComp[]
  atletasPorAtletica: Record<string, AtletaComp[]>
  onAtleticaChange: () => Promise<void>
  onAtletaChange: (atletica_id: string) => Promise<void>
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  const [novaNome, setNovaNome] = useState('')
  const [novaSigla, setNovaSigla] = useState('')
  const [novaCor, setNovaCor] = useState('#E30D3F')
  const [salvandoAtletica, setSalvandoAtletica] = useState(false)
  const [expandida, setExpandida] = useState<string | null>(null)

  async function adicionarAtletica(e: React.FormEvent) {
    e.preventDefault()
    setSalvandoAtletica(true)
    try {
      const res = await fetch('/api/wings-comp/atleticas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novaNome, sigla: novaSigla, cor: novaCor }),
      })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar.' })
        return
      }
      showToast({ tipo: 'ok', msg: `✅ Atlética ${j.atletica.nome} cadastrada.` })
      setNovaNome('')
      setNovaSigla('')
      await onAtleticaChange()
    } finally {
      setSalvandoAtletica(false)
    }
  }

  async function removerAtletica(a: AtleticaComp) {
    if (!confirm(`Remover a atlética "${a.nome}"? Isso apaga atletas e runs associados.`)) return
    const res = await fetch(`/api/wings-comp/atleticas?id=${a.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      showToast({ tipo: 'erro', msg: j.error || 'Erro ao remover.' })
      return
    }
    showToast({ tipo: 'ok', msg: `Atlética removida.` })
    await onAtleticaChange()
  }

  return (
    <section className="bg-white/5 border border-white/10 p-4 sm:p-5">
      <h2 className="text-xl sm:text-2xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
        <Users className="w-5 h-5 text-wfl-yellow" /> Atléticas
      </h2>

      <form onSubmit={adicionarAtletica} className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_100px_60px_auto] gap-2">
        <input
          required
          placeholder="Nome da atlética"
          value={novaNome}
          onChange={e => setNovaNome(e.target.value)}
          className="bg-black/30 border border-white/15 px-3 py-2.5 text-sm text-white outline-none focus:border-wfl-yellow"
        />
        <input
          placeholder="Sigla"
          value={novaSigla}
          onChange={e => setNovaSigla(e.target.value)}
          className="bg-black/30 border border-white/15 px-3 py-2.5 text-sm text-white outline-none focus:border-wfl-yellow"
        />
        <input
          type="color"
          value={novaCor}
          onChange={e => setNovaCor(e.target.value)}
          className="h-full bg-black/30 border border-white/15 cursor-pointer"
          aria-label="Cor"
        />
        <button
          type="submit"
          disabled={salvandoAtletica}
          className="inline-flex items-center justify-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 disabled:opacity-50 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <ul className="mt-5 space-y-2">
        {atleticas.length === 0 && (
          <li className="text-sm text-white/40 text-center py-6">Nenhuma atlética cadastrada ainda.</li>
        )}
        {atleticas.map(a => (
          <li key={a.id} className="bg-black/20 border border-white/10">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: a.cor }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{a.nome}</p>
                {a.sigla && <p className="text-[10px] uppercase tracking-wider text-white/50">{a.sigla}</p>}
              </div>
              <button
                onClick={() => setExpandida(expandida === a.id ? null : a.id)}
                className="text-[10px] uppercase tracking-wider text-wfl-yellow font-bold hover:underline"
              >
                {expandida === a.id ? 'Fechar' : 'Atletas'}
              </button>
              <button
                onClick={() => removerAtletica(a)}
                className="text-white/40 hover:text-wfl-red"
                aria-label="Remover"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {expandida === a.id && (
              <GerenciarAtletas
                atletica={a}
                atletas={atletasPorAtletica[a.id] ?? []}
                onChange={() => onAtletaChange(a.id)}
                showToast={showToast}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function GerenciarAtletas({
  atletica,
  atletas,
  onChange,
  showToast,
}: {
  atletica: AtleticaComp
  atletas: AtletaComp[]
  onChange: () => Promise<void>
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  const [nome, setNome] = useState('')
  const [sexo, setSexo] = useState<Sexo>('M')
  const [modalidade, setModalidade] = useState<Modalidade>(1)
  const [salvando, setSalvando] = useState(false)

  async function adicionar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      const res = await fetch('/api/wings-comp/atletas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atletica_id: atletica.id, nome, sexo, modalidade }),
      })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar atleta.' })
        return
      }
      showToast({ tipo: 'ok', msg: `✅ ${j.atleta.nome} adicionado.` })
      setNome('')
      await onChange()
    } finally {
      setSalvando(false)
    }
  }

  async function remover(a: AtletaComp) {
    if (!confirm(`Remover ${a.nome}?`)) return
    await fetch(`/api/wings-comp/atletas?id=${a.id}`, { method: 'DELETE' })
    await onChange()
  }

  return (
    <div className="px-3 pb-3 pt-1 border-t border-white/5">
      <form onSubmit={adicionar} className="grid grid-cols-1 sm:grid-cols-[1fr_60px_60px_auto] gap-2 mb-3">
        <input
          required
          placeholder="Nome do atleta"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="bg-black/40 border border-white/10 px-2.5 py-2 text-xs text-white outline-none focus:border-wfl-yellow"
        />
        <select
          value={sexo}
          onChange={e => setSexo(e.target.value as Sexo)}
          className="bg-black/40 border border-white/10 px-2 py-2 text-xs text-white outline-none focus:border-wfl-yellow"
        >
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
        <select
          value={modalidade}
          onChange={e => setModalidade(Number(e.target.value) as Modalidade)}
          className="bg-black/40 border border-white/10 px-2 py-2 text-xs text-white outline-none focus:border-wfl-yellow"
        >
          {MODALIDADES.map(m => (
            <option key={m.num} value={m.num}>
              Mod {m.num}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={salvando}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
        >
          + Atleta
        </button>
      </form>

      {atletas.length === 0 ? (
        <p className="text-[10px] text-white/40 text-center py-2">Nenhum atleta. Mín 2M + 2F.</p>
      ) : (
        <ul className="space-y-1">
          {atletas.map(a => {
            const mod = MODALIDADES.find(m => m.num === a.modalidade)
            return (
              <li
                key={a.id}
                className="flex items-center gap-2 bg-black/30 px-2.5 py-1.5 text-xs"
              >
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold ${
                    a.sexo === 'M' ? 'bg-blue-500/30 text-blue-200' : 'bg-pink-500/30 text-pink-200'
                  }`}
                >
                  {a.sexo}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-wfl-yellow/20 text-wfl-yellow">
                  {a.modalidade}
                </span>
                <span className="flex-1 truncate">{a.nome}</span>
                <span className="text-[9px] text-white/40 hidden sm:inline">{mod?.nome}</span>
                <button
                  onClick={() => remover(a)}
                  className="text-white/40 hover:text-wfl-red"
                  aria-label="Remover atleta"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// =====================================================================
// COLUNA DIREITA — Registrar Run
// =====================================================================

function ColunaRegistrarRun({
  atleticas,
  showToast,
}: {
  atleticas: AtleticaComp[]
  showToast: (t: { tipo: 'ok' | 'erro'; msg: string }) => void
}) {
  const [atleticaId, setAtleticaId] = useState('')
  const [fase, setFase] = useState<Fase>('classificatoria')
  const [tempoStr, setTempoStr] = useState('')
  const [pen, setPen] = useState<[string, string, string, string]>(['0', '0', '0', '0'])
  const [obs, setObs] = useState('')
  const [salvando, setSalvando] = useState(false)

  const tempoBrutoMs = displayParaMs(tempoStr)
  const tempoBrutoValido = !isNaN(tempoBrutoMs) && tempoBrutoMs > 0
  const penalidadesMs = pen.map(s => {
    const n = Number(String(s).replace(',', '.'))
    return isNaN(n) ? 0 : segundosParaMs(n)
  }) as [number, number, number, number]
  const totalPenalidades = penalidadesMs.reduce((a, b) => a + b, 0)
  const tempoFinalMs = tempoBrutoValido ? tempoBrutoMs + totalPenalidades : 0

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!atleticaId) {
      showToast({ tipo: 'erro', msg: 'Selecione uma atlética.' })
      return
    }
    if (!tempoBrutoValido) {
      showToast({ tipo: 'erro', msg: 'Tempo bruto inválido. Use MM:SS.ms (ex: 01:23.456).' })
      return
    }
    setSalvando(true)
    try {
      const res = await fetch('/api/wings-comp/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atletica_id: atleticaId,
          fase,
          tempo_bruto_ms: tempoBrutoMs,
          penalidade_1_ms: penalidadesMs[0],
          penalidade_2_ms: penalidadesMs[1],
          penalidade_3_ms: penalidadesMs[2],
          penalidade_4_ms: penalidadesMs[3],
          observacoes: obs,
        }),
      })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao salvar run.' })
        return
      }
      const atletica = atleticas.find(a => a.id === atleticaId)
      showToast({ tipo: 'ok', msg: `✅ Run da ${atletica?.nome ?? 'equipe'} salvo!` })
      setTempoStr('')
      setPen(['0', '0', '0', '0'])
      setObs('')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="bg-white/5 border border-white/10 p-4 sm:p-5">
      <h2 className="text-xl sm:text-2xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
        <Trophy className="w-5 h-5 text-wfl-yellow" /> Registrar Run
      </h2>

      <Cronometro onTempoCapturado={ms => setTempoStr(msParaDisplay(ms))} />

      <form onSubmit={salvar} className="mt-4 space-y-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Atlética</label>
          <select
            value={atleticaId}
            onChange={e => setAtleticaId(e.target.value)}
            required
            className="mt-1 w-full bg-black/30 border border-white/15 px-3 py-2.5 text-sm text-white outline-none focus:border-wfl-yellow"
          >
            <option value="">Selecione…</option>
            {atleticas.map(a => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Fase</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['classificatoria', 'final'] as Fase[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFase(f)}
                className={`py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  fase === f
                    ? 'bg-wfl-red text-white'
                    : 'bg-black/30 text-white/60 hover:bg-black/40'
                }`}
              >
                {f === 'classificatoria' ? 'Classificatória' : 'Final'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">
            Tempo bruto (MM:SS.ms)
          </label>
          <input
            value={tempoStr}
            onChange={e => setTempoStr(e.target.value)}
            placeholder="01:23.456"
            inputMode="decimal"
            className="mt-1 w-full bg-black/30 border border-white/15 px-3 py-2.5 text-base font-mono text-white outline-none focus:border-wfl-yellow"
          />
          {tempoStr && !tempoBrutoValido && (
            <p className="mt-1 text-[10px] text-wfl-red">Formato inválido. Use MM:SS.ms (ex: 01:23.456).</p>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">
            Penalidades (segundos por modalidade)
          </label>
          <div className="mt-1 space-y-2">
            {MODALIDADES.map((m, i) => (
              <div key={m.num} className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-wfl-yellow/20 text-wfl-yellow text-xs font-bold">
                  {m.num}
                </span>
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
                  className="w-20 bg-black/30 border border-white/15 px-2 py-1.5 text-sm text-white outline-none focus:border-wfl-yellow text-right"
                />
                <span className="text-[10px] text-white/40">s</span>
                <span className="text-[10px] text-white/60 truncate">{m.nome}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Observações</label>
          <input
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="mt-1 w-full bg-black/30 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:border-wfl-yellow"
          />
        </div>

        {/* Preview */}
        <div className="bg-black/40 border border-white/10 p-3">
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-white/50">
            <span>Tempo bruto</span>
            <span className="font-mono text-sm text-white tabular-nums">
              {tempoBrutoValido ? msParaDisplay(tempoBrutoMs) : '--:--.---'}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-white/50 mt-1">
            <span>Σ Penalidades</span>
            <span className="font-mono text-sm text-white tabular-nums">
              +{(totalPenalidades / 1000).toFixed(2)}s
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-wfl-yellow font-bold">Tempo final</span>
            <span
              className={`font-mono text-2xl font-bold tabular-nums ${
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
          className="w-full inline-flex items-center justify-center gap-2 bg-wfl-red hover:bg-wfl-red/90 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 text-sm font-bold tracking-[0.2em] uppercase transition-colors"
        >
          <Save className="w-4 h-4" />
          {salvando ? 'Salvando…' : 'Salvar Run'}
        </button>
      </form>
    </section>
  )
}
