'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import gsap from 'gsap'
import {
  ArrowLeft, ArrowRight, Maximize, Minimize, Menu, X, PanelLeftClose, PanelLeftOpen, Sun, Moon,
  Users, TrendingUp, Dumbbell, Shirt, ShoppingBag, Tent, Ticket, BadgePercent, Globe, MonitorSmartphone,
  Gauge, Scale, FlaskConical, PartyPopper, Snowflake, Move, Medal, CheckCircle2, type LucideIcon,
} from 'lucide-react'
import { EvolveMap } from '@/components/evolve/evolve-map'

/* ============================================================================
 * Componentes — tema ESCURO editorial (compartilham a mesma linguagem da v1)
 * ========================================================================== */

const O = ({ children }: { children: ReactNode }) => <span className="text-[#FF2C03]">{children}</span>

function Eyebrow({ children }: { children: ReactNode }) {
  return <p data-anim className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#FF2C03] sm:text-xs">{children}</p>
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-[rgb(var(--fg))] text-[2rem] sm:text-5xl sm:leading-[0.9] lg:text-6xl">
      {children}
    </h2>
  )
}

function Head({ k, title, sub }: { k: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="space-y-3 border-l-2 border-[#FF2C03] pl-4 sm:space-y-4 sm:pl-6">
      <Eyebrow>{k}</Eyebrow>
      <Title>{title}</Title>
      {sub && <p data-anim className="max-w-[60ch] text-[15px] leading-relaxed text-[rgb(var(--fg)_/_0.6)] sm:text-base lg:text-lg">{sub}</p>}
    </header>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p data-anim className="max-w-[60ch] text-[13px] leading-relaxed text-[rgb(var(--fg)_/_0.5)] sm:text-sm">{children}</p>
}

function Panel({ title, items, variant = 'plain' }: { title: string; items: ReactNode[]; variant?: 'muted' | 'accent' | 'plain' }) {
  const accent = variant === 'accent'
  const muted = variant === 'muted'
  return (
    <div data-anim className={`rounded-2xl p-5 sm:p-6 ${accent ? 'border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10]' : muted ? 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.03)]' : 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.05)]'}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accent ? 'text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.4)]'}`}>{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-[rgb(var(--fg)_/_0.85)] sm:text-base"><span className="mt-0.5 shrink-0 text-[#FF2C03]">▸</span><span>{it}</span></li>
        ))}
      </ul>
    </div>
  )
}

