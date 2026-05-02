'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Maximize2, Minimize2, ListOrdered } from 'lucide-react'
import { useRanking } from './useRanking'
import { msParaDisplay } from '@/lib/wings-cronometragem/tempo'
import type { Fase } from '@/lib/wings-cronometragem/tempo'
import type { AtleticaComp, RunComp } from '@/lib/wings-cronometragem/types'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

const NUM_LANES = 8
const LANE_WIDTH = 22
const RUNNER_R = 11
const TRACK_MARGIN = 80
const TRACK_BOTTOM_MARGIN = 40

// "Linha de chegada" é o ponto angular onde fica o líder.
// Em coords paramétricas (parâmetro u ∈ [0,1)) escolhemos u = 0.75
// que corresponde ao topo do oval (12h) — fica visível e dramático.
const FINISH_U = 0.75

type Corredor = {
  atleticaId: string
  cor: string
  nome: string
  sigla: string | null
  foto: HTMLImageElement | null
  fotoOk: boolean
  posReal: number       // float interpolada (1 = líder)
  posAlvo: number       // posição alvo do ranking
  estado: 'completo' | 'parcial' | 'sem-tempo'
  bobOffset: number     // fase pessoal de "respiração" da bolinha
  pulseEm: number       // frames de glow após mudar posição
}

function buildOvalPath(
  cx: number, cy: number, rx: number, ry: number, phase: number
) {
  // Retorna função u → {x, y, tangent} para parametrizar o oval.
  // Usamos elipse simples; phase rotaciona a origem do parâmetro.
  return (u: number) => {
    const theta = (u + phase) * Math.PI * 2
    const x = cx + Math.cos(theta) * rx
    const y = cy + Math.sin(theta) * ry
    // tangente (derivada) para orientar o corredor
    const tx = -Math.sin(theta) * rx
    const ty = Math.cos(theta) * ry
    const tlen = Math.hypot(tx, ty) || 1
    return { x, y, tx: tx / tlen, ty: ty / tlen }
  }
}

