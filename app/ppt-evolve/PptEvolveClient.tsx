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

function LogoImg({ src, alt, h = 'h-7' }: { src: string; alt: string; h?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`${h} w-auto`} />
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
    { e: '🎬', t: 'Conteúdo' },
    { e: '📣', t: 'Influência' },
    { e: '🤝', t: 'Parceiros' },
    { e: '✨', t: 'Lifestyle' },
  ]
  const rings = [
    { d: 50, dur: 20, count: 2 },
    { d: 76, dur: 28, count: 3 },
    { d: 100, dur: 36, count: 3 },
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

/* ============================================================================
 * Slides
 * ========================================================================== */

type Slide = { section: string; node: ReactNode; center?: boolean }

const SLIDES: Slide[] = [
  // 1 — Capa
  {
    section: 'Capa', center: true,
    node: (
      <div>
        <div data-anim className="mb-8 flex items-center gap-4 sm:gap-6">
          <LogoImg src="/Logo_Nova_Somma_Branca_Laranja.svg" alt="Somma Club" h="h-10 sm:h-14" />
          <span className="text-2xl font-light text-[rgb(var(--fg)_/_0.25)]">×</span>
          <LogoImg src="/logo-evolve.png" alt="Evolve" h="h-7 sm:h-9" />
        </div>
        <h1 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.86] tracking-tight text-[rgb(var(--fg))] text-[2.6rem] sm:text-7xl lg:text-[6.5rem]">
          Somma Club<br /><span className="text-[#FF2C03]">+ Evolve</span>
        </h1>
        <p data-anim className="mt-6 max-w-xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-xl">
          Construindo a próxima geração de comunidade fitness do Distrito Federal.
        </p>
      </div>
    ),
  },

  // 2 — Pertencimento
  {
    section: 'Pertencimento', center: true,
    node: (
      <div>
        <h2 data-anim className="font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[3.6rem]">
          As pessoas não buscam mais academia.<br /><O>Elas buscam pertencimento.</O>
        </h2>
        <p data-anim className="mt-7 max-w-2xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-xl">
          As maiores marcas do mundo pararam de vender produto. Passaram a construir comunidade.
        </p>
      </div>
    ),
  },

  // 3 — O novo consumidor
  {
    section: 'O novo consumidor',
    node: (<>
      <Head k="01 · Comportamento" title="O novo consumidor" sub="O que a galera procura mudou de vez." />
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <Panel variant="muted" title="Antes" items={['Academia', 'Treino', 'Equipamento']} />
        <Panel variant="accent" title="Hoje" items={['Experiência', 'Comunidade', 'Relacionamento', 'Networking', 'Lifestyle', 'Performance']} />
      </div>
    </>),
  },

  // 4 — Quem é o Somma
  {
    section: 'Quem é o Somma',
    node: (<>
      <Head k="02 · O movimento" title="Antes de falar de corrida, vamos falar de gente" />
      <Chips items={['Comunidade', 'Conexão', 'Experiência', 'Cultura', 'Pertencimento']} />
      <Note>O Somma não é assessoria. Não é grupo de corrida. É uma comunidade que junta gente pela corrida.</Note>
    </>),
  },

  // 5 — Os números
  {
    section: 'Os números',
    node: (<>
      <Head k="03 · O impacto" title="Os números falam por si" />
      <Stats items={[{ n: '+5.000', l: 'membros cadastrados' }, { n: '52', l: 'encontros por ano' }, { n: '100k+', l: 'interações por ano' }, { n: '100%', l: 'comunidade ativa' }]} />
      <Note>Eventos próprios, presença digital crescente e tudo isso de forma orgânica.</Note>
    </>),
  },

  // 6 — Ecossistema (órbita)
  {
    section: 'O ecossistema',
    node: (<>
      <Head k="04 · A plataforma" title="O Somma é um ecossistema" sub="No centro, a comunidade. Em volta, tudo o que ela movimenta." />
      <OrbitEcosystem />
    </>),
  },

  // 7 — O que construímos
  {
    section: 'O que construímos',
    node: (<>
      <Head k="05 · A essência" title="O que a gente construiu" sub="No fim, não é sobre corrida. É sobre gente." />
      <Chips items={['Pessoas', 'Conexões', 'Relacionamentos', 'Networking', 'Experiências', 'Emoção']} />
      <Note>Esse é o ativo mais difícil de construir. E a gente já tem.</Note>
    </>),
  },

  // 8 — Por que as marcas se aproximam
  {
    section: 'Por que as marcas chegam',
    node: (<>
      <Head k="06 · O valor" title="Por que as marcas chegam no Somma" sub="Porque o Somma tem uma coisa rara." />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-5" items={[
        { emoji: '👀', t: 'Atenção', d: 'gente olhando de verdade.' },
        { emoji: '🤝', t: 'Confiança', d: 'a galera acredita.' },
        { emoji: '📣', t: 'Influência', d: 'a recomendação rola.' },
        { emoji: '❤️', t: 'Relacionamento', d: 'vínculo real.' },
        { emoji: '🔁', t: 'Recorrência', d: 'toda semana, sem falta.' },
      ]} />
    </>),
  },

  // 9 — Quem é a Evolve
  {
    section: 'Quem é a Evolve',
    node: (<>
      <Head k="07 · A parceira" title="Quem é a Evolve" />
      <div data-anim><LogoImg src="/logo-evolve.png" alt="Evolve" h="h-9 sm:h-11" /></div>
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-5" items={[
        { emoji: '📈', t: 'Escala', d: 'tamanho de mercado.' },
        { emoji: '⚡', t: 'Crescimento', d: 'em forte expansão.' },
        { emoji: '🏗️', t: 'Estrutura', d: 'operação sólida.' },
        { emoji: '📍', t: 'Capilaridade', d: 'presença em todo lugar.' },
        { emoji: '💪', t: 'Comunidade fitness', d: 'a potência do dia a dia.' },
      ]} />
    </>),
  },

  // 9b — Marca + movimento
  {
    section: 'Marca + movimento',
    node: (<>
      <Head k="A grande sacada" title="Marca + movimento" sub="As maiores marcas não patrocinam só atletas. Elas se atrelam ao movimento." />
      <Chips items={['New Balance', 'Adidas', 'Nike', 'Smart Fit', 'The Simple Gym', 'Ironberg']} />
      <Note>Todas usam o esporte e a corrida pra construir desejo e reconhecimento. O Somma leva esse movimento pra dentro de cada unidade da Evolve.</Note>
    </>),
  },

  // 9c — Evolve em todo o DF (mapa)
  {
    section: 'Evolve no DF',
    node: (<>
      <Head k="Capilaridade" title="Evolve em todo o Distrito Federal" sub="O Somma conversa com todas as regiões onde a Evolve está." />
      <EvolveMap />
      <Note>Cada ponto é uma unidade Evolve. O movimento de corrida do Somma alcança todas elas, fortalecendo a marca e impulsionando matrículas em cada região.</Note>
    </>),
  },

  // 10 — Por que faz sentido (tabela)
  {
    section: 'Por que faz sentido',
    node: (<>
      <Head k="08 · O encaixe" title="Por que Evolve e Somma combinam" />
      <DataTable heads={['O Somma traz', 'A Evolve traz']} rows={[
        ['Comunidade', 'Estrutura'],
        ['Influência', 'Academias'],
        ['Relacionamento', 'Escala'],
        ['Lifestyle', 'Capacidade comercial'],
        ['Conteúdo', 'Operação'],
      ]} />
      <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[rgb(var(--fg))] sm:text-2xl">
          Juntos, vocês criam algo que <O>nenhum concorrente</O> tem.
        </p>
      </div>
    </>),
  },

  // 11 — A oportunidade Evolve+
  {
    section: 'A oportunidade',
    node: (<>
      <Head k="09 · O salto" title="A oportunidade Evolve+" sub="A Evolve já domina a porta de entrada. Agora dá pra ir além." />
      <Chips items={['Construir desejo', 'Construir autoridade', 'Posicionamento premium']} />
      <Note>E o melhor: esse público já está dentro do Somma.</Note>
    </>),
  },

  // 12 — Oportunidade exclusiva
  {
    section: 'Oportunidade exclusiva',
    node: (<>
      <Head k="10 · O território" title="Uma oportunidade exclusiva" sub="Nenhuma academia do DF tem isso hoje:" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Panel variant="muted" title="O que falta pra todas elas" items={['Integração com a maior comunidade de corrida do DF', '+5.000 membros', 'Influenciadores', 'Eventos próprios']} />
        <Panel variant="muted" title="E ainda" items={['Ecossistema próprio', 'Check-in próprio', 'Conteúdo próprio', 'Base de relacionamento própria']} />
      </div>
      <div data-anim className="rounded-2xl border-2 border-[#FF2C03] bg-[#FF2C03]/[0.10] p-5 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[rgb(var(--fg))] sm:text-3xl">A Evolve pode ser a <O>única</O>.</p>
      </div>
    </>),
  },

  // 13 — O conceito
  {
    section: 'O conceito', center: true,
    node: (
      <div>
        <Eyebrow>11 · O conceito</Eyebrow>
        <p data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-none tracking-tight text-[rgb(var(--fg))] text-6xl sm:text-8xl lg:text-[8rem]" style={{ animation: 'glowText 3s ease-in-out infinite' }}>
          Evolve<span className="text-[#FF2C03]">+</span>
        </p>
        <p data-anim className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[rgb(var(--fg)_/_0.7)] sm:text-base">Official Performance Partner of Somma Club</p>
        <p data-anim className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-[rgb(var(--fg)_/_0.35)]">Powered by Evolve</p>
        <p data-anim className="mx-auto mt-8 max-w-xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-lg">
          Não é naming rights tradicional. É uma associação estratégica.
        </p>
      </div>
    ),
  },

  // 14 — Ativos disponíveis (tabela didática)
  {
    section: 'Ativos disponíveis',
    node: (<>
      <Head k="12 · O que entra" title="Ativos disponíveis" sub="Tudo o que a parceria coloca na mesa." />
      <DataTable heads={['Ativo', 'O que ele entrega']} rows={[
        ['Comunidade', '+5.000 membros engajados'],
        ['Eventos', 'palco recorrente da marca'],
        ['Conteúdo', 'mídia própria toda semana'],
        ['Influenciadores', 'vozes em que a galera confia'],
        ['Assessoria', 'canal direto de novos alunos'],
        ['CRM e check-ins', 'dados reais de quem aparece'],
        ['Site e landing pages', 'captação e conversão'],
        ['Loja e base de membros', 'relacionamento contínuo'],
      ]} />
    </>),
  },

  // 15 — Somma Creators
  {
    section: 'Somma Creators',
    node: (<>
      <Head k="13 · Programa" title="Somma Creators" sub="O programa oficial de criadores." />
      <Lead>Transformar a Evolve+ em assunto recorrente.</Lead>
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-4" items={[
        { emoji: '🎬', t: 'Conteúdo', d: 'produção constante.' },
        { emoji: '🔥', t: 'Desejo', d: 'gente querendo entrar.' },
        { emoji: '📡', t: 'Alcance', d: 'a marca em todo feed.' },
        { emoji: '👑', t: 'Autoridade', d: 'referência no assunto.' },
      ]} />
    </>),
  },

  // 16 — Somma Leaders
  {
    section: 'Somma Leaders',
    node: (<>
      <Head k="14 · Programa" title="Somma Leaders" sub="Evento mensal, tudo dentro da Evolve+." />
      <Chips items={['Empresários', 'Executivos', 'Médicos', 'Advogados', 'Influenciadores']} />
      <Chips items={['Networking', 'Treino', 'Café', 'Relacionamento']} />
      <Note>O público que toda academia premium quer ter dentro de casa.</Note>
    </>),
  },

  // 17 — Performance Lab
  {
    section: 'Performance Lab',
    node: (<>
      <Head k="15 · Programa" title="Somma Performance Lab" sub="Local: Evolve+." />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
        { emoji: '🏃', t: 'Corrida', d: 'no centro de tudo.' },
        { emoji: '⏱️', t: 'Performance', d: 'evoluir de verdade.' },
        { emoji: '🥗', t: 'Nutrição', d: 'combustível certo.' },
        { emoji: '🧘', t: 'Mobilidade', d: 'corpo solto.' },
        { emoji: '🧊', t: 'Recuperação', d: 'voltar mais forte.' },
        { emoji: '🏋️', t: 'Treinamento', d: 'método e constância.' },
      ]} />
    </>),
  },

  // 18 — Recovery Day
  {
    section: 'Recovery Day',
    node: (<>
      <Head k="16 · Programa" title="Somma Recovery Day" sub="Uma experiência premium." />
      <Chips items={['Bem-estar', 'Recuperação', 'Longevidade', 'Saúde']} />
      <Note>O lado que fideliza: cuidar da pessoa inteira, não só do treino.</Note>
    </>),
  },

  // 19 — Evolve+ Challenge
  {
    section: 'Evolve+ Challenge',
    node: (<>
      <Head k="17 · Programa" title="Evolve+ Challenge" sub="Um programa de desafios." />
      <Tiles cols="sm:grid-cols-2 lg:grid-cols-3" items={[
        { emoji: '📅', t: 'Frequência', d: 'hábito que gruda.' },
        { emoji: '✨', t: 'Transformação', d: 'antes e depois real.' },
        { emoji: '⏱️', t: 'Performance', d: 'metas que engajam.' },
        { emoji: '🤝', t: 'Engajamento', d: 'a base ativa.' },
        { emoji: '🏆', t: 'Premiações', d: 'recompensa de verdade.' },
        { emoji: '🎬', t: 'Conteúdo', d: 'histórias pra contar.' },
      ]} />
    </>),
  },

  // 20 — Programa de Bolsas
  {
    section: 'Programa de Bolsas',
    node: (<>
      <Head k="18 · Programa" title="Programa de Bolsas" sub="Patrocínio oficial Evolve+." />
      <Stats cols="sm:grid-cols-3" items={[{ n: '5', l: 'bolsas integrais por semestre' }, { n: '10', l: 'bolsas por ano' }, { n: '100%', l: 'assessoria custeada' }]} />
      <Note>Transformar vidas, gerar histórias reais, produzir conteúdo e atrair novos corredores.</Note>
    </>),
  },

  // 21 — Calendário anual
  {
    section: 'Calendário anual',
    node: (<>
      <Head k="19 · O ano todo" title="Calendário anual" sub="O que roda durante o ano." />
      <Stats cols="sm:grid-cols-3 lg:grid-cols-4" items={[
        { n: '52', l: 'encontros Somma' },
        { n: '12', l: 'ativações Evolve+' },
        { n: '12', l: 'campanhas digitais' },
        { n: '12', l: 'ações com criadores' },
        { n: '4', l: 'eventos premium' },
        { n: '2', l: 'grandes campanhas' },
        { n: '10', l: 'bolsas distribuídas' },
        { n: '365', l: 'dias de presença' },
      ]} />
    </>),
  },

  // 22 — Exclusividade
  {
    section: 'Exclusividade', center: true,
    node: (
      <div>
        <Eyebrow>20 · O coração da proposta</Eyebrow>
        <p data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.98] tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-5xl lg:text-[3.4rem]">
          A Evolve será a <O>única</O> academia oficialmente associada ao Somma.
        </p>
        <p data-anim className="mx-auto mt-7 max-w-2xl text-base font-medium leading-snug text-[rgb(var(--fg)_/_0.6)] sm:text-lg">
          Sem concorrentes diretos dentro do ecossistema. A exclusividade é parte central da proposta.
        </p>
      </div>
    ),
  },

  // 23 — Presença da marca
  {
    section: 'Presença da marca',
    node: (<>
      <Head k="21 · Onde aparece" title="Presença da marca" sub="A Evolve+ presente em cada ponto de contato." />
      <Chips items={['Camisetas insiders', 'Uniformes', 'Site', 'Check-in', 'Backdrops', 'Eventos', 'Credenciais', 'Landing pages', 'Totens', 'Conteúdo']} />
    </>),
  },

  // 24 — Funil de negócios
  {
    section: 'Funil de negócios',
    node: (<>
      <Head k="22 · Gera venda" title="Funil de negócios" sub="A parceria gera matrícula, não só marca." />
      <VFlow items={['Comunidade', 'Experiência', 'Relacionamento', 'Day Pass', 'Teste', 'Matrícula', 'Retenção', 'Advocacy']} highlightFrom={5} />
    </>),
  },

  // 25 — O que a Evolve ganha
  {
    section: 'O que a Evolve ganha',
    node: (<>
      <Head k="23 · Para a Evolve" title="O que a Evolve ganha" />
      <Chips items={['Posicionamento', 'Comunidade', 'Autoridade', 'Exclusividade', 'Conteúdo', 'Influência', 'Leads', 'Matrículas', 'Relacionamento']} />
    </>),
  },

  // 26 — O que o Somma ganha
  {
    section: 'O que o Somma ganha',
    node: (<>
      <Head k="24 · Para o Somma" title="O que o Somma ganha" />
      <Chips items={['Estrutura', 'Investimento', 'Experiência', 'Comunidade mais forte', 'Ecossistema maior', 'Novas oportunidades']} />
    </>),
  },

  // 27 — Visão 2030
  {
    section: 'Visão 2030',
    node: (<>
      <Head k="25 · O futuro" title="Visão 2030" />
      <Lead>O Somma vira referência nacional. A Evolve vira a academia oficialmente ligada a esse movimento.</Lead>
      <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[rgb(var(--fg))] sm:text-2xl">
          A gente não está criando uma campanha. Está construindo um <O>ativo</O>.
        </p>
      </div>
    </>),
  },

  // 28 — Proposta de investimento
  {
    section: 'Investimento',
    node: (<>
      <Head k="26 · Proposta" title="Proposta de investimento" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { name: 'Start', price: 'R$ 10k', d: 'presença e ativações base', hot: false },
          { name: 'Growth', price: 'R$ 15k', d: 'creators e eventos premium', hot: true },
          { name: 'Performance', price: 'R$ 20k', d: 'bolsas e exclusividade total', hot: false },
        ].map((p) => (
          <div key={p.name} data-anim className={`rounded-2xl p-5 text-center ${p.hot ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.10]' : 'border border-[rgb(var(--fg)_/_0.1)] bg-[rgb(var(--panel)_/_0.04)]'}`} style={p.hot ? { animation: 'glowPulse 3s ease-in-out infinite' } : undefined}>
            {p.hot && <span className="mb-2 inline-block rounded-full bg-[#FF2C03] px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">Recomendado</span>}
            <p className="text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--fg)_/_0.4)]">Plano</p>
            <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[rgb(var(--fg))]">{p.name}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#FF2C03]">{p.price}<span className="text-base text-[rgb(var(--fg)_/_0.4)]">/mês</span></p>
            <p className="mt-2 text-[13px] leading-snug text-[rgb(var(--fg)_/_0.55)]">{p.d}</p>
          </div>
        ))}
      </div>
      <Note>Contrato mínimo de 12 meses.</Note>
    </>),
  },

  // 29 — Fecho
  {
    section: 'Fecho', center: true,
    node: (
      <ClosingCard
        kicker="Somma Club + Evolve"
        title={<>As melhores marcas não compram espaço. Elas constroem movimentos.</>}
        sub="O futuro da comunidade fitness do Distrito Federal começa aqui."
      />
    ),
  },
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
    <main style={themeVars} className="fixed inset-0 flex overflow-hidden overscroll-none bg-[var(--bg)] font-[family-name:var(--font-body)] text-[rgb(var(--fg))] [-webkit-tap-highlight-color:transparent] select-none">
      <style>{`
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,44,3,0) } 50% { box-shadow: 0 0 0 5px rgba(255,44,3,.35) } }
        @keyframes glowText { 0%,100% { text-shadow: 0 0 0 rgba(255,44,3,0) } 50% { text-shadow: 0 0 28px rgba(255,44,3,.45) } }
        @media (prefers-reduced-motion: reduce) { [style*="animation"] { animation: none !important } }
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
