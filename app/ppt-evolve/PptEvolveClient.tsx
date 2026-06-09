'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, Maximize, Minimize, Menu, X, PanelLeftClose, PanelLeftOpen, Sun, Moon } from 'lucide-react'
import { EvolveMap } from '@/components/evolve/evolve-map'

/* ============================================================================
 * Componentes — tema ESCURO editorial
 * ========================================================================== */

const O = ({ children }: { children: ReactNode }) => <span className="text-[#FF2C03]">{children}</span>

function Eyebrow({ children }: { children: ReactNode }) {
  return <p data-anim className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#FF2C03] sm:text-xs">{children}</p>
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight text-[rgb(var(--fg))] text-4xl sm:text-5xl lg:text-6xl">
      {children}
    </h2>
  )
}

function Head({ k, title, sub }: { k: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="space-y-3 border-l-2 border-[#FF2C03] pl-4 sm:pl-5">
      <Eyebrow>{k}</Eyebrow>
      <Title>{title}</Title>
      {sub && <p data-anim className="max-w-2xl text-sm leading-snug text-[rgb(var(--fg)_/_0.55)] sm:text-base lg:text-lg">{sub}</p>}
    </header>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p data-anim className="text-sm leading-snug text-[rgb(var(--fg)_/_0.45)] sm:text-base">{children}</p>
}

function Lead({ children }: { children: ReactNode }) {
  return <p data-anim className="text-lg font-medium leading-snug text-[rgb(var(--fg)_/_0.9)] sm:text-2xl lg:text-[1.7rem]">{children}</p>
}

function Panel({ title, items, variant = 'plain' }: { title: string; items: ReactNode[]; variant?: 'muted' | 'accent' | 'plain' }) {
  const accent = variant === 'accent'
  const muted = variant === 'muted'
  return (
    <div data-anim className={`rounded-2xl p-5 sm:p-6 ${accent ? 'border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10]' : muted ? 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.03)]' : 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.05)]'}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accent ? 'text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.4)]'}`}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm leading-snug text-[rgb(var(--fg)_/_0.85)] sm:text-base"><span className="text-[#FF2C03]">▸</span><span>{it}</span></li>
        ))}
      </ul>
    </div>
  )
}

function Arrow() {
  return <div className="flex justify-center text-base text-[rgb(var(--fg)_/_0.25)]">↓</div>
}

