'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, Trophy, Users, ListOrdered, FileText, Plus, Folder, FolderOpen } from 'lucide-react'
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

type Tab = 'resumo' | 'equipes' | 'runs' | 'podio'

/**
 * Browser de arquivos como interface principal do admin quando não há evento ativo.
 * Cada arquivo aparece como uma "pasta" no topo, e o conteúdo abre embaixo com
 * sub-tabs (Resumo, Equipes, Runs, Pódio).
 */
export default function ArquivoBrowser({
  showToast,
  onNovoEvento,
}: {
  showToast: (t: Toast) => void
  onNovoEvento: () => void
}) {
  const [eventos, setEventos] = useState<EventoLista[]>([])
  const [carregando, setCarregando] = useState(true)
  const [pastaAtiva, setPastaAtiva] = useState<string | null>(null)
  const [eventoCarregado, setEventoCarregado] = useState<EventoCompleto | null>(null)
  const [carregandoEvento, setCarregandoEvento] = useState(false)

  async function listar() {
    setCarregando(true)
    try {
      const res = await fetch('/api/wings-comp/eventos-arquivados')
      const j = await res.json()
      if (!res.ok) {
        showToast({ tipo: 'erro', msg: j.error || 'Erro ao listar.' })
        return
      }
      setEventos(j.eventos ?? [])
      // seleciona o primeiro automaticamente
      if (j.eventos?.length && !pastaAtiva) {
        setPastaAtiva(j.eventos[0].id)
      }
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    listar()
  }, [])

  // carrega snapshot da pasta ativa
  useEffect(() => {
    if (!pastaAtiva) {
      setEventoCarregado(null)
      return
    }
    let cancelado = false
    setCarregandoEvento(true)
    fetch(`/api/wings-comp/eventos-arquivados?id=${pastaAtiva}`)
      .then(r => r.json())
      .then(j => {
        if (cancelado) return
        if (j.evento) setEventoCarregado(j.evento)
      })
      .finally(() => {
        if (!cancelado) setCarregandoEvento(false)
      })
    return () => {
      cancelado = true
    }
  }, [pastaAtiva])

  if (carregando) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-12 text-center text-white/40 text-sm" style={fontBody}>
        Carregando arquivos…
      </div>
    )
  }

  if (eventos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-6 py-16 text-center" style={fontBody}>
        <Archive className="w-12 h-12 mx-auto text-white/30 mb-4" />
        <h2 className="text-2xl uppercase mb-2" style={fontDisplay}>Nenhum arquivo ainda</h2>
        <p className="text-sm text-white/60 mb-6">
          Crie um novo evento ou arquive o atual pra começar a visualizar pastas aqui.
        </p>
        <button
          onClick={onNovoEvento}
          className="inline-flex items-center gap-2 bg-wfl-yellow hover:bg-wfl-yellow/90 text-wfl-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors"
        >
          <Plus className="w-4 h-4" /> Iniciar novo evento
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6" style={fontBody}>
      {/* Cabeçalho da seção */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">Modo arquivo</p>
          <h2 className="text-2xl sm:text-3xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
            <Archive className="w-6 h-6 text-wfl-yellow" /> Pastas de eventos
          </h2>
          <p className="mt-1 text-xs text-white/50">
            {eventos.length} evento{eventos.length === 1 ? '' : 's'} arquivado{eventos.length === 1 ? '' : 's'}.
            Clique numa pasta pra abrir.
          </p>
        </div>
        <button
          onClick={onNovoEvento}
          className="inline-flex items-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 min-h-9"
        >
          <Plus className="w-3.5 h-3.5" /> Iniciar novo evento
        </button>
      </div>

      {/* Tabs (pastas) */}
      <PastasTabs
        eventos={eventos}
        ativaId={pastaAtiva}
        onChange={setPastaAtiva}
      />

      {/* Conteúdo da pasta ativa */}
      <div
        className="bg-wfl-navy border border-wfl-yellow/40 border-t-wfl-yellow/0 -mt-px p-4 sm:p-6 min-h-[400px]"
        style={{ borderTopLeftRadius: pastaAtiva === eventos[0]?.id ? 0 : 8 }}
      >
        {carregandoEvento ? (
          <p className="text-center text-white/40 text-sm py-12">Carregando pasta…</p>
        ) : eventoCarregado ? (
          <ConteudoEvento evento={eventoCarregado} />
        ) : (
          <p className="text-center text-white/40 text-sm py-12">Selecione uma pasta acima.</p>
        )}
      </div>
    </div>
  )
}

/**
 * Tabs estilo "pasta" — aba ativa parece uma pasta de arquivos com cantos
 * arredondados em cima e fundido com o conteúdo embaixo.
 */
function PastasTabs({
  eventos,
  ativaId,
  onChange,
}: {
  eventos: EventoLista[]
  ativaId: string | null
  onChange: (id: string) => void
}) {
  return (
    <div className="relative flex flex-wrap items-end gap-1 overflow-x-auto pb-0">
      {eventos.map(e => {
        const ativa = e.id === ativaId
        return (
          <button
            key={e.id}
            onClick={() => onChange(e.id)}
            className={`group relative inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
              ativa
                ? 'bg-wfl-navy text-wfl-yellow border-2 border-wfl-yellow/40 border-b-wfl-navy'
                : 'bg-black/40 text-white/60 hover:text-white hover:bg-black/60 border-2 border-transparent'
            }`}
            style={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              marginBottom: ativa ? -2 : 0,
              zIndex: ativa ? 2 : 1,
            }}
            title={e.nome}
          >
            {ativa ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="max-w-[140px] sm:max-w-[200px] truncate">{e.nome}</span>
            {e.data_evento && (
              <span className={`text-[9px] tabular-nums ${ativa ? 'text-wfl-yellow/70' : 'text-white/30'}`}>
                {new Date(e.data_evento).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function ConteudoEvento({ evento }: { evento: EventoCompleto }) {
  const [tab, setTab] = useState<Tab>('resumo')
  const navRef = useRef<HTMLDivElement | null>(null)
  const [indicador, setIndicador] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

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
    <div>
      {/* Cabeçalho do evento */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <h3 className="text-2xl sm:text-3xl uppercase leading-none" style={fontDisplay}>
          {evento.nome}
        </h3>
        <p className="mt-1 text-[11px] text-white/50">
          {evento.data_evento && new Date(evento.data_evento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          {evento.descricao && ` · ${evento.descricao}`}
          {' · '}arquivado em {new Date(evento.snapshot.arquivado_em).toLocaleString('pt-BR')}
        </p>
      </div>

      {/* Sub-tabs de conteúdo */}
      <div ref={navRef} className="relative flex flex-wrap items-center border-b border-white/10 mb-4">
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
      </div>

      {/* Painel */}
      <div className="transition-all">
        {tab === 'resumo' && <PainelResumo evento={evento} />}
        {tab === 'equipes' && <PainelEquipes snapshot={evento.snapshot} />}
        {tab === 'runs' && <PainelRuns snapshot={evento.snapshot} />}
        {tab === 'podio' && <PainelPodio snapshot={evento.snapshot} />}
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
    { label: 'Total Barras', valor: totalBarras, sub: totalBarras > 0 ? `−${totalBarras}s descontados` : '' },
  ]

  return (
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
  )
}

function PainelEquipes({ snapshot }: { snapshot: Snapshot }) {
  return (
    <ul className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
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
                  <p className="text-xs sm:text-sm font-semibold text-center mb-1 truncate w-full" style={fontDisplay}>
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
