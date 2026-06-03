'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Route, Mountain, Droplets, Zap, Flag, TriangleAlert, TrendingUp, TrendingDown,
  Activity, Flame, Thermometer, Heart, Users, ArrowRight, ArrowDown, ChevronDown,
  MapPin, Gauge, Move, CornerUpRight, Footprints,
} from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { StravaRouteEmbed } from '@/components/somma-rio/strava-route-embed'

const LOGO_SOMMA = '/Logo_Nova_Somma_Branca_Laranja.svg'
const BG_HERO = '/marcos-vinicius-do-vale-yeEsrY5kzL8-unsplash.jpg'

const STRAVA_42 =
  'https://strava-embeds.com/route/3456667059960308766?units=metric&fullWidth=true&style=standard&clubId=666544&fromEmbed=true#ns=13efd3d9-8998-4292-8495-2d3f0c2059b9&hostOrigin=https%3A%2F%2Fwww.maratonadorio.com.br&hostPath=%2Fpt%2Fcorrida%2F42k-2026&hostTitle=42K+-+2025+%7C+Maratona+do+Rio&mapHash=10.24/-22.9613/-43.3016'
const STRAVA_21 =
  'https://strava-embeds.com/route/3347662519365211922?units=metric&style=standard&clubId=666544&fromEmbed=false#ns=04b192a3-acda-4e8e-80bb-45fcf91d2841&hostOrigin=https%3A%2F%2Fwww.maratonadorio.com.br&hostPath=%2Fpt%2Fcorrida%2F21k-2026&hostTitle=21K+-+2025+%7C+Maratona+do+Rio'
const MARINA_EMBED =
  'https://www.google.com/maps?q=Marina+da+Gl%C3%B3ria,+Rio+de+Janeiro&z=15&output=embed'

/* ───────────────── Navegação interna ───────────────── */
const NAV = [
  { id: 'p42k', label: '42K' },
  { id: 'p21k', label: '21K' },
  { id: 'p10k', label: '10K' },
  { id: 'p5k', label: '5K' },
  { id: 'hidratacao', label: 'Hidratação' },
  { id: 'torcida', label: 'Torcida Somma' },
]