type Tile = { emoji: string; t: string; d: string }
function Tiles({ items, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { items: Tile[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 ${cols}`}>
      {items.map(({ emoji, t, d }, i) => (
        <div key={i} data-anim className="rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)] p-4">
          <span className="text-2xl">{emoji}</span>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-[rgb(var(--fg))]">{t}</h3>
          <p className="mt-1 text-[13px] leading-snug text-[rgb(var(--fg)_/_0.55)]">{d}</p>
        </div>
      ))}
    </div>
  )
}

function DataTable({ heads, rows }: { heads: string[]; rows: ReactNode[][] }) {
  return (
    <div data-anim className="overflow-x-auto rounded-2xl border border-[rgb(var(--fg)_/_0.1)]">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="bg-[rgb(var(--panel)_/_0.07)]">
            {heads.map((h, i) => <th key={i} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] ${i === 0 ? 'text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.6)]'}`}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-[rgb(var(--fg)_/_0.08)]">
              {r.map((c, ci) => <td key={ci} className={`px-4 py-3 align-top text-[13px] sm:text-sm ${ci === 0 ? 'font-semibold text-[rgb(var(--fg))]' : 'text-[rgb(var(--fg)_/_0.6)]'}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div data-anim className="flex flex-wrap gap-2">
      {items.map((c) => (
        <span key={c} className="rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[rgb(var(--panel)_/_0.05)] px-3.5 py-2 text-sm font-semibold text-[rgb(var(--fg)_/_0.8)]">{c}</span>
      ))}
    </div>
  )
}

/** Números gigantes */
function Stats({ items, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { items: { n: string; l: string }[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${cols}`}>
      {items.map((s) => (
        <div key={s.l} data-anim className="rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)] p-4 text-center">
          <p className="font-[family-name:var(--font-display)] text-4xl uppercase leading-none tracking-tight text-[#FF2C03] sm:text-5xl">{s.n}</p>
          <p className="mt-2 text-[11px] font-medium leading-tight text-[rgb(var(--fg)_/_0.55)] sm:text-xs">{s.l}</p>
        </div>
      ))}
    </div>
  )
}

/** Fluxo vertical com setas */
function VFlow({ items, highlightFrom }: { items: string[]; highlightFrom?: number }) {
  return (
    <div data-anim className="mx-auto flex max-w-sm flex-col gap-1.5">
      {items.map((t, i) => {
        const hot = highlightFrom !== undefined && i >= highlightFrom
        return (
          <div key={t}>
            <div className={`rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${i === 0 || hot ? 'bg-[#FF2C03] text-black' : 'border border-[rgb(var(--fg)_/_0.15)] bg-[rgb(var(--panel)_/_0.05)] text-[rgb(var(--fg)_/_0.85)]'}`}>{t}</div>
            {i < items.length - 1 && <div className="flex justify-center text-[rgb(var(--fg)_/_0.25)]">↓</div>}
          </div>
        )
      })}
    </div>
  )
}

/** Funil como fluxo de nós conectados, estilo n8n */
function FunnelFlow() {
  const W = 940, H = 250, nw = 132, nh = 60
  const nodes = [
    { x: 6, y: 90, e: '👥', t: 'Comunidade' },
    { x: 162, y: 14, e: '✨', t: 'Experiência' },
    { x: 318, y: 162, e: '🤝', t: 'Relacionamento' },
    { x: 474, y: 40, e: '🎟️', t: 'Teste' },
    { x: 630, y: 168, e: '✅', t: 'Matrícula', hot: true },
    { x: 706, y: 36, e: '🔁', t: 'Retenção', hot: true },
    { x: 802, y: 120, e: '📣', t: 'Advocacia', hot: true },
  ]
  const paths = nodes.slice(0, -1).map((a, i) => {
    const b = nodes[i + 1]
    const sx = a.x + nw, sy = a.y + nh / 2, ex = b.x, ey = b.y + nh / 2, mx = (sx + ex) / 2
    return `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}`
  })
  return (
    <div data-anim className="funnel-grid overflow-x-auto rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.03)]">
      <div className="relative mx-auto" style={{ width: W, height: H }}>
        <svg width={W} height={H} className="absolute inset-0">
          {paths.map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke="rgb(var(--fg) / 0.12)" strokeWidth={3} />
              <path d={d} fill="none" stroke="#FF2C03" strokeWidth={2.5} strokeDasharray="6 10" className="funnel-flow" style={{ animationDelay: `${i * 0.18}s` }} />
            </g>
          ))}
        </svg>
        {nodes.map((n, i) => (
          <div
            key={n.t}
            className={`absolute rounded-xl border shadow-lg ${n.hot ? 'border-[#FF2C03] bg-[#FF2C03]/[0.12]' : 'border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)]'}`}
            style={{ left: n.x, top: n.y, width: nw, height: nh }}
          >
            <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#FF2C03] bg-[var(--bg)]" />
            <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#FF2C03] bg-[var(--bg)]" />
            <div className="flex h-full items-center gap-2 px-2.5">
              <span className="shrink-0 text-lg leading-none">{n.e}</span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold leading-tight text-[rgb(var(--fg))]">{n.t}</p>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[rgb(var(--fg)_/_0.4)]">etapa {i + 1}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogoImg({ src, alt, h = 'h-7' }: { src: string; alt: string; h?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`logo-adapt ${h} w-auto`} />
}

function ClosingCard({ kicker, title, sub }: { kicker: string; title: ReactNode; sub: ReactNode }) {
  return (
    <div data-anim className="rounded-3xl bg-[#FF2C03] p-8 text-center sm:p-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60 sm:text-xs">{kicker}</p>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl uppercase leading-[0.98] tracking-tight text-black sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-snug text-black/80 sm:text-lg">{sub}</p>
    </div>
  )
}

/** Ecossistema em órbita — logo Somma no centro, elementos orbitando */
function OrbitEcosystem() {
  const items = [
    { e: '🏃', t: 'Comunidade' },
    { e: '📈', t: 'Assessoria' },
    { e: '🎉', t: 'Eventos' },
    { e: '👕', t: 'Loja' },
    { e: '📣', t: 'Influenciadores' },
    { e: '✨', t: 'Experiências' },
    { e: '🤝', t: 'Parceiros' },
    { e: '🎬', t: 'Conteúdo' },
    { e: '🔗', t: 'Networking' },
    { e: '🌅', t: 'Lifestyle' },
  ]
  const rings = [
    { d: 46, dur: 20, count: 2 },
    { d: 73, dur: 28, count: 4 },
    { d: 100, dur: 36, count: 4 },
  ]
  const nodes: { it: { e: string; t: string }; d: number; dur: number; delay: number }[] = []
  let idx = 0
  for (const r of rings) {
    for (let k = 0; k < r.count; k++) {
      const it = items[idx++]
      if (!it) break
      nodes.push({ it, d: r.d, dur: r.dur, delay: -(r.dur * k) / r.count })
    }
  }
  return (
    <div data-anim className="eco">
      <style>{`
        .eco { position: relative; margin: 0 auto; width: min(80vw, 300px); aspect-ratio: 1; }
        @media (min-width: 640px){ .eco{ width: 380px; } }
        @media (min-width: 1024px){ .eco{ width: 420px; } }
        .eco-ring { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; border:1px solid rgb(var(--fg) / 0.12); }
        .eco-ring.lit { border-color: rgba(255,44,3,.18); }
        .eco-center { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:20; display:flex; align-items:center; justify-content:center; border-radius:50%; background:#FF2C03; box-shadow:0 0 44px rgba(255,44,3,.45); width:27%; height:27%; }
        .eco-lane { position:absolute; top:50%; left:50%; border-radius:50%; animation-name: ecoSpin; animation-timing-function: linear; animation-iteration-count: infinite; }
        .eco-node { position:absolute; top:0; left:50%; width:0; height:0; }
        .eco-badge { position:absolute; animation-name: ecoSpinRev; animation-timing-function: linear; animation-iteration-count: infinite; }
        @keyframes ecoSpin { from { transform: translate(-50%,-50%) rotate(0deg) } to { transform: translate(-50%,-50%) rotate(360deg) } }
        @keyframes ecoSpinRev { from { transform: translate(-50%,-50%) rotate(0deg) } to { transform: translate(-50%,-50%) rotate(-360deg) } }
        @media (prefers-reduced-motion: reduce){ .eco-lane, .eco-badge { animation: none !important } }
      `}</style>
      {rings.map((r, i) => (
        <span key={r.d} className={`eco-ring ${i === rings.length - 1 ? 'lit' : ''}`} style={{ width: `${r.d}%`, height: `${r.d}%` }} />
      ))}
      <div className="eco-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma" className="w-[60%]" style={{ filter: 'brightness(0)' }} />
      </div>
      {nodes.map((n, i) => (
        <span key={i} className="eco-lane" style={{ width: `${n.d}%`, height: `${n.d}%`, animationDuration: `${n.dur}s`, animationDelay: `${n.delay}s` }}>
          <span className="eco-node">
            <span
              className="eco-badge inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--badge)] px-2 py-1 text-[11px] font-semibold text-[rgb(var(--fg))] shadow-lg"
              style={{ animationDuration: `${n.dur}s`, animationDelay: `${n.delay}s` }}
            >
              <span className="text-sm leading-none">{n.it.e}</span>
              <span className="hidden whitespace-nowrap sm:inline">{n.it.t}</span>
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

/** Divisor de capítulo */
function Divider({ num, chapter, title }: { num: string; chapter: string; title: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <p data-anim className="font-[family-name:var(--font-display)] text-7xl leading-none tracking-tight text-[#FF2C03] sm:text-9xl">{num}</p>
      <p data-anim className="mt-4 text-[11px] font-bold uppercase tracking-[0.32em] text-[rgb(var(--fg)_/_0.4)] sm:text-xs">{chapter}</p>
      <h2 data-anim className="mt-3 max-w-4xl font-[family-name:var(--font-display)] uppercase leading-[0.92] tracking-tight text-[rgb(var(--fg))] text-4xl sm:text-6xl lg:text-7xl">{title}</h2>
    </div>
  )
}

/** Frase de impacto, centralizada */
function Statement({ kicker, children, sub }: { kicker?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      {kicker && <Eyebrow>{kicker}</Eyebrow>}
      <h2 data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.96] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[3.4rem]">{children}</h2>
      {sub && <p data-anim className="mx-auto mt-6 max-w-2xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-lg">{sub}</p>}
    </div>
  )
}

/** Barra de divisão por gênero */
function GenderBar({ f, m }: { f: number; m: number }) {
  return (
    <div data-anim className="space-y-2">
      <div className="flex h-10 w-full overflow-hidden rounded-xl">
        <div className="flex items-center justify-start bg-[#FF2C03] pl-3 text-sm font-bold text-black" style={{ width: `${f}%` }}>{f}%</div>
        <div className="flex items-center justify-end bg-[rgb(var(--panel)_/_0.12)] pr-3 text-sm font-bold text-[rgb(var(--fg))]" style={{ width: `${m}%` }}>{m}%</div>
      </div>
      <div className="flex justify-between text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--fg)_/_0.5)]">
        <span>Mulheres</span><span>Homens</span>
      </div>
    </div>
  )
}

/* ============================================================================
 * Slides
 * ========================================================================== */

type Slide = { section: string; node: ReactNode; center?: boolean }

const SLIDES: Slide[] = [
  // 1 — Capa
  { section: 'Capa', center: true, node: (
    <div>
      <div data-anim className="mb-8 flex items-center gap-4 sm:gap-6">
        <LogoImg src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" h="h-10 sm:h-14" />
        <span className="text-2xl font-light text-[rgb(var(--fg)_/_0.25)]">×</span>
        <LogoImg src="/logo-evolve.png" alt="Evolve" h="h-7 sm:h-9" />
      </div>
      <h1 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.86] tracking-tight text-[rgb(var(--fg))] text-[2.6rem] sm:text-7xl lg:text-[6.5rem]">
        Somma Club<br /><span className="text-[#FF2C03]">+ Evolve+</span>
      </h1>
      <p data-anim className="mt-6 max-w-xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-xl">
        Construindo o futuro da comunidade fitness no Distrito Federal.
      </p>
    </div>
  ) },

  // — Capítulo 1
  { section: '— Capítulo 1', center: true, node: <Divider num="01" chapter="Capítulo 1" title="O movimento que está redefinindo uma geração" /> },

  // 2 — corrida virou comportamento
  { section: 'Corrida = comportamento', center: true, node: (
    <Statement kicker="O comportamento mudou" sub="O mundo vive uma transformação silenciosa. As pessoas não estão só correndo. Estão buscando pertencimento.">
      A corrida deixou de ser esporte.<br /><O>Ela virou comportamento.</O>
    </Statement>
  ) },

  // 3 — run clubs
  { section: 'Novos pontos de encontro', node: (<>
    <Head k="Cap 1 · O fenômeno" title="Os run clubs são os novos pontos de encontro" />
    <Chips items={['Substituíram parte da vida social', 'A corrida virou saúde mental', 'O esporte virou conexão', 'As ruas viraram comunidade', 'Pertencer vale mais que performar']} />
  </>) },

  // 4 — mercado explodindo
  { section: 'O mercado explodindo', node: (<>
    <Head k="Cap 1 · O mercado" title="O mercado está explodindo" sub="Não é tendência passageira. É um movimento global." />
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
      { emoji: '🏃', t: 'Corridas ↑', d: 'mais gente correndo a cada ano.' },
      { emoji: '🏅', t: 'Maratonas ↑', d: 'inscrições esgotando em minutos.' },
      { emoji: '👟', t: 'Run clubs ↑', d: 'explodindo em todo lugar.' },
      { emoji: '🔥', t: 'Hyrox ↑', d: 'o novo fenômeno fitness.' },
      { emoji: '🧘', t: 'Wellness ↑', d: 'economia bilionária e crescendo.' },
      { emoji: '🌎', t: 'Global', d: 'o movimento é mundial.' },
    ]} />
  </>) },

  // — Capítulo 2
  { section: '— Capítulo 2', center: true, node: <Divider num="02" chapter="Capítulo 2" title="O Somma" /> },

  // 5 — o Somma nasceu
  { section: 'O Somma nasceu', center: true, node: (
    <Statement kicker="A origem">
      Enquanto o movimento crescia,<br /><O>o Somma nascia.</O>
    </Statement>
  ) },

  // 6 — uma das maiores do DF
  { section: 'Uma das maiores do DF', node: (<>
    <Head k="Cap 2 · Hoje" title="Uma das maiores comunidades de corrida do DF" />
    <Stats items={[{ n: '+5.000', l: 'membros cadastrados' }, { n: '52', l: 'encontros por ano' }, { n: '100%', l: 'comunidade gratuita' }, { n: 'Orgânico', l: 'crescimento' }]} />
    <Chips items={['Eventos proprietários', 'Ecossistema próprio']} />
  </>) },

  // 7 — números do Instagram
  { section: 'O Somma em números', node: (<>
    <Head k="Cap 2 · Alcance" title="O Somma em números" sub="Últimos 30 dias." />
    <Stats cols="sm:grid-cols-3 lg:grid-cols-4" items={[
      { n: '13.460', l: 'seguidores' },
      { n: '737.620', l: 'visualizações em 30 dias' },
      { n: '120.251', l: 'contas alcançadas' },
      { n: '12.861', l: 'interações' },
      { n: '14.044', l: 'visitas ao perfil' },
      { n: '1.355', l: 'cliques na bio' },
      { n: '+1.565', l: 'seguidores líquidos em 30 dias' },
    ]} />
  </>) },

  // 8 — relacionamento + gênero
  { section: 'Relacionamento, não audiência', node: (<>
    <Head k="Cap 2 · O público" title="Não construímos audiência. Construímos relacionamento." />
    <GenderBar f={66.9} m={33.1} />
    <Chips items={['Saúde', 'Performance', 'Bem-estar', 'Lifestyle', 'Experiências', 'Comunidade']} />
  </>) },

  // 9 — órbita
  { section: 'Não é grupo de corrida', node: (<>
    <Head k="Cap 2 · A plataforma" title="O Somma não é um grupo de corrida" sub="No centro, a comunidade. Em volta, todo o ecossistema." />
    <OrbitEcosystem />
  </>) },

  // 10 — pessoas
  { section: 'Nosso maior ativo', center: true, node: (
    <Statement kicker="A essência" sub="Diversidade, energia e pertencimento. Antes de qualquer número, são pessoas.">
      Nosso maior ativo<br /><O>são as pessoas.</O>
    </Statement>
  ) },

  // — Capítulo 3
  { section: '— Capítulo 3', center: true, node: <Divider num="03" chapter="Capítulo 3" title="Por que a Evolve" /> },

  // 11 — mesma geração (tabela)
  { section: 'A mesma geração', node: (<>
    <Head k="Cap 3 · O encaixe" title="Evolve e Somma falam com a mesma geração" />
    <DataTable heads={['O Somma traz', 'A Evolve traz']} rows={[
      ['Comunidade', 'Estrutura'],
      ['Relacionamento', 'Escala'],
      ['Influência', 'Academias'],
      ['Lifestyle', 'Operação'],
      ['Experiência', 'Capilaridade'],
    ]} />
    <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5 text-center">
      <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[rgb(var(--fg))] sm:text-2xl">Juntos criam algo <O>único</O>.</p>
    </div>
  </>) },

  // 11b — mapa Evolve no DF
  { section: 'Evolve no DF', node: (<>
    <Head k="Cap 3 · Capilaridade" title="Evolve em todo o Distrito Federal" sub="O movimento Somma alcança todas as regiões onde a Evolve está." />
    <EvolveMap />
  </>) },

  // 12 — oportunidade Evolve+
  { section: 'A oportunidade Evolve+', node: (<>
    <Head k="Cap 3 · O salto" title="A oportunidade Evolve+" />
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel variant="muted" title="Evolve hoje" items={['Domina o mercado de volume']} />
      <Panel variant="accent" title="Evolve+ amanhã" items={['Pode dominar o mercado de valor']} />
    </div>
    <Note>E o Somma conecta exatamente esse público.</Note>
  </>) },

  // 13 — o que a Evolve está comprando
  { section: 'O que a Evolve compra', node: (<>
    <Head k="Cap 3 · A real" title="O que a Evolve está comprando" sub="Não é mídia. Não é post. Não é exposição." />
    <Chips items={['Presença', 'Relacionamento', 'Comunidade', 'Influência', 'Recorrência', 'Pertencimento']} />
  </>) },

  // — Capítulo 4
  { section: '— Capítulo 4', center: true, node: <Divider num="04" chapter="Capítulo 4" title="Naming rights" /> },

  // 14 — conceito
  { section: 'O conceito', center: true, node: (
    <div>
      <Eyebrow>Cap 4 · O conceito</Eyebrow>
      <p data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight text-[rgb(var(--fg))] text-4xl sm:text-6xl lg:text-[5rem]">
        Somma Club<br /><span className="text-[#FF2C03]">powered by Evolve+</span>
      </p>
      <p data-anim className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[rgb(var(--fg)_/_0.6)]">Evolve+ · Official Performance Partner of Somma Club</p>
      <p data-anim className="mt-4 text-base font-medium text-[rgb(var(--fg)_/_0.55)]">Uma parceria que não existe no Distrito Federal.</p>
    </div>
  ) },

  // 15 — exclusividade
  { section: 'Exclusividade', center: true, node: (
    <Statement kicker="Cap 4 · O território" sub="Nenhuma concorrente terá acesso ao território construído pela comunidade.">
      A Evolve será a <O>única</O> academia integrada oficialmente ao ecossistema Somma.
    </Statement>
  ) },

  // — Capítulo 5
  { section: '— Capítulo 5', center: true, node: <Divider num="05" chapter="Capítulo 5" title="Entregáveis" /> },

  // 16 — presença de marca
  { section: 'Presença de marca', node: (<>
    <Head k="Cap 5 · Marca" title="Presença de marca" sub="Logo Evolve+ em cada ponto de contato." />
    <Chips items={['Uniformes dos insiders', 'Equipe Somma', 'Staff de eventos', 'Backdrops', 'Totens', 'Landing pages', 'Site', 'Materiais institucionais']} />
  </>) },

  // 17 — eventos
  { section: 'Eventos', node: (<>
    <Head k="Cap 5 · Eventos" title="Presença prioritária nos eventos" />
    <Chips items={['Somma Day', 'Special Day', 'Shake Outs', 'Eventos proprietários', 'Experiências especiais']} />
    <Stats cols="sm:grid-cols-1" items={[{ n: '52', l: 'encontros anuais' }]} />
  </>) },

  // 18 — experiências exclusivas
  { section: 'Experiências Evolve+', node: (<>
    <Head k="Cap 5 · Experiências" title="Experiências exclusivas Evolve+" sub="Eventos exclusivos dentro da Evolve+." />
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
      { emoji: '🧊', t: 'Recovery Day', d: 'recuperação e bem-estar.' },
      { emoji: '⏱️', t: 'Performance Day', d: 'foco em evolução.' },
      { emoji: '🔬', t: 'Running Lab', d: 'teste e ciência.' },
      { emoji: '🧘', t: 'Mobility Day', d: 'mobilidade e prevenção.' },
      { emoji: '☕', t: 'Coffee Run', d: 'corrida e café.' },
      { emoji: '🌙', t: 'Community Night', d: 'comunidade e networking.' },
    ]} />
  </>) },

  // 18b — Somma Intercity
  { section: 'Somma Intercity', node: (<>
    <Head k="Cap 5 · Novo projeto" title="Somma Intercity" sub="Uma night run por mês, levando o movimento pra dentro das unidades Evolve+." />
    <div data-anim className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {['Largada na unidade', 'Corrida noturna', 'Retorno à unidade'].map((s, i, a) => (
        <span key={s} className="flex items-center gap-1.5">
          <span className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${i === a.length - 1 ? 'bg-[#FF2C03] text-black' : 'border border-[rgb(var(--fg)_/_0.15)] bg-[rgb(var(--panel)_/_0.05)] text-[rgb(var(--fg)_/_0.85)]'}`}>{s}</span>
          {i < a.length - 1 && <span className="text-[rgb(var(--fg)_/_0.3)]">→</span>}
        </span>
      ))}
    </div>
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
      { emoji: '🌙', t: 'Night run', d: 'corrida noturna, clima de evento.' },
      { emoji: '🎟️', t: 'Vagas limitadas', d: 'gera desejo e exclusividade.' },
      { emoji: '🔁', t: 'Sai e volta na unidade', d: 'movimento real pro ginásio.' },
      { emoji: '🏙️', t: 'Presença nas cidades', d: 'leva Somma + Evolve+ pra cada região.' },
    ]} />
    <Note>Uma vez por mês, 12 por ano, com vagas limitadas. Inspirado no cenário europeu e em capitais como SP, RJ e PE.</Note>
  </>) },

  // 19 — bolsas
  { section: 'Programa de Bolsas', node: (<>
    <Head k="Cap 5 · Bolsas" title="Programa de Bolsas" sub="Patrocínio Evolve+." />
    <Stats cols="sm:grid-cols-2" items={[{ n: '5', l: 'assessorias gratuitas por semestre' }, { n: '10', l: 'assessorias por ano' }]} />
    <Note>Transformar histórias reais em conteúdo real.</Note>
  </>) },

  // 20 — creators
  { section: 'Somma Creators', node: (<>
    <Head k="Cap 5 · Creators" title="Somma Creators" sub="A rede oficial de criadores, gerando conteúdo recorrente para a Evolve+." />
    <Chips items={['Influenciadores', 'Embaixadores', 'Atletas', 'Comunidade']} />
  </>) },

  // 21 — presença digital
  { section: 'Presença digital', node: (<>
    <Head k="Cap 5 · Digital" title="Presença digital" sub="Inserções recorrentes em todos os canais." />
    <Chips items={['Instagram', 'Stories', 'Reels', 'CRM', 'WhatsApp', 'Landing pages', 'Site', 'E-mails', 'Check-ins']} />
  </>) },

  // 22 — funil
  { section: 'Funil de negócios', node: (<>
    <Head k="Cap 5 · Conversão" title="Funil de negócios" sub="A parceria gera matrícula, não só marca." />
    <FunnelFlow />
  </>) },

  // — Capítulo 6
  { section: '— Capítulo 6', center: true, node: <Divider num="06" chapter="Capítulo 6" title="Visão de futuro" /> },

  // 23 — campanha x ativo
  { section: 'Campanha ou ativo', center: true, node: (
    <Statement kicker="Cap 6 · A virada" sub="Visão de longo prazo, crescimento e liderança de comunidade.">
      Não estamos criando uma campanha.<br /><O>Estamos criando um ativo.</O>
    </Statement>
  ) },

  // 24 — Evolve ganha
  { section: 'O que a Evolve ganha', node: (<>
    <Head k="Cap 6 · Para a Evolve" title="O que a Evolve ganha" />
    <Chips items={['Exclusividade', 'Comunidade', 'Posicionamento', 'Autoridade', 'Conteúdo', 'Influência', 'Leads', 'Matrículas', 'Retenção']} />
  </>) },

  // 25 — Somma ganha
  { section: 'O que o Somma ganha', node: (<>
    <Head k="Cap 6 · Para o Somma" title="O que o Somma ganha" />
    <Chips items={['Estrutura', 'Experiência', 'Investimento', 'Crescimento', 'Comunidade mais forte']} />
  </>) },

  // 26 — visão 2030
  { section: 'Visão 2030', center: true, node: (
    <Statement kicker="Cap 6 · 2030" sub="Não apenas uma academia. Não apenas um running club. Um movimento.">
      Somma Club + Evolve+:<br /><O>a principal comunidade fitness do DF.</O>
    </Statement>
  ) },

  // 27 — fecho
  { section: 'Fecho', center: true, node: (
    <div className="text-center">
      <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[3.8rem]">
        As melhores marcas não patrocinam movimentos.<br /><O>Elas se tornam parte deles.</O>
      </h2>
      <div data-anim className="mx-auto mt-9 flex items-center justify-center gap-4 sm:gap-6">
        <LogoImg src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" h="h-8 sm:h-11" />
        <span className="text-xl font-light text-[rgb(var(--fg)_/_0.3)]">×</span>
        <LogoImg src="/logo-evolve.png" alt="Evolve" h="h-6 sm:h-8" />
      </div>
      <p data-anim className="mx-auto mt-6 max-w-xl text-base font-medium text-[rgb(var(--fg)_/_0.6)] sm:text-lg">
        Construindo o futuro da comunidade fitness do Distrito Federal.
      </p>
    </div>
  ) },
]

/* ============================================================================
 * Shell — barra lateral de índice + palco escuro
 * ========================================================================== */

export function PptEvolveClient() {
  const [active, setActive] = useState(0)
  const [menu, setMenu] = useState(false)
  const [fs, setFs] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const stageRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const navRefs = useRef<(HTMLButtonElement | null)[]>([])
  const total = SLIDES.length

  const go = useCallback((n: number) => setActive(Math.min(Math.max(n, 0), total - 1)), [total])
  const next = useCallback(() => setActive((a) => Math.min(a + 1, total - 1)), [total])
  const prev = useCallback(() => setActive((a) => Math.max(a - 1, 0)), [])

  const toggleFs = useCallback(() => {
    if (typeof document === 'undefined') return
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const nt = t === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem('evolve-theme', nt) } catch {}
      return nt
    })
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('evolve-theme')
      if (saved === 'light' || saved === 'dark') setTheme(saved)
    } catch {}
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const targets = el.querySelectorAll('[data-anim]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(targets, { opacity: 0, x: -26 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 })
    }, el)
    return () => ctx.revert()
  }, [active])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menu && e.key === 'Escape') return setMenu(false)
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next() }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev() }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
      else if (e.key === 'f' || e.key === 'F') toggleFs()
      else if (e.key === 'm' || e.key === 'M') setMenu((v) => !v)
      else if (e.key === 't' || e.key === 'T') toggleTheme()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, toggleFs, toggleTheme, total, menu])

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    navRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) { dx < 0 ? next() : prev() }
    touch.current = null
  }

  const slide = SLIDES[active]

  const NavList = ({ onPick }: { onPick?: () => void }) => (
    <nav className="flex flex-col gap-0.5">
      {SLIDES.map((s, i) => (
        <button
          key={i}
          ref={(el) => { navRefs.current[i] = el }}
          onClick={() => { go(i); onPick?.() }}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-[12px] transition ${
            i === active ? 'bg-[#FF2C03]/15 font-semibold text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.55)] hover:bg-[rgb(var(--panel)_/_0.05)] hover:text-[rgb(var(--fg))]'
          }`}
        >
          <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-[rgb(var(--fg)_/_0.3)]">{String(i + 1).padStart(2, '0')}</span>
          <span className="truncate">{s.section}</span>
        </button>
      ))}
    </nav>
  )

  const themeVars = (theme === 'dark'
    ? { '--bg': '#0A0A0A', '--fg': '255 255 255', '--panel': '255 255 255', '--badge': '#161616' }
    : { '--bg': '#ffffff', '--fg': '23 23 23', '--panel': '15 15 15', '--badge': '#f1f1f1' }) as CSSProperties

  return (
    <main style={themeVars} data-theme={theme} className="fixed inset-0 flex overflow-hidden overscroll-none bg-[var(--bg)] font-[family-name:var(--font-body)] text-[rgb(var(--fg))] [-webkit-tap-highlight-color:transparent] select-none">
      <style>{`
        [data-theme="light"] .logo-adapt { filter: brightness(0); }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,44,3,0) } 50% { box-shadow: 0 0 0 5px rgba(255,44,3,.35) } }
        @keyframes glowText { 0%,100% { text-shadow: 0 0 0 rgba(255,44,3,0) } 50% { text-shadow: 0 0 28px rgba(255,44,3,.45) } }
        @keyframes funnelFlow { to { stroke-dashoffset: -16; } }
        .funnel-flow { animation: funnelFlow 0.9s linear infinite; }
        .funnel-grid { background-image: radial-gradient(rgb(var(--fg) / 0.07) 1px, transparent 1px); background-size: 18px 18px; }
        @media (prefers-reduced-motion: reduce) { [style*="animation"] { animation: none !important } .funnel-flow { animation: none !important } }
      `}</style>

      <aside className={`hidden w-60 shrink-0 flex-col border-r border-[rgb(var(--fg)_/_0.1)] ${collapsed ? 'lg:hidden' : 'lg:flex'}`}>
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-[rgb(var(--fg))]">SOMMA <span className="text-[#FF2C03]">× Evolve</span></span>
          <button onClick={() => setCollapsed(true)} className="flex h-7 w-7 items-center justify-center rounded-full text-[rgb(var(--fg)_/_0.5)] transition hover:bg-[rgb(var(--panel)_/_0.1)] hover:text-[#FF2C03]" aria-label="Recolher menu">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4"><NavList /></div>
        <div className="h-1 bg-[rgb(var(--panel)_/_0.05)]">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>
      </aside>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="absolute left-3 top-3 z-30 hidden h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)] text-[rgb(var(--fg)_/_0.7)] transition hover:text-[#FF2C03] lg:flex" aria-label="Expandir menu">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[rgb(var(--fg)_/_0.1)] px-4 pt-[max(0.7rem,env(safe-area-inset-top))] pb-2 lg:hidden">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight">SOMMA <span className="text-[#FF2C03]">× Evolve</span></span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tabular-nums text-[rgb(var(--fg)_/_0.45)]">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => setMenu(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] active:bg-[rgb(var(--panel)_/_0.1)]" aria-label="Índice"><Menu className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="h-0.5 bg-[rgb(var(--panel)_/_0.1)] lg:hidden">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>

        {!slide.center && (
          <span className="pointer-events-none absolute right-4 top-2 z-0 select-none font-[family-name:var(--font-display)] text-[7rem] leading-none text-[rgb(var(--fg)_/_0.03)] sm:right-10 sm:text-[12rem]">
            {String(active + 1).padStart(2, '0')}
          </span>
        )}

        <div key={active} ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative z-10 h-full overflow-y-auto overscroll-contain px-5 pb-24 pt-6 sm:px-12 sm:pb-20 sm:pt-10">
          <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-4 sm:gap-5">{slide.node}</div>
        </div>

        <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))] sm:px-8">
          <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] text-[rgb(var(--fg)_/_0.7)] transition hover:text-[#FF2C03]" aria-label="Alternar tema claro/escuro" title="Tema (T)">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={toggleFs} className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] text-[rgb(var(--fg)_/_0.7)] transition hover:text-[#FF2C03]" aria-label="Tela cheia">
            {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-1 rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[rgb(var(--panel)_/_0.04)] px-1.5 py-1">
            <button onClick={prev} disabled={active === 0} className="flex h-8 w-8 items-center justify-center rounded-full text-[rgb(var(--fg)_/_0.8)] transition hover:bg-[rgb(var(--panel)_/_0.1)] disabled:opacity-25" aria-label="Anterior"><ArrowLeft className="h-4 w-4" /></button>
            <span className="min-w-[3.2rem] text-center text-xs font-bold tabular-nums text-[rgb(var(--fg)_/_0.6)]">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={next} disabled={active === total - 1} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2C03] text-black transition hover:bg-[#ff4a28] disabled:opacity-25" aria-label="Próximo"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      {menu && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[var(--bg)] backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight">Índice</span>
            <button onClick={() => setMenu(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)]" aria-label="Fechar"><X className="h-4 w-4" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6"><NavList onPick={() => setMenu(false)} /></div>
        </div>
      )}
    </main>
  )
}
