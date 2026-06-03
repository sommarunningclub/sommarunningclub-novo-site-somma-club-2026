'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronLeft, ChevronRight, ArrowRight, Mountain, Droplets, Zap, Flag,
  Users, Thermometer, TrendingDown, TrendingUp, Flame, CornerUpRight, Move, Footprints,
  Sun, Moon, Sparkles, Maximize, Minimize,
} from 'lucide-react'
import { GAIN_42K, GAIN_21K } from '../somma-rio-2026/route-data'

const LOGO_WHITE = '/Logo_Nova_Somma_Branca_Laranja.svg'
const LOGO_DARK = 'https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png?v=1772322941'
const SOMMA = '#FF2C03'

type Mode = 'claro' | 'escuro' | 'vivo'
const VIVID = ['#FF2C03', '#2563eb', '#db2777', '#059669', '#7c3aed', '#0891b2', '#e11d48', '#d97706']

interface Tokens {
  bg: string
  text: string
  sub: string
  cardB: string
  cardBg: string
  accent: string // cor de destaques (números/ícones) no conteúdo
  eyebrow: string
  onLight: boolean
}

function resolve(mode: Mode, i: number): Tokens {
  if (mode === 'claro') return { bg: '#ffffff', text: 'text-neutral-900', sub: 'text-neutral-500', cardB: 'border-black/10', cardBg: 'bg-black/[0.025]', accent: SOMMA, eyebrow: SOMMA, onLight: true }
  if (mode === 'escuro') return { bg: '#000000', text: 'text-white', sub: 'text-white/55', cardB: 'border-white/10', cardBg: 'bg-white/[0.04]', accent: SOMMA, eyebrow: SOMMA, onLight: false }
  return { bg: VIVID[i % VIVID.length], text: 'text-white', sub: 'text-white/85', cardB: 'border-white/25', cardBg: 'bg-white/10', accent: '#ffffff', eyebrow: '#ffffff', onLight: false }
}

const CRITICOS = [
  { tone: '#f59e0b', icon: TrendingUp, km: 'KM 14,5 – 15,9', title: 'Subida do Joá', tip: '1,5 km e +33 m. Perder 20–30s é normal — não tente compensar na subida.' },
  { tone: '#ef4444', icon: TrendingDown, km: 'Descida do Joá', title: 'Descida técnica', tip: 'Controle o ritmo e preserve o quadríceps. Quem ganha tempo aqui costuma perder depois.' },
  { tone: '#f59e0b', icon: TrendingUp, km: 'KM 19,5 – 21,4', title: 'Subida de São Conrado', tip: '1,9 km e +36 m. Os últimos 400 m têm descida íngreme.' },
  { tone: '#ef4444', icon: Flame, km: 'KM 24 – 30,5', title: 'A maratona começa aqui', tip: 'Leblon: piso irregular e muita torcida. Corra no centro da pista e não corra pela emoção.' },
]

const DICAS = [
  { icon: CornerUpRight, t: 'Curvas', d: 'Faça pela tangente' },
  { icon: Move, t: 'Terreno irregular', d: 'Corra no centro da pista' },
  { icon: Mountain, t: 'Subidas', d: 'Controle o esforço' },
  { icon: Users, t: 'Torcida', d: 'Não altere seu plano' },
  { icon: Droplets, t: 'Hidratação', d: 'Use todos os postos' },
]