/* ───────────────── Tons de cor por tipo de trecho ───────────────── */
type Tone = 'green' | 'yellow' | 'red' | 'orange'
const TONE: Record<Tone, { text: string; dot: string; bar: string; ring: string; chip: string; glow: string }> = {
  green: { text: 'text-emerald-400', dot: 'bg-emerald-500', bar: 'bg-emerald-500', ring: 'border-emerald-500/40', chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', glow: 'shadow-[0_0_0_4px_rgba(16,185,129,0.12)]' },
  yellow: { text: 'text-amber-400', dot: 'bg-amber-500', bar: 'bg-amber-500', ring: 'border-amber-500/40', chip: 'border-amber-500/30 bg-amber-500/10 text-amber-400', glow: 'shadow-[0_0_0_4px_rgba(245,158,11,0.12)]' },
  red: { text: 'text-red-400', dot: 'bg-red-500', bar: 'bg-red-500', ring: 'border-red-500/40', chip: 'border-red-500/30 bg-red-500/10 text-red-400', glow: 'shadow-[0_0_0_4px_rgba(239,68,68,0.14)]' },
  orange: { text: 'text-[#FF2C03]', dot: 'bg-[#FF2C03]', bar: 'bg-[#FF2C03]', ring: 'border-[#FF2C03]/40', chip: 'border-[#FF2C03]/30 bg-[#FF2C03]/10 text-[#FF2C03]', glow: 'shadow-[0_0_0_4px_rgba(255,44,3,0.14)]' },
}

type Marco = {
  km: string
  tone: Tone
  icon: React.ElementType
  badge: string
  title: string
  stats: { k: string; v: string }[]
  bullets: string[]
  highlight?: string
  alert?: string
  featured?: boolean
}

const TIMELINE: Marco[] = [
  {
    km: 'KM 0 — 14,5', tone: 'green', icon: Activity, badge: 'Trecho favorável', title: 'COMECE NO CONTROLE',
    stats: [{ k: 'Distância', v: '14,5 km' }, { k: 'Perfil', v: 'Plano' }],
    bullets: ['Totalmente plano', 'Excelente para encontrar o ritmo', 'Evite exagerar no início'],
  },
  {
    km: 'KM 14,5 — 15,9', tone: 'yellow', icon: TrendingUp, badge: 'Subida', title: 'SUBIDA DO JOÁ',
    stats: [{ k: 'Extensão', v: '1,5 km' }, { k: 'Elevação', v: '+33 m' }],
    bullets: ['1,5 km de subida', '33 m acumulados', 'Perder 20 a 30 segundos é normal'],
    highlight: 'Não tente compensar na subida.',
  },
  {
    km: 'Descida do Joá', tone: 'red', icon: TrendingDown, badge: 'Atenção', title: 'DESCIDA TÉCNICA',
    stats: [{ k: 'Tipo', v: 'Descida técnica' }, { k: 'Foco', v: 'Quadríceps' }],
    bullets: ['Descida técnica', 'Controle o ritmo', 'Preserve o quadríceps'],
    highlight: 'Quem ganha tempo aqui costuma perder depois.',
  },
  {
    km: 'KM 19,5 — 21,4', tone: 'yellow', icon: TrendingUp, badge: 'Subida', title: 'SUBIDA DE SÃO CONRADO',
    stats: [{ k: 'Extensão', v: '1,9 km' }, { k: 'Elevação', v: '+36 m' }],
    bullets: ['1,9 km de subida', '36 m acumulados'],
    alert: 'Os últimos 400 m têm descida íngreme.',
  },
  {
    km: 'KM 24 — 30,5', tone: 'red', icon: Flame, badge: 'Ponto crítico', title: 'A MARATONA COMEÇA AQUI', featured: true,
    stats: [{ k: 'Trecho', v: 'Leblon' }, { k: 'Piso', v: 'Irregular' }],
    bullets: ['Entrada no Leblon', 'Muita torcida', 'Piso irregular', 'Corra próximo ao centro da pista'],
    highlight: 'Não corra pela emoção da torcida.',
  },
  {
    km: 'KM 37', tone: 'orange', icon: Flag, badge: 'Reta final', title: 'MARINA DA GLÓRIA',
    stats: [{ k: 'Trecho', v: 'Centro do Rio' }, { k: 'Perfil', v: 'Subida leve' }],
    bullets: ['Início da reta final', 'Pequena subida', 'Centro do Rio'],
  },
  {
    km: 'KM 39', tone: 'yellow', icon: TrendingUp, badge: 'Subida', title: 'VIADUTO',
    stats: [{ k: 'Tipo', v: 'Subida curta' }, { k: 'Estado', v: 'Desgaste alto' }],
    bullets: ['Pequena subida', 'Atenção ao desgaste acumulado'],
  },
]

const CARDS_21K = [
  { km: 'Largada', icon: Flag, title: 'Jardim de Alah', desc: 'Ponto de partida da meia maratona.' },
  { km: 'KM 6,5', icon: Move, title: 'Entrada no túnel', desc: 'Mude o foco para o ritmo interno.' },
  { km: 'KM 16,5', icon: Users, title: 'Muita torcida', desc: 'Grande concentração de público.' },
  { km: 'KM 19', icon: TrendingUp, title: 'Pequena subida', desc: 'Último esforço antes da chegada.' },
]

const CARDS_10K = [
  { icon: Gauge, title: 'Controle a largada', desc: 'Não saia acima do ritmo planejado.' },
  { icon: Activity, title: 'Mantenha estratégia', desc: 'Constância vence a empolgação.' },
  { icon: Flag, title: 'Aproveite o percurso', desc: 'Trajeto rápido e favorável.' },
]

const CARDS_5K = [
  { icon: Heart, title: 'Aproveite a experiência', desc: 'O foco é celebrar a corrida.' },
  { icon: Gauge, title: 'Respeite seu ritmo', desc: 'Sem cobrança de tempo.' },
  { icon: Footprints, title: 'Largue no planejado', desc: 'Não comece acima do combinado.' },
]

const DICAS = [
  { icon: CornerUpRight, title: 'Curvas', desc: 'Faça pela tangente.' },
  { icon: Move, title: 'Terreno irregular', desc: 'Corra no centro da pista.' },
  { icon: Mountain, title: 'Subidas', desc: 'Controle o esforço.' },
  { icon: Users, title: 'Torcida', desc: 'Não altere seu plano de prova.' },
  { icon: Droplets, title: 'Hidratação', desc: 'Use todos os postos.' },
]

// Postos ao longo dos 42,195 km
const KM_TOTAL = 42.195
const POSTOS_AGUA = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39]
const POSTOS_ELETRO = [10, 17, 24, 31, 38]

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#FF2C03]">{children}</p>
)

