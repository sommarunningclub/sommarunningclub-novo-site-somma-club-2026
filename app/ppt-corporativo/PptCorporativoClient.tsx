'use client'

import type { ReactNode } from 'react'
import { Deck, O, Head, Note, type Slide } from '../estacao-somma-club/EstacaoClient'
import { DollarSign, Building2, Users, TrendingUp, Award, Heart, Store } from 'lucide-react'

/* ----------------------------------------------------------------------------
 * Componentes visuais — preto / branco / cinza (#F3F4F6) / laranja (#FF2C03)
 * -------------------------------------------------------------------------- */

function Lead({ children }: { children: ReactNode }) {
  return (
    <p data-anim className="text-lg font-medium leading-snug text-neutral-800 sm:text-2xl lg:text-[1.7rem]">
      {children}
    </p>
  )
}

/** Slide divisor de seção (fundo preto) */
function Divider({ part, title, sub }: { part: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="-mx-5 -my-4 flex min-h-full flex-col justify-center bg-black px-6 py-10 text-center sm:-mx-10 sm:px-12">
      <p data-anim className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#FF2C03] sm:text-xs">{part}</p>
      <h2
        data-anim
        className="mx-auto mt-5 max-w-4xl font-[family-name:var(--font-display)] uppercase leading-[0.92] tracking-tight text-white text-4xl sm:text-6xl lg:text-7xl"
      >
        {title}
      </h2>
      {sub && <p data-anim className="mx-auto mt-5 max-w-2xl text-base font-medium leading-snug text-white/60 sm:text-lg">{sub}</p>}
    </div>
  )
}

