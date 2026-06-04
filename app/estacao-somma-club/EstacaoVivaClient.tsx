'use client'

import { useState, type ReactNode } from 'react'
import { Deck, O, type Slide } from './EstacaoClient'
import { Eye, Check, X } from 'lucide-react'

/* ----------------------------------------------------------------------------
 * Componentes interativos / didáticos (tema claro, linguagem simples)
 * -------------------------------------------------------------------------- */

function Chapter({ n, emoji, title, sub }: { n: string; emoji: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="space-y-3">
      <p data-anim className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#FF2C03] sm:text-xs">
        <span className="text-base">{emoji}</span> Capítulo {n}
      </p>
      <h2
        data-anim
        className="font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-neutral-900 text-3xl sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {sub && (
        <p data-anim className="max-w-2xl text-sm leading-snug text-neutral-600 sm:text-base lg:text-lg">
          {sub}
        </p>
      )}
    </header>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p data-anim className="text-lg font-medium leading-snug text-neutral-800 sm:text-2xl lg:text-[1.7rem]">
      {children}
    </p>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p data-anim className="text-sm leading-snug text-neutral-500 sm:text-base">
      {children}
    </p>
  )
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div data-anim className="rounded-2xl border border-[#FF2C03]/25 bg-[#FF2C03]/[0.06] p-4 sm:p-5">
      <p className="text-sm font-medium leading-snug text-neutral-800 sm:text-base">{children}</p>
    </div>
  )
}

/** Exemplo do dia a dia */
function Example({ children }: { children: ReactNode }) {
  return (
    <div data-anim className="flex gap-3 rounded-2xl border border-black/10 bg-neutral-50 p-4 sm:p-5">
      <span className="text-xl">💡</span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Exemplo</p>
        <p className="mt-1 text-sm leading-snug text-neutral-700 sm:text-base">{children}</p>
      </div>
    </div>
  )
}

/** Botão "toque para revelar" */
function Reveal({ prompt, children }: { prompt: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div data-anim>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-[#FF2C03]/40 bg-[#FF2C03]/[0.04] p-5 text-left transition hover:bg-[#FF2C03]/[0.09]"
        >
          <span className="text-base font-semibold text-neutral-700 sm:text-lg">{prompt}</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF2C03] px-3 py-1.5 text-xs font-bold text-white">
            <Eye className="h-3.5 w-3.5" /> revelar
          </span>
        </button>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">{children}</div>
      )}
    </div>
  )
}