type Tile = { icon: LucideIcon; t: string; d: string }
function Tiles({ items, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { items: Tile[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:gap-3.5 ${cols}`}>
      {items.map(({ icon: Icon, t, d }, i) => (
        <div key={i} data-anim className="rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)] p-5 transition-colors duration-200 hover:border-[#FF2C03]/40 hover:bg-[rgb(var(--panel)_/_0.07)]">
          <Icon className="h-6 w-6 text-[#FF2C03]" strokeWidth={2} />
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-[rgb(var(--fg))]">{t}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[rgb(var(--fg)_/_0.6)]">{d}</p>
        </div>
      ))}
    </div>
  )
}

function DataTable({ heads, rows }: { heads: string[]; rows: ReactNode[][] }) {
  return (
    <div data-anim className="overflow-hidden rounded-2xl border border-[rgb(var(--fg)_/_0.1)]">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="bg-[rgb(var(--panel)_/_0.07)]">
            {heads.map((h, i) => <th key={i} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] sm:px-5 sm:py-3.5 ${i === 0 ? 'text-[#FF2C03]' : 'text-[rgb(var(--fg)_/_0.6)]'}`}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-[rgb(var(--fg)_/_0.08)]">
              {r.map((c, ci) => <td key={ci} className={`px-4 py-3 align-top text-[13.5px] leading-snug sm:px-5 sm:py-4 sm:text-sm ${ci === 0 ? 'font-semibold text-[rgb(var(--fg))]' : 'text-[rgb(var(--fg)_/_0.6)]'}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div data-anim className="flex flex-wrap gap-2 sm:gap-2.5">
      {items.map((c) => (
        <span key={c} className="rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[rgb(var(--panel)_/_0.05)] px-4 py-2.5 text-[13.5px] font-semibold text-[rgb(var(--fg)_/_0.8)] sm:text-sm">{c}</span>
      ))}
    </div>
  )
}

function LogoImg({ src, alt, h = 'h-7' }: { src: string; alt: string; h?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`logo-adapt ${h} w-auto`} />
}

function SlideImg({ src, alt, ratio = 'aspect-[4/3]', position = 'object-center' }: { src: string; alt: string; ratio?: string; position?: string }) {
  return (
    <div data-anim className={`group relative overflow-hidden rounded-2xl border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)] ${ratio}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${position} transition-transform duration-500 group-hover:scale-[1.03]`} />
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
      <h2 data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[1] tracking-tight text-[rgb(var(--fg))] text-[1.75rem] sm:text-5xl sm:leading-[0.96] lg:text-[3.4rem]">{children}</h2>
      {sub && <p data-anim className="mx-auto mt-7 max-w-[55ch] text-[15px] font-medium leading-relaxed text-[rgb(var(--fg)_/_0.6)] sm:text-lg">{sub}</p>}
    </div>
  )
}

/** Arquitetura de marca em 3 camadas empilhadas */
function BrandStack() {
  const layers = [
    { icon: Users, t: 'Somma Club', d: 'A comunidade. A marca-mãe, preservada.', tone: 'plain' as const },
    { icon: TrendingUp, t: 'Assessoria Somma Club', d: 'A vertical de treino e performance.', tone: 'plain' as const },
    { icon: Dumbbell, t: 'Evolve+', d: 'Academia oficial e parceira de performance da assessoria.', tone: 'accent' as const },
  ]
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
      {layers.map(({ icon: Icon, t, d, tone }, i) => {
        const accent = tone === 'accent'
        return (
          <div key={t}>
            <div data-anim className={`flex items-center gap-4 rounded-2xl p-5 sm:gap-5 sm:p-6 ${accent ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.10]' : 'border border-[rgb(var(--fg)_/_0.12)] bg-[rgb(var(--panel)_/_0.04)]'}`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent ? 'bg-[#FF2C03] text-black' : 'bg-[rgb(var(--panel)_/_0.08)] text-[#FF2C03]'}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-[rgb(var(--fg))] sm:text-xl">{t}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-[rgb(var(--fg)_/_0.6)] sm:text-sm">{d}</p>
              </div>
            </div>
            {i < layers.length - 1 && <div className="flex justify-center py-1 text-[rgb(var(--fg)_/_0.3)]">↓</div>}
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================================
 * Slides
 * ========================================================================== */

type Slide = { section: string; node: ReactNode; center?: boolean; bg?: string }

const SLIDES: Slide[] = [
  // 1 — Capa
  { section: 'Capa', center: true, bg: '/evolve2-capa.jpg', node: (
    <div>
      <div data-anim className="mb-8 flex items-center gap-4 sm:gap-6">
        <LogoImg src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" h="h-10 sm:h-14" />
        <span className="text-2xl font-light text-[rgb(var(--fg)_/_0.25)]">×</span>
        <LogoImg src="/Evolve+_ElementoPrincipal_Branca.png" alt="Evolve+" h="h-12 sm:h-16" />
      </div>
      <h1 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.86] tracking-tight text-[rgb(var(--fg))] text-[2.4rem] sm:text-6xl lg:text-[5.4rem]">
        Assessoria Somma Club<br /><span className="text-[#FF2C03]">powered by Evolve+</span>
      </h1>
      <p data-anim className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[rgb(var(--fg)_/_0.55)]">Proposta de Naming Rights · 12 meses</p>
      <p data-anim className="mt-4 max-w-xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-lg">
        A Evolve+ como academia oficial da principal assessoria esportiva do ecossistema Somma.
      </p>
    </div>
  ) },

  // 2 — A virada de posicionamento
  { section: 'A virada', center: true, node: (
    <Statement kicker="O novo posicionamento" sub="Não é mídia. Não é exposição. É a Evolve+ assumindo um papel dentro da operação da assessoria.">
      A Evolve+ não está patrocinando um running club.<br /><O>Está se tornando a academia oficial da assessoria.</O>
    </Statement>
  ) },

  // 3 — Benchmark
  { section: 'O benchmark', node: (<>
    <Head k="A referência" title="The Simple Run Club × On" sub="Uma marca de performance se associando a uma assessoria com identidade própria, que também é comunidade." />
    <DataTable heads={['A referência', 'A nossa parceria']} rows={[
      ['The Simple Gym Club', 'Assessoria Somma Club'],
      ['On Running (marca de performance)', 'Evolve+ (academia ticket alto)'],
      ['Running club + assessoria oficial', 'Comunidade + assessoria oficial'],
      ['Nem premium, nem low cost', 'Nem premium, nem low cost'],
    ]} />
    <Note>Mesmo conceito, território próprio: o Distrito Federal.</Note>
  </>) },

  // 4 — Arquitetura de marca
  { section: 'Arquitetura de marca', node: (<>
    <Head k="Como a marca se organiza" title="Três camadas, uma só experiência" sub="A marca Somma é preservada. A Evolve+ entra como academia oficial da vertical de assessoria." />
    <BrandStack />
  </>) },

  // 5 — Naming rights, o conceito
  { section: 'Naming rights', center: true, node: (
    <div>
      <Eyebrow>O conceito · 12 meses</Eyebrow>
      <p data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[4.2rem]">
        Assessoria Somma Club<br /><span className="text-[#FF2C03]">powered by Evolve+</span>
      </p>
      <p data-anim className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[rgb(var(--fg)_/_0.6)]">Evolve+ · Academia oficial da Assessoria Somma Club</p>
      <p data-anim className="mt-4 text-base font-medium text-[rgb(var(--fg)_/_0.55)]">Preserva a marca Somma e adiciona a associação estratégica com a Evolve+.</p>
    </div>
  ) },

  // 6 — Exclusividade
  { section: 'Exclusividade', center: true, node: (
    <Statement kicker="O território" sub="Nenhuma concorrente terá acesso ao território construído pela comunidade e pela assessoria.">
      A Evolve+ será a <O>única</O> academia oficial integrada à assessoria do Somma.
    </Statement>
  ) },

  // — Capítulo: Entregáveis
  { section: '— Entregáveis', center: true, node: <Divider num="·" chapter="A proposta executiva" title="Os entregáveis do naming rights" /> },

  // 7 — Marca & identidade
  { section: '1 · Marca & identidade', node: (<>
    <Head k="Entregável 1" title="Marca & identidade visual" sub='Logo "powered by Evolve+" em cada ponto de contato da assessoria.' />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
      <SlideImg src="/evolve2-marca-1.png" alt="Aplicação da marca Evolve+ na identidade da assessoria" ratio="aspect-square" />
      <SlideImg src="/evolve2-marca-2.png" alt="Uniformes e materiais com a marca powered by Evolve+" ratio="aspect-square" />
    </div>
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
      { icon: Shirt, t: 'Uniformes', d: 'treino, eventos, staff e insiders.' },
      { icon: ShoppingBag, t: 'Kits físicos', d: 'ecobags e materiais do aluno.' },
      { icon: Medal, t: 'Credenciais', d: 'identidade nos eventos da assessoria.' },
      { icon: Globe, t: 'Backdrops', d: 'presença de marca nas ativações.' },
    ]} />
  </>) },

  // 8 — Experiência presencial
  { section: '2 · Experiência presencial', node: (<>
    <Head k="Entregável 2" title="Experiência presencial" sub="Estrutura física dedicada à parceria nos encontros e provas." />
    <div className="grid gap-3 sm:gap-3.5 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
      <SlideImg src="/evolve2-experiencia.png" alt="Tenda e ativação presencial Assessoria Somma Club × Evolve+" ratio="aspect-[3/4] lg:aspect-auto lg:min-h-full" />
      <div className="grid content-start gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-1">
        <Panel variant="accent" title="Tenda oficial" items={['Assessoria Somma Club × Evolve+', 'Estrutura dedicada nos encontros', 'Experiência premium para o aluno']} />
        <Panel variant="muted" title="Nova tenda Evolve+" items={['Produção e personalização pela Evolve', 'Uso em eventos, provas e ativações']} />
      </div>
    </div>
  </>) },

  // 9 — Benefícios comerciais
  { section: '3 · Benefícios comerciais', node: (<>
    <Head k="Entregável 3" title="Benefícios comerciais" sub="Vantagem de mão dupla: a base da Evolve+ vira aluno da assessoria, e o aluno da assessoria vira aluno da Evolve+." />
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel variant="plain" title="Para o aluno Evolve+" items={[<><BadgePercent className="mr-1 inline h-4 w-4 text-[#FF2C03]" />Mensalidade mais barata na assessoria</>, 'Condição especial de matrícula']} />
      <Panel variant="plain" title="Para o aluno da assessoria" items={[<><Ticket className="mr-1 inline h-4 w-4 text-[#FF2C03]" />Bolsa de 3 meses na Evolve+</>, 'Plano especial após o período inicial']} />
    </div>
  </>) },

  // 10 — Digital & aquisição
  { section: '4 · Digital & aquisição', node: (<>
    <Head k="Entregável 4" title="Digital & aquisição" sub="Site próprio da assessoria e entrada no ecossistema digital da Evolve." />
    <Tiles cols="sm:grid-cols-2" items={[
      { icon: MonitorSmartphone, t: 'Novo site da assessoria', d: '"Assessoria Somma Club powered by Evolve+", com captação integrada.' },
      { icon: Globe, t: 'Portal Evolve', d: 'A assessoria figura como "Assessoria de Corrida Oficial" da Evolve+.' },
    ]} />
  </>) },

  // 11 — Performance & saúde
  { section: '5 · Performance & saúde', node: (<>
    <Head k="Entregável 5" title="Performance & saúde" sub="Tecnologia e dados para treinar a base da assessoria em escala." />
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
      { icon: Gauge, t: 'Treinamento exclusivo', d: 'sistema que identifica o perfil do aluno.' },
      { icon: FlaskConical, t: 'Segmentação', d: 'por objetivo, nível e frequência — aplicada em massa.' },
      { icon: Scale, t: 'Balança de bioimpedância', d: 'cedida pela Evolve para avaliações da comunidade.' },
    ]} />
  </>) },

  // 12 — Eventos & comunidade
  { section: '6 · Eventos & comunidade', node: (<>
    <Head k="Entregável 6" title="Eventos & comunidade" sub="Experiências proprietárias exclusivas para a base da assessoria e da Evolve+." />
    <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
      { icon: PartyPopper, t: 'Eventos exclusivos', d: 'treinos fechados e encontros premium.' },
      { icon: Snowflake, t: 'Recovery days', d: 'recuperação e bem-estar.' },
      { icon: Move, t: 'Mobility days', d: 'mobilidade e prevenção.' },
      { icon: Medal, t: 'Provas exclusivas', d: 'desafios e ações proprietárias.' },
    ]} />
  </>) },

  // 13 — Mapa: academia oficial em todo o DF
  { section: 'Evolve+ no DF', node: (<>
    <Head k="Capilaridade" title="Academia oficial em todo o DF" sub="A assessoria leva a Evolve+ como academia oficial para todas as regiões onde a marca está." />
    <EvolveMap />
  </>) },

  // 14 — Quem entrega o quê
  { section: 'Quem entrega o quê', node: (<>
    <Head k="Arquitetura da parceria" title="Quem entrega o quê" sub="Papéis claros entre Somma e Evolve+." />
    <DataTable heads={['Ativo', 'Responsável']} rows={[
      ['Comunidade Somma', 'Somma Club'],
      ['Operação da assessoria', 'Somma Club'],
      ['Academia oficial', 'Evolve+'],
      ['Branding compartilhado', 'Somma + Evolve+'],
      ['Eventos exclusivos', 'Somma + Evolve+'],
      ['Benefícios comerciais', 'Somma + Evolve+'],
      ['Portal e captação digital', 'Evolve+ + Somma'],
    ]} />
  </>) },

  // 15 — Investimento (mesmos planos da v1)
  { section: 'Proposta de investimento', node: (<>
    <Head k="Investimento" title="Proposta de investimento" sub="Dois níveis de parceria, ambos com exclusividade. O Growth é o ponto de equilíbrio entre alcance e ativação." />
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
      {[
        { name: 'Growth', price: 'R$ 15k', d: 'Mais alcance, conteúdo e eventos.', feats: ['Logo nos ativos oficiais (camisetas, faixas e banners)', 'Presença nos 52 encontros do ano', 'Somma Creators (rede de criadores ativando a marca)', '4 inserções digitais por mês + 1 reels colaborativo', 'Experiências Evolve exclusivas para a comunidade', 'Somma Intercity: 1 night run por trimestre saindo da unidade', 'Co-branding em 1 evento proprietário por trimestre'], hot: true },
        { name: 'Performance', price: 'R$ 20k', d: 'Parceria completa e exclusiva.', feats: ['Tudo do plano Growth', 'Programa de Bolsas (atletas patrocinados pela Evolve)', 'Exclusividade total na categoria academia', 'Naming em 1 evento proprietário por ano', 'Série de conteúdo dedicada (1 por mês) + relatório de resultados', 'Presença de marca em todas as unidades Evolve mapeadas'], hot: false },
      ].map((p) => (
        <div key={p.name} data-anim className={`flex flex-col rounded-2xl p-6 sm:p-7 ${p.hot ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.10]' : 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)]'}`} style={p.hot ? { animation: 'glowPulse 3s ease-in-out infinite' } : undefined}>
          {p.hot && <span className="mb-3 inline-block self-start rounded-full bg-[#FF2C03] px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">Recomendado</span>}
          <p className="text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--fg)_/_0.4)]">Plano</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[rgb(var(--fg))]">{p.name}</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[2.75rem] leading-none tracking-tight text-[#FF2C03]">{p.price}<span className="text-base text-[rgb(var(--fg)_/_0.4)]">/mês</span></p>
          <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--fg)_/_0.6)]">{p.d}</p>
          <ul className="mt-5 space-y-2.5 border-t border-[rgb(var(--fg)_/_0.08)] pt-5">
            {p.feats.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[rgb(var(--fg)_/_0.82)]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2C03]" />{f}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <Note>Contrato mínimo de 12 meses. Valores e escopos podem ser ajustados conforme a parceria.</Note>
  </>) },

  // 16 — Fecho
  { section: 'Fecho', center: true, node: (
    <div className="text-center">
      <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[3.6rem]">
        Performance, comunidade e lifestyle<br /><O>em uma única experiência.</O>
      </h2>
      <div data-anim className="mx-auto mt-9 flex items-center justify-center gap-4 sm:gap-6">
        <LogoImg src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" h="h-8 sm:h-11" />
        <span className="text-xl font-light text-[rgb(var(--fg)_/_0.3)]">×</span>
        <LogoImg src="/Evolve+_ElementoPrincipal_Branca.png" alt="Evolve+" h="h-10 sm:h-12" />
      </div>
      <p data-anim className="mx-auto mt-6 max-w-xl text-base font-medium text-[rgb(var(--fg)_/_0.6)] sm:text-lg">
        Assessoria Somma Club powered by Evolve+.
      </p>
    </div>
  ) },
]

