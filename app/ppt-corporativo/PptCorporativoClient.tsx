'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { SatelliteMap } from '@/components/estacao/satellite-map'
import {
  ArrowLeft, ArrowRight, Maximize, Minimize, Menu, X, PanelLeftClose, PanelLeftOpen,
  DollarSign, Building2, Users, TrendingUp, Award, Heart, Store,
} from 'lucide-react'

const ORANGE = '#FF2C03'

/* ============================================================================
 * Componentes — tema ESCURO editorial
 * ========================================================================== */

const O = ({ children }: { children: ReactNode }) => <span className="text-[#FF2C03]">{children}</span>

function Eyebrow({ children }: { children: ReactNode }) {
  return <p data-anim className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#FF2C03] sm:text-xs">{children}</p>
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight text-white text-4xl sm:text-5xl lg:text-6xl">
      {children}
    </h2>
  )
}

function Head({ k, title, sub }: { k: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="space-y-3 border-l-2 border-[#FF2C03] pl-4 sm:pl-5">
      <Eyebrow>{k}</Eyebrow>
      <Title>{title}</Title>
      {sub && <p data-anim className="max-w-2xl text-sm leading-snug text-white/55 sm:text-base lg:text-lg">{sub}</p>}
    </header>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p data-anim className="text-sm leading-snug text-white/45 sm:text-base">{children}</p>
}

function Lead({ children }: { children: ReactNode }) {
  return <p data-anim className="text-lg font-medium leading-snug text-white/90 sm:text-2xl lg:text-[1.7rem]">{children}</p>
}

function Panel({ title, items, variant = 'plain' }: { title: string; items: ReactNode[]; variant?: 'muted' | 'accent' | 'plain' }) {
  const accent = variant === 'accent'
  const muted = variant === 'muted'
  return (
    <div data-anim className={`rounded-2xl p-5 sm:p-6 ${accent ? 'border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10]' : muted ? 'border border-white/10 bg-white/[0.03]' : 'border border-white/10 bg-white/[0.05]'}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accent ? 'text-[#FF2C03]' : 'text-white/40'}`}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm leading-snug text-white/85 sm:text-base">
            <span className="text-[#FF2C03]">▸</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Person({ name, role, tone = 'plain' }: { name: string; role: string; tone?: 'ceo' | 'coo' | 'head' | 'plain' }) {
  const cls =
    tone === 'ceo'
      ? 'bg-[#FF2C03] text-black'
      : tone === 'coo'
        ? 'border-2 border-[#FF2C03] bg-transparent text-white'
        : tone === 'head'
          ? 'border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] text-white'
          : 'border border-white/15 bg-white/[0.04] text-white'
  return (
    <div className={`rounded-xl p-2.5 text-center ${cls}`}>
      <p className={`font-[family-name:var(--font-display)] text-sm uppercase tracking-tight ${tone === 'ceo' ? 'text-black' : 'text-white'}`}>{name}</p>
      <p className={`text-[10px] font-medium leading-tight ${tone === 'ceo' ? 'text-black/70' : 'text-white/45'}`}>{role}</p>
    </div>
  )
}

function Arrow() {
  return <div className="flex justify-center text-base text-white/25">↓</div>
}

/** Seta animada (fluxo descendo) — para o organograma em loop */
function FlowArrow() {
  return (
    <div className="flex justify-center">
      <span style={{ animation: 'orgFlow 1.8s ease-in-out infinite' }} className="text-lg text-[#FF2C03]">↓</span>
    </div>
  )
}

function RoleCard({ area, cargo, person, missao, resp, kpis, team }: {
  area?: string; cargo: string; person: string; missao?: string; resp: string[]; kpis: string[]; team?: string
}) {
  return (
    <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          {area && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2C03]">{area}</p>}
          <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-white sm:text-2xl">{cargo}</h3>
        </div>
        <span className="rounded-full bg-[#FF2C03] px-3 py-1 text-xs font-bold text-black">{person}</span>
      </div>
      {missao && <p className="mt-2 border-l-2 border-[#FF2C03] pl-3 text-sm font-medium italic leading-snug text-white/75 sm:text-base">“{missao}”</p>}
      {team && <p className="mt-2 text-[13px] text-white/60"><span className="font-semibold text-white">Equipe:</span> {team}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Responsabilidades</p>
          <ul className="mt-2 space-y-1">
            {resp.map((r, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-white/80"><span className="text-white/25">•</span>{r}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-[#FF2C03]/[0.08] p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF2C03]">KPIs · o que esperamos</p>
          <ul className="mt-2 space-y-1">
            {kpis.map((k, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-white/80"><span className="text-[#FF2C03]">▸</span>{k}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function UnitCard({ nome, responsavel, kpis }: { nome: string; responsavel: string; kpis: string[] }) {
  return (
    <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF2C03]" />
        <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-white">{nome}</h3>
      </div>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">Responsável: <span className="text-white/80">{responsavel}</span></p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {kpis.map((k, i) => <span key={i} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/70">{k}</span>)}
      </div>
    </div>
  )
}

function Bars({ title, note, items, animated }: { title?: string; note?: string; items: { label: string; pct: number; value?: string }[]; animated?: boolean }) {
  return (
    <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      {title && <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF2C03]">{title}</p>}
      <div className="mt-3 space-y-2.5">
        {items.map((it, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between text-[13px] font-medium text-white/75">
              <span>{it.label}</span>{it.value && <span className="text-white/40">{it.value}</span>}
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-[#FF2C03]" style={{ width: `${it.pct}%`, transformOrigin: 'left', animation: animated ? `barGrow 2.8s ease-in-out ${i * 0.2}s infinite` : undefined }} />
            </div>
          </div>
        ))}
      </div>
      {note && <p className="mt-3 text-[11px] text-white/35">{note}</p>}
    </div>
  )
}

function Funnel({ items, animated }: { items: { label: string; value: string; pct: number; tone?: 'plain' | 'accent' }[]; animated?: boolean }) {
  return (
    <div data-anim className="mx-auto flex max-w-md flex-col items-center gap-2">
      {items.map((it, i) => (
        <div key={i} style={{ width: `${it.pct}%`, animation: animated ? `funnelPulse 2.6s ease-in-out ${i * 0.4}s infinite` : undefined }} className={`rounded-xl px-3 py-3 text-center ${it.tone === 'accent' ? 'bg-[#FF2C03] text-black' : 'border border-white/15 bg-white/[0.06] text-white'}`}>
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight sm:text-3xl">{it.value}</p>
          <p className={`mt-1 text-[11px] ${it.tone === 'accent' ? 'text-black/60' : 'text-white/50'}`}>{it.label}</p>
        </div>
      ))}
    </div>
  )
}

type Tile = { icon?: typeof Store; emoji?: string; t: string; d: string }
function Tiles({ items, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { items: Tile[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 ${cols}`}>
      {items.map(({ icon: Icon, emoji, t, d }, i) => (
        <div key={i} data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          {Icon ? <Icon className="h-5 w-5 text-[#FF2C03]" /> : <span className="text-2xl">{emoji}</span>}
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-white">{t}</h3>
          <p className="mt-1 text-[13px] leading-snug text-white/55">{d}</p>
        </div>
      ))}
    </div>
  )
}

function DataTable({ heads, rows }: { heads: string[]; rows: ReactNode[][] }) {
  return (
    <div data-anim className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="bg-white/[0.07]">
            {heads.map((h, i) => (
              <th key={i} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] ${i === 0 ? 'text-[#FF2C03]' : 'text-white/60'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-white/[0.08]">
              {r.map((c, ci) => (
                <td key={ci} className={`px-4 py-3 align-top text-[13px] sm:text-sm ${ci === 0 ? 'font-semibold text-white' : 'text-white/60'}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Slide divisor — número gigante + título */
function Divider({ part, num, title, sub }: { part: string; num: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <p data-anim className="font-[family-name:var(--font-display)] text-7xl leading-none tracking-tight text-[#FF2C03] sm:text-9xl">{num}</p>
      <p data-anim className="mt-4 text-[11px] font-bold uppercase tracking-[0.32em] text-white/40 sm:text-xs">{part}</p>
      <h2 data-anim className="mt-3 max-w-4xl font-[family-name:var(--font-display)] uppercase leading-[0.92] tracking-tight text-white text-4xl sm:text-6xl lg:text-7xl">{title}</h2>
      {sub && <p data-anim className="mt-5 max-w-2xl text-base font-medium leading-snug text-white/55 sm:text-lg">{sub}</p>}
    </div>
  )
}

/* ============================================================================
 * Projetos estratégicos — botões + modais
 * ========================================================================== */

type ProjectKey = 'estacao' | 'sebrae'
const ProjectCtx = createContext<(p: ProjectKey) => void>(() => {})

function ProjectButtons() {
  const open = useContext(ProjectCtx)
  const btn = 'group rounded-2xl border p-6 text-left transition'
  return (
    <div data-anim className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button onClick={() => open('estacao')} className={`${btn} border-[#FF2C03]/40 bg-[#FF2C03]/[0.08] hover:bg-[#FF2C03]/[0.16]`}>
        <span className="text-3xl">🏠</span>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-white">Estação Somma</h3>
        <p className="mt-1 text-sm leading-snug text-white/60">O hub físico permanente da comunidade no Parque da Cidade.</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#FF2C03]">Abrir projeto →</span>
      </button>
      <button onClick={() => open('sebrae')} className={`${btn} border-white/15 bg-white/[0.05] hover:bg-white/[0.09]`}>
        <LogoChip src="/Sebrae_logo.svg" alt="Sebrae" h="h-7" />
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-white">Somma Sebrae</h3>
        <p className="mt-1 text-sm leading-snug text-white/60">O laboratório vivo de empreendedorismo wellness do DF.</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#FF2C03]">Abrir projeto →</span>
      </button>
    </div>
  )
}

function MSec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="border-l-2 border-[#FF2C03] pl-3 font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-white sm:text-2xl">{title}</h3>
      {children}
    </section>
  )
}
function MQuote({ children }: { children: ReactNode }) {
  return <blockquote className="rounded-2xl border border-[#FF2C03]/30 bg-[#FF2C03]/[0.08] p-4 text-base font-medium italic leading-snug text-white/90">“{children}”</blockquote>
}
function Bul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => <li key={i} className="flex gap-2 text-sm leading-snug text-white/75"><span className="text-[#FF2C03]">▸</span>{it}</li>)}
    </ul>
  )
}
function Pills({ items, accent }: { items: string[]; accent?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => <span key={t} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${accent ? 'bg-[#FF2C03] text-black' : 'border border-white/15 bg-white/[0.05] text-white/80'}`}>{t}</span>)}
    </div>
  )
}
function Flow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {items.map((s, i) => (
        <span key={s} className="flex items-center gap-1.5">
          <span className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${i === items.length - 1 ? 'bg-[#FF2C03] text-black' : 'border border-white/15 bg-white/[0.05] text-white/80'}`}>{s}</span>
          {i < items.length - 1 && <span className="text-white/30">→</span>}
        </span>
      ))}
    </div>
  )
}

function Stats({ items }: { items: { n: string; l: string }[] }) {
  return (
    <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((s) => (
        <div key={s.l} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight text-[#FF2C03] sm:text-3xl">{s.n}</p>
          <p className="mt-1 text-[11px] font-medium leading-tight text-white/55">{s.l}</p>
        </div>
      ))}
    </div>
  )
}

function VFlow({ items }: { items: string[] }) {
  return (
    <div data-anim className="mx-auto flex max-w-xs flex-col gap-1.5">
      {items.map((t, i) => (
        <div key={t}>
          <div className={`rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${i === 0 ? 'bg-[#FF2C03] text-black' : 'border border-white/15 bg-white/[0.05] text-white/85'}`}>{t}</div>
          {i < items.length - 1 && <div className="flex justify-center text-white/25">↓</div>}
        </div>
      ))}
    </div>
  )
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

/* ---- Logos de parceiros ---- */
function LogoChip({ src, alt, h = 'h-7' }: { src: string; alt: string; h?: string }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-white px-3 py-2 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className={`${h} w-auto`} />
    </span>
  )
}
function DecathlonMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg bg-[#0082C3] px-3 py-2 text-sm font-bold uppercase tracking-wide text-white ${className}`}>
      Decathlon
    </span>
  )
}
function Logos({ children }: { children: ReactNode }) {
  return <div data-anim className="flex flex-wrap items-center gap-2.5">{children}</div>
}

function Gallery({ images }: { images: { src: string; cap: string }[] }) {
  return (
    <div data-anim className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {images.map((im) => (
        <figure key={im.src} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={im.src} alt={im.cap} loading="lazy" className="aspect-video w-full bg-white/[0.03] object-cover" />
          <figcaption className="px-3 py-2 text-[12px] leading-snug text-white/60">{im.cap}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---- ESTAÇÃO SOMMA · apresentação completa (GDF + Decathlon + Investidores) ---- */
const ESTACAO_SLIDES: Slide[] = [
  {
    section: 'Capa', center: true,
    node: (
      <div>
        <p data-anim className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#FF2C03]">Projeto de parceria público-privada</p>
        <h2 data-anim className="mt-3 font-[family-name:var(--font-display)] text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">Estação <span className="text-[#FF2C03]">Somma</span></h2>
        <p data-anim className="mt-4 max-w-xl text-base text-white/65 sm:text-lg">Um hub permanente de esporte, saúde, bem-estar e comunidade no Parque da Cidade.</p>
        <div className="mt-5"><Pills items={['Para o GDF', 'Para a Decathlon', 'Para investidores']} /></div>
      </div>
    ),
  },
  {
    section: '01 · O que é o Somma',
    node: (<>
      <Head k="Capítulo 1" title="O que é o Somma" />
      <Stats items={[{ n: '+5.000', l: 'membros cadastrados' }, { n: '#1', l: 'corrida do DF' }, { n: '100%', l: 'gratuito' }, { n: 'Semanal', l: 'encontros' }]} />
      <Bul items={['Comunidade gratuita e movimento democrático', 'Maior comunidade de corrida do Distrito Federal', 'Eventos recorrentes e ativações esportivas', 'Impacto real em saúde e qualidade de vida']} />
    </>),
  },
  {
    section: '02 · O problema',
    node: (<>
      <Head k="Capítulo 2" title="O problema" sub="Brasília tem demanda — falta estrutura." />
      <Bul items={['Milhares de corredores e usuários do Parque da Cidade', 'Poucos pontos estruturados de apoio ao corredor', 'Falta de espaços permanentes de convivência esportiva', 'Falta de integração entre esporte, saúde e comunidade', 'Falta de infraestrutura moderna voltada ao corredor']} />
    </>),
  },
  {
    section: '03 · A oportunidade',
    node: (<>
      <Head k="Capítulo 3" title="A oportunidade" sub="Por que Brasília e por que agora." />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
        { emoji: '🏞️', t: 'Parque da Cidade', d: 'Fluxo constante de corredores, ciclistas e caminhantes.' },
        { emoji: '🏃', t: 'Mercado de corrida', d: 'Em forte crescimento no país.' },
        { emoji: '🧘', t: 'Wellness', d: 'Economia da saúde em alta.' },
        { emoji: '📅', t: 'Eventos esportivos', d: 'Calendário aquecido o ano todo.' },
        { emoji: '💼', t: 'Economia do esporte', d: 'Cada vez mais relevante.' },
        { emoji: '👥', t: 'Comunidade pronta', d: 'O Somma já reúne o público.' },
      ]} />
    </>),
  },
  {
    section: '04 · A visão', center: true,
    node: (
      <div>
        <Head k="Capítulo 4" title="A visão" />
        <MQuote>Transformar o Parque da Cidade no principal ponto de encontro da comunidade de corrida do Centro-Oeste.</MQuote>
        <Note>Visão de longo prazo, legado e transformação urbana.</Note>
      </div>
    ),
  },
  {
    section: '05 · Estação Somma',
    node: (<>
      <Head k="Capítulo 5" title="O projeto e a localização" />
      <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF2C03]">Localização</p>
        <p className="mt-1 text-lg font-semibold text-white">Parque da Cidade · Brasília–DF</p>
        <p className="mt-1 font-mono text-sm text-white/60">-15.8015306, -47.9036227</p>
      </div>
      <div data-anim>
        <SatelliteMap lat={-15.8015306} lng={-47.9036227} zoom={18} label="Estação Somma · Parque da Cidade" />
        <p className="mt-2 text-[11px] text-white/40">Visão de satélite · exatamente onde a Estação Somma seria implantada.</p>
      </div>
    </>),
  },
  {
    section: '05 · Como será',
    node: (<>
      <Head k="Capítulo 5" title="Como será a Estação" sub="Conceito visual — Estação Somma no Parque da Cidade." />
      <Gallery images={[
        { src: '/estacao-somma/render-fachada.jpg', cap: 'Fachada · Café, Loja, Decathlon Experience, Guarda-volumes e Recovery' },
        { src: '/estacao-somma/render-aerea.jpg', cap: 'Vista aérea · Estação Somma + Praça Evolve (academia outdoor)' },
        { src: '/estacao-somma/render-rooftop.jpg', cap: 'Rooftop · convivência, eventos e experiência premium' },
        { src: '/estacao-somma/render-treinao.jpg', cap: 'Treinão · a comunidade reunida ao entardecer' },
      ]} />
    </>),
  },
  {
    section: '06 · Estrutura física',
    node: (<>
      <Head k="Capítulo 6" title="Estrutura física" />
      <Logos><DecathlonMark /></Logos>
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
        { emoji: '☕', t: 'Café Somma', d: 'Café especial, açaí, lanches e conveniência esportiva.' },
        { emoji: '👕', t: 'Loja Somma', d: 'Roupas, bonés, acessórios e coleções exclusivas.' },
        { emoji: '🛒', t: 'Decathlon Experience', d: 'Teste de produtos, lançamentos e ativações.' },
        { emoji: '🔐', t: 'Guarda-volumes', d: 'Lockers, segurança e conveniência.' },
        { emoji: '💆', t: 'Área Recovery', d: 'Alongamento, massagem e recuperação.' },
        { emoji: '🌇', t: 'Rooftop', d: 'Convivência, eventos, networking e experiência premium.' },
      ]} />
    </>),
  },
  {
    section: '07 · Academia Evolve',
    node: (<>
      <Head k="Capítulo 7" title="Praça Evolve" sub="Academia ao ar livre — ativação permanente da marca." />
      <Logos><LogoChip src="/logo-evolve.png" alt="Evolve" h="h-7" /></Logos>
      <Bul items={['Academia outdoor com equipamentos premium', 'Treinos gratuitos e aulas abertas à população', 'Mobilidade, funcional, fortalecimento e prevenção', 'Benefício direto de saúde para quem usa o parque']} />
    </>),
  },
  {
    section: '08 · Ecossistema',
    node: (<>
      <Head k="Capítulo 8" title="Ecossistema Somma" sub="Cada unidade fortalece as demais." />
      <VFlow items={['Grupo Somma', 'Somma Club', 'Somma Retail', 'Somma Eventos', 'Assessoria Somma', 'Estação Somma']} />
    </>),
  },
  {
    section: '09 · Como o GDF ganha',
    node: (<>
      <Head k="Capítulo 9" title="Como o GDF ganha" sub="Infraestrutura permanente, sem custo direto para o governo." />
      <div className="grid gap-2 sm:grid-cols-2">
        <Bul items={['Ocupação qualificada do parque', 'Promoção da saúde e da atividade física', 'Redução do sedentarismo', 'Valorização do espaço público']} />
        <Bul items={['Turismo esportivo', 'Geração de emprego e renda', 'Atração de investimento privado', 'Nenhum custo direto ao governo']} />
      </div>
    </>),
  },
  {
    section: '10 · Como a Decathlon ganha',
    node: (<>
      <Head k="Capítulo 10" title="Como a Decathlon ganha" />
      <Logos><DecathlonMark /></Logos>
      <div className="grid gap-2 sm:grid-cols-2">
        <Bul items={['Presença permanente e hub regional', 'Teste de produto em ambiente real', 'Relacionamento direto com corredores', 'Brand awareness e experiência de marca']} />
        <Bul items={['Vendas e lançamentos', 'Produção de conteúdo', 'Programa de embaixadores', 'Aderência total ao público']} />
      </div>
      <Note>Perfil predominante do Somma — classes C, D e média — altamente alinhado ao posicionamento democrático da Decathlon.</Note>
    </>),
  },
  {
    section: '11 · Como o investidor ganha',
    node: (<>
      <Head k="Capítulo 11" title="Como o investidor ganha" sub="Múltiplas fontes de receita — não depende de uma só." />
      <Pills items={['Café', 'Açaí', 'Loja', 'Assessoria', 'Eventos', 'Patrocínios', 'Naming Rights', 'Mídia', 'Ativações', 'Locação de espaços']} />
      <DataTable heads={['Cenário', 'Potencial de receita/mês', 'Perfil']} rows={[
        ['Conservador', 'R$ 60–90 mil', 'Operação base'],
        ['Moderado', 'R$ 120–160 mil', '+ patrocínios e eventos'],
        ['Agressivo', 'R$ 200 mil +', '+ naming rights e mídia'],
      ]} />
      <Note>Valores ilustrativos — a validar no projeto executivo e no plano financeiro.</Note>
    </>),
  },
  {
    section: '12 · Modelo de parceria',
    node: (<>
      <Head k="Capítulo 12" title="Modelo de parceria" />
      <Logos><DecathlonMark /><LogoChip src="/logo-evolve.png" alt="Evolve" h="h-6" /></Logos>
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="GDF" items={['Cessão de área', 'Apoio institucional', 'Licenciamento']} />
        <Panel variant="accent" title="Somma" items={['Operação e gestão', 'Comunidade', 'Eventos']} />
        <Panel title="Decathlon" items={['Patrocínio', 'Experiência', 'Equipamentos e conteúdo']} />
        <Panel title="Evolve" items={['Academia outdoor', 'Treinos', 'Ativações']} />
      </div>
      <Panel variant="muted" title="Investidores" items={['Capex inicial', 'Expansão', 'Escala']} />
    </>),
  },
  {
    section: '13 · Roadmap',
    node: (<>
      <Head k="Capítulo 13" title="Roadmap" />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
        { emoji: '①', t: 'Fase 1', d: 'Aprovação institucional, renders, projeto executivo e captação.' },
        { emoji: '②', t: 'Fase 2', d: 'Implantação, estrutura e operação piloto.' },
        { emoji: '③', t: 'Fase 3', d: 'Lançamento, eventos, ativações e patrocínios.' },
        { emoji: '④', t: 'Fase 4', d: 'Consolidação, expansão e novas receitas.' },
      ]} />
    </>),
  },
  {
    section: '14 · Chamada final', center: true,
    node: (
      <ClosingCard
        kicker="Chamada final"
        title={<>Não estamos propondo um café dentro de um parque.</>}
        sub="Estamos propondo o principal hub permanente de corrida, saúde, bem-estar e comunidade do Centro-Oeste — para transformar o Parque da Cidade em referência nacional de esporte, convivência e qualidade de vida."
      />
    ),
  },
]

/* ---- SOMMA SEBRAE · apresentação para os sócios (conselho estratégico) ---- */
const SEBRAE_SLIDES: Slide[] = [
  {
    section: 'Capa', center: true,
    node: (
      <div>
        <div data-anim className="mb-6"><LogoChip src="/Sebrae_logo.svg" alt="Sebrae" h="h-10" /></div>
        <p data-anim className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#FF2C03]">Reunião de conselho estratégico</p>
        <h2 data-anim className="mt-3 font-[family-name:var(--font-display)] text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">Somma <span className="text-[#FF2C03]">Sebrae</span></h2>
        <p data-anim className="mt-4 max-w-xl text-base text-white/65 sm:text-lg">Transformar a comunidade Somma numa plataforma de desenvolvimento econômico, inovação e empreendedorismo wellness.</p>
      </div>
    ),
  },
  {
    section: '01 · Onde estamos',
    node: (<>
      <Head k="Bloco 1" title="Onde o Somma está hoje" />
      <Stats items={[{ n: '+5.000', l: 'membros' }, { n: 'Semanal', l: 'encontros grátis' }, { n: 'Validada', l: 'operação' }, { n: '4+', l: 'frentes ativas' }]} />
      <DataTable heads={['Indicador', 'Status']} rows={[
        ['Comunidade recorrente', 'Encontros gratuitos todo sábado'],
        ['Assessoria', 'Ativa e crescendo'],
        ['Loja', 'Própria'],
        ['Eventos', 'Recorrentes'],
        ['Patrocinadores', 'Presentes'],
      ]} />
    </>),
  },
  {
    section: '02 · O que o Somma vende',
    node: (<>
      <Head k="Bloco 2" title="O que o Somma realmente vende" sub="O Somma não vende corrida." />
      <VFlow items={['Comunidade', 'Pertencimento', 'Estilo de vida', 'Experiência']} />
    </>),
  },
  {
    section: '03 · O maior ativo',
    node: (<>
      <Head k="Bloco 3" title="O maior ativo do Somma" sub="Audiência física recorrente é extremamente rara — e valiosa." />
      <DataTable heads={['Canal', 'Audiência', 'Recorrência presencial']} rows={[
        ['Influenciadores', 'Digital', 'Baixa'],
        ['Academias', 'Físico', 'Média'],
        ['Eventos', 'Físico', 'Pontual'],
        ['Comunidades digitais', 'Digital', 'Baixa'],
        ['Somma', 'Físico', 'Alta · toda semana'],
      ]} />
    </>),
  },
  {
    section: '04 · O problema do modelo',
    node: (<>
      <Head k="Bloco 4" title="O problema do modelo atual" sub="O Somma gera muito valor — mas captura pouco." />
      <DataTable heads={['Hoje o Somma gera', 'Mas captura']} rows={[
        ['Milhares de pessoas por semana', 'Pouca receita direta'],
        ['Atenção e engajamento', 'Pouca monetização de mídia'],
        ['Comunidade fiel', 'Baixo ticket por membro'],
      ]} />
    </>),
  },
  {
    section: '05 · Oportunidade',
    node: (<>
      <Head k="Bloco 5" title="Oportunidade estratégica" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel variant="muted" title="Hoje" items={['Comunidade']} />
        <Panel variant="accent" title="Amanhã" items={['Comunidade + Desenvolvimento Econômico']} />
      </div>
    </>),
  },
  {
    section: '06 · Onde o Sebrae entra',
    node: (<>
      <Head k="Bloco 6" title="Como o Sebrae entra nessa história" sub="A missão do Sebrae conversa diretamente com o projeto." />
      <Bul items={['Desenvolver pequenos negócios', 'Estimular inovação', 'Apoiar empreendedores', 'Criar ambientes de desenvolvimento econômico']} />
    </>),
  },
  {
    section: '07 · Somma Lab', center: true,
    node: (
      <div>
        <Head k="Bloco 7" title="Nasce o Somma Lab" />
        <MQuote>O primeiro laboratório vivo de empreendedorismo wellness do Distrito Federal.</MQuote>
        <Note>Um braço dentro da Estação que transforma a comunidade num ambiente real de teste e validação de negócios.</Note>
      </div>
    ),
  },
  {
    section: '08 · Na prática',
    node: (<>
      <Head k="Bloco 8" title="Como funcionaria na prática" />
      <Pills items={['Marca de roupa fitness', 'Marca de suplemento', 'Healthtech', 'Cafeteria', 'Fisioterapia']} />
      <Flow items={['Inscrição', 'Capacitação', 'Validação na comunidade', 'Feedback e dados', 'Primeiras vendas']} />
    </>),
  },
  {
    section: '09 · O que o Sebrae ganha',
    node: (<>
      <Head k="Bloco 9" title="O que o Sebrae ganha" />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
        { emoji: '📈', t: 'Desenvolvimento econômico', d: 'Geração de renda e negócios.' },
        { emoji: '🏆', t: 'Casos de sucesso', d: 'Histórias reais para mostrar.' },
        { emoji: '🔬', t: 'Inovação', d: 'Validação com consumidores reais.' },
        { emoji: '🏪', t: 'Pequenos negócios', d: 'Acelerados de verdade.' },
        { emoji: '📍', t: 'Impacto local', d: 'No coração de Brasília.' },
        { emoji: '🇧🇷', t: 'Case nacional', d: 'Projeto pioneiro.' },
      ]} />
    </>),
  },
  {
    section: '10 · O que o Somma ganha',
    node: (<>
      <Head k="Bloco 10" title="O que o Somma ganha" />
      <div className="grid gap-2 sm:grid-cols-2">
        <Bul items={['Recursos e novas receitas', 'Credibilidade e legitimidade', 'Relações institucionais']} />
        <Bul items={['Crescimento e novos parceiros', 'Acesso a programas', 'Estrutura para a Estação']} />
      </div>
    </>),
  },
  {
    section: '11 · O que o GDF ganha',
    node: (<>
      <Head k="Bloco 11" title="O que o GDF ganha" sub="O Sebrae fortalece a narrativa junto ao governo." />
      <Bul items={['Saúde pública e esporte', 'Bem-estar da população', 'Turismo', 'Uso qualificado do parque', 'Desenvolvimento econômico local']} />
    </>),
  },
  {
    section: '12 · Papel da Estação',
    node: (<>
      <Head k="Bloco 12" title="O papel da Estação Somma" sub="A Estação não é um café — é infraestrutura." />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
        { emoji: '👥', t: 'Comunidade', d: 'A casa do movimento.' },
        { emoji: '❤️', t: 'Saúde', d: 'Promoção de bem-estar.' },
        { emoji: '🔬', t: 'Inovação', d: 'Teste e validação.' },
        { emoji: '💡', t: 'Empreendedorismo', d: 'Pequenos negócios.' },
      ]} />
    </>),
  },
  {
    section: '13 · Decathlon + Sebrae + Somma',
    node: (<>
      <Head k="Bloco 13" title="A sinergia dos três" sub="Juntos criam algo que nenhum faria sozinho." />
      <Logos><DecathlonMark /><LogoChip src="/Sebrae_logo.svg" alt="Sebrae" h="h-6" /></Logos>
      <div className="grid gap-3 sm:grid-cols-3">
        <Panel title="Decathlon" items={['Democratização do esporte']} />
        <Panel title="Sebrae" items={['Desenvolvimento econômico']} />
        <Panel variant="accent" title="Somma" items={['Comunidade que conecta tudo']} />
      </div>
    </>),
  },
  {
    section: '14 · Evolve + Somma',
    node: (<>
      <Head k="Bloco 14" title="Evolve + Somma" />
      <Logos><LogoChip src="/logo-evolve.png" alt="Evolve" h="h-7" /></Logos>
      <MQuote>Evolve Outdoor Performance Center.</MQuote>
      <Bul items={['Academia ao ar livre na Estação', 'Mobilidade, funcional e recovery', 'Treinos abertos e ativação de marca permanente']} />
    </>),
  },
  {
    section: '15 · Modelo econômico',
    node: (<>
      <Head k="Bloco 15" title="Modelo econômico futuro" />
      <Pills items={['Patrocínios', 'Ativações', 'Retail', 'Eventos', 'Estação', 'Somma Lab']} />
      <Note>Cada camada monetiza a mesma comunidade. Projeções a detalhar no plano financeiro — o objetivo é elevar o valuation do ecossistema Somma.</Note>
    </>),
  },
  {
    section: '16 · Riscos',
    node: (<>
      <Head k="Bloco 16" title="Riscos e mitigadores" sub="Análise honesta." />
      <DataTable heads={['Risco', 'Mitigação']} rows={[
        ['Dependência institucional', 'Diversificar parceiros e receitas'],
        ['Timing do GDF', 'Entrar via Sebrae para destravar'],
        ['Execução / equipe', 'Governança e papéis claros'],
        ['Capital inicial', 'Capex faseado e patrocínio âncora'],
      ]} />
    </>),
  },
  {
    section: '17 · Roadmap',
    node: (<>
      <Head k="Bloco 17" title="Roadmap" />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
        { emoji: '📅', t: '30 dias', d: 'Validar tese e alinhar sócios.' },
        { emoji: '🗓️', t: '90 dias', d: 'Desenhar o Somma Lab e aproximar o Sebrae.' },
        { emoji: '📆', t: '180 dias', d: 'Piloto e projeto institucional.' },
        { emoji: '🚀', t: '12 meses', d: 'Estação + programa em operação.' },
      ]} />
    </>),
  },
  {
    section: '18 · Decisões dos sócios',
    node: (<>
      <Head k="Bloco 18" title="Decisões que os sócios precisam tomar" />
      <Bul items={['Validar a tese', 'Aprovar a construção do Somma Lab', 'Aprovar a aproximação com o Sebrae', 'Aprovar o piloto', 'Aprovar o projeto institucional']} />
    </>),
  },
  {
    section: 'Reflexão final', center: true,
    node: (
      <ClosingCard
        kicker="Reflexão final"
        title={<>E se isso é sem infraestrutura…</>}
        sub="Se hoje o Somma já reúne mais de 5 mil pessoas sem uma infraestrutura física permanente, o que poderemos construir quando transformarmos essa comunidade numa plataforma de desenvolvimento econômico, saúde e inovação?"
      />
    ),
  },
]

