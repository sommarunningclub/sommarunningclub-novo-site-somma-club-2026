'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ChevronDown, Mountain, Droplets, Zap, Flag, Users, Thermometer, TrendingDown,
  TrendingUp, Flame, CornerUpRight, Move, Gauge, Activity, Heart, Footprints,
  Sun, Moon, Sparkles, Maximize, Minimize,
} from 'lucide-react'
import { GAIN_42K, GAIN_21K, ROUTE_42K, ROUTE_21K, ELEV_42K, ELEV_21K } from '../somma-rio-2026/route-data'
import { ElevationProfile } from '@/components/somma-rio/elevation-profile'
import { RioFlyover, type CircuitPoi } from '@/components/somma-rio/rio-flyover'
import { HeroQR } from '@/components/somma-rio/hero-qr'

const PAGE_URL = 'https://www.sommaclub.com.br/somma-rio-2026-ppt'

const LOGO_WHITE = '/Logo_Nova_Somma_Branca_Laranja.svg'
const LOGO_DARK = 'https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png?v=1772322941'
const SOMMA = '#FF2C03'

type Mode = 'claro' | 'escuro' | 'vivo'
const VIVID = ['#FF2C03', '#111827', '#2563eb', '#db2777', '#059669', '#7c3aed', '#0891b2', '#e11d48', '#0f766e', '#b91c1c', '#1d4ed8', '#000000']

interface Tokens { bg: string; text: string; sub: string; cardB: string; cardBg: string; accent: string; eyebrow: string; onLight: boolean }
function resolve(mode: Mode, i: number): Tokens {
  if (mode === 'claro') return { bg: '#ffffff', text: 'text-neutral-900', sub: 'text-neutral-500', cardB: 'border-black/10', cardBg: 'bg-black/[0.025]', accent: SOMMA, eyebrow: SOMMA, onLight: true }
  if (mode === 'escuro') return { bg: '#000000', text: 'text-white', sub: 'text-white/55', cardB: 'border-white/10', cardBg: 'bg-white/[0.04]', accent: SOMMA, eyebrow: SOMMA, onLight: false }
  return { bg: VIVID[i % VIVID.length], text: 'text-white', sub: 'text-white/85', cardB: 'border-white/25', cardBg: 'bg-white/10', accent: '#ffffff', eyebrow: '#ffffff', onLight: false }
}

const MAP_INDEX = 3
const SECTIONS = ['Capa', 'Provas', '42K', 'Mapa', 'Trechos', '21K', '10K', '5K', 'Hidratação', 'Torcida', 'Dicas', 'Fim']

const TONE_HEX: Record<string, string> = { green: '#10b981', yellow: '#f59e0b', red: '#ef4444', orange: SOMMA }