/** Quiz de uma pergunta */
function Quiz({
  q,
  options,
  correct,
  explain,
}: {
  q: string
  options: string[]
  correct: number
  explain: ReactNode
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const show = picked !== null
  return (
    <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-base font-bold text-neutral-900 sm:text-lg">{q}</p>
      <div className="mt-4 grid gap-2">
        {options.map((opt, i) => {
          const isCorrect = i === correct
          return (
            <button
              key={i}
              disabled={show}
              onClick={() => setPicked(i)}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left text-sm font-medium transition sm:text-base ${
                show && isCorrect
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : show && i === picked
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-black/10 text-neutral-700 enabled:hover:border-[#FF2C03]/40'
              }`}
            >
              <span>{opt}</span>
              {show && isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
              {show && i === picked && !isCorrect && <X className="h-4 w-4 shrink-0 text-red-500" />}
            </button>
          )
        })}
      </div>
      {show && <p className="mt-4 text-sm leading-snug text-neutral-600 sm:text-base">{explain}</p>}
    </div>
  )
}

/** Alternar entre dois cenários (ex.: Antes / Depois) */
function Toggle({
  aLabel,
  bLabel,
  a,
  b,
}: {
  aLabel: string
  bLabel: string
  a: ReactNode
  b: ReactNode
}) {
  const [side, setSide] = useState<'a' | 'b'>('a')
  const pill = (on: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-bold transition ${on ? 'bg-[#FF2C03] text-white shadow' : 'text-neutral-500'}`
  return (
    <div data-anim>
      <div className="inline-flex rounded-full border border-black/10 bg-neutral-100 p-1">
        <button onClick={() => setSide('a')} className={pill(side === 'a')}>
          {aLabel}
        </button>
        <button onClick={() => setSide('b')} className={pill(side === 'b')}>
          {bLabel}
        </button>
      </div>
      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-5 text-base leading-snug text-neutral-700 shadow-sm sm:text-lg">
        {side === 'a' ? a : b}
      </div>
    </div>
  )
}

/** Abas clicáveis */
function Tabs({ tabs }: { tabs: { label: string; emoji?: string; body: ReactNode }[] }) {
  const [i, setI] = useState(0)
  return (
    <div data-anim>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
              i === idx
                ? 'border-[#FF2C03] bg-[#FF2C03] text-white'
                : 'border-black/10 bg-white text-neutral-600 hover:border-[#FF2C03]/40'
            }`}
          >
            {t.emoji && <span className="mr-1">{t.emoji}</span>}
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">{tabs[i].body}</div>
    </div>
  )
}

/** Ecossistema clicável — escolha uma vertical e veja como ela ganha dinheiro */
function EcoPicker({
  items,
}: {
  items: { emoji: string; name: string; head: string; body: string }[]
}) {
  const [sel, setSel] = useState(0)
  return (
    <div data-anim className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="grid gap-2">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
              i === sel ? 'border-[#FF2C03] bg-[#FF2C03]/[0.06]' : 'border-black/10 bg-white hover:border-[#FF2C03]/40'
            }`}
          >
            <span className="text-lg">{it.emoji}</span>
            <span className="text-sm font-semibold text-neutral-800 sm:text-base">{it.name}</span>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">{items[sel].head}</p>
        <p className="mt-2 text-base leading-snug text-neutral-800 sm:text-lg">{items[sel].body}</p>
      </div>
    </div>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div data-anim className="flex flex-wrap gap-2">
      {items.map((c, i) => (
        <span
          key={i}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm"
        >
          {c}
        </span>
      ))}
    </div>
  )
}

/** Grade de cartões simples com emoji */
function Tiles({ items }: { items: { emoji: string; t: string; d: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} data-anim className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
          <span className="text-2xl">{it.emoji}</span>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-neutral-900 sm:text-lg">
            {it.t}
          </h3>
          <p className="mt-1 text-[13px] leading-snug text-neutral-600 sm:text-sm">{it.d}</p>
        </div>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Slides
 * -------------------------------------------------------------------------- */

const SLIDES: Slide[] = [
  // 0 — Capa
  {
    section: 'Início',
    center: true,
    node: (
      <div className="text-center">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#FF2C03] sm:text-xs">
          A Estação SOMMA explicada de um jeito simples
        </p>
        <h1
          data-anim
          className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight text-neutral-900 text-6xl sm:text-8xl lg:text-[8rem]"
        >
          Estação<br />
          <span className="text-[#FF2C03]">SOMMA</span>
        </h1>
        <p data-anim className="mx-auto mt-6 max-w-xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          A história de como um grupo que corre virou algo muito maior — sem economês, com exemplos.
        </p>
        <p data-anim className="mt-9 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Use as setas ← → · 👀 tem partes pra tocar
        </p>
      </div>
    ),
  },

  // 1 — Quiz de abertura
  {
    section: 'O que é o SOMMA?',
    node: (
      <>
        <Chapter n="01" emoji="🤔" title="Primeiro, um quiz rápido" sub="Sem medo de errar — é só pra você sacar a ideia." />
        <Quiz
          q="O que é o SOMMA, na real?"
          options={[
            'Uma assessoria de corrida',
            'Um aplicativo de treino',
            'Uma comunidade que virou um mini-império de marca 😎',
          ]}
          correct={2}
          explain={
            <>
              É a terceira. O SOMMA <O>começou</O> como corrida, mas hoje é uma <O>comunidade</O> com várias frentes de
              negócio em volta. A corrida é só a porta de entrada.
            </>
          }
        />
      </>
    ),
  },

  // 2 — A grande virada
  {
    section: 'A grande virada',
    node: (
      <>
        <Chapter n="02" emoji="🚀" title="O SOMMA deixou de ser “um grupo que corre”" />
        <Lead>
          Ele virou uma <O>holding de comunidade e lifestyle</O>.
        </Lead>
        <Reveal prompt="O que é “holding de comunidade”? (toque)">
          <p className="text-base leading-snug text-neutral-700 sm:text-lg">
            É uma <strong>empresa que junta várias mini-empresas</strong> (chamadas de “verticais”) em volta de uma{' '}
            <strong>galera fiel</strong>. Tipo um grupo de amigos enorme que confia na marca — e cada parte do negócio
            conversa com essa mesma galera.
          </p>
        </Reveal>
        <Note>Isso muda tudo: o valor da marca, a conversa com investidores e o tamanho que o projeto pode alcançar.</Note>
      </>
    ),
  },

  // 3 — O ativo mais raro
  {
    section: 'O ativo raro',
    node: (
      <>
        <Chapter
          n="03"
          emoji="💎"
          title="O que o SOMMA tem é raríssimo: comunidade de verdade"
          sub="+5 mil pessoas cadastradas. Encontros de graça TODO sábado. No Parque da Cidade."
        />
        <Example>
          Sabe a diferença entre um influenciador com <strong>fãs de verdade</strong> e um com seguidores comprados? O
          SOMMA tem fãs de verdade — gente que aparece, chama os amigos e volta toda semana.
        </Example>
        <Toggle
          aLabel="Como quase todo mundo faz"
          bLabel="Como o SOMMA fez"
          a={
            <>
              Abre o espaço primeiro <span className="text-neutral-400">→</span> e <strong>torce</strong> pra aparecer
              gente. Gasta rios de dinheiro em anúncio pra atrair público.
            </>
          }
          b={
            <>
              Criou a <strong>galera primeiro</strong> <span className="text-neutral-400">→</span> e só agora vai criar o
              espaço. O público já existe. Isso é o <O>oposto do normal</O> — e reduz MUITO o risco.
            </>
          }
        />
      </>
    ),
  },

  // 4 — Várias formas de ganhar
  {
    section: 'Várias rendas',
    node: (
      <>
        <Chapter
          n="04"
          emoji="🧩"
          title="A mesma galera, várias formas de gerar valor"
          sub="A sacada genial: em vez de cobrar só uma coisa, o SOMMA monetiza a mesma comunidade por várias camadas. Toque pra explorar."
        />
        <EcoPicker
          items={[
            { emoji: '🏃', name: 'Somma Club', head: 'É a base / a distribuição', body: 'É o ponto de encontro de todo mundo. Tudo nasce daqui — é a “audiência” que alimenta o resto.' },
            { emoji: '🎬', name: 'Somma Mídia', head: 'Monetiza a ATENÇÃO', body: 'Vídeos, reels e conteúdo. As marcas pagam pra aparecer pra essa galera. Tipo um canal com público fiel.' },
            { emoji: '👕', name: 'Somma Retail', head: 'Monetiza o PERTENCIMENTO', body: 'Roupas e produtos da marca. Quem ama fazer parte quer vestir a camisa — literalmente.' },
            { emoji: '🎉', name: 'Somma Eventos', head: 'Monetiza a EXPERIÊNCIA', body: 'Corridas e ativações. Momentos que valem ingresso e atraem patrocínio.' },
            { emoji: '📈', name: 'Assessoria', head: 'Monetiza a TRANSFORMAÇÃO', body: 'Treino e evolução dos atletas. As pessoas pagam pra melhorar de verdade.' },
            { emoji: '🏠', name: 'Estação', head: 'Monetiza a PRESENÇA FÍSICA', body: 'Café, loja, lockers, experiências. Um lugar real onde tudo acontece todo dia.' },
          ]}
        />
      </>
    ),
  },

  // 5 — A Estação é o coração
  {
    section: 'O coração físico',
    node: (
      <>
        <Chapter
          n="05"
          emoji="❤️"
          title="A Estação SOMMA é o coração físico de tudo isso"
          sub="Não é “mais um cafezinho”. É a sede, o clubhouse, a casa da marca."
        />
        <Lead>É tipo a “casa do grupo” — todas as partes do SOMMA passam a viver ali dentro.</Lead>
        <Tiles
          items={[
            { emoji: '🏃', t: 'O Club', d: 'usa como base operacional dos encontros.' },
            { emoji: '🎬', t: 'A Mídia', d: 'ganha cenário e presença física pra gravar.' },
            { emoji: '👕', t: 'O Retail', d: 'ganha uma loja, um ponto de desejo e venda.' },
            { emoji: '🎉', t: 'Os Eventos', d: 'ganham um palco permanente.' },
            { emoji: '📈', t: 'A Assessoria', d: 'ganha experiência premium e retenção.' },
            { emoji: '✨', t: 'A Marca', d: 'finalmente vira “real”, palpável, visitável.' },
          ]}
        />
      </>
    ),
  },

  // 6 — O que muda quando vira físico
  {
    section: 'Virou real',
    node: (
      <>
        <Chapter n="06" emoji="🪄" title="O que acontece quando a marca ganha um lugar de verdade" />
        <Toggle
          aLabel="Hoje (só movimento)"
          bLabel="Com a Estação (instituição)"
          a={
            <>
              A comunidade existe <strong>em movimento</strong>: aparece no sábado e some. É forte, mas é “solta no ar”.
            </>
          }
          b={
            <>
              Com um espaço fixo: <strong>pertencimento ↑, retenção ↑, valor percebido ↑, ticket médio ↑</strong>. As
              marcas enxergam mais valor e os patrocinadores ficam mais interessados.
            </>
          }
        />
        <Callout>
          Você deixa de ser <strong>“grupo que corre”</strong> e vira <O>“movimento urbano”</O>. Essa é a virada.
        </Callout>
      </>
    ),
  },

  // 7 — O café é só consequência
  {
    section: 'O produto real',
    node: (
      <>
        <Chapter n="07" emoji="☕" title="Atenção: o café NÃO é o produto" />
        <Quiz
          q="Qual é o verdadeiro produto da Estação SOMMA?"
          options={['O café e o açaí', 'Os tênis e as roupas', 'A comunidade 🧡']}
          correct={2}
          explain={
            <>
              O café, a loja e o guarda-volumes são só o <O>apoio</O> à comunidade esportiva. O produto valioso é a{' '}
              <O>galera</O>. O resto é consequência dela existir.
            </>
          }
        />
        <Note>Por isso o erro fatal seria vender a ideia como “uma cafeteria”. Ela é a base de um movimento.</Note>
      </>
    ),
  },

  // 8 — Vale mais do que parece
  {
    section: 'Valor escondido',
    node: (
      <>
        <Chapter
          n="08"
          emoji="🏙️"
          title="Esse tipo de lugar vale muito mais do que parece"
          sub="Shoppings, parques, construtoras e cidades QUEREM um ativo assim por perto."
        />
        <Example>
          É tipo aquele “point” que todo mundo quer ter na esquina, porque <strong>atrai gente bacana o tempo todo</strong>.
          Quando tem movimento bom, o lugar inteiro fica mais valorizado.
        </Example>
        <p data-anim className="text-sm font-semibold uppercase tracking-widest text-neutral-400">O SOMMA gera:</p>
        <Chips
          items={[
            'fluxo de gente qualificado',
            'ocupação recorrente',
            'lifestyle aspiracional',
            'segurança passiva',
            'permanência',
            'conteúdo',
            'valor urbano',
          ]}
        />
      </>
    ),
  },

  // 9 — Pensa grande: é a PRIMEIRA
  {
    section: 'A primeira',
    node: (
      <>
        <Chapter n="09" emoji="📍" title="Não pense “a única”. Pense “a PRIMEIRA”." />
        <Lead>
          A Estação do Parque da Cidade é a <O>unidade nº 1</O> — não a unidade única.
        </Lead>
        <Example>
          É como a primeira loja de uma franquia que vai dar certo. Primeiro você prova que funciona num lugar, depois{' '}
          <strong>copia o modelo</strong> em vários.
        </Example>
        <Note>O modelo se repete em: parques, orlas, condomínios, clubes, shoppings e outras cidades — Águas Claras, Noroeste, Goiânia, São Paulo…</Note>
      </>
    ),
  },

  // 10 — A real sobre dinheiro
  {
    section: 'A real da grana',
    node: (
      <>
        <Chapter n="10" emoji="😅" title="Agora, a real sobre dinheiro" />
        <Reveal prompt="Como o SOMMA se sustenta hoje? (toque)">
          <p className="text-base leading-snug text-neutral-700 sm:text-lg">
            Hoje o SOMMA se segura no <O>propósito</O>, não no caixa. Tem 5 mil membros, eventos, patrocínio… e mesmo
            assim costuma “zerar” no fim do mês.
          </p>
        </Reveal>
        <Example>
          É tipo um canal que <strong>bombou de seguidores</strong> mas ainda não monetiza direito. O sucesso (o público)
          chegou antes da grana. Isso é super comum em comunidades fortes.
        </Example>
        <Callout>
          O problema: propósito move montanhas, mas <strong>não escala sozinho</strong>. Em algum momento, não pode
          depender só de gente se sacrificando — senão vira burnout.
        </Callout>
      </>
    ),
  },

  // 11 — A Estação vira o motor
  {
    section: 'Custo? Não. Motor.',
    node: (
      <>
        <Chapter
          n="11"
          emoji="⚙️"
          title="A Estação não é custo — é o motor que gera grana todo dia"
          sub="Hoje o SOMMA ganha em “picos” (um evento aqui, outro ali). A Estação cria receita contínua."
        />
        <p data-anim className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Rendas que rodam o ano todo:</p>
        <Chips
          items={[
            '☕ café e comida',
            '👕 loja',
            '🔐 lockers',
            '📣 ativações de marca',
            '🎉 eventos',
            '🎟️ memberships',
            '🌟 experiências premium',
            '📲 conteúdo patrocinado',
          ]}
        />
        <Note>Mais consumo recorrente, mais permanência, mais ticket médio. É o que transforma o movimento numa máquina sustentável.</Note>
      </>
    ),
  },

  // 12 — Como bancar sem se ferrar
  {
    section: 'Sem vacilar na grana',
    node: (
      <>
        <Chapter n="12" emoji="🛡️" title="Como bancar isso sem entregar o ouro" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div data-anim className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500">
              <X className="h-3.5 w-3.5" /> Erro 1
            </span>
            <p className="mt-2 text-base font-semibold leading-snug text-neutral-700 sm:text-lg">
              Fazer tudo sozinho, sem dinheiro. Lento e arriscado.
            </p>
          </div>
          <div data-anim className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500">
              <X className="h-3.5 w-3.5" /> Erro 2
            </span>
            <p className="mt-2 text-base font-semibold leading-snug text-neutral-700 sm:text-lg">
              Vender um pedaço do SOMMA inteiro agora. Tá <strong>barato demais</strong>!
            </p>
          </div>
        </div>
        <Callout>
          <strong className="text-[#FF2C03]">Jogada esperta:</strong> separar a Estação numa empresa só dela (uma “SPE”).
          É tipo abrir uma <strong>conta separada</strong> só pro projeto — capta dinheiro pra ele sem misturar nem
          arriscar a marca principal.
        </Callout>
      </>
    ),
  },

  // 13 — Comece pequeno e estiloso
  {
    section: 'Pequeno e estiloso',
    node: (
      <>
        <Chapter
          n="13"
          emoji="📦"
          title="A 1ª Estação não precisa ser gigante"
          sub="O objetivo no começo é só um: provar que a galera vem todo dia. Comece enxuto."
        />
        <Chips items={['modular', 'em container', 'enxuta', 'instagramável 📸', 'arquitetura forte', 'barata de operar']} />
        <Example>
          O Parque da Cidade <strong>já traz a galera de graça</strong>. Vocês não precisam pagar pra atrair público — ele
          já está lá. Isso derruba o risco lá embaixo.
        </Example>
      </>
    ),
  },

  // 14 — 3 jeitos de conseguir dinheiro
  {
    section: '3 jeitos de captar',
    node: (
      <>
        <Chapter n="14" emoji="💰" title="3 jeitos de conseguir o dinheiro" sub="Toque em cada um pra entender." />
        <Tabs
          tabs={[
            {
              label: 'Patrocínio âncora',
              emoji: '🤝',
              body: (
                <div className="space-y-2">
                  <p className="text-base font-semibold text-neutral-900 sm:text-lg">Uma marca paga e leva o nome.</p>
                  <p className="text-sm leading-snug text-neutral-600 sm:text-base">
                    Tipo <O>“Estação SOMMA powered by [marca]”</O>. Em troca de bancar parte da estrutura, ela ganha
                    naming, presença fixa e exclusividade. Pode financiar boa parte da obra.
                  </p>
                </div>
              ),
            },
            {
              label: 'Investidor que opera',
              emoji: '🧠',
              body: (
                <div className="space-y-2">
                  <p className="text-base font-semibold text-neutral-900 sm:text-lg">Alguém que entende do negócio.</p>
                  <p className="text-sm leading-snug text-neutral-600 sm:text-base">
                    Não “alguém com dinheiro” qualquer — alguém que manja de <strong>food, varejo e operação</strong> e
                    ajuda a rodar de verdade. Entra pelo posicionamento, não só pelo retorno.
                  </p>
                </div>
              ),
            },
            {
              label: 'A própria comunidade',
              emoji: '🧡',
              body: (
                <div className="space-y-2">
                  <p className="text-base font-semibold text-neutral-900 sm:text-lg">A galera ajuda a construir.</p>
                  <p className="text-sm leading-snug text-neutral-600 sm:text-base">
                    Membros founders, lockers premium, plano supporter, naming de espaços, drops exclusivos, “founders
                    wall”. É tipo uma <strong>vaquinha com recompensas</strong> — e comunidade forte AMA ajudar a erguer o
                    símbolo dela.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </>
    ),
  },

  // 15 — O papel do governo
  {
    section: 'O papel do GDF',
    node: (
      <>
        <Chapter n="15" emoji="🏛️" title="E o governo? Ele dá algo melhor que dinheiro" />
        <Quiz
          q="O que o GDF (governo do DF) entra dando, na prática?"
          options={['O dinheiro pra construir', 'A permissão pra operar oficialmente no parque 🔑', 'Os funcionários da Estação']}
          correct={1}
          explain={
            <>
              O governo dificilmente paga a obra. O que ele dá é <O>autorização, cessão da área, apoio e legitimidade</O>.
              O direito de operar oficialmente dentro do Parque da Cidade já vale uma fortuna.
            </>
          }
        />
        <Example>
          É tipo conseguir o <strong>lugar oficial pra fazer a festa</strong>. Sem essa permissão, nada acontece — com
          ela, o projeto inteiro destrava.
        </Example>
      </>
    ),
  },

  // 16 — Por que o governo vai gostar
  {
    section: 'Bom pra cidade',
    node: (
      <>
        <Chapter
          n="16"
          emoji="🌳"
          title="Por que o governo tende a gostar disso"
          sub="Porque resolve várias dores do parque ao mesmo tempo — de graça pra cidade."
        />
        <Callout>
          O argumento mais forte: <O>“Todo sábado a gente ativa o Parque da Cidade de graça pra milhares de pessoas.”</O>
        </Callout>
        <Tiles
          items={[
            { emoji: '🏃', t: 'Esporte grátis', d: 'incentivo à saúde da população.' },
            { emoji: '🛡️', t: 'Mais segurança', d: 'lugar ocupado e movimentado é mais seguro.' },
            { emoji: '✨', t: 'Mais vida', d: 'o parque fica mais usado e cuidado.' },
          ]}
        />
      </>
    ),
  },

  // 17 — Os 4 pilares
  {
    section: 'Os 4 pilares',
    node: (
      <>
        <Chapter n="17" emoji="🏗️" title="A Estação fica em pé sobre 4 pilares" />
        <Tiles
          items={[
            { emoji: '🤝', t: '1. Base Comunitária', d: 'ponto dos encontros, check-in, guarda-volumes, hidratação e convivência.' },
            { emoji: '☕', t: '2. Operação Comercial', d: 'café, snacks, açaí, recovery drinks e a loja SOMMA.' },
            { emoji: '📣', t: '3. Plataforma de Marca', d: 'ativações de patrocinadores, collabs, eventos e lançamentos.' },
            { emoji: '🎁', t: '4. Contrapartida Pública', d: 'eventos gratuitos, calendário esportivo e ocupação segura do parque.' },
          ]}

        />
      </>
    ),
  },

  // 18 — Referências do mundo
  {
    section: 'Inspirações',
    node: (
      <>
        <Chapter n="18" emoji="🌎" title="Imagina um misto dessas referências" sub="Mas com a cara democrática brasileira: todo mundo pode entrar." />
        <Tiles
          items={[
            { emoji: '🛋️', t: 'Soho House', d: 'o clube social descolado — só que do esporte urbano.' },
            { emoji: '🗽', t: 'Running hubs NY/Londres', d: 'pontos de encontro de corredores que viraram cultura.' },
            { emoji: '🏕️', t: 'Track&Field Experience', d: 'experiência de marca esportiva, numa versão mais simples.' },
          ]}
        />
        <Callout>
          A diferença do SOMMA: vocês criaram <O>pertencimento antes de monetizar</O>. Isso dá uma legitimidade que dinheiro
          nenhum compra.
        </Callout>
      </>
    ),
  },

  // 19 — Deixar "inevitável"
  {
    section: 'Tornar inevitável',
    node: (
      <>
        <Chapter
          n="19"
          emoji="🎯"
          title="Como fazer a ideia virar “inevitável”"
          sub="Hoje é só uma ideia falada. Com imagem e plano, vira real — e aí o dinheiro aparece."
        />
        <Tiles
          items={[
            { emoji: '📘', t: 'Brand book', d: 'material caprichado, com cara de projeto sério de cidade.' },
            { emoji: '🖼️', t: 'Renders', d: 'imagens do espaço. Muda totalmente a percepção.' },
            { emoji: '🗺️', t: 'Mapear a área', d: 'definir exatamente que pedaço do parque ocupar.' },
            { emoji: '📣', t: 'Narrativa', d: '“revitalização e ativação esportiva permanente”.' },
            { emoji: '🏛️', t: 'Entrar antes do edital', d: 'conversa institucional primeiro, papelada depois.' },
            { emoji: '📊', t: 'Números', d: 'comunidade, fluxo e potencial de receita na mão.' },
          ]}
        />
      </>
    ),
  },

  // 20 — O ecossistema (diagrama)
  {
    section: 'O ecossistema',
    node: (
      <>
        <Chapter n="20" emoji="🕸️" title="Juntando tudo: o ecossistema SOMMA" />
        <div data-anim className="space-y-3">
          <div className="rounded-2xl border border-black/10 bg-neutral-900 p-4 text-center">
            <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-white">Grupo SOMMA</p>
          </div>
          <div className="flex justify-center text-neutral-300">↓</div>
          <div className="rounded-2xl border border-[#FF2C03]/30 bg-[#FF2C03]/[0.06] p-4 text-center">
            <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-neutral-900">
              Somma Club <span className="text-neutral-400">· a audiência</span>
            </p>
          </div>
          <div className="flex justify-center text-neutral-300">↓</div>
          <div className="rounded-2xl border-2 border-[#FF2C03] bg-white p-4 text-center shadow-sm">
            <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-[#FF2C03]">
              ❤️ Estação SOMMA <span className="text-neutral-400">· o coração físico</span>
            </p>
          </div>
        </div>
        <Chips items={['Somma Mídia', 'Somma Retail', 'Somma Eventos', 'Assessoria', 'Patrocinadores']} />
      </>
    ),
  },

  // 21 — O maior risco
  {
    section: 'O maior risco',
    node: (
      <>
        <Chapter n="21" emoji="⚠️" title="O maior risco do SOMMA não é o que parece" />
        <Reveal prompt="Qual é o maior risco? (toque pra revelar)">
          <p className="text-lg font-semibold leading-snug text-neutral-900 sm:text-2xl">
            Não é falta de potencial. É <O>crescer pequeno demais</O> perto do tamanho do que vocês têm na mão.
          </p>
        </Reveal>
        <Callout>
          Por isso a Estação precisa nascer já com <strong>cara de marca icônica de Brasília</strong>. O ecossistema
          aguenta esse tamanho.
        </Callout>
      </>
    ),
  },

  // 22 — Equipamento urbano informal
  {
    section: 'Ativo institucional',
    node: (
      <>
        <Chapter
          n="22"
          emoji="🧱"
          title="Vocês já operam um “equipamento urbano informal”"
          sub="Os 5 mil membros não são número de vaidade — são um ativo institucional forte."
        />
        <p data-anim className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Porque vocês conseguem PROVAR:</p>
        <Chips
          items={[
            'recorrência',
            'engajamento',
            'ocupação organizada do parque',
            'impacto social contínuo',
            'audiência qualificada',
            'potencial turístico',
            'potencial econômico indireto',
          ]}
        />
        <Callout>
          Na prática, vocês já são um equipamento urbano — só que informal. A Estação é a <O>formalização física</O> disso.
        </Callout>
      </>
    ),
  },

  // 23 — A palavra certa (posicionamento)
  {
    section: 'A palavra certa',
    node: (
      <>
        <Chapter
          n="23"
          emoji="🎤"
          title="A palavra que você usa muda o jogo"
          sub="Como a Estação é apresentada decide se ela é levada a sério ou não."
        />
        <Toggle
          aLabel="❌ Não diga"
          bLabel="✅ Diga"
          a={
            <>
              “É uma <strong>cafeteria</strong> no parque.” — aí vira só mais um comércio querendo explorar espaço
              público.
            </>
          }
          b={
            <>
              <O>“Base operacional permanente de esporte, convivência e bem-estar do Parque da Cidade.”</O> — aí a
              conversa muda de nível.
            </>
          }
        />
        <Callout>
          Com essa frase, o café, a loja e o guarda-volumes viram <strong>infraestrutura de apoio</strong> à comunidade
          esportiva. Isso legitima MUITO mais a ocupação.
        </Callout>
      </>
    ),
  },

  // 24 — Comunidade transversal
  {
    section: 'Comunidade transversal',
    node: (
      <>
        <Chapter
          n="24"
          emoji="🔗"
          title="A corrida conecta vários mundos ao mesmo tempo"
          sub="Por isso a Estação é mais um “hub de lifestyle” do que um comércio comum."
        />
        <Chips
          items={['saúde', 'lifestyle', 'networking', 'turismo', 'marcas', 'consumo premium', 'bem-estar', 'experiência urbana']}
        />
        <Example>
          É tipo um lugar que ao mesmo tempo é academia, café, point dos amigos e palco de marca. Um comércio comum faz
          uma coisa só; a Estação cruza todas.
        </Example>
      </>
    ),
  },

  // 25 — O que pode virar
  {
    section: 'O que pode virar',
    node: (
      <>
        <Chapter n="25" emoji="🔮" title="E isso pode crescer pra MUITO além de um ponto" />
        <Tiles
          items={[
            { emoji: '🏢', t: 'Franquia de hubs', d: 'o mesmo modelo replicado em vários lugares.' },
            { emoji: '🏷️', t: 'Naming rights', d: 'marcas pagando pra dar nome a espaços.' },
            { emoji: '🏁', t: 'Corridas próprias', d: 'eventos proprietários do SOMMA.' },
            { emoji: '📲', t: 'App + assinatura', d: 'plataforma de comunidade com plano premium.' },
            { emoji: '🧊', t: 'Recovery / spa', d: 'recuperação esportiva como serviço.' },
            { emoji: '🏋️', t: 'Academia outdoor', d: 'treino ao ar livre + retail esportivo.' },
          ]}
        />
        <Note>
          Vocês já têm o mais difícil: <strong>distribuição orgânica e comunidade recorrente</strong>. A maioria das marcas
          tenta comprar isso com mídia — vocês já possuem.
        </Note>
      </>
    ),
  },

  // 26 — Fecho
  {
    section: 'Fecho',
    center: true,
    node: (
      <div className="max-w-4xl text-center">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#FF2C03] sm:text-xs">
          Resumindo tudo numa frase
        </p>
        <p
          data-anim
          className="mt-6 font-[family-name:var(--font-display)] uppercase leading-[1.0] tracking-tight text-neutral-900 text-3xl sm:text-5xl lg:text-[3.4rem]"
        >
          A Estação SOMMA não é um café no parque.
        </p>
        <p data-anim className="mx-auto mt-7 max-w-2xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          É a <O>casa de um movimento</O> — e o começo de algo que pode virar a <O>marca de lifestyle esportivo mais forte
          de Brasília</O>.
        </p>
      </div>
    ),
  },
]

export function EstacaoVivaClient() {
  return <Deck slides={SLIDES} />
}
