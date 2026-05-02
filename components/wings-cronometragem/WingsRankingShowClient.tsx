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

const CAR_W = 56
const CAR_H = 38
const CAR_PHOTO_R = 18
const MAX_FIRE = 600
const SPEED = 0.55
const PARALLAX_OFFSET_FACTOR = 80

type Carro = {
  atleticaId: string
  cor: string
  foto: HTMLImageElement | null
  fotoOk: boolean
  posReal: number      // float interpolada (1.0 = 1º lugar)
  posAlvo: number      // posição alvo
  tWave: number        // offset da fase pra cada carro flutuar diferente
  velocidadeMs: number | null
  pulseEm: number      // frames de fogo extra após mudar de posição
}

type Particula = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  l: number
  c: number
  hue: number
  alpha: number
  life: number
  maxLife: number
}

function hexParaHue(hex: string): number {
  const m = hex.match(/^#?([a-f0-9]{6})$/i)
  if (!m) return 0
  const r = parseInt(m[1].slice(0, 2), 16) / 255
  const g = parseInt(m[1].slice(2, 4), 16) / 255
  const b = parseInt(m[1].slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  if (d === 0) return 0
  let h: number
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  h *= 60
  if (h < 0) h += 360
  return h
}

function ctxRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  if ('roundRect' in ctx) {
    ;(ctx as unknown as { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(x, y, w, h, r)
  } else {
    ctx.rect(x, y, w, h)
  }
}

export default function WingsRankingShowClient() {
  const [fase, setFase] = useState<Fase>('classificatoria')
  const { ranking, loading, aoVivo, runs } = useRanking(fase)
  const [telao, setTelao] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const carrosRef = useRef<Carro[]>([])
  const fogoRef = useRef<Particula[]>([])
  const tickRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  // Mapa atleticaId → posição no ranking (1-based)
  const posPorAtletica = useMemo(() => {
    const m = new Map<string, number>()
    ranking.forEach((linha, idx) => {
      m.set(linha.atletica.id, idx + 1)
    })
    return m
  }, [ranking])

  // Sincroniza carros com lista atual sempre que ranking mudar
  useEffect(() => {
    const carros = carrosRef.current
    const idsAtuais = new Set(ranking.map(r => r.atletica.id))

    // Remove sumidos
    for (let i = carros.length - 1; i >= 0; i--) {
      if (!idsAtuais.has(carros[i].atleticaId)) carros.splice(i, 1)
    }

    // Cria/atualiza
    ranking.forEach((linha, idx) => {
      const id = linha.atletica.id
      let c = carros.find(x => x.atleticaId === id)
      // No show usamos o tempo combinado (se completo) ou o melhor disponível
      const tempo =
        linha.tempoCombinadoMs ??
        linha.melhorRunNormal?.tempo_final_ms ??
        linha.melhorRunDinamico?.tempo_final_ms ??
        null
      const posAlvo = posPorAtletica.get(id) ?? idx + 1

      if (!c) {
        c = {
          atleticaId: id,
          cor: linha.atletica.cor,
          foto: null,
          fotoOk: false,
          posReal: posAlvo,
          posAlvo,
          tWave: Math.random() * Math.PI * 2,
          velocidadeMs: tempo,
          pulseEm: 0,
        }
        if (linha.atletica.foto_url) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => { if (c) c.fotoOk = true }
          img.src = linha.atletica.foto_url
          c.foto = img
        }
        carros.push(c)
      } else {
        c.cor = linha.atletica.cor
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
        if (c.posAlvo !== posAlvo && tempo != null) {
          c.pulseEm = 28
        }
        c.posAlvo = posAlvo
        c.velocidadeMs = tempo
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

    function emitirFogo(
      x: number, y: number, headingRad: number, corHex: string, intenso: boolean
    ) {
      const list = fogoRef.current
      const emit = intenso ? 6 : 2
      for (let i = 0; i < emit; i++) {
        if (list.length > MAX_FIRE) break
        const speed = 1.0 + Math.random() * (intenso ? 3.5 : 1.6)
        const spread = (Math.random() - 0.5) * 0.5
        list.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: -Math.cos(headingRad + spread) * speed,
          vy: -Math.sin(headingRad + spread) * speed - 0.3,
          r: 3 + Math.random() * 4,
          l: intenso ? 0.78 : 0.66,
          c: intenso ? 0.22 : 0.16,
          hue: hexParaHue(corHex),
          alpha: intenso ? 0.95 : 0.7,
          life: 0,
          maxLife: 18 + Math.random() * 18,
        })
      }
    }

    function desenharFogo() {
      const list = fogoRef.current
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.94
        p.vy = p.vy * 0.94 + 0.04
        p.life += 1
        const prog = p.life / p.maxLife
        const ease = 1 - Math.pow(1 - prog, 2)
        const r = p.r * (1 + prog * 0.7)
        const a = p.alpha * (1 - ease)
        if (a <= 0.02 || p.life >= p.maxLife) {
          list.splice(i, 1)
          continue
        }
        const l = Math.min(p.l + prog * 0.18, 0.96)
        const c = p.c * (1 - prog * 0.5)
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        grad.addColorStop(0, `oklch(${(l + 0.08).toFixed(2)} ${(c * 0.5).toFixed(3)} ${Math.round(p.hue)} / ${a.toFixed(3)})`)
        grad.addColorStop(0.4, `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${Math.round(p.hue)} / ${(a * 0.7).toFixed(3)})`)
        grad.addColorStop(1, `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${Math.round(p.hue)} / 0)`)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }
    }

    function desenharCarro(
      x: number, y: number, headingRad: number, corHex: string,
      foto: HTMLImageElement | null, fotoOk: boolean
    ) {
      ctx!.save()
      ctx!.translate(x, y)
      ctx!.rotate(headingRad)

      // sombra
      ctx!.save()
      ctx!.fillStyle = 'rgba(0,0,0,0.35)'
      ctx!.beginPath()
      ctx!.ellipse(0, CAR_H / 2 + 4, CAR_W * 0.45, 5, 0, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.restore()

      // chassi
      ctx!.fillStyle = corHex
      ctx!.beginPath()
      ctxRoundRect(ctx!, -CAR_W / 2, -CAR_H / 2, CAR_W, CAR_H, 8)
      ctx!.fill()

      // janela frontal
      ctx!.fillStyle = 'rgba(255,255,255,0.18)'
      ctx!.beginPath()
      ctxRoundRect(ctx!, CAR_W / 2 - 18, -CAR_H / 2 + 4, 14, CAR_H - 8, 4)
      ctx!.fill()

      // foto (avatar circular)
      ctx!.save()
      ctx!.beginPath()
      ctx!.arc(-CAR_W / 2 + CAR_PHOTO_R + 2, 0, CAR_PHOTO_R, 0, Math.PI * 2)
      ctx!.closePath()
      ctx!.clip()
      if (foto && fotoOk) {
        ctx!.drawImage(foto, -CAR_W / 2 + 2, -CAR_PHOTO_R, CAR_PHOTO_R * 2, CAR_PHOTO_R * 2)
      } else {
        ctx!.fillStyle = 'rgba(255,255,255,0.85)'
        ctx!.fillRect(-CAR_W / 2 + 2, -CAR_PHOTO_R, CAR_PHOTO_R * 2, CAR_PHOTO_R * 2)
      }
      ctx!.restore()

      ctx!.strokeStyle = 'rgba(255,255,255,0.95)'
      ctx!.lineWidth = 2
      ctx!.beginPath()
      ctx!.arc(-CAR_W / 2 + CAR_PHOTO_R + 2, 0, CAR_PHOTO_R, 0, Math.PI * 2)
      ctx!.stroke()

      // rodas
      ctx!.fillStyle = '#0a0a0a'
      for (const wx of [-CAR_W / 2 + 12, CAR_W / 2 - 12]) {
        ctx!.beginPath()
        ctx!.arc(wx, CAR_H / 2 - 2, 5, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.fillStyle = 'rgba(255,255,255,0.35)'
      for (const wx of [-CAR_W / 2 + 12, CAR_W / 2 - 12]) {
        ctx!.beginPath()
        ctx!.arc(wx - 1, CAR_H / 2 - 3, 1.5, 0, Math.PI * 2)
        ctx!.fill()
      }

      ctx!.restore()
    }

    function loop() {
      tickRef.current += 1
      const t = tickRef.current
      const { w, h } = sizeRef.current
      ctx!.clearRect(0, 0, w, h)

      const grad = ctx!.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h))
      grad.addColorStop(0, 'rgba(255,255,255,0.04)')
      grad.addColorStop(1, 'rgba(0,0,0,0.35)')
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, w, h)

      const carros = carrosRef.current
      const total = carros.length
      if (total === 0) {
        raf = requestAnimationFrame(loop)
        return
      }

      const topY = h * 0.18
      const botY = h * 0.86
      const espaco = (botY - topY) / Math.max(total, 1)

      // Desenha de trás pra frente (último primeiro, líder por cima)
      const ordem = carros
        .slice()
        .sort((a, b) => b.posAlvo - a.posAlvo)

      ordem.forEach(c => {
        c.posReal += (c.posAlvo - c.posReal) * 0.05

        const yBase = topY + espaco * (c.posReal - 0.5)
        const waveAmp = Math.max(8, espaco * 0.35)
        const phase = t * 0.022 + c.tWave
        const yWave = Math.sin(phase) * waveAmp
        const y = yBase + yWave

        const speedFactor = c.velocidadeMs ? 1 + (1 - Math.min(c.posAlvo / total, 1)) * 0.6 : 0.45
        const xLoopPeriod = w + CAR_W * 2
        const x = ((t * SPEED * speedFactor + c.tWave * PARALLAX_OFFSET_FACTOR) % xLoopPeriod) - CAR_W
        const xw = x < -CAR_W ? x + xLoopPeriod : x

        const headingRad = Math.atan2(Math.cos(phase) * waveAmp * 0.022, 1)

        // rastro fino na pista
        ctx!.strokeStyle = c.cor + '55'
        ctx!.lineWidth = 2
        ctx!.beginPath()
        ctx!.moveTo(xw - 60, y + waveAmp * 0.6 + 6)
        ctx!.lineTo(xw, y + waveAmp * 0.6 + 6)
        ctx!.stroke()

        // emite fogo
        const exhaustX = xw - CAR_W * 0.5
        const exhaustY = y + 4
        emitirFogo(exhaustX, exhaustY, headingRad, c.cor, c.pulseEm > 0)
        if (c.pulseEm > 0) c.pulseEm -= 1

        desenharCarro(xw, y, headingRad, c.cor, c.foto, c.fotoOk)
      })

      desenharFogo()

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
            {(['classificatoria', 'final'] as Fase[]).map(f => (
              <button
                key={f}
                onClick={() => setFase(f)}
                className={`min-h-10 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  fase === f
                    ? 'bg-wfl-red text-white'
                    : 'bg-transparent text-white/60 hover:bg-white/5'
                }`}
              >
                {f === 'classificatoria' ? 'Classific.' : 'Final'}
              </button>
            ))}
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