const TRECHOS_42K = [
  { tone: 'green', icon: Activity, km: 'KM 0 – 14,5', t: 'Comece no controle', d: 'Totalmente plano. Encontre o ritmo e não exagere no início.' },
  { tone: 'yellow', icon: TrendingUp, km: 'KM 14,5 – 15,9', t: 'Subida do Joá', d: '1,5 km · +33 m. Perder 20–30s é normal — não compense na subida.' },
  { tone: 'red', icon: TrendingDown, km: 'Descida do Joá', t: 'Descida técnica', d: 'Controle o ritmo e preserve o quadríceps. Quem ganha tempo aqui perde depois.' },
  { tone: 'yellow', icon: TrendingUp, km: 'KM 19,5 – 21,4', t: 'Subida de São Conrado', d: '1,9 km · +36 m. Os últimos 400 m têm descida íngreme.' },
  { tone: 'red', icon: Flame, km: 'KM 24 – 30,5', t: 'A maratona começa aqui', d: 'Leblon: piso irregular e muita torcida. Não corra pela emoção.' },
  { tone: 'orange', icon: Flag, km: 'KM 37', t: 'Marina da Glória', d: 'Início da reta final, no centro do Rio.' },
  { tone: 'yellow', icon: TrendingUp, km: 'KM 39', t: 'Viaduto', d: 'Subida curta com desgaste acumulado.' },
]
const CARDS_21K = [
  { icon: Flag, km: 'Largada', t: 'Jardim de Alah' },
  { icon: Move, km: 'KM 6,5', t: 'Entrada no túnel' },
  { icon: Users, km: 'KM 16,5', t: 'Muita torcida' },
  { icon: TrendingUp, km: 'KM 19', t: 'Pequena subida' },
]
const CARDS_10K = [
  { icon: Gauge, t: 'Controle a largada', d: 'Não saia acima do ritmo.' },
  { icon: Activity, t: 'Mantenha a estratégia', d: 'Constância vence a empolgação.' },
  { icon: Flag, t: 'Aproveite o percurso', d: 'Trajeto rápido e favorável.' },
]
const CARDS_5K = [
  { icon: Heart, t: 'Aproveite', d: 'O foco é celebrar.' },
  { icon: Gauge, t: 'Respeite seu ritmo', d: 'Sem cobrança de tempo.' },
  { icon: Footprints, t: 'Largue no planejado', d: 'Não comece acima do combinado.' },
]
const DICAS = [
  { icon: CornerUpRight, t: 'Curvas', d: 'Faça pela tangente' },
  { icon: Move, t: 'Terreno irregular', d: 'Corra no centro da pista' },
  { icon: Mountain, t: 'Subidas', d: 'Controle o esforço' },
  { icon: Users, t: 'Torcida', d: 'Não altere seu plano' },
  { icon: Droplets, t: 'Hidratação', d: 'Use todos os postos' },
]
const POIS_42K: CircuitPoi[] = [
  { km: 7, tone: 'green', title: 'Trecho favorável', note: 'Plano até o km 14,5 — segure o ritmo.' },
  { km: 15.9, tone: 'yellow', title: 'Subida do Joá', note: '1,5 km · +33 m. Não compense na subida.' },
  { km: 17, tone: 'red', title: 'Descida do Joá', note: 'Técnica — preserve o quadríceps.' },
  { km: 21.4, tone: 'yellow', title: 'Subida de São Conrado', note: '1,9 km · +36 m. Descida íngreme no fim.' },
  { km: 27, tone: 'red', title: 'A maratona começa aqui', note: 'Leblon — piso irregular e muita torcida.' },
  { km: 37, tone: 'orange', title: 'Marina da Glória', note: 'Início da reta final.' },
  { km: 39, tone: 'yellow', title: 'Viaduto', note: 'Subida curta com desgaste acumulado.' },
]
const POIS_21K: CircuitPoi[] = [
  { km: 0.1, tone: 'green', title: 'Largada · Jardim de Alah' },
  { km: 6.5, tone: 'orange', title: 'Entrada no túnel' },
  { km: 16.5, tone: 'red', title: 'Muita torcida' },
  { km: 19, tone: 'yellow', title: 'Subida final' },
]
const KM_TOTAL = 42.195
const POSTOS_AGUA = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39]
const POSTOS_ELETRO = [10, 17, 24, 31, 38]

const Eyebrow = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <p data-anim className="mb-4 text-xs font-bold uppercase tracking-[0.3em]" style={{ color }}>{children}</p>
)

function Section({ i, mode, center = false, className = '', children }: { i: number; mode: Mode; center?: boolean; className?: string; children: React.ReactNode }) {
  const tk = resolve(mode, i)
  return (
    <section
      id={`sec-${i}`} data-sec data-index={i}
      className={`relative flex min-h-[100svh] w-full flex-col justify-center px-5 py-16 transition-colors duration-500 sm:px-6 sm:py-20 ${tk.text} ${center ? 'items-center text-center' : ''} ${className}`}
      style={{ backgroundColor: tk.bg }}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  )
}