/* ───────────────── Perfil de altimetria (42K) ───────────────── */
function ElevationProfile() {
  // pontos aproximados do perfil — x: km0→42 (0..1000), y: invertido (maior = mais alto)
  const pts =
    '0,168 345,168 365,150 378,96 392,140 405,150 464,150 485,128 509,98 519,150 700,150 850,150 880,116 900,128 927,114 945,140 1000,150'
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Mountain className="h-4 w-4 text-[#FF2C03]" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Perfil de altimetria</p>
      </div>
      <svg viewBox="0 0 1000 200" className="h-40 w-full md:h-52" preserveAspectRatio="none" role="img" aria-label="Perfil de altimetria do percurso de 42K">
        <defs>
          <linearGradient id="elev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF2C03" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF2C03" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,200 ${pts} 1000,200`} fill="url(#elev)" />
        <polyline points={pts} fill="none" stroke="#FF2C03" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* picos marcados */}
        {[
          { x: 378, label: 'Joá' },
          { x: 509, label: 'S. Conrado' },
          { x: 927, label: 'Viaduto' },
        ].map((p) => (
          <g key={p.label}>
            <line x1={p.x} y1="0" x2={p.x} y2="200" stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="4 4" />
          </g>
        ))}
      </svg>
      <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[#666]">
        <span>KM 0</span><span>Joá</span><span>S. Conrado</span><span>Viaduto</span><span>KM 42</span>
      </div>
    </div>
  )
}