/* ---- Sub-deck navegável (usado nos modais de projeto) ---- */
function SubDeck({ title, slides, onClose, headerLogo }: { title: string; slides: Slide[]; onClose: () => void; headerLogo?: string }) {
  const [i, setI] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const total = slides.length
  const next = useCallback(() => setI((v) => Math.min(v + 1, total - 1)), [total])
  const prev = useCallback(() => setI((v) => Math.max(v - 1, 0)), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const t = el.querySelectorAll('[data-anim]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { gsap.set(t, { opacity: 1, x: 0 }); return }
    const ctx = gsap.context(() => { gsap.fromTo(t, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05 }) }, el)
    return () => ctx.revert()
  }, [i])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next() }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, onClose])

  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) { dx < 0 ? next() : prev() }
    touch.current = null
  }

  const slide = slides[i]
  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-[#0A0A0A]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 sm:px-8">
        <div className="flex items-center gap-3">
          {headerLogo && <LogoChip src={headerLogo} alt={title} h="h-5" />}
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-white">{title}</span>
          <span className="hidden text-[11px] font-bold tabular-nums text-white/40 sm:inline">{String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        </div>
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:text-[#FF2C03]" aria-label="Fechar projeto"><X className="h-4 w-4" /></button>
      </div>
      <div key={i} ref={ref} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-12 sm:py-8">
        <span className="pointer-events-none absolute right-4 top-1 z-0 select-none font-[family-name:var(--font-display)] text-[6rem] leading-none text-white/[0.03] sm:right-8 sm:text-[9rem]">{String(i + 1).padStart(2, '0')}</span>
        <div className="relative z-10 mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-4 pb-6 sm:gap-5">{slide.node}</div>
      </div>
      <div className="flex items-center justify-end gap-1 border-t border-white/10 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8">
        <button onClick={prev} disabled={i === 0} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 disabled:opacity-25" aria-label="Anterior"><ArrowLeft className="h-4 w-4" /></button>
        <button onClick={next} disabled={i === total - 1} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#FF2C03] text-black transition hover:bg-[#ff4a28] disabled:opacity-25" aria-label="Próximo"><ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
  )
}

/* ============================================================================
 * Slides
 * ========================================================================== */

type Slide = { section: string; node: ReactNode; center?: boolean; group?: boolean }

const SLIDES: Slide[] = [
  // 1 — Capa
  {
    section: 'Capa',
    center: true,
    node: (
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-anim src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" className="mb-7 h-12 w-auto sm:h-14" />
        <Eyebrow>Estrutura · Responsabilidades · Indicadores</Eyebrow>
        <h1 data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.86] tracking-tight text-white text-[2.6rem] sm:text-7xl lg:text-[7rem]">
          Governança<br />Corporativa<br /><span className="text-[#FF2C03]">Somma Club</span>
        </h1>
        <p data-anim className="mt-6 max-w-xl text-base font-medium leading-snug text-white/60 sm:text-xl">
          Profissionalizar a operação sem perder a essência da comunidade.
        </p>
      </div>
    ),
  },

  // 2 — Divisor P1
  { section: '— Parte 1', group: true, node: <Divider num="01" part="Parte 1" title="Por que profissionalizar agora" sub="O Somma cresceu. A estrutura precisa crescer junto." /> },

  // 3 — Por que agora
  {
    section: 'Por que agora',
    node: (
      <>
        <Head k="01 · O momento" title="Por que estamos discutindo isso?" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel variant="muted" title="Somma de ontem" items={['Grupo de amigos', 'Boa vontade', 'Tudo passa pelos fundadores', 'Pouca clareza', 'Dependência de pessoas']} />
          <Panel variant="accent" title="Somma do futuro" items={['Organização', 'Responsabilidades claras', 'Autonomia', 'Escalabilidade', 'Novos negócios e receita previsível']} />
        </div>
        <div data-anim className="grid grid-cols-3 gap-2">
          {[['+5.000', 'membros cadastrados'], ['~400', 'recorrentes nos eventos'], ['9', 'áreas em operação']].map(([n, l]) => (
            <div key={l} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#FF2C03] sm:text-3xl">{n}</p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-white/50">{l}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // 4 — O problema
  {
    section: 'O problema',
    node: (
      <>
        <Head k="02 · Diagnóstico" title="Hoje, tudo chega em uma pessoa" />
        <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['Marketing', 'Eventos', 'Patrocínios', 'Loja', 'Comunidade', 'Assessoria', 'Tecnologia', 'Atendimento'].map((s) => (
            <div key={s} className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-center text-[13px] font-semibold text-white/75">{s}</div>
          ))}
        </div>
        <Arrow />
        <div data-anim className="mx-auto w-full max-w-sm rounded-2xl bg-[#FF2C03] p-4 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-black">Tudo chega em Alexandre</p>
        </div>
        <div data-anim className="flex flex-wrap justify-center gap-2">
          {['Sobrecarga', 'Dependência', 'Lentidão', 'Falta de clareza'].map((c) => (
            <span key={c} className="rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-300">{c}</span>
          ))}
        </div>
      </>
    ),
  },

  // 5 — Visão futura
  {
    section: 'A visão futura',
    node: (
      <>
        <Head k="03 · O modelo" title="Duas frentes que se sustentam" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel variant="accent" title="Comunidade" items={['Propósito', 'Experiência', 'Cultura', 'Treinões', 'Relacionamento']} />
          <Panel variant="muted" title="Corporativo" items={['Receita', 'Patrocínios', 'Eventos', 'Assessoria', 'Loja · Tecnologia · Novos negócios']} />
        </div>
        <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
          <p className="text-sm font-semibold text-white/80 sm:text-base">
            O <O>Corporativo</O> gera receita que <span className="font-bold text-white">financia</span> a <O>Comunidade</O> — que continua gratuita e forte.
          </p>
        </div>
      </>
    ),
  },

  // 6 — Organizações maduras
  {
    section: 'Organizações maduras',
    node: (
      <>
        <Head k="04 · A referência" title="Como organizações maduras funcionam" sub="Quatro camadas — cada uma com um papel claro. No Somma, fica assim:" />
        <div className="space-y-2">
          {[
            { n: '01', t: 'Conselho', d: 'Direção e visão de longo prazo', who: 'Alexandre · João Victor · Diogo', w: 'sm:w-[64%]', accent: true },
            { n: '02', t: 'Estratégia', d: 'Para onde vamos e por quê', who: 'CEO', w: 'sm:w-[76%]' },
            { n: '03', t: 'Operação', d: 'Como fazemos acontecer', who: 'COO + Heads', w: 'sm:w-[88%]' },
            { n: '04', t: 'Execução', d: 'O dia a dia, na ponta', who: 'Coordenações e times', w: 'sm:w-full' },
          ].map((l) => (
            <div key={l.n} data-anim className={`mx-auto flex w-full items-center gap-3 rounded-2xl p-3.5 sm:gap-4 ${l.w} ${l.accent ? 'bg-[#FF2C03] text-black' : 'border border-white/10 bg-white/[0.05] text-white'}`}>
              <span className={`font-[family-name:var(--font-display)] text-2xl tabular-nums ${l.accent ? 'text-black/40' : 'text-white/30'}`}>{l.n}</span>
              <div className="flex-1">
                <p className="font-[family-name:var(--font-display)] text-lg uppercase leading-none tracking-tight">{l.t}</p>
                <p className={`text-[11px] ${l.accent ? 'text-black/60' : 'text-white/50'}`}>{l.d}</p>
              </div>
              <span className={`hidden shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold sm:block ${l.accent ? 'bg-black/10 text-black' : 'bg-white/10 text-white'}`}>{l.who}</span>
            </div>
          ))}
        </div>
        <Note>Ninguém faz tudo — e nada depende de uma pessoa só.</Note>
      </>
    ),
  },

  // 7 — Divisor P2
  { section: '— Parte 2', group: true, node: <Divider num="02" part="Parte 2" title="Organograma e papéis" sub="Quem faz o quê, com nome, missão, responsabilidades e KPIs." /> },

  // 8 — Organograma
  {
    section: 'Organograma',
    node: (
      <>
        <Head k="05 · A estrutura" title="O organograma do Somma" />
        <div className="space-y-2">
          <div data-anim style={{ animation: 'orgGlow 3.2s ease-in-out 0s infinite' }} className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Conselho de Sócios</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-white">Alexandre · João Victor · Diogo</p>
          </div>
          <FlowArrow />
          <div data-anim style={{ animation: 'orgGlow 3.2s ease-in-out 0.5s infinite' }} className="mx-auto max-w-[16rem] rounded-xl"><Person name="Alexandre Alves" role="CEO" tone="ceo" /></div>
          <FlowArrow />
          <div data-anim style={{ animation: 'orgGlow 3.2s ease-in-out 1s infinite' }} className="mx-auto max-w-[16rem] rounded-xl"><Person name="Alex Rodrigues" role="COO" tone="coo" /></div>
          <FlowArrow />
          <div data-anim style={{ animation: 'orgGlow 3.2s ease-in-out 1.5s infinite' }} className="grid grid-cols-2 gap-2 rounded-2xl sm:grid-cols-3">
            <Person name="Camilla" role="Head Comercial e Parcerias" tone="head" />
            <Person name="Diogo" role="Head de Produto e Retail" tone="head" />
            <Person name="João Victor" role="Head de Conteúdo Visual" tone="head" />
            <Person name="Cristina" role="Coord. Comunicação" />
            <Person name="Yas" role="Coord. Eventos" />
            <Person name="Priscila" role="Coord. Atendimento e Operações" />
          </div>
          <div data-anim className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Design · sob Comunicação</p>
              <p className="text-[13px] font-semibold text-white/80">Gustavo Firmino</p>
            </div>
            <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Assessoria · Dir. Técnico Alexandre</p>
              <p className="text-[13px] font-semibold text-white/80">Professores: Joseph · Mateus</p>
            </div>
          </div>
        </div>
      </>
    ),
  },

  // 9 — Conselho
  {
    section: 'Conselho de Sócios',
    node: (
      <>
        <Head k="06 · Liderança" title="Conselho de Sócios" />
        <RoleCard area="Direção do grupo" cargo="Conselho de Sócios" person="Alexandre · João Victor · Diogo"
          resp={['Definição da visão de longo prazo', 'Aprovação de novos sócios', 'Aprovação de investimentos', 'Aprovação de novos negócios', 'Aprovação do orçamento anual', 'Aprovação de projetos estratégicos']}
          kpis={['Crescimento anual da receita', 'Crescimento da comunidade', 'Resultado financeiro consolidado', 'Novos negócios lançados', 'Patrocínios estratégicos conquistados']} />
      </>
    ),
  },

  // 10 — CEO
  {
    section: 'CEO',
    node: (
      <>
        <Head k="06 · Liderança" title="CEO" />
        <RoleCard area="Executivo-chefe" cargo="CEO" person="Alexandre Alves" missao="Garantir a visão, cultura e crescimento sustentável do Somma."
          resp={['Liderança da comunidade', 'Relacionamento institucional', 'Cultura do Somma', 'Relacionamento com patrocinadores estratégicos', 'Aprovação das principais decisões', 'Representação oficial da marca', 'Coordenação geral dos treinões']}
          kpis={['Crescimento da comunidade', 'Participação média nos treinões', 'Retenção de membros', 'Nº de patrocinadores estratégicos', 'NPS da comunidade']} />
      </>
    ),
  },

  // 11 — COO
  {
    section: 'COO',
    node: (
      <>
        <Head k="06 · Liderança" title="COO" />
        <RoleCard area="Operações" cargo="COO" person="Alex Rodrigues" missao="Garantir que toda a operação corporativa funcione."
          resp={['Operação geral · Processos · Planejamento', 'Tecnologia e e-commerce', 'Assessoria', 'Indicadores e governança', 'Novos negócios', 'Integração entre áreas']}
          kpis={['Receita total do corporativo', 'Receita de assessoria, loja, eventos e mídia', 'Cumprimento de projetos e cronogramas', 'Margem operacional']} />
      </>
    ),
  },

  // 12 — Head Comercial
  {
    section: 'Head Comercial',
    node: (
      <>
        <Head k="07 · Heads" title="Head Comercial e Parcerias" />
        <RoleCard area="Receita" cargo="Head Comercial e Parcerias" person="Camilla" missao="Transformar audiência em receita."
          resp={['Prospecção comercial', 'Patrocínios e mídia', 'Parcerias', 'Relacionamento com empresas', 'Negociação de contratos']}
          kpis={['Receita gerada', 'Nº de reuniões realizadas', 'Nº de propostas enviadas', 'Taxa de conversão comercial', 'Valor do pipeline aberto', 'Nº de patrocinadores ativos']} />
      </>
    ),
  },

  // 13 — Head Retail
  {
    section: 'Head Retail',
    node: (
      <>
        <Head k="07 · Heads" title="Head de Produto e Retail" />
        <RoleCard area="Produto" cargo="Head de Produto e Retail" person="Diogo" missao="Transformar a marca Somma em produtos desejados."
          resp={['Desenvolvimento de produtos', 'Produção', 'Estoque', 'Loja Somma', 'Fornecedores', 'Tendências de mercado']}
          kpis={['Receita da loja', 'Margem dos produtos', 'Giro de estoque', 'Ticket médio', 'Nº de lançamentos', 'Ruptura de estoque']} />
      </>
    ),
  },

  // 14 — Head Conteúdo Visual
  {
    section: 'Head Conteúdo Visual',
    node: (
      <>
        <Head k="07 · Heads" title="Head de Conteúdo Visual" />
        <RoleCard area="Acervo visual" cargo="Head de Conteúdo Visual" person="João Victor" missao="Construir o acervo visual do Somma."
          resp={['Fotografia', 'Banco de imagens', 'Cobertura dos treinões', 'Cobertura dos eventos']}
          kpis={['Eventos fotografados', 'Fotos entregues por evento', 'Tempo de entrega', 'Atualização do banco de imagens']} />
      </>
    ),
  },

  // 15 — Comunicação
  {
    section: 'Coord. Comunicação',
    node: (
      <>
        <Head k="08 · Coordenações" title="Coordenação de Comunicação" />
        <RoleCard area="Marca e conteúdo" cargo="Coordenação de Comunicação" person="Cristina" missao="Fortalecer a marca Somma através do conteúdo."
          resp={['Instagram e Stories', 'Calendário editorial', 'Influenciadores', 'Cobertura de eventos', 'Gestão do designer']}
          kpis={['Conteúdos publicados', 'Alcance mensal', 'Crescimento de seguidores', 'Taxa de engajamento', 'Cumprimento do calendário', 'Nº de colaborações']} />
      </>
    ),
  },

  // 16 — Design
  {
    section: 'Design',
    node: (
      <>
        <Head k="08 · Coordenações" title="Design" />
        <RoleCard area="Identidade visual · sob Comunicação" cargo="Design" person="Gustavo Firmino" missao="Garantir excelência visual em todos os pontos de contato da marca."
          resp={['Artes para redes sociais', 'Landing pages', 'Apresentações', 'Materiais para patrocinadores', 'Identidade visual']}
          kpis={['Prazo médio de entrega', 'Demandas entregues no prazo', 'Nº de materiais produzidos', 'Retrabalho por erro']} />
      </>
    ),
  },

  // 17 — Eventos
  {
    section: 'Coord. Eventos',
    node: (
      <>
        <Head k="08 · Coordenações" title="Coordenação de Eventos" />
        <RoleCard area="Experiência" cargo="Coordenação de Eventos" person="Yas" missao="Garantir que os eventos aconteçam com excelência."
          resp={['Planejamento operacional', 'Cronogramas', 'Ativações', 'Fornecedores', 'Experiência dos participantes']}
          kpis={['Eventos realizados', 'Eventos entregues no prazo', 'Receita de eventos', 'Nº de participantes', 'NPS dos eventos', 'Custo por evento']} />
      </>
    ),
  },

  // 18 — Atendimento
  {
    section: 'Coord. Atendimento',
    node: (
      <>
        <Head k="08 · Coordenações" title="Atendimento e Operações" />
        <RoleCard area="Relacionamento · Experiência da Assessoria" cargo="Atendimento e Operações" person="Priscila" missao="Garantir organização, excelente atendimento e a experiência completa do aluno da assessoria."
          resp={['WhatsApp e atendimento', 'Experiência da assessoria de ponta a ponta', 'Controle de kits: quem recebeu e quem ainda não recebeu', 'Mapear necessidades do aluno (quem precisa de algo, quem não precisa)', 'Agenda e organização de reuniões', 'Comunicação operacional e suporte aos participantes']}
          kpis={['Tempo médio de resposta', 'Taxa de resolução', 'Satisfação dos membros', 'Kits entregues x pendentes', 'Demandas resolvidas', 'Reuniões organizadas']} />
      </>
    ),
  },

  // 19 — Assessoria
  {
    section: 'Assessoria',
    node: (
      <>
        <Head k="09 · Técnico" title="Assessoria Somma" sub="A autoridade esportiva do Somma." />
        <RoleCard area="Performance" cargo="Direção Técnica" person="Alexandre" team="Professores: Joseph · Mateus" missao="Garantir a autoridade técnica e a evolução dos atletas."
          resp={['Metodologia de treino', 'Programas de evolução', 'Supervisão dos professores', 'Acompanhamento dos alunos', 'Conteúdo técnico']}
          kpis={['Alunos ativos', 'Receita recorrente mensal', 'Churn', 'Ticket médio', 'NPS dos alunos']} />
      </>
    ),
  },

  // 20 — Divisor P3
  { section: '— Parte 3', group: true, node: <Divider num="03" part="Parte 3" title="Unidades de negócio" sub="Cada unidade tem um responsável e indicadores próprios." /> },

  // 21 — Unidades
  {
    section: 'Unidades de negócio',
    node: (
      <>
        <Head k="10 · Negócios" title="As unidades do ecossistema Somma" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <UnitCard nome="Somma Club" responsavel="Alexandre Alves" kpis={['Participantes/sábado', 'Crescimento', 'Retenção', 'NPS']} />
          <UnitCard nome="Somma Assessoria" responsavel="Alex Rodrigues" kpis={['Alunos ativos', 'MRR', 'Churn', 'Ticket médio', 'NPS']} />
          <UnitCard nome="Somma Retail" responsavel="Diogo" kpis={['Receita', 'Margem', 'Ticket médio', 'Giro de estoque']} />
          <UnitCard nome="Somma Mídia e Patrocínios" responsavel="Camilla" kpis={['Receita de patrocínios', 'Contratos ativos', 'Pipeline', 'Taxa de fechamento']} />
          <UnitCard nome="Somma Eventos" responsavel="Yas + Alex" kpis={['Receita', 'Participantes', 'NPS', 'Margem']} />
          <UnitCard nome="Somma Digital" responsavel="Alex Rodrigues" kpis={['Leads captados', 'Conversão de LPs', 'Uptime', 'Novas features', 'Crescimento da base']} />
        </div>
      </>
    ),
  },

  // 22 — Divisor P4
  { section: '— Parte 4', group: true, node: <Divider num="04" part="Parte 4" title="Como vamos operar" sub="Decisão, responsabilidade, indicadores e rituais." /> },

  // 23 — Princípio
  {
    section: 'Princípio',
    node: (
      <>
        <Head k="11 · Cultura" title="Princípio de responsabilidade" />
        <Lead>Quem é responsável não executa tudo — mas responde pelo resultado.</Lead>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div data-anim className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Se der certo</p>
            <p className="mt-2 text-lg font-semibold text-white">O mérito é do time. 🎉</p>
          </div>
          <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">Se der errado</p>
            <p className="mt-2 text-lg font-semibold text-white">A responsabilidade é do líder da área.</p>
          </div>
        </div>
      </>
    ),
  },

  // 24 — RACI
  {
    section: 'Modelo de decisão',
    node: (
      <>
        <Head k="12 · Decisão" title="Modelo de decisão (RACI)" />
        <div data-anim className="flex flex-wrap gap-2 text-[11px] font-semibold">
          {[['A', 'Aprova / decide'], ['R', 'Responsável / executa'], ['C', 'Consultado'], ['I', 'Informado / acompanha']].map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-white/70">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2C03] text-[9px] font-bold text-black">{k}</span>{v}
            </span>
          ))}
        </div>
        <DataTable heads={['Atividade', 'Decide (A)', 'Executa (R)', 'Consulta (C)', 'Acompanha (I)']}
          rows={[
            ['Fechar patrocínio', 'CEO', 'Comercial', 'Marketing', 'COO'],
            ['Produzir um evento', 'COO', 'Eventos', 'Comercial', 'CEO'],
            ['Gestão da loja', 'Head Retail', 'Retail', 'Comercial', 'COO'],
            ['Conteúdo & redes', 'Comunicação', 'Design / Conteúdo Visual', 'Marketing', 'COO'],
            ['Treino & metodologia', 'Dir. Técnico', 'Professores', '—', 'COO'],
          ]} />
      </>
    ),
  },

  // 25 — Metas
  {
    section: 'Quem tem meta de receita',
    node: (
      <>
        <Head k="13 · Metas" title="Quem responde por receita — e quem não" sub="Não se cobra alguém por um número sobre o qual não tem controle direto." />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">Metas de RECEITA</p>
            <p className="mt-1 text-[13px] text-white/50">Áreas que influenciam o faturamento.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Alexandre · CEO', 'Alex · COO', 'Camilla · Comercial', 'Diogo · Retail'].map((p) => (
                <span key={p} className="rounded-full bg-[#FF2C03] px-3 py-1.5 text-xs font-bold text-black">{p}</span>
              ))}
            </div>
          </div>
          <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Metas de EXECUÇÃO, QUALIDADE e PRAZO</p>
            <p className="mt-1 text-[13px] text-white/50">Medimos entrega — não faturamento.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Cristina', 'João Victor', 'Gustavo Firmino', 'Yas', 'Priscila'].map((p) => (
                <span key={p} className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white/80">{p}</span>
              ))}
            </div>
          </div>
        </div>
        <Note>Isso protege o time: cada pessoa é cobrada pelo que realmente controla.</Note>
      </>
    ),
  },

  // 26 — Dashboard
  {
    section: 'KPIs · dashboard',
    node: (
      <>
        <Head k="14 · Indicadores" title="O Somma em números" />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="space-y-2">
            <p data-anim className="text-[11px] font-bold uppercase tracking-widest text-white/40">Comunidade · do cadastro ao recorrente</p>
            <Funnel animated items={[{ label: 'membros cadastrados', value: '5.000', pct: 100 }, { label: 'recorrentes nos eventos', value: '~400', pct: 55, tone: 'accent' }]} />
          </div>
          <Bars animated title="Composição de receita do corporativo" note="Distribuição ilustrativa — a calibrar com dados reais."
            items={[{ label: 'Assessoria', pct: 40, value: '40%' }, { label: 'Loja', pct: 25, value: '25%' }, { label: 'Eventos', pct: 20, value: '20%' }, { label: 'Mídia e patrocínios', pct: 15, value: '15%' }]} />
        </div>
      </>
    ),
  },

  // 27 — Quadro de KPIs
  {
    section: 'Quadro de KPIs',
    node: (
      <>
        <Head k="14 · Indicadores" title="Quadro de KPIs por área" />
        <DataTable heads={['Área', 'Indicadores principais', 'Responsável']}
          rows={[
            ['Comunidade', 'Participantes · NPS · retenção', 'Alexandre'],
            ['Assessoria', 'Alunos · MRR · churn · ticket', 'Alex'],
            ['Comercial', 'Receita · patrocínios · pipeline', 'Camilla'],
            ['Retail', 'Faturamento · margem · giro', 'Diogo'],
            ['Eventos', 'Receita · participantes · NPS', 'Yas + Alex'],
            ['Comunicação', 'Alcance · engajamento · calendário', 'Cristina'],
            ['Conteúdo Visual', 'Cobertura · entregas · prazo', 'João Victor'],
            ['Digital', 'Leads · conversão · uptime', 'Alex'],
          ]} />
      </>
    ),
  },

  // 28 — Rituais
  {
    section: 'Ritual de reuniões',
    node: (
      <>
        <Head k="15 · Rotina" title="Ritual de reuniões" />
        <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
          { emoji: '📅', t: 'Segunda', d: 'Reunião Corporativa — alinhar a semana das áreas.' },
          { emoji: '✅', t: 'Sexta', d: 'Reunião Operacional — resultados e ajustes.' },
          { emoji: '📈', t: 'Mensal', d: 'Reunião Estratégica — metas e prioridades.' },
          { emoji: '🏛️', t: 'Trimestral', d: 'Conselho — visão, expansão e decisões grandes.' },
        ]} />
      </>
    ),
  },

  // 29 — Carreira
  {
    section: 'Carreira',
    node: (
      <>
        <Head k="16 · Crescimento" title="Plano de evolução de carreira" />
        <div data-anim className="mx-auto flex max-w-xl flex-col gap-2">
          {[
            { t: 'Voluntário', d: 'ajuda, aprende e veste a camisa' },
            { t: 'Coordenador', d: 'responde por uma frente com consistência' },
            { t: 'Head', d: 'lidera uma área e suas metas' },
            { t: 'Executivo', d: 'responde por receita e resultado do grupo' },
            { t: 'Sócio', d: 'compartilha visão, risco e participação' },
          ].map((s, i, arr) => (
            <div key={s.t} className={`flex items-center gap-3 rounded-xl border p-3 ${i === arr.length - 1 ? 'border-[#FF2C03]/50 bg-[#FF2C03]/[0.10]' : 'border-white/10 bg-white/[0.04]'}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF2C03] text-xs font-bold text-black">{i + 1}</span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-white">{s.t}</p>
                <p className="text-[13px] text-white/50">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <Note>Critério é entrega e responsabilidade — não tempo de casa.</Note>
      </>
    ),
  },

  // 30 — O que NÃO é
  {
    section: 'O que NÃO é',
    node: (
      <>
        <Head k="17 · Tranquilizar" title="O que NÃO estamos fazendo" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {['Burocracia', 'Hierarquia excessiva', 'Tirar autonomia', 'Mudar a essência do Somma'].map((t) => (
            <div key={t} data-anim className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white/70">✕</span>
              <span className="text-base font-semibold text-white/70">{t}</span>
            </div>
          ))}
        </div>
        <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-white sm:text-3xl">Estamos criando <O>clareza</O>.</p>
        </div>
      </>
    ),
  },

  // 31 — Benefícios
  {
    section: 'Benefícios',
    node: (
      <>
        <Head k="18 · Resultado" title="Benefícios esperados" />
        <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
          { icon: DollarSign, t: 'Mais receita', d: 'Frentes comerciais ativas e previsíveis.' },
          { icon: Building2, t: 'Mais organização', d: 'Cada coisa com um dono claro.' },
          { icon: Users, t: 'Menos dependência', d: 'O Somma não para sem os fundadores.' },
          { icon: TrendingUp, t: 'Mais crescimento', d: 'Estrutura pronta para escalar.' },
          { icon: Award, t: 'Mais profissionalismo', d: 'Marca forte perante parceiros.' },
          { icon: Heart, t: 'Mais impacto', d: 'Comunidade ainda mais forte.' },
        ]} />
      </>
    ),
  },

  // 32 — Roadmap
  {
    section: 'Roadmap',
    node: (
      <>
        <Head k="19 · Implementação" title="Roadmap de implementação" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          {[['Fase 1', 'Definir estrutura'], ['Fase 2', 'Validar responsabilidades'], ['Fase 3', 'Definir KPIs'], ['Fase 4', 'Criar rituais'], ['Fase 5', 'Avaliação trimestral']].map(([f, t], i) => (
            <div key={f} data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF2C03] text-xs font-bold text-black">{i + 1}</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/40">{f}</p>
              <p className="mt-0.5 text-sm font-semibold leading-tight text-white">{t}</p>
            </div>
          ))}
        </div>
        <Note>Cada fase é leve e prática — feita junto com o time, não imposta de cima.</Note>
      </>
    ),
  },

  // 33 — Visão 2030
  {
    section: 'Visão 2030',
    node: (
      <>
        <Head k="20 · O futuro" title="Visão Somma 2030" />
        <Lead>Ser a <O>maior comunidade de corrida e bem-estar do Centro-Oeste</O> — um ecossistema completo.</Lead>
        <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { e: '🧡', t: 'Comunidade' }, { e: '🏃', t: 'Assessoria' }, { e: '🎉', t: 'Eventos' }, { e: '👕', t: 'Loja' },
            { e: '🤝', t: 'Patrocínios' }, { e: '🏠', t: 'Estação Somma' }, { e: '📲', t: 'Tecnologia' }, { e: '🚀', t: 'Novos negócios' },
          ].map((n) => (
            <div key={n.t} className="rounded-xl border border-[#FF2C03]/30 bg-[#FF2C03]/[0.08] p-3 text-center">
              <span className="text-xl">{n.e}</span>
              <p className="mt-1 text-[13px] font-semibold text-white/85">{n.t}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // 34 — Projetos estratégicos
  {
    section: 'Projetos',
    node: (
      <>
        <Head k="21 · Projetos" title="Dois projetos estratégicos" sub="Eles ampliam o Somma para além da comunidade. Toque para abrir e explorar cada um." />
        <ProjectButtons />
      </>
    ),
  },

  // 35 — Finalização (laranja pleno)
  {
    section: 'Finalização',
    center: true,
    node: (
      <div className="-mx-5 -my-6 flex min-h-full flex-col justify-center bg-[#FF2C03] px-6 py-12 text-center sm:-mx-12 sm:px-12">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60 sm:text-xs">Finalização</p>
        <h2 data-anim className="mx-auto mt-5 max-w-4xl font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-black text-4xl sm:text-6xl lg:text-[4rem]">
          De comunidade<br />a instituição.
        </h2>
        <p data-anim className="mx-auto mt-7 max-w-2xl text-base font-medium leading-snug text-black/75 sm:text-xl">
          O Somma já tem o mais difícil: <span className="font-bold text-black">pessoas e propósito</span>. Agora ganha a estrutura para crescer sem depender de uma pessoa só — e durar.
        </p>
        <div data-anim className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
          {['Clareza', 'Responsabilidade', 'Indicadores', 'Crescimento'].map((c) => (
            <span key={c} className="rounded-full border border-black/30 px-4 py-2 text-sm font-semibold text-black">{c}</span>
          ))}
        </div>
      </div>
    ),
  },
]

/* ============================================================================
 * Shell — barra lateral de índice + palco escuro
 * ========================================================================== */

export function PptCorporativoClient() {
  const [active, setActive] = useState(0)
  const [menu, setMenu] = useState(false)
  const [fs, setFs] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [project, setProject] = useState<ProjectKey | null>(null)
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

  // reveal
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

  // teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (project) return
      if (menu && e.key === 'Escape') return setMenu(false)
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next() }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev() }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
      else if (e.key === 'f' || e.key === 'F') toggleFs()
      else if (e.key === 'm' || e.key === 'M') setMenu((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, toggleFs, total, menu, project])

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // mantém o item ativo visível na barra lateral
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
      {SLIDES.map((s, i) =>
        s.group ? (
          <p key={i} className="mt-3 px-3 pb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30 first:mt-0">
            {s.section.replace('— ', '')}
          </p>
        ) : (
          <button
            key={i}
            ref={(el) => { navRefs.current[i] = el }}
            onClick={() => { go(i); onPick?.() }}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-[12px] transition ${
              i === active ? 'bg-[#FF2C03]/15 font-semibold text-[#FF2C03]' : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-white/30">{String(i + 1).padStart(2, '0')}</span>
            <span className="truncate">{s.section}</span>
          </button>
        ),
      )}
    </nav>
  )

  return (
    <ProjectCtx.Provider value={setProject}>
    <main className="fixed inset-0 flex overflow-hidden overscroll-none bg-[#0A0A0A] font-[family-name:var(--font-body)] text-white [-webkit-tap-highlight-color:transparent] select-none">
      <style>{`
        @keyframes orgGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(255,44,3,0) } 50% { box-shadow: 0 0 0 3px rgba(255,44,3,.45) } }
        @keyframes orgFlow { 0% { opacity:.25; transform: translateY(-3px) } 50% { opacity:1; transform: translateY(3px) } 100% { opacity:.25; transform: translateY(-3px) } }
        @keyframes barGrow { 0% { transform: scaleX(0) } 50% { transform: scaleX(1) } 100% { transform: scaleX(0) } }
        @keyframes funnelPulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.03) } }
        @media (prefers-reduced-motion: reduce) { [style*="animation"] { animation: none !important } }
      `}</style>
      {/* Barra lateral (desktop) */}
      <aside className={`hidden w-60 shrink-0 flex-col border-r border-white/10 ${collapsed ? 'lg:hidden' : 'lg:flex'}`}>
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-white">
            SOMMA <span className="text-[#FF2C03]">Gov.</span>
          </span>
          <button onClick={() => setCollapsed(true)} className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-[#FF2C03]" aria-label="Recolher menu">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          <NavList />
        </div>
        <div className="h-1 bg-white/5">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>
      </aside>

      {/* Botão flutuante para expandir o menu (desktop, quando recolhido) */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="absolute left-3 top-3 z-30 hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0A0A0A] text-white/70 transition hover:text-[#FF2C03] lg:flex" aria-label="Expandir menu">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {/* Palco */}
      <section className="relative flex min-w-0 flex-1 flex-col">
        {/* Top bar mobile */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 pt-[max(0.7rem,env(safe-area-inset-top))] pb-2 lg:hidden">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight">SOMMA <span className="text-[#FF2C03]">Gov.</span></span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tabular-nums text-white/45">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => setMenu(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 active:bg-white/10" aria-label="Índice">
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Barra de progresso mobile */}
        <div className="h-0.5 bg-white/10 lg:hidden">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>

        {/* Número gigante de fundo */}
        {!slide.center && (
          <span className="pointer-events-none absolute right-4 top-2 z-0 select-none font-[family-name:var(--font-display)] text-[7rem] leading-none text-white/[0.03] sm:right-10 sm:text-[12rem]">
            {String(active + 1).padStart(2, '0')}
          </span>
        )}

        {/* Conteúdo */}
        <div
          key={active}
          ref={stageRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative z-10 h-full overflow-y-auto overscroll-contain px-5 pb-24 pt-6 sm:px-12 sm:pb-20 sm:pt-10"
        >
          <div className={`mx-auto flex min-h-full max-w-4xl flex-col gap-4 sm:gap-5 ${slide.center ? 'justify-center' : 'justify-center'}`}>
            {slide.node}
          </div>
        </div>

        {/* Nav inferior */}
        <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))] sm:px-8">
          <button onClick={toggleFs} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:text-[#FF2C03]" aria-label="Tela cheia">
            {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-1.5 py-1">
            <button onClick={prev} disabled={active === 0} className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 disabled:opacity-25" aria-label="Anterior">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[3.2rem] text-center text-xs font-bold tabular-nums text-white/60">
              {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button onClick={next} disabled={active === total - 1} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2C03] text-black transition hover:bg-[#ff4a28] disabled:opacity-25" aria-label="Próximo">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Índice mobile */}
      {menu && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0A0A]/97 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight">Índice</span>
            <button onClick={() => setMenu(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
            <NavList onPick={() => setMenu(false)} />
          </div>
        </div>
      )}

      {/* Sub-deck de projeto */}
      {project && (
        <SubDeck
          title={project === 'estacao' ? 'Estação Somma' : 'Somma Sebrae'}
          slides={project === 'estacao' ? ESTACAO_SLIDES : SEBRAE_SLIDES}
          headerLogo={project === 'sebrae' ? '/Sebrae_logo.svg' : undefined}
          onClose={() => setProject(null)}
        />
      )}
    </main>
    </ProjectCtx.Provider>
  )
}