/** Painel com lista — escuro, laranja ou neutro */
function Panel({ title, items, variant = 'plain' }: { title: string; items: ReactNode[]; variant?: 'dark' | 'accent' | 'plain' }) {
  const dark = variant === 'dark'
  const accent = variant === 'accent'
  return (
    <div
      data-anim
      className={`rounded-2xl p-5 sm:p-6 ${dark ? 'bg-black text-white' : accent ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.05]' : 'border border-black/10 bg-white shadow-sm'}`}
    >
      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-[#FF2C03]'}`}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className={`flex gap-2 text-sm leading-snug sm:text-base ${dark ? 'text-white/90' : 'text-neutral-700'}`}>
            <span className="text-[#FF2C03]">▸</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Cartão de pessoa para organograma */
function Person({ name, role, tone = 'plain' }: { name: string; role: string; tone?: 'ceo' | 'coo' | 'head' | 'plain' }) {
  const cls =
    tone === 'ceo'
      ? 'border-2 border-[#FF2C03] bg-[#FF2C03] text-white'
      : tone === 'coo'
        ? 'border-2 border-[#FF2C03] bg-white'
        : tone === 'head'
          ? 'border border-[#FF2C03]/40 bg-[#FF2C03]/[0.05]'
          : 'border border-black/10 bg-white shadow-sm'
  return (
    <div className={`rounded-xl p-2.5 text-center ${cls}`}>
      <p className={`font-[family-name:var(--font-display)] text-sm uppercase tracking-tight ${tone === 'ceo' ? 'text-white' : 'text-neutral-900'}`}>{name}</p>
      <p className={`text-[10px] font-medium leading-tight ${tone === 'ceo' ? 'text-white/80' : 'text-neutral-500'}`}>{role}</p>
    </div>
  )
}

function Arrow() {
  return <div className="flex justify-center text-base text-neutral-300">↓</div>
}

/** Cartão de cargo — nome, cargo, missão, responsabilidades e KPIs */
function RoleCard({
  area,
  cargo,
  person,
  missao,
  resp,
  kpis,
  team,
}: {
  area?: string
  cargo: string
  person: string
  missao?: string
  resp: string[]
  kpis: string[]
  team?: string
}) {
  return (
    <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          {area && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2C03]">{area}</p>}
          <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-neutral-900 sm:text-2xl">{cargo}</h3>
        </div>
        <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">{person}</span>
      </div>
      {missao && <p className="mt-2 border-l-2 border-[#FF2C03] pl-3 text-sm font-medium italic leading-snug text-neutral-700 sm:text-base">“{missao}”</p>}
      {team && <p className="mt-2 text-[13px] text-neutral-600"><span className="font-semibold text-neutral-800">Equipe:</span> {team}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Responsabilidades</p>
          <ul className="mt-2 space-y-1">
            {resp.map((r, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-neutral-700">
                <span className="text-neutral-300">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-gray-100 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF2C03]">KPIs · o que esperamos</p>
          <ul className="mt-2 space-y-1">
            {kpis.map((k, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-neutral-700">
                <span className="text-[#FF2C03]">▸</span>
                {k}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** Cartão de unidade de negócio */
function UnitCard({ nome, responsavel, kpis }: { nome: string; responsavel: string; kpis: string[] }) {
  return (
    <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF2C03]" />
        <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-neutral-900">{nome}</h3>
      </div>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Responsável: <span className="text-neutral-700">{responsavel}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {kpis.map((k, i) => (
          <span key={i} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">{k}</span>
        ))}
      </div>
    </div>
  )
}

/** Gráfico de barras horizontais */
function Bars({ title, note, items }: { title?: string; note?: string; items: { label: string; pct: number; value?: string }[] }) {
  return (
    <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      {title && <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF2C03]">{title}</p>}
      <div className="mt-3 space-y-2.5">
        {items.map((it, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between text-[13px] font-medium text-neutral-700">
              <span>{it.label}</span>
              {it.value && <span className="text-neutral-400">{it.value}</span>}
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#FF2C03]" style={{ width: `${it.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      {note && <p className="mt-3 text-[11px] text-neutral-400">{note}</p>}
    </div>
  )
}

/** Funil / pirâmide de números */
function Funnel({ items }: { items: { label: string; value: string; pct: number; tone?: 'dark' | 'accent' }[] }) {
  return (
    <div data-anim className="mx-auto flex max-w-md flex-col items-center gap-2">
      {items.map((it, i) => (
        <div
          key={i}
          style={{ width: `${it.pct}%` }}
          className={`rounded-xl px-3 py-3 text-center ${it.tone === 'accent' ? 'bg-[#FF2C03]' : 'bg-black'} text-white`}
        >
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight sm:text-3xl">{it.value}</p>
          <p className="mt-1 text-[11px] text-white/60">{it.label}</p>
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
        <div key={i} data-anim className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          {Icon ? <Icon className="h-5 w-5 text-[#FF2C03]" /> : <span className="text-2xl">{emoji}</span>}
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-neutral-900">{t}</h3>
          <p className="mt-1 text-[13px] leading-snug text-neutral-600">{d}</p>
        </div>
      ))}
    </div>
  )
}

function DataTable({ heads, rows }: { heads: string[]; rows: ReactNode[][] }) {
  return (
    <div data-anim className="overflow-x-auto rounded-2xl border border-black/10 shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="bg-black text-white">
            {heads.map((h, i) => (
              <th key={i} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] ${i === 0 ? 'text-[#FF2C03]' : 'text-white/70'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-black/[0.07] bg-white">
              {r.map((c, ci) => (
                <td key={ci} className={`px-4 py-3 align-top text-[13px] sm:text-sm ${ci === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Slides
 * -------------------------------------------------------------------------- */

const SLIDES: Slide[] = [
  // 1 — Capa
  {
    section: 'Capa',
    center: true,
    node: (
      <div className="text-center">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FF2C03] sm:text-xs">
          Estrutura organizacional · Responsabilidades · Indicadores
        </p>
        <h1
          data-anim
          className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.88] tracking-tight text-neutral-900 text-5xl sm:text-7xl lg:text-[6.5rem]"
        >
          Governança<br />
          Corporativa<br />
          <span className="text-[#FF2C03]">Somma Club</span>
        </h1>
        <p data-anim className="mx-auto mt-6 max-w-xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          Profissionalizar a operação sem perder a essência da comunidade.
        </p>
      </div>
    ),
  },

  // 2 — Divisor P1
  {
    section: '— Parte 1',
    node: <Divider part="Parte 1" title="Por que profissionalizar agora" sub="O Somma cresceu. A estrutura precisa crescer junto." />,
  },

  // 3 — Por que agora
  {
    section: 'Por que agora',
    node: (
      <>
        <Head k="01 · O momento" title="Por que estamos discutindo isso?" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel variant="dark" title="Somma de ontem" items={['Grupo de amigos', 'Boa vontade', 'Tudo passa pelos fundadores', 'Pouca clareza', 'Dependência de pessoas']} />
          <Panel variant="accent" title="Somma do futuro" items={['Organização', 'Responsabilidades claras', 'Autonomia', 'Escalabilidade', 'Novos negócios e receita previsível']} />
        </div>
        <div data-anim className="grid grid-cols-3 gap-2">
          {[['+5.000', 'membros cadastrados'], ['~400', 'recorrentes nos eventos'], ['9', 'áreas em operação']].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-gray-100 p-3 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#FF2C03] sm:text-3xl">{n}</p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-neutral-500">{l}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // 4 — O problema atual
  {
    section: 'O problema',
    node: (
      <>
        <Head k="02 · Diagnóstico" title="Hoje, tudo chega em uma pessoa" />
        <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['Marketing', 'Eventos', 'Patrocínios', 'Loja', 'Comunidade', 'Assessoria', 'Tecnologia', 'Atendimento'].map((s) => (
            <div key={s} className="rounded-xl border border-black/10 bg-gray-100 p-2.5 text-center text-[13px] font-semibold text-neutral-700">{s}</div>
          ))}
        </div>
        <Arrow />
        <div data-anim className="mx-auto w-full max-w-sm rounded-2xl bg-black p-4 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-white">
            Tudo chega em <span className="text-[#FF2C03]">Alexandre</span>
          </p>
        </div>
        <div data-anim className="flex flex-wrap justify-center gap-2">
          {['Sobrecarga', 'Dependência', 'Lentidão', 'Falta de clareza'].map((c) => (
            <span key={c} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">{c}</span>
          ))}
        </div>
      </>
    ),
  },

  // 5 — A visão futura
  {
    section: 'A visão futura',
    node: (
      <>
        <Head k="03 · O modelo" title="Duas frentes que se sustentam" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel variant="accent" title="Comunidade" items={['Propósito', 'Experiência', 'Cultura', 'Treinões', 'Relacionamento']} />
          <Panel variant="dark" title="Corporativo" items={['Receita', 'Patrocínios', 'Eventos', 'Assessoria', 'Loja · Tecnologia · Novos negócios']} />
        </div>
        <div data-anim className="rounded-2xl bg-gray-100 p-4 text-center">
          <p className="text-sm font-semibold text-neutral-700 sm:text-base">
            O <span className="text-[#FF2C03]">Corporativo</span> gera receita que <span className="font-bold">financia</span> a <span className="text-[#FF2C03]">Comunidade</span> — que continua gratuita e forte.
          </p>
        </div>
      </>
    ),
  },

  // 6 — Como organizações maduras funcionam (REDESENHADO)
  {
    section: 'Organizações maduras',
    node: (
      <>
        <Head k="04 · A referência" title="Como organizações maduras funcionam" sub="Quatro camadas — cada uma com um papel claro. No Somma, fica assim:" />
        <div className="space-y-2">
          {[
            { n: '01', t: 'Conselho', d: 'Direção e visão de longo prazo', who: 'Alexandre · João Victor · Diogo', w: 'sm:w-[64%]', tone: 'accent' },
            { n: '02', t: 'Estratégia', d: 'Para onde vamos e por quê', who: 'CEO', w: 'sm:w-[76%]', tone: 'dark' },
            { n: '03', t: 'Operação', d: 'Como fazemos acontecer', who: 'COO + Heads', w: 'sm:w-[88%]', tone: 'dark' },
            { n: '04', t: 'Execução', d: 'O dia a dia, na ponta', who: 'Coordenações e times', w: 'sm:w-full', tone: 'dark' },
          ].map((l) => (
            <div
              key={l.n}
              data-anim
              className={`mx-auto flex w-full items-center gap-3 rounded-2xl p-3.5 sm:gap-4 ${l.w} ${l.tone === 'accent' ? 'bg-[#FF2C03] text-white' : 'bg-black text-white'}`}
            >
              <span className="font-[family-name:var(--font-display)] text-2xl tabular-nums text-white/40">{l.n}</span>
              <div className="flex-1">
                <p className="font-[family-name:var(--font-display)] text-lg uppercase leading-none tracking-tight">{l.t}</p>
                <p className="text-[11px] text-white/60">{l.d}</p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold sm:block">{l.who}</span>
            </div>
          ))}
        </div>
        <Note>Ninguém faz tudo — e nada depende de uma pessoa só.</Note>
      </>
    ),
  },

  // 7 — Divisor P2
  {
    section: '— Parte 2',
    node: <Divider part="Parte 2" title="Organograma e papéis" sub="Quem faz o quê, com nome, missão, responsabilidades e KPIs." />,
  },

  // 8 — Organograma completo
  {
    section: 'Organograma',
    node: (
      <>
        <Head k="05 · A estrutura" title="O organograma do Somma" />
        <div className="space-y-2">
          <div data-anim className="rounded-2xl bg-black p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Conselho de Sócios</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-white">Alexandre · João Victor · Diogo</p>
          </div>
          <Arrow />
          <div data-anim className="mx-auto max-w-[16rem]"><Person name="Alexandre Alves" role="CEO" tone="ceo" /></div>
          <Arrow />
          <div data-anim className="mx-auto max-w-[16rem]"><Person name="Alex Rodrigues" role="COO" tone="coo" /></div>
          <Arrow />
          <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Person name="Camilla" role="Head Comercial e Parcerias" tone="head" />
            <Person name="Diogo" role="Head de Produto e Retail" tone="head" />
            <Person name="João Victor" role="Head de Conteúdo Visual" tone="head" />
            <Person name="Cristina" role="Coord. Comunicação" />
            <Person name="Yas" role="Coord. Eventos" />
            <Person name="Priscila" role="Coord. Atendimento e Operações" />
          </div>
          <div data-anim className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-dashed border-black/15 bg-gray-100 p-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Design · sob Comunicação</p>
              <p className="text-[13px] font-semibold text-neutral-700">Gustavo Firmino</p>
            </div>
            <div className="rounded-xl border border-dashed border-black/15 bg-gray-100 p-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Assessoria · Dir. Técnico Alexandre</p>
              <p className="text-[13px] font-semibold text-neutral-700">Professores: Joseph · Mateus</p>
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
        <RoleCard
          area="Direção do grupo"
          cargo="Conselho de Sócios"
          person="Alexandre · João Victor · Diogo"
          resp={['Definição da visão de longo prazo', 'Aprovação de novos sócios', 'Aprovação de investimentos', 'Aprovação de novos negócios', 'Aprovação do orçamento anual', 'Aprovação de projetos estratégicos']}
          kpis={['Crescimento anual da receita', 'Crescimento da comunidade', 'Resultado financeiro consolidado', 'Novos negócios lançados', 'Patrocínios estratégicos conquistados']}
        />
      </>
    ),
  },

  // 10 — CEO
  {
    section: 'CEO',
    node: (
      <>
        <Head k="06 · Liderança" title="CEO" />
        <RoleCard
          area="Executivo-chefe"
          cargo="CEO"
          person="Alexandre Alves"
          missao="Garantir a visão, cultura e crescimento sustentável do Somma."
          resp={['Liderança da comunidade', 'Relacionamento institucional', 'Cultura do Somma', 'Relacionamento com patrocinadores estratégicos', 'Aprovação das principais decisões', 'Representação oficial da marca', 'Coordenação geral dos treinões']}
          kpis={['Crescimento da comunidade', 'Participação média nos treinões', 'Retenção de membros', 'Nº de patrocinadores estratégicos', 'NPS da comunidade']}
        />
      </>
    ),
  },

  // 11 — COO
  {
    section: 'COO',
    node: (
      <>
        <Head k="06 · Liderança" title="COO" />
        <RoleCard
          area="Operações"
          cargo="COO"
          person="Alex Rodrigues"
          missao="Garantir que toda a operação corporativa funcione."
          resp={['Operação geral · Processos · Planejamento', 'Tecnologia e e-commerce', 'Assessoria', 'Indicadores e governança', 'Novos negócios', 'Integração entre áreas']}
          kpis={['Receita total do corporativo', 'Receita de assessoria, loja, eventos e mídia', 'Cumprimento de projetos e cronogramas', 'Margem operacional']}
        />
      </>
    ),
  },

  // 12 — Head Comercial
  {
    section: 'Head Comercial',
    node: (
      <>
        <Head k="07 · Heads" title="Head Comercial e Parcerias" />
        <RoleCard
          area="Receita"
          cargo="Head Comercial e Parcerias"
          person="Camilla"
          missao="Transformar audiência em receita."
          resp={['Prospecção comercial', 'Patrocínios e mídia', 'Parcerias', 'Relacionamento com empresas', 'Negociação de contratos']}
          kpis={['Receita gerada', 'Nº de reuniões realizadas', 'Nº de propostas enviadas', 'Taxa de conversão comercial', 'Valor do pipeline aberto', 'Nº de patrocinadores ativos']}
        />
      </>
    ),
  },

  // 13 — Head Retail
  {
    section: 'Head Retail',
    node: (
      <>
        <Head k="07 · Heads" title="Head de Produto e Retail" />
        <RoleCard
          area="Produto"
          cargo="Head de Produto e Retail"
          person="Diogo"
          missao="Transformar a marca Somma em produtos desejados."
          resp={['Desenvolvimento de produtos', 'Produção', 'Estoque', 'Loja Somma', 'Fornecedores', 'Tendências de mercado']}
          kpis={['Receita da loja', 'Margem dos produtos', 'Giro de estoque', 'Ticket médio', 'Nº de lançamentos', 'Ruptura de estoque']}
        />
      </>
    ),
  },

  // 14 — Head Conteúdo Visual
  {
    section: 'Head Conteúdo Visual',
    node: (
      <>
        <Head k="07 · Heads" title="Head de Conteúdo Visual" />
        <RoleCard
          area="Acervo visual"
          cargo="Head de Conteúdo Visual"
          person="João Victor"
          missao="Construir o acervo visual do Somma."
          resp={['Fotografia', 'Banco de imagens', 'Cobertura dos treinões', 'Cobertura dos eventos']}
          kpis={['Eventos fotografados', 'Fotos entregues por evento', 'Tempo de entrega', 'Atualização do banco de imagens']}
        />
      </>
    ),
  },

  // 15 — Coord Comunicação
  {
    section: 'Coord. Comunicação',
    node: (
      <>
        <Head k="08 · Coordenações" title="Coordenação de Comunicação" />
        <RoleCard
          area="Marca e conteúdo"
          cargo="Coordenação de Comunicação"
          person="Cristina"
          missao="Fortalecer a marca Somma através do conteúdo."
          resp={['Instagram e Stories', 'Calendário editorial', 'Influenciadores', 'Cobertura de eventos', 'Gestão do designer']}
          kpis={['Conteúdos publicados', 'Alcance mensal', 'Crescimento de seguidores', 'Taxa de engajamento', 'Cumprimento do calendário', 'Nº de colaborações']}
        />
      </>
    ),
  },

  // 16 — Design
  {
    section: 'Design',
    node: (
      <>
        <Head k="08 · Coordenações" title="Design" />
        <RoleCard
          area="Identidade visual · sob Comunicação"
          cargo="Design"
          person="Gustavo Firmino"
          missao="Garantir excelência visual em todos os pontos de contato da marca."
          resp={['Artes para redes sociais', 'Landing pages', 'Apresentações', 'Materiais para patrocinadores', 'Identidade visual']}
          kpis={['Prazo médio de entrega', 'Demandas entregues no prazo', 'Nº de materiais produzidos', 'Retrabalho por erro']}
        />
      </>
    ),
  },

  // 17 — Coord Eventos
  {
    section: 'Coord. Eventos',
    node: (
      <>
        <Head k="08 · Coordenações" title="Coordenação de Eventos" />
        <RoleCard
          area="Experiência"
          cargo="Coordenação de Eventos"
          person="Yas"
          missao="Garantir que os eventos aconteçam com excelência."
          resp={['Planejamento operacional', 'Cronogramas', 'Ativações', 'Fornecedores', 'Experiência dos participantes']}
          kpis={['Eventos realizados', 'Eventos entregues no prazo', 'Receita de eventos', 'Nº de participantes', 'NPS dos eventos', 'Custo por evento']}
        />
      </>
    ),
  },

  // 18 — Coord Atendimento
  {
    section: 'Coord. Atendimento',
    node: (
      <>
        <Head k="08 · Coordenações" title="Coordenação de Atendimento e Operações" />
        <RoleCard
          area="Relacionamento"
          cargo="Atendimento e Operações"
          person="Priscila"
          missao="Garantir organização e excelente atendimento aos membros."
          resp={['WhatsApp e atendimento', 'Agenda', 'Organização de reuniões', 'Comunicação operacional', 'Suporte aos participantes']}
          kpis={['Tempo médio de resposta', 'Taxa de resolução', 'Satisfação dos membros', 'Demandas resolvidas', 'Reuniões organizadas']}
        />
      </>
    ),
  },

  // 19 — Assessoria
  {
    section: 'Assessoria',
    node: (
      <>
        <Head k="09 · Técnico" title="Assessoria Somma" sub="A autoridade esportiva do Somma." />
        <RoleCard
          area="Performance"
          cargo="Direção Técnica"
          person="Alexandre"
          team="Professores: Joseph · Mateus"
          missao="Garantir a autoridade técnica e a evolução dos atletas."
          resp={['Metodologia de treino', 'Programas de evolução', 'Supervisão dos professores', 'Acompanhamento dos alunos', 'Conteúdo técnico']}
          kpis={['Alunos ativos', 'Receita recorrente mensal', 'Churn', 'Ticket médio', 'NPS dos alunos']}
        />
      </>
    ),
  },

  // 20 — Divisor P3
  {
    section: '— Parte 3',
    node: <Divider part="Parte 3" title="Unidades de negócio" sub="Cada unidade tem um responsável e indicadores próprios." />,
  },

  // 21 — Unidades de negócio
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
  {
    section: '— Parte 4',
    node: <Divider part="Parte 4" title="Como vamos operar" sub="Decisão, responsabilidade, indicadores e rituais." />,
  },

  // 23 — Princípio de responsabilidade
  {
    section: 'Princípio',
    node: (
      <>
        <Head k="11 · Cultura" title="Princípio de responsabilidade" />
        <Lead>Quem é responsável não executa tudo — mas responde pelo resultado.</Lead>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div data-anim className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Se der certo</p>
            <p className="mt-2 text-lg font-semibold text-neutral-800">O mérito é do time. 🎉</p>
          </div>
          <div data-anim className="rounded-2xl border-2 border-[#FF2C03]/40 bg-[#FF2C03]/[0.05] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">Se der errado</p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">A responsabilidade é do líder da área.</p>
          </div>
        </div>
      </>
    ),
  },

  // 24 — Modelo de decisão (RACI)
  {
    section: 'Modelo de decisão',
    node: (
      <>
        <Head k="12 · Decisão" title="Modelo de decisão (RACI)" />
        <div data-anim className="flex flex-wrap gap-2 text-[11px] font-semibold">
          {[['A', 'Aprova / decide'], ['R', 'Responsável / executa'], ['C', 'Consultado'], ['I', 'Informado / acompanha']].map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-neutral-600">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2C03] text-[9px] font-bold text-white">{k}</span>
              {v}
            </span>
          ))}
        </div>
        <DataTable
          heads={['Atividade', 'Decide (A)', 'Executa (R)', 'Consulta (C)', 'Acompanha (I)']}
          rows={[
            ['Fechar patrocínio', 'CEO', 'Comercial', 'Marketing', 'COO'],
            ['Produzir um evento', 'COO', 'Eventos', 'Comercial', 'CEO'],
            ['Gestão da loja', 'Head Retail', 'Retail', 'Comercial', 'COO'],
            ['Conteúdo & redes', 'Comunicação', 'Design / Conteúdo Visual', 'Marketing', 'COO'],
            ['Treino & metodologia', 'Dir. Técnico', 'Professores', '—', 'COO'],
          ]}
        />
      </>
    ),
  },

  // 25 — Metas financeiras (modelo)
  {
    section: 'Quem tem meta de receita',
    node: (
      <>
        <Head k="13 · Metas" title="Quem responde por receita — e quem não" sub="Não se cobra alguém por um número sobre o qual não tem controle direto." />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <div data-anim className="rounded-2xl border-2 border-[#FF2C03] bg-[#FF2C03]/[0.05] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">Metas de RECEITA</p>
            <p className="mt-1 text-[13px] text-neutral-500">Áreas que influenciam o faturamento.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Alexandre · CEO', 'Alex · COO', 'Camilla · Comercial', 'Diogo · Retail'].map((p) => (
                <span key={p} className="rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white">{p}</span>
              ))}
            </div>
          </div>
          <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Metas de EXECUÇÃO, QUALIDADE e PRAZO</p>
            <p className="mt-1 text-[13px] text-neutral-500">Medimos entrega — não faturamento.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Cristina', 'João Victor', 'Gustavo Firmino', 'Yas', 'Priscila'].map((p) => (
                <span key={p} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-neutral-700">{p}</span>
              ))}
            </div>
          </div>
        </div>
        <Note>Isso protege o time: cada pessoa é cobrada pelo que realmente controla.</Note>
      </>
    ),
  },

  // 26 — KPIs / dashboard com gráficos
  {
    section: 'KPIs · dashboard',
    node: (
      <>
        <Head k="14 · Indicadores" title="O Somma em números" />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="space-y-2">
            <p data-anim className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Comunidade · do cadastro ao recorrente</p>
            <Funnel
              items={[
                { label: 'membros cadastrados', value: '5.000', pct: 100, tone: 'dark' },
                { label: 'recorrentes nos eventos', value: '~400', pct: 55, tone: 'accent' },
              ]}
            />
          </div>
          <Bars
            title="Composição de receita do corporativo"
            note="Distribuição ilustrativa — a calibrar com dados reais."
            items={[
              { label: 'Assessoria', pct: 40, value: '40%' },
              { label: 'Loja', pct: 25, value: '25%' },
              { label: 'Eventos', pct: 20, value: '20%' },
              { label: 'Mídia e patrocínios', pct: 15, value: '15%' },
            ]}
          />
        </div>
      </>
    ),
  },

  // 27 — Quadro de KPIs por área
  {
    section: 'Quadro de KPIs',
    node: (
      <>
        <Head k="14 · Indicadores" title="Quadro de KPIs por área" />
        <DataTable
          heads={['Área', 'Indicadores principais', 'Responsável']}
          rows={[
            ['Comunidade', 'Participantes · NPS · retenção', 'Alexandre'],
            ['Assessoria', 'Alunos · MRR · churn · ticket', 'Alex'],
            ['Comercial', 'Receita · patrocínios · pipeline', 'Camilla'],
            ['Retail', 'Faturamento · margem · giro', 'Diogo'],
            ['Eventos', 'Receita · participantes · NPS', 'Yas + Alex'],
            ['Comunicação', 'Alcance · engajamento · calendário', 'Cristina'],
            ['Conteúdo Visual', 'Cobertura · entregas · prazo', 'João Victor'],
            ['Digital', 'Leads · conversão · uptime', 'Alex'],
          ]}
        />
      </>
    ),
  },

  // 28 — Ritual de reuniões
  {
    section: 'Ritual de reuniões',
    node: (
      <>
        <Head k="15 · Rotina" title="Ritual de reuniões" />
        <Tiles
          cols="sm:grid-cols-2 lg:grid-cols-4"
          items={[
            { emoji: '📅', t: 'Segunda', d: 'Reunião Corporativa — alinhar a semana das áreas.' },
            { emoji: '✅', t: 'Sexta', d: 'Reunião Operacional — resultados e ajustes.' },
            { emoji: '📈', t: 'Mensal', d: 'Reunião Estratégica — metas e prioridades.' },
            { emoji: '🏛️', t: 'Trimestral', d: 'Conselho — visão, expansão e decisões grandes.' },
          ]}
        />
      </>
    ),
  },

  // 29 — Evolução de carreira
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
            <div key={s.t} className={`flex items-center gap-3 rounded-xl border p-3 ${i === arr.length - 1 ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.05]' : 'border-black/10 bg-white shadow-sm'}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">{i + 1}</span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-neutral-900">{s.t}</p>
                <p className="text-[13px] text-neutral-500">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <Note>Critério é entrega e responsabilidade — não tempo de casa.</Note>
      </>
    ),
  },

  // 30 — O que NÃO estamos fazendo
  {
    section: 'O que NÃO é',
    node: (
      <>
        <Head k="17 · Tranquilizar" title="O que NÃO estamos fazendo" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {['Burocracia', 'Hierarquia excessiva', 'Tirar autonomia', 'Mudar a essência do Somma'].map((t) => (
            <div key={t} data-anim className="flex items-center gap-3 rounded-2xl bg-gray-100 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-sm font-bold text-white">✕</span>
              <span className="text-base font-semibold text-neutral-600">{t}</span>
            </div>
          ))}
        </div>
        <div data-anim className="rounded-2xl border-2 border-[#FF2C03] bg-[#FF2C03]/[0.06] p-5 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-neutral-900 sm:text-3xl">
            Estamos criando <span className="text-[#FF2C03]">clareza</span>.
          </p>
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
        <Tiles
          cols="sm:grid-cols-2 lg:grid-cols-3"
          items={[
            { icon: DollarSign, t: 'Mais receita', d: 'Frentes comerciais ativas e previsíveis.' },
            { icon: Building2, t: 'Mais organização', d: 'Cada coisa com um dono claro.' },
            { icon: Users, t: 'Menos dependência', d: 'O Somma não para sem os fundadores.' },
            { icon: TrendingUp, t: 'Mais crescimento', d: 'Estrutura pronta para escalar.' },
            { icon: Award, t: 'Mais profissionalismo', d: 'Marca forte perante parceiros.' },
            { icon: Heart, t: 'Mais impacto', d: 'Comunidade ainda mais forte.' },
          ]}
        />
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
            <div key={f} data-anim className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF2C03] text-xs font-bold text-white">{i + 1}</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">{f}</p>
              <p className="mt-0.5 text-sm font-semibold leading-tight text-neutral-900">{t}</p>
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
            <div key={n.t} className="rounded-xl border border-[#FF2C03]/30 bg-[#FF2C03]/[0.05] p-3 text-center">
              <span className="text-xl">{n.e}</span>
              <p className="mt-1 text-[13px] font-semibold text-neutral-800">{n.t}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // 34 — Finalização
  {
    section: 'Finalização',
    node: (
      <div className="-mx-5 -my-4 flex min-h-full flex-col justify-center bg-black px-6 py-12 text-center sm:-mx-10 sm:px-12">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF2C03] sm:text-xs">Finalização</p>
        <h2 data-anim className="mx-auto mt-5 max-w-4xl font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-white text-4xl sm:text-6xl lg:text-[4rem]">
          De comunidade<br />a <span className="text-[#FF2C03]">instituição</span>.
        </h2>
        <p data-anim className="mx-auto mt-7 max-w-2xl text-base font-medium leading-snug text-white/70 sm:text-xl">
          O Somma já tem o mais difícil: <span className="text-white">pessoas e propósito</span>. Agora ganha a estrutura para
          crescer sem depender de uma pessoa só — e durar.
        </p>
        <div data-anim className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
          {['Clareza', 'Responsabilidade', 'Indicadores', 'Crescimento'].map((c) => (
            <span key={c} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white">{c}</span>
          ))}
        </div>
      </div>
    ),
  },
]

export function PptCorporativoClient() {
  return (
    <Deck
      slides={SLIDES}
      brand={
        <>
          SOMMA <span className="text-[#FF2C03]">· Governança</span>
        </>
      }
    />
  )
}
