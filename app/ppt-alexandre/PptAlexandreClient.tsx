'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, Maximize, Minimize, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

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
          <li key={i} className="flex gap-2 text-sm leading-snug text-white/85 sm:text-base"><span className="text-[#FF2C03]">▸</span><span>{it}</span></li>
        ))}
      </ul>
    </div>
  )
}

function Person({ name, role, tone = 'plain' }: { name: string; role: string; tone?: 'ceo' | 'coo' | 'head' | 'plain' }) {
  const cls =
    tone === 'ceo' ? 'bg-[#FF2C03] text-black'
      : tone === 'coo' ? 'border-2 border-[#FF2C03] bg-transparent text-white'
        : tone === 'head' ? 'border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] text-white'
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

type Tile = { emoji: string; t: string; d: string }
function Tiles({ items, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { items: Tile[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 ${cols}`}>
      {items.map(({ emoji, t, d }, i) => (
        <div key={i} data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="text-2xl">{emoji}</span>
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
            {heads.map((h, i) => <th key={i} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] ${i === 0 ? 'text-[#FF2C03]' : 'text-white/60'}`}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-white/[0.08]">
              {r.map((c, ci) => <td key={ci} className={`px-4 py-3 align-top text-[13px] sm:text-sm ${ci === 0 ? 'font-semibold text-white' : 'text-white/60'}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Fluxo de etapas em chips (quebra de linha) */
function FlowChips({ items }: { items: string[] }) {
  return (
    <div data-anim className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${i === items.length - 1 ? 'bg-[#FF2C03] text-black' : 'border border-white/15 bg-white/[0.05] text-white/80'}`}>{it}</span>
          {i < items.length - 1 && <span className="text-white/30">→</span>}
        </span>
      ))}
    </div>
  )
}

/** Etapas numeradas em cartões */
function Steps({ items, cols = 'sm:grid-cols-2 lg:grid-cols-4' }: { items: { t: string; d?: string }[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 ${cols}`}>
      {items.map((s, i) => (
        <div key={i} data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF2C03] text-xs font-bold text-black">{i + 1}</span>
          <p className="mt-2 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-white">{s.t}</p>
          {s.d && <p className="mt-0.5 text-[13px] leading-snug text-white/55">{s.d}</p>}
        </div>
      ))}
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
        <Eyebrow>Apresentação executiva · para Alexandre Alves</Eyebrow>
        <h1 data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.86] tracking-tight text-white text-[2.7rem] sm:text-7xl lg:text-[7rem]">
          O Futuro do<br /><span className="text-[#FF2C03]">Somma Club</span>
        </h1>
        <p data-anim className="mt-6 max-w-xl text-base font-medium leading-snug text-white/60 sm:text-xl">
          Governança, proteção jurídica e crescimento sustentável.
        </p>
      </div>
    ),
  },

  // 2 — Por que agora
  {
    section: 'Por que agora',
    node: (
      <>
        <Head k="01 · O momento" title="Por que falar disso agora?" />
        <FlowChips items={['Início', 'Comunidade', 'Crescimento', '+5.000 membros', 'Assessoria', 'Loja', 'Patrocínios', 'Eventos', 'Novos negócios', 'Estrutura']} />
        <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-white sm:text-3xl">
            O Somma cresceu. <O>A estrutura ainda não.</O>
          </p>
        </div>
      </>
    ),
  },

  // 3 — O modelo atual (hub)
  {
    section: 'O modelo atual',
    node: (
      <>
        <Head k="02 · Diagnóstico" title="O modelo atual" />
        <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['Comunidade', 'Marketing', 'Loja', 'Eventos', 'Patrocínios', 'Tecnologia', 'Assessoria'].map((s) => (
            <div key={s} className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-center text-[13px] font-semibold text-white/75">{s}</div>
          ))}
        </div>
        <Arrow />
        <div data-anim className="mx-auto w-full max-w-sm rounded-2xl bg-[#FF2C03] p-4 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-black">Tudo converge em Alexandre</p>
        </div>
        <div data-anim className="flex flex-wrap justify-center gap-2">
          {['Dependência', 'Sobrecarga', 'Falta de clareza', 'Risco operacional'].map((c) => (
            <span key={c} className="rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-300">{c}</span>
          ))}
        </div>
      </>
    ),
  },

  // 4 — O problema é daqui a 3 anos
  {
    section: 'O problema futuro',
    node: (
      <>
        <Head k="03 · A urgência" title="O problema não é hoje. É daqui a 3 anos." />
        <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex h-44 items-end gap-3 sm:gap-5">
            {[{ y: 'Hoje', h: 28 }, { y: 'Ano 1', h: 46 }, { y: 'Ano 2', h: 68 }, { y: 'Ano 3', h: 100 }].map((b) => (
              <div key={b.y} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div style={{ height: `${b.h}%` }} className="w-full rounded-t-lg bg-[#FF2C03]" />
                </div>
                <span className="text-[11px] font-semibold text-white/60">{b.y}</span>
              </div>
            ))}
          </div>
        </div>
        <Note>Quanto maior o Somma ficar, maior o risco de operar sem estrutura. O melhor momento de organizar é antes de precisar.</Note>
      </>
    ),
  },

  // 5 — Comunidade vira organização
  {
    section: 'De comunidade a organização',
    node: (
      <>
        <Head k="04 · A transição" title="Quando uma comunidade vira organização" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel variant="muted" title="Antes" items={['Amizade', 'Boa vontade', 'Ajuda', 'Informalidade']} />
          <Panel variant="accent" title="Depois" items={['Responsabilidade', 'Processo', 'Prestação de contas', 'Governança']} />
        </div>
        <Note>Não é perder o jeito Somma. É ganhar a base para que ele dure.</Note>
      </>
    ),
  },

  // 6 — Os dois Sommas
  {
    section: 'Os dois Sommas',
    node: (
      <>
        <Head k="05 · O modelo" title="Os dois Sommas que já existem hoje" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel variant="accent" title="Somma Comunidade" items={['Treinões', 'Membros', 'Propósito', 'Cultura', 'Experiência']} />
          <Panel variant="muted" title="Somma Corporativo" items={['Receita', 'Patrocínios', 'Eventos', 'Loja', 'Assessoria · Tecnologia']} />
        </div>
        <div data-anim className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
          <p className="text-sm font-semibold text-white/80 sm:text-base">
            O <O>Corporativo</O> gera receita que <span className="font-bold text-white">financia</span> a <O>Comunidade</O> — que segue gratuita.
          </p>
        </div>
      </>
    ),
  },

  // 7 — O que é governança
  {
    section: 'O que é governança',
    node: (
      <>
        <Head k="06 · O conceito" title="O que é governança?" sub="Em palavras simples, governança responde a quatro perguntas:" />
        <Steps
          items={[
            { t: 'Quem decide?', d: 'quem tem a palavra final' },
            { t: 'Quem executa?', d: 'quem coloca em prática' },
            { t: 'Quem responde?', d: 'quem assume o resultado' },
            { t: 'Quem presta contas?', d: 'quem mostra os números' },
          ]}
        />
        <Note>Só isso. Governança é deixar essas respostas claras — para ninguém depender de adivinhação.</Note>
      </>
    ),
  },

  // 8 — Estrutura organizacional proposta
  {
    section: 'Estrutura proposta',
    node: (
      <>
        <Head k="07 · A proposta" title="Estrutura organizacional proposta" />
        <div className="space-y-2">
          <div data-anim className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Conselho de Sócios</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-white">Alexandre · João Victor · Diogo</p>
          </div>
          <Arrow />
          <div data-anim className="mx-auto max-w-[15rem]"><Person name="Alexandre Alves" role="CEO" tone="ceo" /></div>
          <Arrow />
          <div data-anim className="mx-auto max-w-[15rem]"><Person name="Alex Rodrigues" role="COO" tone="coo" /></div>
          <Arrow />
          <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Person name="Camilla" role="Head Comercial" tone="head" />
            <Person name="Diogo" role="Head de Retail" tone="head" />
            <Person name="João Victor" role="Head de Conteúdo Visual" tone="head" />
            <Person name="Cristina" role="Coord. Comunicação" />
            <Person name="Yas" role="Coord. Eventos" />
            <Person name="Priscila" role="Coord. Atendimento" />
          </div>
        </div>
      </>
    ),
  },

  // 9 — Quem faz o quê
  {
    section: 'Quem faz o quê',
    node: (
      <>
        <Head k="08 · Papéis" title="Quem faz o quê?" />
        <DataTable
          heads={['Nome', 'Função', 'Responsabilidades', 'Resultado esperado']}
          rows={[
            ['Alexandre', 'CEO', 'Comunidade, cultura e patrocínios', 'Crescimento e NPS'],
            ['Alex', 'COO', 'Operação, tecnologia e assessoria', 'Margem e projetos no prazo'],
            ['Camilla', 'Head Comercial', 'Patrocínios e parcerias', 'Receita e pipeline'],
            ['Diogo', 'Head de Retail', 'Loja e produtos', 'Faturamento e margem'],
            ['Cristina', 'Comunicação', 'Marca e conteúdo', 'Alcance e engajamento'],
            ['Yas', 'Eventos', 'Produção e experiência', 'NPS e entrega no prazo'],
          ]}
        />
      </>
    ),
  },

  // 10 — O ponto mais importante
  {
    section: 'Cargo = responsabilidade',
    center: true,
    node: (
      <div className="text-center">
        <Eyebrow>09 · O ponto mais importante</Eyebrow>
        <p data-anim className="mt-6 font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-white text-4xl sm:text-6xl lg:text-[4rem]">
          Cargo não é<br />reconhecimento.
        </p>
        <p data-anim className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-[#FF2C03] text-4xl sm:text-6xl lg:text-[4rem]">
          Cargo é responsabilidade.
        </p>
      </div>
    ),
  },

  // 11 — O risco invisível
  {
    section: 'O risco invisível',
    node: (
      <>
        <Head k="10 · Atenção" title="O risco invisível" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Panel variant="muted" title="Hoje temos" items={['Pessoas ajudando por amor à comunidade', 'Colaboração espontânea']} />
          <Panel variant="accent" title="Mas já existe" items={['Gente com responsabilidades contínuas', 'Tarefas recorrentes e esperadas']} />
        </div>
        <div data-anim className="flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-medium text-amber-100 sm:text-base">Quando “ajuda” vira “função fixa”, sem formalização, surge um risco silencioso — que cresce com o tempo.</p>
        </div>
      </>
    ),
  },

  // 12 — Como a Justiça enxerga
  {
    section: 'Os 4 pilares do vínculo',
    node: (
      <>
        <Head k="11 · O jurídico, sem juridiquês" title="Como a Justiça enxerga um vínculo" sub="A Justiça olha 4 sinais. Quanto mais presentes juntos, mais parece emprego." />
        <Tiles
          items={[
            { emoji: '🙋', t: 'Pessoalidade', d: 'É sempre aquela pessoa específica que faz.' },
            { emoji: '🔁', t: 'Habitualidade', d: 'Acontece com frequência e de forma esperada.' },
            { emoji: '💰', t: 'Onerosidade', d: 'Existe algum pagamento ou contrapartida.' },
            { emoji: '🎯', t: 'Subordinação', d: 'Recebe ordens e precisa cumprir.' },
          ]}
        />
        <Note>Sem alarme: entender esses sinais é o que permite organizar tudo do jeito certo, com tranquilidade.</Note>
      </>
    ),
  },

  // 13 — Onde o Somma está hoje
  {
    section: 'Onde estamos',
    node: (
      <>
        <Head k="12 · Maturidade" title="Onde o Somma está hoje?" />
        <FlowChips items={['Voluntário', 'Colaborador', 'Executivo']} />
        <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5">
          <p className="text-sm font-medium text-white/85 sm:text-base">
            Algumas pessoas <O>já estão migrando</O> do estágio “voluntário” para o de “colaborador” — com responsabilidades recorrentes. É exatamente esse ponto que pede formalização.
          </p>
        </div>
      </>
    ),
  },

  // 14 — Por que formalizar o voluntariado
  {
    section: 'Formalizar o voluntariado',
    node: (
      <>
        <Head k="13 · Proteção" title="Por que formalizar o voluntariado?" />
        <Tiles
          cols="sm:grid-cols-3"
          items={[
            { emoji: '🙋', t: 'Protege o voluntário', d: 'Deixa claro que é participação espontânea.' },
            { emoji: '🛡️', t: 'Protege o Somma', d: 'Evita interpretações de vínculo.' },
            { emoji: '👤', t: 'Protege os fundadores', d: 'Reduz risco pessoal de quem lidera.' },
          ]}
        />
      </>
    ),
  },

  // 15 — Proposta para os Insiders
  {
    section: 'Proposta · Insiders',
    node: (
      <>
        <Head k="14 · Voluntários" title="Proposta para os Insiders" />
        <FlowChips items={['Insiders', 'Termo de Participação Voluntária']} />
        <Panel
          variant="accent"
          title="Características do termo"
          items={['Sem cobrança', 'Sem metas', 'Sem obrigação', 'Sem remuneração', 'Participação 100% espontânea']}
        />
        <Note>O termo apenas registra o que já é verdade: o insider participa porque ama o Somma.</Note>
      </>
    ),
  },

  // 16 — Proposta para o Corporativo
  {
    section: 'Proposta · Corporativo',
    node: (
      <>
        <Head k="15 · Time" title="Proposta para o Corporativo" sub="Aqui a lógica é o oposto do voluntariado — e tudo bem." />
        <FlowChips items={['Corporativo', 'Responsabilidades', 'Metas', 'KPIs', 'Governança']} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Panel variant="muted" title="Insiders (voluntário)" items={['Sem metas', 'Sem cobrança', 'Espontâneo']} />
          <Panel variant="accent" title="Corporativo (time)" items={['Com metas e KPIs', 'Com prestação de contas', 'Com formalização adequada']} />
        </div>
      </>
    ),
  },

  // 17 — Estrutura jurídica recomendada
  {
    section: 'Estrutura jurídica',
    node: (
      <>
        <Head k="16 · A separação" title="Estrutura jurídica recomendada" sub="Separar o que é comunidade do que é negócio — cada um na sua caixa." />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <div data-anim className="rounded-2xl border border-white/15 bg-white/[0.05] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Associação Somma Club</p>
            <p className="mt-1 text-[13px] text-white/50">A casa da comunidade.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Comunidade', 'Voluntários', 'Treinões', 'Cultura'].map((t) => (
                <span key={t} className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/80">{t}</span>
              ))}
            </div>
          </div>
          <div data-anim className="rounded-2xl border border-[#FF2C03]/40 bg-[#FF2C03]/[0.10] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF2C03]">Empresa Somma</p>
            <p className="mt-1 text-[13px] text-white/50">O motor do negócio.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Loja', 'Eventos', 'Assessoria', 'Patrocínios'].map((t) => (
                <span key={t} className="rounded-full bg-[#FF2C03] px-3 py-1.5 text-xs font-bold text-black">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <Note>Duas caixas separadas: a comunidade protegida de um lado, o negócio organizado do outro.</Note>
      </>
    ),
  },

  // 18 — Benefícios da separação
  {
    section: 'Benefícios',
    node: (
      <>
        <Head k="17 · Resultado" title="Benefícios da separação" />
        <Tiles
          cols="sm:grid-cols-2 lg:grid-cols-3"
          items={[
            { emoji: '🛡️', t: 'Proteção jurídica', d: 'Risco controlado e isolado.' },
            { emoji: '🔍', t: 'Clareza', d: 'Cada coisa no seu lugar.' },
            { emoji: '🗂️', t: 'Organização', d: 'Contas e papéis separados.' },
            { emoji: '📈', t: 'Escalabilidade', d: 'Pronto para crescer.' },
            { emoji: '🤝', t: 'Captação de parceiros', d: 'Mais confiança para marcas.' },
            { emoji: '👤', t: 'Segurança dos sócios', d: 'Fundadores protegidos.' },
          ]}
        />
      </>
    ),
  },

  // 19 — O que acontece se nada for feito
  {
    section: 'Se nada for feito',
    node: (
      <>
        <Head k="18 · Cenário" title="E se nada for feito?" sub="Sem dramatizar — apenas o que a experiência mostra que costuma acontecer." />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            ['⚖️', 'Passivos trabalhistas'],
            ['💢', 'Conflitos internos'],
            ['🔗', 'Dependência dos fundadores'],
            ['🌫️', 'Falta de clareza'],
            ['🧱', 'Dificuldade de crescer'],
          ].map(([e, t]) => (
            <div key={t} data-anim className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="text-xl">{e}</span>
              <span className="text-base font-semibold text-white/80">{t}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // 20 — Plano de ação
  {
    section: 'Plano de ação',
    node: (
      <>
        <Head k="19 · Caminho" title="Plano de ação recomendado" />
        <Steps
          cols="sm:grid-cols-2 lg:grid-cols-3"
          items={[
            { t: 'Definir governança', d: 'papéis e decisões claras' },
            { t: 'Formalizar responsabilidades', d: 'quem responde por quê' },
            { t: 'Termo dos voluntários', d: 'proteger os insiders' },
            { t: 'Regimento interno', d: 'as regras do jogo' },
            { t: 'Análise jurídica', d: 'revisão completa por especialista' },
            { t: 'Estrutura societária', d: 'associação + empresa' },
          ]}
        />
        <Note>Passo a passo, leve, sem travar a operação. Cada fase deixa o Somma mais seguro.</Note>
      </>
    ),
  },

  // 21 — O Somma que queremos (fecho laranja)
  {
    section: 'Finalização',
    center: true,
    node: (
      <div className="-mx-5 -my-6 flex min-h-full flex-col justify-center bg-[#FF2C03] px-6 py-12 text-center sm:-mx-12 sm:px-12">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60 sm:text-xs">O Somma que queremos construir</p>
        <h2 data-anim className="mx-auto mt-5 max-w-4xl font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-black text-3xl sm:text-5xl lg:text-[3.6rem]">
          Comunidade forte.<br />Operação sustentável.<br />Marca protegida.
        </h2>
        <div data-anim className="mx-auto mt-6 flex flex-wrap justify-center gap-2">
          {['Estação Somma', 'Assessoria', 'Eventos', 'Loja', 'Parcerias'].map((c) => (
            <span key={c} className="rounded-full border border-black/30 px-3.5 py-1.5 text-sm font-semibold text-black">{c}</span>
          ))}
        </div>
        <p data-anim className="mx-auto mt-7 max-w-2xl text-base font-semibold leading-snug text-black/80 sm:text-lg">
          “Profissionalizar não significa perder a essência. Significa criar uma estrutura capaz de proteger e ampliar tudo aquilo que fez o Somma chegar até aqui.”
        </p>
      </div>
    ),
  },
]

/* ============================================================================
 * Shell — barra lateral de índice + palco escuro
 * ========================================================================== */

export function PptAlexandreClient() {
  const [active, setActive] = useState(0)
  const [menu, setMenu] = useState(false)
  const [fs, setFs] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
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
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, toggleFs, total, menu])

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
            i === active ? 'bg-[#FF2C03]/15 font-semibold text-[#FF2C03]' : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
          }`}
        >
          <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-white/30">{String(i + 1).padStart(2, '0')}</span>
          <span className="truncate">{s.section}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <main className="fixed inset-0 flex overflow-hidden overscroll-none bg-[#0A0A0A] font-[family-name:var(--font-body)] text-white [-webkit-tap-highlight-color:transparent] select-none">
      <aside className={`hidden w-60 shrink-0 flex-col border-r border-white/10 ${collapsed ? 'lg:hidden' : 'lg:flex'}`}>
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-white">SOMMA <span className="text-[#FF2C03]">Futuro</span></span>
          <button onClick={() => setCollapsed(true)} className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-[#FF2C03]" aria-label="Recolher menu">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4"><NavList /></div>
        <div className="h-1 bg-white/5">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>
      </aside>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="absolute left-3 top-3 z-30 hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0A0A0A] text-white/70 transition hover:text-[#FF2C03] lg:flex" aria-label="Expandir menu">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 pt-[max(0.7rem,env(safe-area-inset-top))] pb-2 lg:hidden">
          <span className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight">SOMMA <span className="text-[#FF2C03]">Futuro</span></span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tabular-nums text-white/45">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => setMenu(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 active:bg-white/10" aria-label="Índice"><Menu className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="h-0.5 bg-white/10 lg:hidden">
          <div className="h-full bg-[#FF2C03] transition-[width] duration-500" style={{ width: `${((active + 1) / total) * 100}%` }} />
        </div>

        {!slide.center && (
          <span className="pointer-events-none absolute right-4 top-2 z-0 select-none font-[family-name:var(--font-display)] text-[7rem] leading-none text-white/[0.03] sm:right-10 sm:text-[12rem]">
            {String(active + 1).padStart(2, '0')}
          </span>
        )}

        <div key={active} ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative z-10 h-full overflow-y-auto overscroll-contain px-5 pb-24 pt-6 sm:px-12 sm:pb-20 sm:pt-10">
          <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-4 sm:gap-5">{slide.node}</div>
        </div>

        <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))] sm:px-8">
          <button onClick={toggleFs} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:text-[#FF2C03]" aria-label="Tela cheia">
            {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-1.5 py-1">
            <button onClick={prev} disabled={active === 0} className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 disabled:opacity-25" aria-label="Anterior"><ArrowLeft className="h-4 w-4" /></button>
            <span className="min-w-[3.2rem] text-center text-xs font-bold tabular-nums text-white/60">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={next} disabled={active === total - 1} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2C03] text-black transition hover:bg-[#ff4a28] disabled:opacity-25" aria-label="Próximo"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      {menu && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0A0A]/97 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight">Índice</span>
            <button onClick={() => setMenu(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15" aria-label="Fechar"><X className="h-4 w-4" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6"><NavList onPick={() => setMenu(false)} /></div>
        </div>
      )}
    </main>
  )
}