export function PptClient() {
  const [mode, setMode] = useState<Mode>('vivo')
  const [active, setActive] = useState(0)
  const [mapDist, setMapDist] = useState<'42' | '21'>('42')
  const [openTrecho, setOpenTrecho] = useState(0)
  const [fs, setFs] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Lenis + GSAP reveals
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight
      const r = max > 0 ? window.scrollY / max : 0
      if (progressBarRef.current) progressBarRef.current.style.width = `${r * 100}%`
    })
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-anim]').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } })
      })
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.from(Array.from(group.children), { opacity: 0, y: 36, duration: 0.7, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: group, start: 'top 82%' } })
      })
    }, rootRef)

    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null }
  }, [])

  // seção ativa
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (vis) setActive(Number((vis.target as HTMLElement).dataset.index))
      },
      { threshold: [0.4, 0.6] }
    )
    document.querySelectorAll('[data-sec]').forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  // fullscreen
  useEffect(() => {
    const h = () => setFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  const toggleFs = () => {
    const de = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }
    const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> }
    if (!document.fullscreenElement) (de.requestFullscreen?.() ?? de.webkitRequestFullscreen?.())?.catch?.(() => {})
    else (document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())?.catch?.(() => {})
  }

  const goTo = (i: number) => {
    const el = document.getElementById(`sec-${i}`)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el)
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  const tkActive = resolve(mode, active)
  const onLight = tkActive.onLight

  const MODES: { m: Mode; icon: React.ElementType; label: string }[] = [
    { m: 'claro', icon: Sun, label: 'Claro' }, { m: 'escuro', icon: Moon, label: 'Escuro' }, { m: 'vivo', icon: Sparkles, label: 'Vivo' },
  ]

  const T = (i: number) => resolve(mode, i)

  return (
    <div ref={rootRef} className={`overflow-x-hidden font-[family-name:var(--font-body)] antialiased [&_h1]:font-[family-name:var(--font-display)] [&_h2]:font-[family-name:var(--font-display)] [&_h3]:font-[family-name:var(--font-display)]`}>
      {/* progresso */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-black/10">
        <div ref={progressBarRef} className="h-full bg-[#FF2C03] transition-[width] duration-150" style={{ width: '0%' }} />
      </div>

      {/* controles fixos */}
      <div className="fixed right-[max(1.25rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-50 flex items-center gap-2">
        <div className={`flex items-center gap-0.5 rounded-full border p-0.5 backdrop-blur-md ${onLight ? 'border-black/15 bg-white/70' : 'border-white/20 bg-black/40'}`}>
          {MODES.map(({ m, icon: Icon, label }) => (
            <button key={m} onClick={() => setMode(m)} aria-label={label} title={label}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${mode === m ? 'bg-[#FF2C03] text-white' : onLight ? 'text-neutral-500 hover:text-black' : 'text-white/60 hover:text-white'}`}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <button onClick={toggleFs} aria-label="Tela cheia" title={fs ? 'Sair da tela cheia' : 'Tela cheia'}
          className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${onLight ? 'border-black/15 bg-white/70 text-neutral-600 hover:text-black' : 'border-white/20 bg-black/40 text-white/70 hover:text-white'}`}>
          {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>

      {/* dots de navegação */}
      <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-2.5 lg:flex">
        {SECTIONS.map((s, i) => (
          <button key={s} onClick={() => goTo(i)} aria-label={s} title={s}
            className={`rounded-full transition-all ${i === active ? 'h-6 w-1.5 bg-[#FF2C03]' : `h-1.5 w-1.5 ${onLight ? 'bg-black/25 hover:bg-black/50' : 'bg-white/30 hover:bg-white/60'}`}`} />
        ))}
      </div>

      {/* contador */}
      <div className={`fixed left-[max(1.25rem,env(safe-area-inset-left))] top-[max(1.1rem,env(safe-area-inset-top))] z-50 font-mono text-xs font-bold tracking-widest ${onLight ? 'text-neutral-400' : 'text-white/55'}`}>
        {String(active + 1).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
      </div>

      {/* ===== 0 · CAPA ===== */}
      <Section mode={mode} i={0} center>
        <img data-anim src={T(0).onLight ? LOGO_DARK : LOGO_WHITE} alt="Somma Club" className="mx-auto mb-10 h-9 w-auto" />
        <Eyebrow color={T(0).eyebrow}>Briefing · Guia de prova</Eyebrow>
        <h1 data-anim className="text-[2.9rem] uppercase leading-[0.85] tracking-tight sm:text-7xl md:text-9xl">
          Maratona<br />do Rio <span style={{ color: T(0).accent }}>2026</span>
        </h1>
        <p data-anim className={`mx-auto mt-7 max-w-md text-base md:text-lg ${T(0).sub}`}>Tudo o que você precisa saber antes da largada — role para começar.</p>
        <button data-anim onClick={() => goTo(1)} className="mx-auto mt-9 flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-[#FF2C03] text-white"><ChevronDown className="h-5 w-5" /></button>
        <HeroQR url={PAGE_URL} className="absolute bottom-10 right-8 z-20" />
      </Section>

      {/* ===== 1 · PROVAS ===== */}
      <Section mode={mode} i={1}>
        <Eyebrow color={T(1).eyebrow}>As provas</Eyebrow>
        <h2 data-anim className="text-4xl uppercase leading-[0.9] sm:text-5xl md:text-7xl">Quatro distâncias,<br />uma cidade</h2>
        <div data-stagger className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { d: '42K', s: `42,195 km · +${GAIN_42K} m` }, { d: '21K', s: `21,097 km · +${GAIN_21K} m` },
            { d: '10K', s: 'Rápido e favorável' }, { d: '5K', s: 'Para se divertir' },
          ].map((x) => (
            <div key={x.d} className={`rounded-2xl border p-6 ${T(1).cardB} ${T(1).cardBg}`}>
              <p className="text-4xl md:text-5xl" style={{ color: T(1).accent }}>{x.d}</p>
              <p className={`mt-2 text-sm ${T(1).sub}`}>{x.s}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 2 · 42K indicadores + altimetria ===== */}
      <Section mode={mode} i={2}>
        <Eyebrow color={T(2).eyebrow}>A prova completa</Eyebrow>
        <h2 data-anim className="text-6xl uppercase leading-[0.85] md:text-8xl">42K</h2>
        <div data-stagger className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { i: Footprints, v: '42,195 km', k: 'Distância' }, { i: Mountain, v: `+${GAIN_42K} m`, k: 'Elevação' },
            { i: Droplets, v: '13', k: 'Hidratação' }, { i: Zap, v: '5', k: 'Eletrólitos' },
          ].map((x) => (
            <div key={x.k} className={`rounded-2xl border p-4 ${T(2).cardB} ${T(2).cardBg}`}>
              <x.i className="mb-2 h-6 w-6" style={{ color: T(2).accent }} />
              <p className="text-xl font-bold sm:text-2xl">{x.v}</p>
              <p className={`mt-0.5 text-[11px] uppercase tracking-widest ${T(2).sub}`}>{x.k}</p>
            </div>
          ))}
        </div>
        <div data-anim className="mt-4">
          <ElevationProfile data={ELEV_42K} gain={GAIN_42K} peaks={[{ km: 15.9, label: 'Joá' }, { km: 21.4, label: 'S. Conrado' }, { km: 37, label: 'Marina' }, { km: 39, label: 'Viaduto' }]} />
        </div>
      </Section>

      {/* ===== 3 · SOBREVOO DO MAPA ===== */}
      <Section mode={mode} i={3}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow color={T(3).eyebrow}>Sobrevoo do circuito</Eyebrow>
            <h2 data-anim className="text-3xl uppercase leading-none md:text-5xl">Veja a rota no mapa</h2>
          </div>
          <div className={`flex gap-0.5 rounded-full border p-0.5 ${T(3).onLight ? 'border-black/15 bg-black/[0.03]' : 'border-white/20 bg-white/5'}`}>
            {(['42', '21'] as const).map((d) => (
              <button key={d} onClick={() => setMapDist(d)} className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${mapDist === d ? 'bg-[#FF2C03] text-white' : T(3).onLight ? 'text-neutral-500' : 'text-white/60'}`}>{d}K</button>
            ))}
          </div>
        </div>
        <div data-anim onTouchStart={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
          <RioFlyover key={mapDist} points={mapDist === '42' ? ROUTE_42K : ROUTE_21K} pois={mapDist === '42' ? POIS_42K : POIS_21K}
            label={mapDist === '42' ? 'Circuito 42K' : 'Circuito 21K'} distanceLabel={mapDist === '42' ? '42,195 KM' : '21,097 KM'}
            autoActive={active === MAP_INDEX} className="h-[46vh] sm:h-[50vh]" />
        </div>
      </Section>

      {/* ===== 4 · TRECHOS DO 42K ===== */}
      <Section mode={mode} i={4}>
        <Eyebrow color={T(4).eyebrow}>Pontos de atenção</Eyebrow>
        <h2 data-anim className="text-4xl uppercase leading-[0.9] md:text-6xl">Onde a prova<br />é decidida</h2>
        <p data-anim className={`mt-3 text-sm ${T(4).sub}`}>Toque em cada trecho para a recomendação.</p>
        <div data-stagger className="mt-7 space-y-2.5">
          {TRECHOS_42K.map((c, i) => {
            const open = openTrecho === i
            return (
              <button key={c.t} onClick={() => setOpenTrecho(open ? -1 : i)} className={`block w-full rounded-2xl border p-4 text-left transition ${T(4).cardB} ${open ? T(4).cardBg : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${TONE_HEX[c.tone]}22` }}>
                    <c.icon className="h-4 w-4" style={{ color: TONE_HEX[c.tone] }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${T(4).sub}`}>{c.km}</p>
                    <p className="text-lg uppercase leading-tight">{c.t}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition ${T(4).sub} ${open ? 'rotate-180' : ''}`} />
                </div>
                <div className={`grid transition-all duration-300 ${open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <p className={`overflow-hidden text-sm ${T(4).sub}`}>{c.d}</p>
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ===== 5 · 21K ===== */}
      <Section mode={mode} i={5}>
        <Eyebrow color={T(5).eyebrow}>Meia maratona</Eyebrow>
        <h2 data-anim className="text-6xl uppercase leading-[0.85] md:text-8xl">21K</h2>
        <div data-stagger className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {CARDS_21K.map((c) => (
            <div key={c.t} className={`rounded-2xl border p-4 ${T(5).cardB} ${T(5).cardBg}`}>
              <c.icon className="mb-2 h-5 w-5" style={{ color: T(5).accent }} />
              <p className={`text-[10px] font-bold uppercase tracking-widest ${T(5).sub}`}>{c.km}</p>
              <p className="text-base uppercase leading-tight">{c.t}</p>
            </div>
          ))}
        </div>
        <div data-anim className="mt-4"><ElevationProfile data={ELEV_21K} gain={GAIN_21K} peaks={[{ km: 19, label: 'Subida' }]} /></div>
        <p data-anim className="mt-4 text-2xl font-semibold italic md:text-3xl" style={{ color: T(5).accent }}>“Segure até o km 16 e acelere no final.”</p>
      </Section>

      {/* ===== 6 · 10K ===== */}
      <Section mode={mode} i={6}>
        <Eyebrow color={T(6).eyebrow}>Performance</Eyebrow>
        <h2 data-anim className="text-6xl uppercase leading-[0.85] md:text-8xl">10K</h2>
        <p data-anim className={`mt-4 text-lg ${T(6).sub}`}>Percurso rápido e favorável para performance.</p>
        <div data-stagger className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CARDS_10K.map((c) => (
            <div key={c.t} className={`rounded-2xl border p-5 ${T(6).cardB} ${T(6).cardBg}`}>
              <c.icon className="mb-3 h-6 w-6" style={{ color: T(6).accent }} />
              <p className="text-lg uppercase leading-tight">{c.t}</p>
              <p className={`mt-1 text-sm ${T(6).sub}`}>{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 7 · 5K ===== */}
      <Section mode={mode} i={7}>
        <Eyebrow color={T(7).eyebrow}>Experiência</Eyebrow>
        <h2 data-anim className="text-6xl uppercase leading-[0.85] md:text-8xl">5K</h2>
        <p data-anim className={`mt-4 text-lg ${T(7).sub}`}>Corra para se divertir.</p>
        <div data-stagger className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CARDS_5K.map((c) => (
            <div key={c.t} className={`rounded-2xl border p-5 ${T(7).cardB} ${T(7).cardBg}`}>
              <c.icon className="mb-3 h-6 w-6" style={{ color: T(7).accent }} />
              <p className="text-lg uppercase leading-tight">{c.t}</p>
              <p className={`mt-1 text-sm ${T(7).sub}`}>{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 8 · HIDRATAÇÃO ===== */}
      <Section mode={mode} i={8}>
        <Eyebrow color={T(8).eyebrow}>Estratégia de prova</Eyebrow>
        <h2 data-anim className="text-4xl uppercase leading-[0.9] sm:text-5xl md:text-7xl">Hidratação</h2>
        <div data-stagger className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { i: Droplets, v: '13', k: 'postos de água' }, { i: Flag, v: '≈ 3 km', k: 'entre postos' },
            { i: Zap, v: '5', k: 'eletrólitos' }, { i: Flag, v: 'KM 10', k: '1º eletrolítico' },
          ].map((x) => (
            <div key={x.k} className={`rounded-2xl border p-4 ${T(8).cardB} ${T(8).cardBg}`}>
              <x.i className="mb-2 h-6 w-6" style={{ color: T(8).accent }} />
              <p className="text-2xl font-bold">{x.v}</p>
              <p className={`mt-0.5 text-[11px] uppercase tracking-widest ${T(8).sub}`}>{x.k}</p>
            </div>
          ))}
        </div>
        {/* régua dos postos */}
        <div data-anim className={`mt-4 rounded-2xl border p-5 ${T(8).cardB} ${T(8).cardBg}`}>
          <div className="relative h-14">
            <span className={`absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full ${T(8).onLight ? 'bg-black/10' : 'bg-white/15'}`} />
            {POSTOS_AGUA.map((km) => (
              <span key={`a${km}`} className="absolute top-1/2 -translate-x-1/2 -translate-y-[13px]" style={{ left: `${(km / KM_TOTAL) * 100}%` }}>
                <span className="block h-2.5 w-2.5 rounded-full bg-sky-400" />
              </span>
            ))}
            {POSTOS_ELETRO.map((km) => (
              <span key={`e${km}`} className="absolute top-1/2 translate-y-[5px] -translate-x-1/2" style={{ left: `${(km / KM_TOTAL) * 100}%` }}>
                <span className="block h-3 w-3 rounded-full bg-[#FF2C03]" />
              </span>
            ))}
          </div>
          <div className={`mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider ${T(8).sub}`}>
            <span>KM 0</span><span>KM 21</span><span>KM 42</span>
          </div>
        </div>
        <div data-anim className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/15 p-5">
          <Thermometer className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
          <p className={`text-sm md:text-base ${T(8).onLight ? 'text-amber-800' : 'text-amber-100'}`}>A partir de <strong>1h30 de prova</strong> o calor impacta o desempenho. Antecipe a hidratação.</p>
        </div>
      </Section>

      {/* ===== 9 · TORCIDA SOMMA ===== */}
      <Section mode={mode} i={9} center>
        <Eyebrow color={T(9).eyebrow}>O laranja te espera</Eyebrow>
        <h2 data-anim className="text-[2.8rem] uppercase leading-[0.9] md:text-8xl">Procure<br />o laranja</h2>
        <p data-anim className={`mx-auto mt-7 max-w-md text-lg ${T(9).sub}`}>Entre o <strong>km 37 e o km 38</strong>, próximo à Marina da Glória e à última ponte.</p>
        <p data-anim className="mt-6 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: T(9).accent }}>Quando estiver difícil, ache a torcida Somma</p>
      </Section>

      {/* ===== 10 · DICAS ===== */}
      <Section mode={mode} i={10}>
        <Eyebrow color={T(10).eyebrow}>Checklist do atleta</Eyebrow>
        <h2 data-anim className="text-4xl uppercase leading-[0.9] sm:text-5xl md:text-7xl">Dicas finais</h2>
        <div data-stagger className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {DICAS.map((d) => (
            <div key={d.t} className={`rounded-2xl border p-5 ${T(10).cardB} ${T(10).cardBg}`}>
              <d.icon className="mb-3 h-6 w-6" style={{ color: T(10).accent }} />
              <p className="text-base font-bold uppercase leading-tight">{d.t}</p>
              <p className={`mt-1 text-sm ${T(10).sub}`}>{d.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 11 · FIM ===== */}
      <Section mode={mode} i={11} center>
        <h2 data-anim className="text-4xl uppercase leading-[0.85] sm:text-5xl md:text-8xl">Boa prova,<br /><span style={{ color: T(11).accent }}>atleta</span></h2>
        <p data-anim className={`mt-6 text-lg ${T(11).sub}`}>Confie no plano. O Somma corre com você.</p>
        <img data-anim src={T(11).onLight ? LOGO_DARK : LOGO_WHITE} alt="Somma Club" className="mx-auto mt-10 h-9 w-auto" />
      </Section>
    </div>
  )
}