/* ───────────────── Item da timeline (clicável) ───────────────── */
function TimelineItem({ marco, open, onToggle }: { marco: Marco; open: boolean; onToggle: () => void }) {
  const t = TONE[marco.tone]
  const Icon = marco.icon
  return (
    <div className="relative pl-12 md:pl-16">
      {/* nó */}
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`absolute left-[7px] top-1 flex h-8 w-8 items-center justify-center rounded-full border ${t.ring} bg-black transition md:left-[15px] ${open ? t.glow : ''}`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
      </button>

      <button onClick={onToggle} className="group w-full text-left">
        <div className={`rounded-2xl border bg-[#0e0e0e] p-5 transition md:p-6 ${open ? `${t.ring} bg-[#111]` : 'border-[#2A2A2A] hover:border-white/20'} ${marco.featured && !open ? 'border-red-500/30' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${t.chip}`}>
                <Icon className="h-3 w-3" aria-hidden /> {marco.badge}
              </span>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#666]">{marco.km}</p>
              <h3 className="mt-0.5 text-xl uppercase leading-tight md:text-2xl">{marco.title}</h3>
            </div>
            <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-[#888] transition ${open ? 'rotate-180' : ''}`} aria-hidden />
          </div>

          {/* detalhe expansível */}
          <div className={`grid transition-all duration-300 ease-out ${open ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              {marco.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                  {marco.stats.map((s) => (
                    <div key={s.k} className="rounded-xl border border-[#222] bg-black/40 p-3">
                      <p className="text-[10px] uppercase tracking-widest text-[#777]">{s.k}</p>
                      <p className={`mt-0.5 text-lg font-bold ${t.text}`}>{s.v}</p>
                    </div>
                  ))}
                </div>
              )}
              <ul className="mt-4 space-y-1.5">
                {marco.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-[#A1A1A1]">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`} /> {b}
                  </li>
                ))}
              </ul>
              {marco.alert && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-300">
                  <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden /> {marco.alert}
                </div>
              )}
              {marco.highlight && (
                <p className={`mt-4 border-l-2 pl-4 text-base font-semibold italic ${t.ring} ${t.text}`}>
                  “{marco.highlight}”
                </p>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

export function SommaRioClient() {
  const rootRef = useRef<HTMLElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [active, setActive] = useState('p42k')
  const [openIdx, setOpenIdx] = useState(0)

  /* Lenis + GSAP reveals + parallax */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 42, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.to('[data-hero-bg]', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } })
    }, rootRef)

    return () => {
      ctx.revert()
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  /* destaque do item ativo na navegação */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const goTo = (href: string) => {
    const sel = `#${href}`
    if (lenisRef.current) lenisRef.current.scrollTo(sel, { offset: -96 })
    else document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main
      ref={rootRef}
      className="min-h-screen overflow-x-hidden bg-black font-[family-name:var(--font-body)] text-white antialiased [&_h1]:font-[family-name:var(--font-display)] [&_h2]:font-[family-name:var(--font-display)] [&_h3]:font-[family-name:var(--font-display)]"
    >
      {/* ===== HEADER + NAV STICKY ===== */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-6">
          <button onClick={() => goTo('topo')} aria-label="Somma Club">
            <img src={LOGO_SOMMA} alt="Somma Club" className="h-6 w-auto md:h-7" />
          </button>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goTo(n.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${active === n.id ? 'bg-[#FF2C03] text-white' : 'text-white/60 hover:text-white'}`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
        {/* nav rolável no mobile */}
        <nav className="flex gap-2 overflow-x-auto border-t border-white/5 px-5 py-2.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => goTo(n.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${active === n.id ? 'border-[#FF2C03] bg-[#FF2C03] text-white' : 'border-[#2A2A2A] text-white/60'}`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section id="topo" data-hero className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
        <img data-hero-bg src={BG_HERO} alt="Rio de Janeiro" aria-hidden className="absolute inset-0 -z-20 h-[120%] w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.6)_45%,rgba(0,0,0,0.92)_100%)]" />
        <div className="mx-auto w-full max-w-7xl px-5 pt-32 pb-24 md:px-6">
          <div className="max-w-3xl">
            <div data-reveal><Eyebrow>Briefing técnico · Somma Club</Eyebrow></div>
            <h1 data-reveal className="text-[3rem] uppercase leading-[0.85] tracking-tight sm:text-7xl md:text-8xl">
              Maratona<br />do Rio <span className="text-[#FF2C03]">2026</span>
            </h1>
            <p data-reveal className="mt-6 max-w-xl text-lg font-semibold text-white md:text-xl">
              Tudo o que você precisa saber antes da largada.
            </p>
            <p data-reveal className="mt-3 max-w-xl text-sm leading-relaxed text-[#A1A1A1] md:text-base">
              Percurso, altimetria, hidratação, pontos críticos, torcida Somma e dicas estratégicas para
              fazer a sua melhor prova.
            </p>
            <button
              data-reveal
              onClick={() => goTo('p42k')}
              className="group mt-9 inline-flex items-center gap-3 rounded-md bg-[#FF2C03] px-8 py-4 text-sm font-bold tracking-wider text-white transition hover:bg-[#ff4d35]"
            >
              EXPLORAR PERCURSOS
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" aria-hidden />
            </button>
            {/* atalhos de distância */}
            <div data-reveal className="mt-10 flex flex-wrap gap-2">
              {[
                { id: 'p42k', n: '42K' }, { id: 'p21k', n: '21K' }, { id: 'p10k', n: '10K' }, { id: 'p5k', n: '5K' },
              ].map((d) => (
                <button key={d.id} onClick={() => goTo(d.id)} className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold tracking-wide text-white/80 backdrop-blur-sm transition hover:border-[#FF2C03] hover:text-[#FF2C03]">
                  {d.n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40">
          <ChevronDown className="h-6 w-6 animate-bounce" aria-hidden />
        </div>
      </section>

      {/* ===== 42K ===== */}
      <section id="p42k" className="scroll-mt-28 border-t border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div data-reveal><Eyebrow>Percurso principal</Eyebrow></div>
          <h2 data-reveal className="text-5xl uppercase leading-[0.9] md:text-6xl">42K · Maratona</h2>
          <p data-reveal className="mt-4 max-w-xl text-[#A1A1A1]">A prova completa, dividida em trechos. Toque em cada marco da timeline para ver o briefing.</p>

          {/* card de indicadores */}
          <div data-reveal className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: Route, v: '42,195 km', k: 'Distância' },
              { icon: Mountain, v: '≈ 150 m', k: 'Ganho de elevação' },
              { icon: Droplets, v: '13', k: 'Postos de hidratação' },
              { icon: Zap, v: '5', k: 'Postos de eletrólitos' },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-5">
                <s.icon className="mb-3 h-6 w-6 text-[#FF2C03]" aria-hidden />
                <p className="text-2xl font-bold md:text-3xl">{s.v}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-widest text-[#A1A1A1]">{s.k}</p>
              </div>
            ))}
          </div>

          {/* mapa interativo (Strava) */}
          <div data-reveal className="mt-12">
            <h3 className="text-2xl uppercase leading-tight md:text-3xl">Mapa interativo do percurso 42K</h3>
            <p className="mt-2 max-w-2xl text-sm text-[#A1A1A1] md:text-base">
              Explore o percurso completo da maratona, observe os trechos de subida, descida, altimetria e pontos
              críticos da prova.
            </p>
            <div className="mt-5">
              <StravaRouteEmbed
                title="Mapa interativo 42K Maratona do Rio"
                src={STRAVA_42}
                height={720}
                fallbackLabel="Abrir percurso 42K no Strava"
              />
            </div>
          </div>

          {/* altimetria (complementa o mapa) */}
          <div data-reveal className="mt-4"><ElevationProfile /></div>

          {/* timeline interativa */}
          <div className="mt-14">
            <div data-reveal className="mb-8 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF2C03]">KM 0</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#FF2C03]/60 to-[#2A2A2A]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF2C03]">KM 42</span>
            </div>
            <div className="relative space-y-3">
              {/* trilho vertical */}
              <span className="absolute left-[19px] top-2 bottom-2 w-px bg-[#222] md:left-[27px]" aria-hidden />
              {TIMELINE.map((m, i) => (
                <div key={m.title} data-reveal>
                  <TimelineItem marco={m} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 21K ===== */}
      <section id="p21k" className="scroll-mt-28 border-t border-[#1c1c1c] bg-[#060606]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div data-reveal><Eyebrow>Meia maratona</Eyebrow></div>
          <h2 data-reveal className="text-5xl uppercase leading-[0.9] md:text-6xl">21K · Meia</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS_21K.map((c) => (
              <div key={c.title} data-reveal className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-5 transition hover:-translate-y-1 hover:border-[#FF2C03]/50">
                <c.icon className="mb-4 h-6 w-6 text-[#FF2C03]" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#666]">{c.km}</p>
                <h3 className="mt-0.5 text-lg uppercase leading-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-[#A1A1A1]">{c.desc}</p>
              </div>
            ))}
          </div>
          {/* mapa interativo (Strava) */}
          <div data-reveal className="mt-12">
            <h3 className="text-2xl uppercase leading-tight md:text-3xl">Mapa interativo do percurso 21K</h3>
            <p className="mt-2 max-w-2xl text-sm text-[#A1A1A1] md:text-base">
              Explore o percurso, a altimetria e os principais pontos da meia maratona.
            </p>
            <div className="mt-5">
              <StravaRouteEmbed
                title="Mapa interativo 21K Maratona do Rio"
                src={STRAVA_21}
                height={680}
                fallbackLabel="Abrir percurso 21K no Strava"
              />
            </div>
          </div>

          {/* frase-destaque */}
          <div data-reveal className="mt-4 flex items-center rounded-2xl border border-[#FF2C03]/30 bg-[#FF2C03]/5 p-6 md:p-8">
            <p className="text-2xl font-semibold leading-snug md:text-3xl">
              <span className="text-[#FF2C03]">“</span>Segure até o km 16 e acelere no final.<span className="text-[#FF2C03]">”</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== 10K ===== */}
      <section id="p10k" className="scroll-mt-28 border-t border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div data-reveal><Eyebrow>Performance</Eyebrow></div>
          <h2 data-reveal className="text-5xl uppercase leading-[0.9] md:text-6xl">10K</h2>
          <p data-reveal className="mt-4 max-w-xl text-lg text-[#A1A1A1]">Percurso rápido e favorável para performance.</p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CARDS_10K.map((c) => (
              <div key={c.title} data-reveal className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-6 transition hover:-translate-y-1 hover:border-[#FF2C03]/50">
                <c.icon className="mb-4 h-7 w-7 text-[#FF2C03]" aria-hidden />
                <h3 className="text-xl uppercase leading-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-[#A1A1A1]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5K ===== */}
      <section id="p5k" className="scroll-mt-28 border-t border-[#1c1c1c] bg-[#060606]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div data-reveal><Eyebrow>Experiência</Eyebrow></div>
          <h2 data-reveal className="text-5xl uppercase leading-[0.9] md:text-6xl">5K</h2>
          <p data-reveal className="mt-4 max-w-xl text-lg text-[#A1A1A1]">Corra para se divertir.</p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CARDS_5K.map((c) => (
              <div key={c.title} data-reveal className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-6 transition hover:-translate-y-1 hover:border-[#FF2C03]/50">
                <c.icon className="mb-4 h-7 w-7 text-[#FF2C03]" aria-hidden />
                <h3 className="text-xl uppercase leading-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-[#A1A1A1]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HIDRATAÇÃO ===== */}
      <section id="hidratacao" className="scroll-mt-28 border-t border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div data-reveal><Eyebrow>Estratégia de prova</Eyebrow></div>
          <h2 data-reveal className="text-5xl uppercase leading-[0.9] md:text-6xl">Hidratação</h2>

          <div data-reveal className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: Droplets, v: '13', k: 'Postos de água' },
              { icon: Route, v: '≈ 3 km', k: 'Entre os postos' },
              { icon: Zap, v: '5', k: 'Postos de eletrólitos' },
              { icon: Flag, v: 'KM 10', k: '1º posto eletrolítico' },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-5">
                <s.icon className="mb-3 h-6 w-6 text-[#FF2C03]" aria-hidden />
                <p className="text-2xl font-bold md:text-3xl">{s.v}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-widest text-[#A1A1A1]">{s.k}</p>
              </div>
            ))}
          </div>

          {/* visualização horizontal dos postos */}
          <div data-reveal className="mt-4 rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-5 md:p-7">
            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5 text-[#A1A1A1]"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Água</span>
              <span className="flex items-center gap-1.5 text-[#A1A1A1]"><span className="h-2.5 w-2.5 rounded-full bg-[#FF2C03]" /> Eletrólitos</span>
            </div>
            <div className="relative h-16">
              {/* trilho */}
              <span className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#1c1c1c] via-[#262626] to-[#1c1c1c]" />
              {/* água (acima) */}
              {POSTOS_AGUA.map((km) => (
                <span key={`a${km}`} className="absolute top-1/2 -translate-x-1/2 -translate-y-[14px]" style={{ left: `${(km / KM_TOTAL) * 100}%` }} title={`Água · km ${km}`}>
                  <span className="block h-2.5 w-2.5 rounded-full bg-sky-400 ring-2 ring-sky-400/20" />
                </span>
              ))}
              {/* eletrólitos (abaixo) */}
              {POSTOS_ELETRO.map((km) => (
                <span key={`e${km}`} className="absolute top-1/2 flex -translate-x-1/2 translate-y-[6px] flex-col items-center" style={{ left: `${(km / KM_TOTAL) * 100}%` }} title={`Eletrólitos · km ${km}`}>
                  <span className="block h-3 w-3 rounded-full bg-[#FF2C03] ring-2 ring-[#FF2C03]/25" />
                </span>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[#666]">
              <span>KM 0</span><span>KM 10</span><span>KM 21</span><span>KM 31</span><span>KM 42</span>
            </div>
          </div>

          {/* alerta de calor */}
          <div data-reveal className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 md:p-6">
            <Thermometer className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" aria-hidden />
            <p className="text-sm leading-relaxed text-amber-100 md:text-base">
              A partir de aproximadamente <strong className="text-amber-300">1h30 de prova</strong> o calor começa a impactar
              significativamente o desempenho. Antecipe a hidratação — não espere a sede chegar.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TORCIDA SOMMA ===== */}
      <section id="torcida" className="scroll-mt-28 border-t border-[#FF2C03]/20">
        <div className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_0%_0%,rgba(255,44,3,0.18)_0%,rgba(0,0,0,0)_55%)]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-20 md:px-6 md:py-28 lg:grid-cols-2 lg:items-center">
            <div>
              <div data-reveal><Eyebrow>O laranja te espera</Eyebrow></div>
              <h2 data-reveal className="text-5xl uppercase leading-[0.9] md:text-6xl">Encontre a<br />torcida <span className="text-[#FF2C03]">Somma</span></h2>
              <div data-reveal className="mt-8 space-y-3">
                {[
                  { icon: MapPin, t: 'Entre o km 37 e o km 38' },
                  { icon: Flag, t: 'Próximo à Marina da Glória' },
                  { icon: Move, t: 'Próximo à última ponte' },
                ].map((r) => (
                  <div key={r.t} className="flex items-center gap-3 rounded-xl border border-[#2A2A2A] bg-[#0e0e0e] px-4 py-3">
                    <r.icon className="h-5 w-5 shrink-0 text-[#FF2C03]" aria-hidden />
                    <span className="font-semibold">{r.t}</span>
                  </div>
                ))}
              </div>
              <p data-reveal className="mt-8 border-l-2 border-[#FF2C03] pl-5 text-2xl font-semibold italic leading-snug md:text-3xl">
                Quando estiver difícil, procure o <span className="text-[#FF2C03]">laranja</span>.
              </p>
            </div>
            <div data-reveal className="overflow-hidden rounded-2xl border border-[#FF2C03]/30">
              <iframe
                src={MARINA_EMBED}
                title="Mapa da torcida Somma — Marina da Glória"
                className="h-[20rem] w-full md:h-[26rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, filter: 'grayscale(0.3) contrast(1.05)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== DICAS FINAIS ===== */}
      <section className="border-t border-[#1c1c1c] bg-[#060606]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div data-reveal><Eyebrow>Checklist do atleta</Eyebrow></div>
          <h2 data-reveal className="text-5xl uppercase leading-[0.9] md:text-6xl">Dicas finais</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {DICAS.map((d) => (
              <div key={d.title} data-reveal className="rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-6 transition hover:-translate-y-1 hover:border-[#FF2C03]/50">
                <d.icon className="mb-4 h-7 w-7 text-[#FF2C03]" aria-hidden />
                <h3 className="text-lg uppercase leading-tight">{d.title}</h3>
                <p className="mt-2 text-sm text-[#A1A1A1]">{d.desc}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-[#FF2C03]/30 bg-[#FF2C03]/5 p-7 sm:flex-row sm:items-center sm:justify-between md:p-9">
            <div>
              <h3 className="text-3xl uppercase leading-none md:text-4xl">Boa prova, atleta.</h3>
              <p className="mt-2 text-[#A1A1A1]">Confie no plano. O Somma corre com você.</p>
            </div>
            <button onClick={() => goTo('topo')} className="group inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-bold tracking-wider transition hover:border-[#FF2C03] hover:text-[#FF2C03]">
              VOLTAR AO TOPO <ArrowRight className="h-4 w-4 -rotate-90 transition group-hover:-translate-y-1" aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
