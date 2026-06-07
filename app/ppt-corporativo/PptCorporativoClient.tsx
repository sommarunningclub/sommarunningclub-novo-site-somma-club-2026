'use client'

import type { ReactNode } from 'react'
import { Deck, O, Head, Note, type Slide } from '../estacao-somma-club/EstacaoClient'
import {
  DollarSign, Building2, Users, TrendingUp, Award, Heart,
  Briefcase, Megaphone, PartyPopper, Store, Activity, Cpu, Handshake,
} from 'lucide-react'

/* ----------------------------------------------------------------------------
 * Componentes visuais (preto / branco / cinza F3F4F6 / laranja)
 * -------------------------------------------------------------------------- */

function Lead({ children }: { children: ReactNode }) {
  return (
    <p data-anim className="text-lg font-medium leading-snug text-neutral-800 sm:text-2xl lg:text-[1.7rem]">
      {children}
    </p>
  )
}

/** Painel com lista — variante escura, laranja ou neutra */
function Panel({
  title,
  items,
  variant = 'plain',
}: {
  title: string
  items: ReactNode[]
  variant?: 'dark' | 'accent' | 'plain'
}) {
  const dark = variant === 'dark'
  const accent = variant === 'accent'
  return (
    <div
      data-anim
      className={`rounded-2xl p-5 sm:p-6 ${
        dark
          ? 'bg-black text-white'
          : accent
            ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.05]'
            : 'border border-black/10 bg-white shadow-sm'
      }`}
    >
      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-[#FF2C03]'}`}>
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li
            key={i}
            className={`flex gap-2 text-sm leading-snug sm:text-base ${dark ? 'text-white/90' : 'text-neutral-700'}`}
          >
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
    <div className={`rounded-xl p-3 text-center ${cls}`}>
      <p
        className={`font-[family-name:var(--font-display)] text-sm uppercase tracking-tight sm:text-base ${
          tone === 'ceo' ? 'text-white' : 'text-neutral-900'
        }`}
      >
        {name}
      </p>
      <p className={`text-[11px] font-medium ${tone === 'ceo' ? 'text-white/80' : 'text-neutral-500'}`}>{role}</p>
    </div>
  )
}

function Arrow() {
  return <div className="flex justify-center text-base text-neutral-300">↓</div>
}

/** Tabela genérica com cabeçalho preto (scroll horizontal no mobile) */
function DataTable({ heads, rows }: { heads: string[]; rows: ReactNode[][] }) {
  return (
    <div data-anim className="overflow-x-auto rounded-2xl border border-black/10 shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="bg-black text-white">
            {heads.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] ${i === 0 ? 'text-[#FF2C03]' : 'text-white/70'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-black/[0.07] bg-white">
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 align-top text-[13px] sm:text-sm ${
                    ci === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600'
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-neutral-900">
            {t}
          </h3>
          <p className="mt-1 text-[13px] leading-snug text-neutral-600">{d}</p>
        </div>
      ))}
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
          Apresentação executiva · Sócios e Corporativo
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
          Estrutura para crescimento sustentável — profissionalizar a operação sem perder a essência da comunidade.
        </p>
      </div>
    ),
  },

  // 2 — Por que estamos discutindo isso
  {
    section: 'Por que agora',
    node: (
      <>
        <Head k="01 · O momento" title="Por que estamos discutindo isso?" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel
            variant="dark"
            title="Somma de ontem"
            items={['Grupo de amigos', 'Boa vontade', 'Tudo passa pelos fundadores', 'Pouca clareza', 'Dependência de pessoas']}
          />
          <Panel
            variant="accent"
            title="Somma do futuro"
            items={['Organização', 'Responsabilidades claras', 'Autonomia', 'Escalabilidade', 'Novos negócios e receita previsível']}
          />
        </div>
        <Note>Não é virar uma empresa fria. É ganhar clareza para crescer.</Note>
      </>
    ),
  },

  // 3 — O problema atual
  {
    section: 'O problema',
    node: (
      <>
        <Head k="02 · O diagnóstico" title="O problema atual: tudo chega em uma pessoa" />
        <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['Marketing', 'Eventos', 'Patrocínios', 'Loja', 'Comunidade', 'Assessoria', 'Tecnologia'].map((s) => (
            <div key={s} className="rounded-xl border border-black/10 bg-gray-100 p-2.5 text-center text-[13px] font-semibold text-neutral-700">
              {s}
            </div>
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
            <span key={c} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
              {c}
            </span>
          ))}
        </div>
      </>
    ),
  },

  // 4 — A visão futura
  {
    section: 'A visão futura',
    node: (
      <>
        <Head k="03 · O modelo" title="Duas frentes que se sustentam" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <Panel
            variant="accent"
            title="Comunidade"
            items={['Propósito', 'Experiência', 'Cultura', 'Treinões', 'Relacionamento']}
          />
          <Panel
            variant="dark"
            title="Corporativo"
            items={['Receita', 'Patrocínios', 'Eventos', 'Assessoria', 'Loja · Tecnologia · Novos negócios']}
          />
        </div>
        <div data-anim className="rounded-2xl bg-gray-100 p-4 text-center">
          <p className="text-sm font-semibold text-neutral-700 sm:text-base">
            O <span className="text-[#FF2C03]">Corporativo</span> gera receita que <span className="font-bold">financia</span> a{' '}
            <span className="text-[#FF2C03]">Comunidade</span> — que continua gratuita e forte.
          </p>
        </div>
      </>
    ),
  },

  // 5 — Como organizações maduras funcionam
  {
    section: 'Organizações maduras',
    node: (
      <>
        <Head k="04 · A referência" title="Como organizações maduras funcionam" />
        <div data-anim className="mx-auto flex max-w-2xl flex-col items-center gap-2">
          {[
            { t: 'Conselho', d: 'direção e visão de longo prazo', w: '55%', accent: true },
            { t: 'Estratégia', d: 'para onde vamos e por quê', w: '70%' },
            { t: 'Operação', d: 'como fazemos acontecer', w: '85%' },
            { t: 'Execução', d: 'o dia a dia, na ponta', w: '100%' },
          ].map((l, i) => (
            <div
              key={i}
              style={{ width: l.w }}
              className={`rounded-xl p-3 text-center ${l.accent ? 'bg-[#FF2C03]' : 'bg-black'} text-white`}
            >
              <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight sm:text-lg">{l.t}</p>
              <p className="text-[11px] text-white/60">{l.d}</p>
            </div>
          ))}
        </div>
        <Note>Cada camada tem um papel. Ninguém faz tudo — e nada depende de uma pessoa só.</Note>
      </>
    ),
  },

  // 6 — Estrutura proposta (organograma)
  {
    section: 'Organograma',
    node: (
      <>
        <Head k="05 · A proposta" title="Estrutura proposta para o Somma" />
        <div className="space-y-2">
          <div data-anim className="rounded-2xl bg-black p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Conselho de Sócios</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-white">
              Alexandre · João · Diogo
            </p>
          </div>
          <Arrow />
          <div data-anim className="mx-auto max-w-xs">
            <Person name="Alexandre" role="CEO" tone="ceo" />
          </div>
          <Arrow />
          <div data-anim className="mx-auto max-w-xs">
            <Person name="Alex Rodrigues" role="COO" tone="coo" />
          </div>
          <Arrow />
          <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Person name="Camilla" role="Head Comercial" tone="head" />
            <Person name="Diogo" role="Head Retail" tone="head" />
            <Person name="Cristina" role="Coord. Comunicação" tone="head" />
            <Person name="Yas" role="Coord. Eventos" tone="head" />
            <Person name="Priscila" role="Coord. Atendimento" tone="head" />
            <Person name="João" role="Coord. Conteúdo Visual" tone="head" />
          </div>
          <Arrow />
          <div data-anim className="mx-auto max-w-[12rem]">
            <Person name="Firmino" role="Designer" />
          </div>
        </div>
      </>
    ),
  },

  // 7 — Quem faz o quê
  {
    section: 'Quem faz o quê',
    node: (
      <>
        <Head k="06 · Papéis" title="Quem faz o quê?" />
        <DataTable
          heads={['Pessoa', 'Função', 'Responsabilidade principal', 'Resultado esperado']}
          rows={[
            ['Alexandre', 'CEO', 'Estratégia, captação e relações institucionais', 'Crescimento do ecossistema'],
            ['Alex Rodrigues', 'COO', 'Fazer a operação rodar no dia a dia', 'Operação previsível'],
            ['Camilla', 'Head Comercial', 'Receita, patrocínios e parcerias', 'Receita previsível'],
            ['Diogo', 'Head Retail', 'Loja, coleções e e-commerce', 'Faturamento e margem'],
            ['Cristina', 'Coord. Comunicação', 'Marca, conteúdo e redes', 'Comunidade crescendo'],
            ['Yas', 'Coord. Eventos', 'Produção e experiência dos eventos', 'Eventos memoráveis'],
            ['Priscila', 'Coord. Atendimento', 'Relacionamento e jornada do membro', 'Membros satisfeitos'],
            ['João', 'Coord. Conteúdo Visual', 'Vídeos e cobertura', 'Movimento virando mídia'],
            ['Firmino', 'Designer', 'Identidade e materiais visuais', 'Marca consistente'],
          ]}
        />
      </>
    ),
  },

  // 8 — Responsabilidades de cada área
  {
    section: 'Áreas',
    node: (
      <>
        <Head k="07 · As áreas" title="Responsabilidades de cada área" />
        <Tiles
          items={[
            { icon: Briefcase, t: 'Comercial', d: 'Receita, patrocínios, parcerias e novos negócios.' },
            { icon: Megaphone, t: 'Marketing', d: 'Marca, conteúdo, campanhas e crescimento.' },
            { icon: PartyPopper, t: 'Eventos', d: 'Produção, experiência e ativações.' },
            { icon: Store, t: 'Loja', d: 'Coleções, estoque, e-commerce e collabs.' },
            { icon: Activity, t: 'Assessoria', d: 'Metodologia, treino e evolução dos atletas.' },
            { icon: Cpu, t: 'Tecnologia', d: 'App, dados, CRM e automações.' },
            { icon: Handshake, t: 'Atendimento', d: 'Relacionamento, jornada e suporte ao membro.' },
            { icon: Heart, t: 'Comunidade', d: 'Cultura, treinões, insiders e pertencimento.' },
          ]}
        />
      </>
    ),
  },

  // 9 — O que muda na prática
  {
    section: 'O que muda',
    node: (
      <>
        <Head k="08 · A mudança" title="O que muda na prática?" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <div data-anim className="rounded-2xl bg-gray-100 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Hoje</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase leading-tight tracking-tight text-neutral-500 sm:text-3xl">
              “Eu ajudo quando consigo.”
            </p>
          </div>
          <div data-anim className="rounded-2xl border-2 border-[#FF2C03] bg-[#FF2C03]/[0.05] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">Futuro</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase leading-tight tracking-tight text-neutral-900 sm:text-3xl">
              “Eu sou responsável por essa área.”
            </p>
          </div>
        </div>
        <Note>Exemplos: a Comunicação passa a ter calendário e meta; o Comercial busca e fecha patrocínios — não espera aparecer.</Note>
      </>
    ),
  },

  // 10 — Modelo de decisão (RACI)
  {
    section: 'Modelo de decisão',
    node: (
      <>
        <Head k="09 · Decisão" title="Modelo de decisão (RACI simplificado)" />
        <div data-anim className="flex flex-wrap gap-2 text-[11px] font-semibold">
          {[
            ['A', 'Aprova / decide'],
            ['R', 'Responsável / executa'],
            ['C', 'Consultado'],
            ['I', 'Informado / acompanha'],
          ].map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-neutral-600">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2C03] text-[9px] font-bold text-white">
                {k}
              </span>
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
            ['Conteúdo & redes', 'Comunicação', 'Conteúdo Visual', 'Marketing', 'COO'],
            ['Treino & metodologia', 'Dir. Técnico', 'Assessoria', '—', 'COO'],
          ]}
        />
      </>
    ),
  },

  // 11 — KPIs do Somma (dashboard)
  {
    section: 'KPIs · dashboard',
    node: (
      <>
        <Head k="10 · Indicadores" title="KPIs do Somma" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { area: 'Comunidade', metrics: ['Participantes', 'NPS', 'Retenção'] },
            { area: 'Assessoria', metrics: ['Alunos', 'Receita', 'Churn'] },
            { area: 'Loja', metrics: ['Faturamento', 'Margem', 'Estoque'] },
            { area: 'Comercial', metrics: ['Receita', 'Patrocínios', 'Pipeline'] },
            { area: 'Eventos', metrics: ['Receita', 'Participantes', 'NPS'] },
          ].map((g) => (
            <div key={g.area} data-anim className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FF2C03]" />
                <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-neutral-900">
                  {g.area}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {g.metrics.map((m) => (
                  <div key={m} className="rounded-lg bg-gray-100 p-2 text-center">
                    <p className="text-[11px] font-semibold leading-tight text-neutral-600">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // 12 — KPIs por responsável
  {
    section: 'KPIs por responsável',
    node: (
      <>
        <Head k="11 · Metas" title="KPIs por responsável" />
        <DataTable
          heads={['Nome', 'Área', 'Indicadores', 'Meta', 'Periodicidade']}
          rows={[
            ['Camilla', 'Comercial', 'Receita · patrocínios · pipeline', '+10% / trim.', 'Mensal'],
            ['Diogo', 'Retail', 'Faturamento · margem · estoque', 'Margem > 50%', 'Mensal'],
            ['Cristina', 'Comunicação', 'Alcance · engajamento · novos membros', '+ a cada mês', 'Semanal'],
            ['Yas', 'Eventos', 'Participantes · NPS · receita', 'NPS > 80', 'Por evento'],
            ['Priscila', 'Atendimento', 'NPS · tempo de resposta · retenção', 'NPS > 80', 'Semanal'],
            ['João', 'Conteúdo Visual', 'Vídeos · alcance · cobertura', 'Calendário cheio', 'Semanal'],
            ['Alex Rodrigues', 'Operações', 'Recorrência · custo op. · NPS geral', 'Operação no verde', 'Mensal'],
          ]}
        />
        <Note>As metas acima são exemplos — devem ser calibradas pelo próprio time na Fase 3 do roadmap.</Note>
      </>
    ),
  },

  // 13 — Ritual de reuniões
  {
    section: 'Ritual de reuniões',
    node: (
      <>
        <Head k="12 · Rotina" title="Ritual de reuniões" />
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

  // 14 — Plano de evolução de carreira
  {
    section: 'Carreira',
    node: (
      <>
        <Head k="13 · Crescimento" title="Plano de evolução de carreira" />
        <div data-anim className="mx-auto flex max-w-xl flex-col gap-2">
          {[
            { t: 'Voluntário', d: 'ajuda, aprende e veste a camisa', n: 1 },
            { t: 'Coordenador', d: 'responde por uma frente com consistência', n: 2 },
            { t: 'Head', d: 'lidera uma área e suas metas', n: 3 },
            { t: 'Executivo', d: 'responde por receita e resultado do grupo', n: 4 },
            { t: 'Sócio', d: 'compartilha visão, risco e participação', n: 5 },
          ].map((s, i, arr) => (
            <div
              key={s.t}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                i === arr.length - 1 ? 'border-2 border-[#FF2C03] bg-[#FF2C03]/[0.05]' : 'border-black/10 bg-white shadow-sm'
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {s.n}
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-neutral-900">
                  {s.t}
                </p>
                <p className="text-[13px] text-neutral-500">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <Note>Critério é entrega e responsabilidade — não tempo de casa.</Note>
      </>
    ),
  },

  // 15 — O que NÃO estamos fazendo
  {
    section: 'O que NÃO é',
    node: (
      <>
        <Head k="14 · Tranquilizar" title="O que NÃO estamos fazendo" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {['Burocracia', 'Hierarquia excessiva', 'Tirar autonomia', 'Mudar a essência do Somma'].map((t) => (
            <div key={t} data-anim className="flex items-center gap-3 rounded-2xl bg-gray-100 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-sm font-bold text-white">
                ✕
              </span>
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

  // 16 — Benefícios esperados
  {
    section: 'Benefícios',
    node: (
      <>
        <Head k="15 · Resultado" title="Benefícios esperados" />
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

  // 17 — Roadmap
  {
    section: 'Roadmap',
    node: (
      <>
        <Head k="16 · Implementação" title="Roadmap de implementação" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          {[
            ['Fase 1', 'Definir estrutura'],
            ['Fase 2', 'Validar responsabilidades'],
            ['Fase 3', 'Definir KPIs'],
            ['Fase 4', 'Criar rituais'],
            ['Fase 5', 'Avaliação trimestral'],
          ].map(([f, t], i) => (
            <div key={f} data-anim className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF2C03] text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">{f}</p>
              <p className="mt-0.5 text-sm font-semibold leading-tight text-neutral-900">{t}</p>
            </div>
          ))}
        </div>
        <Note>Cada fase é leve e prática — feita junto com o time, não imposta de cima.</Note>
      </>
    ),
  },

  // 18 — Visão Somma 2030
  {
    section: 'Visão 2030',
    node: (
      <>
        <Head k="17 · O futuro" title="Visão Somma 2030" />
        <Lead>
          Ser a <O>maior comunidade de corrida e bem-estar do Centro-Oeste</O> — um ecossistema completo.
        </Lead>
        <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { e: '🧡', t: 'Comunidade' },
            { e: '🏃', t: 'Assessoria' },
            { e: '🎉', t: 'Eventos' },
            { e: '👕', t: 'Loja' },
            { e: '🤝', t: 'Patrocínios' },
            { e: '🏠', t: 'Estação Somma' },
            { e: '📲', t: 'Tecnologia' },
            { e: '🚀', t: 'Novos negócios' },
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