export function PptClient() {
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<Mode>('vivo')
  const [openCrit, setOpenCrit] = useState(0)
  const [fs, setFs] = useState(false)
  const touchX = useRef<number | null>(null)
  const rootRef = useRef<HTMLElement>(null)

  const slides: ((active: boolean, tk: Tokens) => React.ReactNode)[] = [
    // 1 — Capa
    (a, tk) => (
      <Reveal active={a} className="text-center">
        <img src={tk.onLight ? LOGO_DARK : LOGO_WHITE} alt="Somma Club" className="mx-auto mb-10 h-9 w-auto" />
        <Eyebrow color={tk.eyebrow}>Briefing · Guia de prova</Eyebrow>
        <h1 className="text-[3.4rem] uppercase leading-[0.85] tracking-tight sm:text-8xl md:text-9xl">
          Maratona<br />do Rio <span style={{ color: tk.accent }}>2026</span>
        </h1>
        <p className={`mx-auto mt-7 max-w-md text-base md:text-lg ${tk.sub}`}>Apresentação interativa do guia de prova do Somma Club.</p>
        <span className={`mt-9 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-widest ${tk.cardB} ${tk.sub}`}>
          <ChevronLeft className="h-4 w-4" /> Use as setas ou deslize <ChevronRight className="h-4 w-4" />
        </span>
      </Reveal>
    ),
    // 2 — As provas
    (a, tk) => (
      <Reveal active={a}>
        <Eyebrow color={tk.eyebrow}>As provas</Eyebrow>
        <h2 className="text-5xl uppercase leading-[0.9] md:text-7xl">Quatro distâncias,<br />uma cidade</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { d: '42K', s: `42,195 km · +${GAIN_42K} m` },
            { d: '21K', s: `21,097 km · +${GAIN_21K} m` },
            { d: '10K', s: 'Rápido e favorável' },
            { d: '5K', s: 'Para se divertir' },
          ].map((x) => (
            <div key={x.d} className={`rounded-2xl border p-6 ${tk.cardB} ${tk.cardBg}`}>
              <p className="text-4xl md:text-5xl" style={{ color: tk.accent }}>{x.d}</p>
              <p className={`mt-2 text-sm ${tk.sub}`}>{x.s}</p>
            </div>
          ))}
        </div>
      </Reveal>
    ),
    // 3 — 42K
    (a, tk) => (
      <Reveal active={a} className="text-center">
        <Eyebrow color={tk.eyebrow}>A prova completa</Eyebrow>
        <h2 className="text-[5rem] uppercase leading-[0.8] md:text-[12rem]">42K</h2>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { i: Footprints, v: '42,195', k: 'km' },
            { i: Mountain, v: `+${GAIN_42K}`, k: 'metros' },
            { i: Droplets, v: '13', k: 'postos' },
            { i: Zap, v: '5', k: 'eletrólitos' },
          ].map((x) => (
            <div key={x.k} className={`rounded-2xl border p-4 backdrop-blur-sm ${tk.cardB} ${tk.cardBg}`}>
              <x.i className="mx-auto mb-2 h-6 w-6" style={{ color: tk.accent }} />
              <p className="text-3xl font-bold">{x.v}</p>
              <p className={`text-[11px] uppercase tracking-widest ${tk.sub}`}>{x.k}</p>
            </div>
          ))}
        </div>
      </Reveal>
    ),
    // 4 — Pontos críticos (interativo)
    (a, tk) => (
      <Reveal active={a}>
        <Eyebrow color={tk.eyebrow}>Pontos de atenção</Eyebrow>
        <h2 className="text-4xl uppercase leading-[0.9] md:text-6xl">Onde a prova<br />é decidida</h2>
        <p className={`mt-3 text-sm ${tk.sub}`}>Toque em cada trecho para ver a recomendação.</p>
        <div className="mt-7 space-y-2.5">
          {CRITICOS.map((c, i) => {
            const open = openCrit === i
            return (
              <button key={c.title} onClick={() => setOpenCrit(open ? -1 : i)} className={`block w-full rounded-2xl border p-4 text-left transition ${tk.cardB} ${open ? tk.cardBg : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${c.tone}22` }}>
                    <c.icon className="h-4 w-4" style={{ color: c.tone }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${tk.sub}`}>{c.km}</p>
                    <p className="text-lg uppercase leading-tight">{c.title}</p>
                  </div>
                  <ChevronRight className={`h-5 w-5 shrink-0 transition ${tk.sub} ${open ? 'rotate-90' : ''}`} />
                </div>
                <div className={`grid transition-all duration-300 ${open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <p className={`overflow-hidden text-sm ${tk.sub}`}>{c.tip}</p>
                </div>
              </button>
            )
          })}
        </div>
      </Reveal>
    ),
    // 5 — Hidratação
    (a, tk) => (
      <Reveal active={a}>
        <Eyebrow color={tk.eyebrow}>Estratégia de prova</Eyebrow>
        <h2 className="text-5xl uppercase leading-[0.9] md:text-7xl">Hidratação</h2>
        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { i: Droplets, v: '13', k: 'postos de água' },
            { i: Flag, v: '≈ 3 km', k: 'entre postos' },
            { i: Zap, v: '5', k: 'eletrólitos' },
            { i: Flag, v: 'KM 10', k: '1º eletrolítico' },
          ].map((x) => (
            <div key={x.k} className={`rounded-2xl border p-5 ${tk.cardB} ${tk.cardBg}`}>
              <x.i className="mb-3 h-6 w-6" style={{ color: tk.accent }} />
              <p className="text-3xl font-bold">{x.v}</p>
              <p className={`mt-0.5 text-[11px] uppercase tracking-widest ${tk.sub}`}>{x.k}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/15 p-5">
          <Thermometer className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
          <p className={`text-sm md:text-base ${tk.onLight ? 'text-amber-800' : 'text-amber-100'}`}>A partir de <strong>1h30 de prova</strong> o calor impacta o desempenho. Antecipe a hidratação — não espere a sede.</p>
        </div>
      </Reveal>
    ),
    // 6 — Torcida Somma
    (a, tk) => (
      <Reveal active={a} className="text-center">
        <Eyebrow color={tk.eyebrow}>O laranja te espera</Eyebrow>
        <h2 className="text-[2.8rem] uppercase leading-[0.9] md:text-8xl">Procure<br />o laranja</h2>
        <p className={`mx-auto mt-7 max-w-md text-lg ${tk.sub}`}>Entre o <strong>km 37 e o km 38</strong>, próximo à Marina da Glória e à última ponte.</p>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: tk.accent }}>Quando estiver difícil, ache a torcida Somma</p>
      </Reveal>
    ),
    // 7 — Dicas finais
    (a, tk) => (
      <Reveal active={a}>
        <Eyebrow color={tk.eyebrow}>Checklist do atleta</Eyebrow>
        <h2 className="text-5xl uppercase leading-[0.9] md:text-7xl">Dicas finais</h2>
        <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {DICAS.map((d) => (
            <div key={d.t} className={`rounded-2xl border p-5 ${tk.cardB} ${tk.cardBg}`}>
              <d.icon className="mb-3 h-6 w-6" style={{ color: tk.accent }} />
              <p className="text-base font-bold uppercase leading-tight">{d.t}</p>
              <p className={`mt-1 text-sm ${tk.sub}`}>{d.d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    ),
    // 8 — Encerramento
    (a, tk) => (
      <Reveal active={a} className="text-center">
        <h2 className="text-5xl uppercase leading-[0.85] md:text-8xl">Boa prova,<br /><span style={{ color: tk.accent }}>atleta</span></h2>
        <p className={`mt-6 text-lg ${tk.sub}`}>Confie no plano. O Somma corre com você.</p>
        <img src={tk.onLight ? LOGO_DARK : LOGO_WHITE} alt="Somma Club" className="mx-auto mt-10 h-9 w-auto" />
      </Reveal>
    ),
  ]

  const total = slides.length
  const go = useCallback((n: number) => setIndex((i) => Math.min(Math.max(n, 0), total - 1)), [total])
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev() }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total])

  // fullscreen
  useEffect(() => {
    const h = () => setFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  const toggleFs = () => {
    const el = rootRef.current as (HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }) | null
    const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> }
    if (!document.fullscreenElement) (el?.requestFullscreen?.() ?? el?.webkitRequestFullscreen?.())?.catch?.(() => {})
    else (document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())?.catch?.(() => {})
  }

  const tk = resolve(mode, index)
  const onLight = tk.onLight

  const MODES: { m: Mode; icon: React.ElementType; label: string }[] = [
    { m: 'claro', icon: Sun, label: 'Claro' },
    { m: 'escuro', icon: Moon, label: 'Escuro' },
    { m: 'vivo', icon: Sparkles, label: 'Vivo' },
  ]

  return (
    <main
      ref={rootRef}
      className={`relative h-[100svh] w-screen overflow-hidden font-[family-name:var(--font-body)] antialiased transition-colors duration-500 ${tk.text} [&_h1]:font-[family-name:var(--font-display)] [&_h2]:font-[family-name:var(--font-display)]`}
      style={{ backgroundColor: tk.bg }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 45) (dx < 0 ? next() : prev())
        touchX.current = null
      }}
    >
      {/* progresso */}
      <div className="absolute inset-x-0 top-0 z-30 h-1 bg-black/10">
        <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      {/* trilho de slides */}
      <div className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((render, i) => {
          const stk = resolve(mode, i)
          return (
            <section key={i} className={`flex h-full w-full shrink-0 items-center justify-center px-6 transition-colors duration-500 ${stk.text}`} style={{ backgroundColor: stk.bg }}>
              <div className="w-full max-w-4xl">{render(i === index, stk)}</div>
            </section>
          )
        })}
      </div>

      {/* contador */}
      <div className={`absolute left-6 top-5 z-30 font-mono text-xs font-bold tracking-widest ${onLight ? 'text-neutral-400' : 'text-white/55'}`}>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* controles topo-direita: seletor de tema + fullscreen */}
      <div className="absolute right-5 top-4 z-30 flex items-center gap-2">
        <div className={`flex items-center gap-0.5 rounded-full border p-0.5 backdrop-blur-sm ${onLight ? 'border-black/15 bg-white/60' : 'border-white/20 bg-black/30'}`}>
          {MODES.map(({ m, icon: Icon, label }) => (
            <button key={m} onClick={() => setMode(m)} aria-label={label} title={label}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${mode === m ? 'bg-[#FF2C03] text-white' : onLight ? 'text-neutral-500 hover:text-black' : 'text-white/60 hover:text-white'}`}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <button onClick={toggleFs} aria-label={fs ? 'Sair da tela cheia' : 'Tela cheia'} title={fs ? 'Sair da tela cheia' : 'Tela cheia'}
          className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition ${onLight ? 'border-black/15 bg-white/60 text-neutral-600 hover:text-black' : 'border-white/20 bg-black/30 text-white/70 hover:text-white'}`}>
          {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>

      {/* setas */}
      <button onClick={prev} disabled={index === 0} aria-label="Anterior"
        className={`absolute left-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm transition disabled:opacity-0 sm:flex ${onLight ? 'border-black/15 text-black hover:bg-black/5' : 'border-white/20 text-white hover:bg-white/10'}`}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} disabled={index === total - 1} aria-label="Próximo"
        className={`absolute right-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm transition disabled:opacity-0 sm:flex ${onLight ? 'border-black/15 text-black hover:bg-black/5' : 'border-white/20 text-white hover:bg-white/10'}`}>
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* dots */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-[#FF2C03]' : `w-2 ${onLight ? 'bg-black/20 hover:bg-black/40' : 'bg-white/25 hover:bg-white/50'}`}`} />
        ))}
      </div>

      {/* CTA próximo (mobile) */}
      {index < total - 1 && (
        <button onClick={next} className="absolute bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF2C03] text-white shadow-lg transition hover:bg-[#ff4d35] sm:hidden" aria-label="Próximo">
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
    </main>
  )
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em]" style={{ color }}>{children}</p>
}

function Reveal({ active, className = '', children }: { active: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={`transition-all duration-700 ${active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}>
      {children}
    </div>
  )
}
