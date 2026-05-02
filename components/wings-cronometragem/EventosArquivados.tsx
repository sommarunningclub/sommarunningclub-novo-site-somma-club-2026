'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Archive, Trophy, Users, ListOrdered, FileText, Trash2, Plus, Eye } from 'lucide-react'
import { msParaDisplay } from '@/lib/wings-cronometragem/tempo'
import type { AtleticaComp, AtletaComp, RunComp } from '@/lib/wings-cronometragem/types'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

type Toast = { tipo: 'ok' | 'erro'; msg: string }

type EventoLista = {
  id: string
  nome: string
  descricao: string | null
  data_evento: string | null
  total_atleticas: number
  total_runs: number
  created_at: string
}

type Snapshot = {
  atleticas: AtleticaComp[]
  atletas: AtletaComp[]
  runs: RunComp[]
  config: { final_liberada?: boolean } | null
  arquivado_em: string
}

type EventoCompleto = EventoLista & { snapshot: Snapshot }

export default function EventosArquivados({
  onClose,
  showToast,
}: {
  onClose: () => void
  showToast: (t: Toast) => void
}) {
  const [eventos, setEventos] = useState<EventoLista[]>([])
  const [carregando, setCarregando] = useState(true)
  const [arquivando, setArquivando] = useState(false)
  const [eventoAberto, setEventoAberto] = useState<EventoCompleto | null>(null)
  const [criandoNovo, setCriandoNovo] = useState(false)

  async function recarregar() {
    setCarregando(true)
    try {
      const res = await fetch('/api/wings-comp/eventos-arquivados')
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao listar.' })
        return
      }
      setEventos(j.eventos ?? [])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    recarregar()
  }, [])

  async function abrirEvento(id: string) {
    const res = await fetch(`/api/wings-comp/eventos-arquivados?id=${id}`)
    const j = await res.json()
    if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao abrir.' })
    setEventoAberto(j.evento)
  }

  async function arquivar(nome: string, data: string, descricao: string) {
    setArquivando(true)
    try {
      const res = await fetch('/api/wings-comp/eventos-arquivados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, data_evento: data || null, descricao: descricao || null }),
      })
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao arquivar.' })
        return
      }
      showToast({ tipo: 'ok', msg: '📦 Evento arquivado com sucesso.' })
      setCriandoNovo(false)
      await recarregar()
    } finally {
      setArquivando(false)
    }
  }

  async function excluir(e: EventoLista) {
    if (!confirm(`Excluir o arquivo "${e.nome}"?\nIsso é irreversível.`)) return
    const res = await fetch(`/api/wings-comp/eventos-arquivados?id=${e.id}`, { method: 'DELETE' })
    const j = await res.json()
    if (!res.ok) return showToast({ tipo: 'erro', msg: j.error || 'Erro ao excluir.' })
    showToast({ tipo: 'ok', msg: 'Arquivo removido.' })
    await recarregar()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur overflow-y-auto"
      style={{ ...fontBody, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center px-3 py-6" onClick={e => e.stopPropagation()}>
        <div className="w-full max-w-5xl bg-wfl-navy border border-white/10 shadow-2xl">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-wfl-navy/95 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">Eventos Arquivados</p>
              <h2 className="text-2xl sm:text-3xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
                <Archive className="w-6 h-6 text-wfl-yellow" /> Histórico
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className="p-4 sm:p-6">
            {!criandoNovo && (
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-xs text-white/50">
                  {eventos.length} evento{eventos.length === 1 ? '' : 's'} arquivado{eventos.length === 1 ? '' : 's'}
                </p>
                <button
                  onClick={() => setCriandoNovo(true)}
                  className="inline-flex items-center gap-1.5 bg-wfl-yellow hover:bg-wfl-yellow/90 text-wfl-navy text-[10px] font-bold uppercase tracking-wider px-3 py-2 min-h-9"
                >
                  <Plus className="w-3.5 h-3.5" /> Arquivar evento atual
                </button>
              </div>
            )}

            {criandoNovo && (
              <FormularioArquivar
                onCancelar={() => setCriandoNovo(false)}
                onSalvar={arquivar}
                salvando={arquivando}
              />
            )}

            {carregando ? (
              <p className="text-center text-white/40 py-12 text-sm">Carregando…</p>
            ) : eventos.length === 0 && !criandoNovo ? (
              <div className="text-center py-12">
                <Archive className="w-10 h-10 mx-auto text-white/30 mb-3" />
                <p className="text-white/60 text-sm mb-2">Nenhum evento arquivado ainda.</p>
                <p className="text-[11px] text-white/40">
                  Use o botão acima pra salvar uma cópia do evento atual.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {eventos.map(e => (
                  <li
                    key={e.id}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-wfl-yellow/40 transition-colors px-3 py-2.5"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-wfl-yellow/20 text-wfl-yellow flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold leading-tight">{e.nome}</p>
                      {e.descricao && <p className="text-[11px] text-white/50 truncate">{e.descricao}</p>}
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                        {e.data_evento ? new Date(e.data_evento).toLocaleDateString('pt-BR') : '—'}
                        {' · '}
                        {e.total_atleticas} equipes
                        {' · '}
                        {e.total_runs} runs
                      </p>
                    </div>
                    <button
                      onClick={() => abrirEvento(e.id)}
                      className="flex-shrink-0 inline-flex items-center gap-1 bg-wfl-yellow text-wfl-navy text-[10px] font-bold uppercase tracking-wider px-2.5 py-2 min-h-9 hover:bg-wfl-yellow/90"
                    >
                      <Eye className="w-3.5 h-3.5" /> Abrir
                    </button>
                    <button
                      onClick={() => excluir(e)}
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white/40 hover:text-wfl-red"
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {eventoAberto && <VisualizarEvento evento={eventoAberto} onClose={() => setEventoAberto(null)} />}
    </div>
  )
}

function FormularioArquivar({
  onCancelar,
  onSalvar,
  salvando,
}: {
  onCancelar: () => void
  onSalvar: (nome: string, data: string, descricao: string) => Promise<void>
  salvando: boolean
}) {
  const hoje = new Date().toISOString().slice(0, 10)
  const [nome, setNome] = useState('Wings das Atléticas 2026')
  const [data, setData] = useState(hoje)
  const [descricao, setDescricao] = useState('')

  function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return
    onSalvar(nome.trim(), data, descricao.trim())
  }

  return (
    <form onSubmit={salvar} className="mb-4 bg-wfl-yellow/10 border border-wfl-yellow/40 p-4 space-y-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-wfl-yellow font-bold">📦 Novo arquivo</p>
      <div>
        <label className="text-[10px] uppercase tracking-wider text-white/60">Nome do evento</label>
        <input
          required
          autoFocus
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="mt-1 w-full min-h-11 bg-black/40 border border-white/15 px-3 text-sm text-white outline-none focus:border-wfl-yellow"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Data</label>
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="mt-1 w-full min-h-11 bg-black/40 border border-white/15 px-3 text-sm text-white outline-none focus:border-wfl-yellow"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/60">Descrição (opcional)</label>
          <input
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Ex: 31 atléticas · UnB e CEUB"
            className="mt-1 w-full min-h-11 bg-black/40 border border-white/15 px-3 text-sm text-white outline-none focus:border-wfl-yellow"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancelar}
          className="min-h-10 px-4 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando || !nome.trim()}
          className="min-h-10 px-4 bg-wfl-yellow hover:bg-wfl-yellow/90 disabled:opacity-50 text-wfl-navy text-[10px] font-bold uppercase tracking-wider"
        >
          {salvando ? 'Arquivando…' : 'Salvar arquivo'}
        </button>
      </div>
    </form>
  )
}

type Tab = 'resumo' | 'equipes' | 'runs' | 'podio'

function VisualizarEvento({ evento, onClose }: { evento: EventoCompleto; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('resumo')
  const navRef = useRef<HTMLElement | null>(null)
  const [indicador, setIndicador] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  // calcula posição do indicador da tab ativa
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const ativo = nav.querySelector<HTMLButtonElement>(`button[data-tab="${tab}"]`)
    if (!ativo) return
    setIndicador({ left: ativo.offsetLeft, width: ativo.offsetWidth })
  }, [tab])

  const tabs: { id: Tab; label: string; Icon: typeof Trophy }[] = [
    { id: 'resumo', label: 'Resumo', Icon: FileText },
    { id: 'equipes', label: 'Equipes', Icon: Users },
    { id: 'runs', label: 'Runs', Icon: ListOrdered },
    { id: 'podio', label: 'Pódio', Icon: Trophy },
  ]

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur overflow-y-auto"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center px-3 py-6" onClick={e => e.stopPropagation()}>
        <div className="w-full max-w-5xl bg-wfl-navy border border-wfl-yellow/30 shadow-2xl">
          <header className="sticky top-0 z-20 bg-wfl-navy border-b border-white/10 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">📦 Arquivo</p>
                <h2 className="text-xl sm:text-2xl uppercase leading-none truncate" style={fontDisplay}>
                  {evento.nome}
                </h2>
                {evento.data_evento && (
                  <p className="text-[10px] text-white/50 mt-0.5">
                    {new Date(evento.data_evento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    {evento.descricao && ` · ${evento.descricao}`}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs com indicador animado */}
            <nav ref={navRef} className="relative mt-3 flex flex-wrap items-center border-b border-white/10">
              <span
                className="absolute bottom-0 h-0.5 bg-wfl-yellow transition-all duration-300 ease-in-out"
                style={{ left: indicador.left, width: indicador.width }}
                aria-hidden
              />
              {tabs.map(t => {
                const ativa = tab === t.id
                return (
                  <button
                    key={t.id}
                    data-tab={t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                      ativa ? 'text-wfl-yellow' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <t.Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                )
              })}
            </nav>
          </header>

          <div className="p-4 sm:p-6">
            {tab === 'resumo' && <PainelResumo evento={evento} />}
            {tab === 'equipes' && <PainelEquipes snapshot={evento.snapshot} />}
            {tab === 'runs' && <PainelRuns snapshot={evento.snapshot} />}
            {tab === 'podio' && <PainelPodio snapshot={evento.snapshot} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function PainelResumo({ evento }: { evento: EventoCompleto }) {
  const { snapshot } = evento
  const fasesRuns = useMemo(() => {
    const out = { classificatoria: 0, final: 0 }
    snapshot.runs.forEach(r => {
      if (r.fase === 'final') out.final++
      else out.classificatoria++
    })
    return out
  }, [snapshot.runs])

  const totalBarras = snapshot.atleticas.reduce((sum, a) => sum + (a.barras ?? 0), 0)
  const classificadas = snapshot.atleticas.filter(a => a.classificada_final).length

  const cards = [
    { label: 'Equipes', valor: snapshot.atleticas.length, sub: classificadas > 0 ? `${classificadas} classificadas` : '' },
    { label: 'Atletas', valor: snapshot.atletas.length },
    { label: 'Runs Class.', valor: fasesRuns.classificatoria },
    { label: 'Runs Final', valor: fasesRuns.final },
    { label: 'Total Barras', valor: totalBarras, sub: `−${totalBarras}s descontados` },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {cards.map(c => (
          <div key={c.label} className="bg-white/5 border border-white/10 p-3">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold">{c.label}</p>
            <p className="text-2xl tabular-nums text-wfl-yellow leading-none mt-1" style={fontDisplay}>
              {c.valor}
            </p>
            {c.sub && <p className="text-[9px] text-white/40 mt-1">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-black/30 border border-white/10 p-3 text-[11px] text-white/60 space-y-1">
        <p>
          <span className="text-white/40 uppercase tracking-wider">Arquivado em:</span>{' '}
          <span className="text-white/80">
            {new Date(snapshot.arquivado_em).toLocaleString('pt-BR')}
          </span>
        </p>
        <p>
          <span className="text-white/40 uppercase tracking-wider">Final liberada ao público:</span>{' '}
          <span className="text-white/80">{snapshot.config?.final_liberada ? 'Sim' : 'Não'}</span>
        </p>
        {evento.descricao && (
          <p className="pt-1 text-white/70 italic">{evento.descricao}</p>
        )}
      </div>
    </div>
  )
}

function PainelEquipes({ snapshot }: { snapshot: Snapshot }) {
  return (
    <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
      {snapshot.atleticas.map(a => {
        const atletas = snapshot.atletas.filter(x => x.atletica_id === a.id)
        return (
          <li key={a.id} className="flex items-center gap-2.5 bg-white/5 border-l-4 px-3 py-2" style={{ borderLeftColor: a.cor }}>
            <div
              className="w-10 h-10 flex-shrink-0 overflow-hidden border-2 rounded-full"
              style={{ borderColor: a.cor }}
            >
              {a.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.foto_url} alt={a.nome} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/80"
                  style={{ backgroundColor: `${a.cor}33` }}
                >
                  {(a.sigla || a.nome).slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{a.nome}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">
                {atletas.length} atleta{atletas.length === 1 ? '' : 's'}
                {a.sigla && ` · ${a.sigla}`}
                {a.barras > 0 && ` · 🏋️ ${a.barras}`}
                {a.classificada_final && ' · 🏆 Final'}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function PainelRuns({ snapshot }: { snapshot: Snapshot }) {
  const [filtroFase, setFiltroFase] = useState<'todas' | 'classificatoria' | 'final'>('todas')
  const runs = snapshot.runs
    .filter(r => filtroFase === 'todas' || r.fase === filtroFase)
    .slice()
    .sort((a, b) => a.tempo_final_ms - b.tempo_final_ms)

  const nomePorId = useMemo(() => {
    const m = new Map<string, AtleticaComp>()
    snapshot.atleticas.forEach(a => m.set(a.id, a))
    return m
  }, [snapshot.atleticas])

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 mb-3 max-w-md">
        {(['todas', 'classificatoria', 'final'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltroFase(f)}
            className={`min-h-9 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              filtroFase === f ? 'bg-wfl-red text-white' : 'bg-black/40 text-white/60 hover:bg-black/60'
            }`}
          >
            {f === 'todas' ? 'Todas' : f === 'classificatoria' ? 'Class.' : 'Final'}
          </button>
        ))}
      </div>
      <ul className="space-y-1 max-h-[55vh] overflow-y-auto pr-1">
        {runs.length === 0 ? (
          <li className="text-center text-white/40 text-sm py-8">Sem runs nesta fase.</li>
        ) : (
          runs.map(r => {
            const a = nomePorId.get(r.atletica_id)
            const totalPen = r.penalidade_1_ms + r.penalidade_2_ms + r.penalidade_3_ms + r.penalidade_4_ms
            return (
              <li key={r.id} className="flex items-center gap-2 bg-white/5 px-3 py-2 border-l-2" style={{ borderLeftColor: a?.cor ?? '#fff' }}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{a?.nome ?? '—'}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    {r.fase === 'classificatoria' ? 'Class.' : 'Final'}
                    {' · '}
                    {r.tipo_prova === 'normal' ? 'Atletismo' : 'Dinâmica'}
                    {r.bateria != null && ` · Bat.${r.bateria}`}
                    {r.raia != null && ` · R${r.raia}`}
                  </p>
                </div>
                <div className="text-right tabular-nums">
                  <span className={`font-mono font-bold text-sm ${totalPen > 0 ? 'text-wfl-red' : 'text-wfl-yellow'}`}>
                    {msParaDisplay(r.tempo_final_ms)}
                  </span>
                  {totalPen > 0 && <p className="text-[9px] text-white/40">+{(totalPen / 1000).toFixed(1)}s pen</p>}
                </div>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}

function PainelPodio({ snapshot }: { snapshot: Snapshot }) {
  // Calcula ranking pelo snapshot — mesma lógica do useRanking, simplificada
  const [fase, setFase] = useState<'classificatoria' | 'final'>('final')

  const ranking = useMemo(() => {
    const runsFase = snapshot.runs.filter(r => r.fase === fase)
    const melhor = new Map<string, { normal: RunComp | null; dinamico: RunComp | null }>()
    for (const r of runsFase) {
      const slot = melhor.get(r.atletica_id) ?? { normal: null, dinamico: null }
      if (r.tipo_prova === 'normal') {
        if (!slot.normal || r.tempo_final_ms < slot.normal.tempo_final_ms) slot.normal = r
      } else {
        if (!slot.dinamico || r.tempo_final_ms < slot.dinamico.tempo_final_ms) slot.dinamico = r
      }
      melhor.set(r.atletica_id, slot)
    }
    return snapshot.atleticas
      .map(a => {
        const slot = melhor.get(a.id) ?? { normal: null, dinamico: null }
        if (!slot.normal || !slot.dinamico) return null
        const bruto = slot.normal.tempo_final_ms + slot.dinamico.tempo_final_ms
        const desconto = (a.barras ?? 0) * 1000
        return {
          atletica: a,
          tempo: Math.max(0, bruto - desconto),
          desconto,
        }
      })
      .filter((x): x is { atletica: AtleticaComp; tempo: number; desconto: number } => x !== null)
      .sort((a, b) => a.tempo - b.tempo)
  }, [snapshot, fase])

  const top3 = ranking.slice(0, 3)
  const restante = ranking.slice(3)

  return (
    <div>
      <div className="grid grid-cols-2 gap-1 mb-4 max-w-xs">
        {(['classificatoria', 'final'] as const).map(f => {
          const ativa = fase === f
          return (
            <button
              key={f}
              onClick={() => setFase(f)}
              className={`min-h-9 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                ativa ? 'bg-wfl-red text-white' : 'bg-black/40 text-white/60 hover:bg-black/60'
              }`}
            >
              {f === 'classificatoria' ? 'Classific.' : 'Final'}
            </button>
          )
        })}
      </div>

      {ranking.length === 0 ? (
        <p className="text-center text-white/40 text-sm py-8">Sem equipes completas nesta fase.</p>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-2 mb-5 items-end">
            {[1, 0, 2].map(idx => {
              const linha = top3[idx]
              const pos = idx + 1
              const corMedalha = ['#FFD400', '#C0C0C0', '#CD7F32'][idx]
              const altura = idx === 0 ? 150 : idx === 1 ? 110 : 80
              if (!linha) {
                return (
                  <div key={pos} className="flex flex-col items-center">
                    <div className="bg-white/5 border border-dashed border-white/10 w-full" style={{ height: altura }} />
                  </div>
                )
              }
              return (
                <div key={pos} className="flex flex-col items-center">
                  <p className="text-xs font-semibold text-center mb-1 truncate w-full" style={fontDisplay}>
                    {linha.atletica.nome}
                  </p>
                  <p className="text-base font-mono font-bold text-wfl-yellow tabular-nums mb-2">
                    {msParaDisplay(linha.tempo)}
                  </p>
                  <div
                    className="w-full flex items-center justify-center text-3xl border-t-4"
                    style={{
                      height: altura,
                      backgroundColor: `${corMedalha}22`,
                      borderTopColor: corMedalha,
                      color: corMedalha,
                      ...fontDisplay,
                    }}
                  >
                    {['🥇', '🥈', '🥉'][idx]} {pos}º
                  </div>
                </div>
              )
            })}
          </div>

          {restante.length > 0 && (
            <ul className="space-y-1">
              {restante.map((linha, i) => (
                <li
                  key={linha.atletica.id}
                  className="flex items-center gap-2.5 bg-white/5 px-3 py-2 border-l-2"
                  style={{ borderLeftColor: linha.atletica.cor }}
                >
                  <span className="text-xs font-bold text-white/60 tabular-nums w-6">{i + 4}º</span>
                  <span className="text-sm flex-1 truncate">{linha.atletica.nome}</span>
                  <span className="font-mono text-sm text-wfl-yellow tabular-nums">{msParaDisplay(linha.tempo)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