/* ============================================================================
 * Shell — barra lateral de índice + palco escuro
 * ========================================================================== */

export function PptEvolve2Client() {
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
          className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] transition-colors duration-200 ${
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
        @media (prefers-reduced-motion: reduce) { [style*="animation"] { animation: none !important } }
      `}</style>

      <aside className={`hidden w-60 shrink-0 flex-col border-r border-[rgb(var(--fg)_/_0.1)] ${collapsed ? 'lg:hidden' : 'lg:flex'}`}>
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-[rgb(var(--fg))]">SOMMA <span className="text-[#FF2C03]">× Evolve+</span></span>
          <button onClick={() => setCollapsed(true)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--fg)_/_0.5)] transition-colors duration-200 hover:bg-[rgb(var(--panel)_/_0.1)] hover:text-[#FF2C03]" aria-label="Recolher menu">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4"><NavList /></div>
        <div className="h-1 bg-[rgb(var(--panel)_/_0.05)]">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>
      </aside>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="absolute left-3 top-3 z-30 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)] text-[rgb(var(--fg)_/_0.7)] transition-colors duration-200 hover:border-[#FF2C03]/40 hover:text-[#FF2C03] lg:flex" aria-label="Expandir menu">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[rgb(var(--fg)_/_0.1)] px-4 pt-[max(0.7rem,env(safe-area-inset-top))] pb-2 lg:hidden">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight">SOMMA <span className="text-[#FF2C03]">× Evolve+</span></span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tabular-nums text-[rgb(var(--fg)_/_0.45)]">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => setMenu(true)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] active:bg-[rgb(var(--panel)_/_0.1)]" aria-label="Índice"><Menu className="h-[18px] w-[18px]" /></button>
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

        <div key={active} ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative z-10 h-full overflow-y-auto overscroll-contain px-5 pb-28 pt-8 sm:px-14 sm:pb-24 sm:pt-12 lg:px-20">
          {slide.bg && (
            <div className="pointer-events-none absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.bg} alt="" className="h-full w-full object-cover object-[center_25%] sm:object-[right_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/40 sm:bg-gradient-to-r sm:from-[var(--bg)] sm:via-[var(--bg)]/80 sm:to-[var(--bg)]/10" />
            </div>
          )}
          <div className="relative z-10 mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-6 sm:gap-8">{slide.node}</div>
        </div>

        <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] sm:px-8">
          <button onClick={toggleTheme} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)]/70 text-[rgb(var(--fg)_/_0.7)] backdrop-blur transition-colors duration-200 hover:border-[#FF2C03]/40 hover:text-[#FF2C03]" aria-label="Alternar tema claro/escuro" title="Tema (T)">
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <button onClick={toggleFs} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)]/70 text-[rgb(var(--fg)_/_0.7)] backdrop-blur transition-colors duration-200 hover:border-[#FF2C03]/40 hover:text-[#FF2C03]" aria-label="Tela cheia">
            {fs ? <Minimize className="h-[18px] w-[18px]" /> : <Maximize className="h-[18px] w-[18px]" />}
          </button>
          <div className="flex items-center gap-1 rounded-full border border-[rgb(var(--fg)_/_0.15)] bg-[var(--bg)]/70 px-1.5 py-1 backdrop-blur">
            <button onClick={prev} disabled={active === 0} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[rgb(var(--fg)_/_0.8)] transition-colors duration-200 hover:bg-[rgb(var(--panel)_/_0.1)] disabled:cursor-default disabled:opacity-25" aria-label="Anterior"><ArrowLeft className="h-[18px] w-[18px]" /></button>
            <span className="min-w-[3.4rem] text-center text-xs font-bold tabular-nums text-[rgb(var(--fg)_/_0.6)]">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={next} disabled={active === total - 1} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FF2C03] text-black transition-colors duration-200 hover:bg-[#ff4a28] disabled:cursor-default disabled:opacity-25" aria-label="Próximo"><ArrowRight className="h-[18px] w-[18px]" /></button>
          </div>
        </div>
      </section>

      {menu && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[var(--bg)] backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight">Índice</span>
            <button onClick={() => setMenu(false)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgb(var(--fg)_/_0.15)]" aria-label="Fechar"><X className="h-[18px] w-[18px]" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6"><NavList onPick={() => setMenu(false)} /></div>
        </div>
      )}
    </main>
  )
}