export default function WingsRankingShowClient() {
  const [fase, setFase] = useState<Fase>('classificatoria')
  const { ranking, loading, aoVivo, runs, finalLiberada } = useRanking(fase)
  const [telao, setTelao] = useState(false)

  useEffect(() => {
    if (fase === 'final' && !finalLiberada) setFase('classificatoria')
  }, [fase, finalLiberada])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const corredoresRef = useRef<Corredor[]>([])
  const tickRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  const posPorAtletica = useMemo(() => {
    const m = new Map<string, number>()
    ranking.forEach((linha, idx) => {
      m.set(linha.atletica.id, idx + 1)
    })
    return m
  }, [ranking])

  // Sincroniza corredores com o ranking atual
  useEffect(() => {
    const lista = corredoresRef.current
    const idsAtuais = new Set(ranking.map(r => r.atletica.id))

    // Remove sumidos
    for (let i = lista.length - 1; i >= 0; i--) {
      if (!idsAtuais.has(lista[i].atleticaId)) lista.splice(i, 1)
    }

    ranking.forEach((linha, idx) => {
      const id = linha.atletica.id
      const posAlvo = posPorAtletica.get(id) ?? idx + 1
      let c = lista.find(x => x.atleticaId === id)

      if (!c) {
        c = {
          atleticaId: id,
          cor: linha.atletica.cor,
          nome: linha.atletica.nome,
          sigla: linha.atletica.sigla ?? null,
          foto: null,
          fotoOk: false,
          posReal: posAlvo,
          posAlvo,
          estado: linha.estado,
          bobOffset: Math.random() * Math.PI * 2,
          pulseEm: 0,
        }
        if (linha.atletica.foto_url) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => { if (c) c.fotoOk = true }
          img.src = linha.atletica.foto_url
          c.foto = img
        }
        lista.push(c)
      } else {
        c.cor = linha.atletica.cor
        c.nome = linha.atletica.nome
        c.sigla = linha.atletica.sigla ?? null
        c.estado = linha.estado
        const urlAtual = c.foto?.src ?? null
        const urlNova = linha.atletica.foto_url
        if (urlNova && urlNova !== urlAtual) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => { if (c) c.fotoOk = true }
          img.src = urlNova
          c.foto = img
          c.fotoOk = false
        } else if (!urlNova && urlAtual) {
          c.foto = null
          c.fotoOk = false
        }
        if (c.posAlvo !== posAlvo) {
          c.pulseEm = 36
        }
        c.posAlvo = posAlvo
      }
    })
  }, [ranking, posPorAtletica])

  // Loop de animação
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas!.clientWidth
      const h = canvas!.clientHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      sizeRef.current = { w, h }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function desenharPista(cx: number, cy: number, rxOuter: number, ryOuter: number) {
      // Grama central
      ctx!.save()
      ctx!.fillStyle = 'rgba(20, 80, 40, 0.25)'
      ctx!.beginPath()
      ctx!.ellipse(cx, cy, rxOuter - NUM_LANES * LANE_WIDTH - 8, ryOuter - NUM_LANES * LANE_WIDTH - 8, 0, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.restore()

      // Asfalto da pista (preenche entre borda externa e interna)
      ctx!.save()
      ctx!.fillStyle = 'rgba(180, 60, 50, 0.55)' // tom terracota tipo tartan
      ctx!.beginPath()
      ctx!.ellipse(cx, cy, rxOuter, ryOuter, 0, 0, Math.PI * 2)
      ctx!.ellipse(cx, cy, rxOuter - NUM_LANES * LANE_WIDTH, ryOuter - NUM_LANES * LANE_WIDTH, 0, 0, Math.PI * 2, true)
      ctx!.fill('evenodd')
      ctx!.restore()

      // Linhas das raias (brancas)
      ctx!.save()
      ctx!.strokeStyle = 'rgba(255,255,255,0.55)'
      ctx!.lineWidth = 1.5
      for (let i = 0; i <= NUM_LANES; i++) {
        const rx = rxOuter - i * LANE_WIDTH
        const ry = ryOuter - i * LANE_WIDTH
        ctx!.beginPath()
        ctx!.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx!.stroke()
      }
      ctx!.restore()

      // Linha de chegada — barra branca radial no topo (FINISH_U = 0.75 → topo)
      const theta = FINISH_U * Math.PI * 2
      const cosT = Math.cos(theta)
      const sinT = Math.sin(theta)
      const xOut = cx + cosT * rxOuter
      const yOut = cy + sinT * ryOuter
      const xIn = cx + cosT * (rxOuter - NUM_LANES * LANE_WIDTH)
      const yIn = cy + sinT * (ryOuter - NUM_LANES * LANE_WIDTH)
      ctx!.save()
      ctx!.strokeStyle = '#ffffff'
      ctx!.lineWidth = 4
      ctx!.setLineDash([6, 4])
      ctx!.beginPath()
      ctx!.moveTo(xOut, yOut)
      ctx!.lineTo(xIn, yIn)
      ctx!.stroke()
      ctx!.restore()

      // Label CHEGADA
      ctx!.save()
      ctx!.fillStyle = 'rgba(255, 220, 0, 0.95)'
      ctx!.font = 'bold 11px var(--font-dm-sans-wfl), sans-serif'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'bottom'
      ctx!.fillText('🏁 CHEGADA', cx, cy - ryOuter - 8)
      ctx!.restore()
    }

    function desenharCorredor(
      x: number, y: number, c: Corredor, destaque: number, posicao: number
    ) {
      // glow se subiu posição recentemente OU se está no top 3
      const top3 = posicao >= 1 && posicao <= 3
      const glowAlpha = c.pulseEm > 0 ? 0.6 * (c.pulseEm / 36) : top3 ? 0.35 : 0
      if (glowAlpha > 0) {
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, RUNNER_R * 3)
        grad.addColorStop(0, c.cor + Math.round(glowAlpha * 255).toString(16).padStart(2, '0'))
        grad.addColorStop(1, c.cor + '00')
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.arc(x, y, RUNNER_R * 3, 0, Math.PI * 2)
        ctx!.fill()
      }

      // sombra
      ctx!.save()
      ctx!.fillStyle = 'rgba(0,0,0,0.4)'
      ctx!.beginPath()
      ctx!.ellipse(x, y + RUNNER_R + 3, RUNNER_R * 0.85, 3, 0, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.restore()

      // bolinha
      const r = RUNNER_R + (top3 ? 2 : 0)
      ctx!.save()
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.fillStyle = c.cor
      ctx!.fill()

      // foto recortada se houver
      if (c.foto && c.fotoOk) {
        ctx!.save()
        ctx!.beginPath()
        ctx!.arc(x, y, r - 1.5, 0, Math.PI * 2)
        ctx!.clip()
        ctx!.drawImage(c.foto, x - r, y - r, r * 2, r * 2)
        ctx!.restore()
      } else {
        // sigla dentro da bolinha
        const txt = (c.sigla?.trim() || c.nome).slice(0, 3).toUpperCase()
        ctx!.fillStyle = '#ffffff'
        ctx!.font = `bold ${Math.round(r * 0.85)}px var(--font-bebas), sans-serif`
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(txt, x, y + 1)
      }

      // borda branca
      ctx!.strokeStyle = top3 ? '#ffd400' : 'rgba(255,255,255,0.95)'
      ctx!.lineWidth = top3 ? 2.5 : 1.5
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.stroke()
      ctx!.restore()

      // badge da posição em cima da bolinha
      {
        const badgeR = top3 ? 11 : 9
        const bx = x
        const by = y - r - badgeR - 2
        ctx!.save()
        ctx!.beginPath()
        ctx!.arc(bx, by, badgeR, 0, Math.PI * 2)
        ctx!.fillStyle = top3
          ? ['#ffd400', '#d6d6d6', '#cd7f32'][posicao - 1]
          : '#ffffff'
        ctx!.fill()
        ctx!.strokeStyle = 'rgba(0,0,0,0.6)'
        ctx!.lineWidth = 1.5
        ctx!.beginPath()
        ctx!.arc(bx, by, badgeR, 0, Math.PI * 2)
        ctx!.stroke()
        ctx!.fillStyle = '#0a0a0a'
        ctx!.font = `bold ${top3 ? 13 : 11}px var(--font-bebas), sans-serif`
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(String(posicao), bx, by + 1)
        ctx!.restore()
      }

      // label nome/sigla embaixo
      const label = (c.sigla?.trim() || c.nome).toUpperCase()
      ctx!.save()
      ctx!.font = `bold ${destaque > 0 ? 12 : 10}px var(--font-dm-sans-wfl), sans-serif`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'top'
      const tw = ctx!.measureText(label).width
      const padX = 5
      const padY = 2
      const bx = x - tw / 2 - padX
      const by = y + r + 6
      ctx!.fillStyle = 'rgba(0,0,0,0.7)'
      ctx!.beginPath()
      const rect = (rx: number, ry: number, rw: number, rh: number, rr: number) => {
        if ('roundRect' in ctx!) {
          ;(ctx! as unknown as { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(rx, ry, rw, rh, rr)
        } else {
          ctx!.rect(rx, ry, rw, rh)
        }
      }
      rect(bx, by, tw + padX * 2, 14 + padY, 3)
      ctx!.fill()
      ctx!.strokeStyle = c.cor
      ctx!.lineWidth = 1
      ctx!.beginPath()
      rect(bx, by, tw + padX * 2, 14 + padY, 3)
      ctx!.stroke()
      ctx!.fillStyle = '#fff'
      ctx!.fillText(label, x, by + padY + 1)
      ctx!.restore()
    }

    function loop() {
      tickRef.current += 1
      const t = tickRef.current
      const { w, h } = sizeRef.current
      ctx!.clearRect(0, 0, w, h)

      // gradiente de fundo
      const bg = ctx!.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h))
      bg.addColorStop(0, 'rgba(255,255,255,0.04)')
      bg.addColorStop(1, 'rgba(0,0,0,0.4)')
      ctx!.fillStyle = bg
      ctx!.fillRect(0, 0, w, h)

      const corredores = corredoresRef.current
      const total = corredores.length

      // dimensões do oval
      const cx = w / 2
      const cy = h / 2 + 10
      const rxOuter = Math.max(140, (w - TRACK_MARGIN * 2) / 2)
      const ryOuter = Math.max(110, (h - TRACK_BOTTOM_MARGIN * 2) / 2)

      desenharPista(cx, cy, rxOuter, ryOuter)

      if (total === 0) {
        raf = requestAnimationFrame(loop)
        return
      }

      // Cada corredor ocupa uma raia (limitamos a NUM_LANES; se houver mais
      // atléticas que raias, "empilhamos" 2 por raia separados radialmente).
      // Posição angular: u = FINISH_U - (posReal - 1) * gap
      // gap controla quão espalhados ficam — um pouco menos que 1/total pra
      // não dar volta inteira (último ainda visível atrás do líder).
      const gap = Math.min(0.85 / Math.max(total, 1), 0.06)

      // Animação contínua: o "ritmo" da corrida faz tudo girar lentamente
      const drift = (t * 0.0006) % 1
      const path = buildOvalPath(cx, cy, 0, 0, drift) // só pra calcular phase global

      // Ordena pra desenhar últimos primeiro (líder por cima)
      const ordem = corredores.slice().sort((a, b) => b.posAlvo - a.posAlvo)

      ordem.forEach(c => {
        // Easing pro posReal alcançar posAlvo
        c.posReal += (c.posAlvo - c.posReal) * 0.06

        const lane = (Math.round(c.posReal) - 1) % NUM_LANES
        const rx = rxOuter - (lane + 0.5) * LANE_WIDTH
        const ry = ryOuter - (lane + 0.5) * LANE_WIDTH

        const u = (FINISH_U - (c.posReal - 1) * gap + 1) % 1
        const theta = (u + drift) * Math.PI * 2
        let x = cx + Math.cos(theta) * rx
        let y = cy + Math.sin(theta) * ry

        // pequeno bob vertical pra dar vida
        const bob = Math.sin(t * 0.08 + c.bobOffset) * 1.2
        y += bob

        if (c.pulseEm > 0) c.pulseEm -= 1

        const posicao = Math.round(c.posReal)
        desenharCorredor(x, y, c, c.pulseEm, posicao)

        // suprime warning do path não usado
        void path
      })

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <main className="fixed inset-0 bg-wfl-navy text-white overflow-hidden" style={fontBody}>
      {/* Blobs */}
      <div className="absolute -top-32 -left-24 w-[620px] h-[620px] rounded-full bg-wfl-yellow/15 blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-[500px] h-[500px] rounded-full bg-wfl-red/25 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[340px] h-[340px] rounded-full bg-white/5 blur-[90px] pointer-events-none" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1]" />

      {/* Header */}
      <header
        className="absolute top-0 inset-x-0 z-10 px-3 sm:px-6 py-3"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">
              Ranking Show
            </p>
            <h1
              className={`uppercase leading-none truncate ${
                telao ? 'text-3xl sm:text-5xl' : 'text-xl sm:text-3xl'
              }`}
              style={fontDisplay}
            >
              Wings das Atléticas
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                aoVivo ? 'bg-wfl-red text-white' : 'bg-white/10 text-white/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  aoVivo ? 'bg-white animate-pulse' : 'bg-white/40'
                }`}
              />
              {aoVivo ? 'AO VIVO' : 'CONECTANDO'}
            </span>
            <Link
              href="/wings/ranking"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-9 bg-white/10 hover:bg-white/20 text-white/80 text-[10px] font-bold uppercase tracking-wider transition-colors"
              title="Ranking tradicional"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lista</span>
            </Link>
            <button
              onClick={() => setTelao(t => !t)}
              className="hidden md:inline-flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
              aria-label={telao ? 'Sair do telão' : 'Modo telão'}
            >
              {telao ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 max-w-md">
          <div className="grid grid-cols-2 gap-1.5 bg-black/30 p-1">
            {(['classificatoria', 'final'] as Fase[]).map(f => {
              const desabilitada = f === 'final' && !finalLiberada
              return (
                <button
                  key={f}
                  onClick={() => !desabilitada && setFase(f)}
                  disabled={desabilitada}
                  className={`min-h-10 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                    desabilitada
                      ? 'bg-transparent text-white/30 cursor-not-allowed'
                      : fase === f
                        ? 'bg-wfl-red text-white'
                        : 'bg-transparent text-white/60 hover:bg-white/5'
                  }`}
                  title={desabilitada ? 'Aguardando liberação do staff' : undefined}
                >
                  {f === 'classificatoria' ? 'Classific.' : desabilitada ? 'Final · 🔒' : 'Final'}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Mini-leaderboard lateral */}
      <aside
        className={`absolute z-10 ${
          telao
            ? 'right-4 top-32 w-72'
            : 'right-3 sm:right-6 bottom-24 sm:bottom-6 w-[min(280px,calc(100vw-1.5rem))]'
        }`}
      >
        <div className="bg-black/60 backdrop-blur border border-white/10 max-h-[60vh] overflow-y-auto">
          <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-wfl-yellow font-bold">Top</span>
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              {ranking.filter(r => r.estado === 'completo').length}/{ranking.length} completos
            </span>
          </div>
          {loading ? (
            <p className="px-3 py-3 text-xs text-white/40">Carregando…</p>
          ) : ranking.length === 0 ? (
            <p className="px-3 py-3 text-xs text-white/40">Sem atléticas ainda.</p>
          ) : (
            <ul>
              {ranking.slice(0, 12).map(linha => {
                const top3 = linha.estado === 'completo' && linha.posicao >= 1 && linha.posicao <= 3
                const tempoExibido =
                  linha.tempoCombinadoMs ??
                  linha.melhorRunNormal?.tempo_final_ms ??
                  linha.melhorRunDinamico?.tempo_final_ms ??
                  null
                const corTempo =
                  linha.estado === 'completo'
                    ? linha.totalPenalidadesMs > 0 ? 'text-wfl-red' : 'text-wfl-yellow'
                    : 'text-amber-300'
                return (
                  <li
                    key={linha.atletica.id}
                    className="flex items-center gap-2 px-3 py-2 border-b border-white/5 last:border-b-0"
                  >
                    <MiniAvatar a={linha.atletica} size={28} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate flex items-center gap-1.5">
                        {top3 && <span aria-hidden>{['🥇','🥈','🥉'][linha.posicao - 1]}</span>}
                        {!top3 && linha.estado === 'completo' && (
                          <span className="text-white/50 text-[10px] tabular-nums w-4">
                            {linha.posicao}º
                          </span>
                        )}
                        {linha.estado === 'parcial' && (
                          <span className="text-amber-400 text-[9px] font-bold tabular-nums w-6">1/2</span>
                        )}
                        <span className="truncate">{linha.atletica.nome}</span>
                      </p>
                    </div>
                    <span className={`font-mono text-[11px] font-bold tabular-nums ${corTempo}`}>
                      {tempoExibido != null ? msParaDisplay(tempoExibido) : '—'}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>

      <UltimaRunBanner runs={runs} ranking={ranking} />
    </main>
  )
}

function MiniAvatar({ a, size = 28 }: { a: AtleticaComp; size?: number }) {
  return (
    <div
      className="relative overflow-hidden flex-shrink-0 border-2"
      style={{
        width: size,
        height: size,
        borderColor: a.cor,
        borderRadius: '9999px',
        backgroundColor: `${a.cor}33`,
      }}
    >
      {a.foto_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.foto_url} alt={a.nome} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/80" style={fontDisplay}>
          {(a.sigla || a.nome).slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  )
}

function UltimaRunBanner({
  runs,
  ranking,
}: {
  runs: RunComp[]
  ranking: ReturnType<typeof useRanking>['ranking']
}) {
  const ultima = useMemo(() => {
    if (runs.length === 0) return null
    return runs
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
  }, [runs])

  const [visivel, setVisivel] = useState(false)
  const [chave, setChave] = useState<string | null>(null)

  useEffect(() => {
    if (!ultima) return
    if (ultima.id === chave) return
    setChave(ultima.id)
    setVisivel(true)
    const t = setTimeout(() => setVisivel(false), 5000)
    return () => clearTimeout(t)
  }, [ultima, chave])

  if (!ultima) return null
  const linha = ranking.find(r => r.atletica.id === ultima.atletica_id)
  if (!linha) return null

  const totalPen =
    ultima.penalidade_1_ms + ultima.penalidade_2_ms + ultima.penalidade_3_ms + ultima.penalidade_4_ms

  return (
    <div
      className={`absolute z-20 left-1/2 -translate-x-1/2 transition-all duration-500 ${
        visivel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)' }}
    >
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur border border-wfl-yellow/40 px-4 py-2.5 shadow-2xl">
        <MiniAvatar a={linha.atletica} size={36} />
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-wfl-yellow font-bold">
            Nova run · {ultima.tipo_prova === 'normal' ? 'Atletismo' : 'Dinâmica'}
          </p>
          <p className="text-sm font-semibold leading-tight">{linha.atletica.nome}</p>
        </div>
        <div className="text-right">
          <span
            className={`font-mono text-lg font-bold tabular-nums ${
              totalPen > 0 ? 'text-wfl-red' : 'text-wfl-yellow'
            }`}
          >
            {msParaDisplay(ultima.tempo_final_ms)}
          </span>
          {linha.posicao >= 1 && linha.posicao <= 3 && (
            <p className="text-[10px] uppercase tracking-wider text-white/60">
              {['🥇','🥈','🥉'][linha.posicao - 1]} {linha.posicao}º lugar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
