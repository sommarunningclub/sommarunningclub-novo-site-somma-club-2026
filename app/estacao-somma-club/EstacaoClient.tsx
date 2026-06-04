'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import {
  ArrowLeft, ArrowRight, Maximize, Minimize, LayoutGrid, X,
  Store, Package, Users, Dumbbell, ShoppingBag, Megaphone, Landmark, Heart, Check,
} from 'lucide-react'

const SOMMA = '#FF2C03'

/* ----------------------------------------------------------------------------
 * Componentes de apresentação (tema claro institucional)
 * -------------------------------------------------------------------------- */

const O = ({ children }: { children: ReactNode }) => <span className="text-[#FF2C03]">{children}</span>

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p data-anim className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FF2C03] sm:text-xs">
      {children}
    </p>
  )
}

function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      data-anim
      className={`font-[family-name:var(--font-display)] uppercase leading-[0.95] tracking-tight text-neutral-900 text-3xl sm:text-4xl lg:text-5xl ${className}`}
    >
      {children}
    </h2>
  )
}

function Head({ k, title, sub }: { k: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="space-y-3">
      <Eyebrow>{k}</Eyebrow>
      <Title>{title}</Title>
      {sub && (
        <p data-anim className="max-w-2xl text-sm leading-snug text-neutral-600 sm:text-base lg:text-lg">
          {sub}
        </p>
      )}
    </header>
  )
}

/** Citação curta de impacto (Anton) */
function Pull({ children, cite }: { children: ReactNode; cite?: ReactNode }) {
  return (
    <blockquote data-anim className="border-l-4 border-[#FF2C03] pl-5 sm:pl-7">
      <p className="font-[family-name:var(--font-display)] uppercase leading-[1.02] tracking-tight text-neutral-900 text-2xl sm:text-4xl lg:text-[2.85rem]">
        {children}
      </p>
      {cite && <footer className="mt-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">{cite}</footer>}
    </blockquote>
  )
}

/** Narrativa longa (Barlow) — para os parágrafos institucionais */
function Narrative({ children, cite }: { children: ReactNode; cite?: ReactNode }) {
  return (
    <blockquote data-anim className="border-l-4 border-[#FF2C03] pl-5 sm:pl-7">
      <p className="text-lg font-medium leading-snug text-neutral-800 sm:text-2xl lg:text-[1.7rem]">{children}</p>
      {cite && <footer className="mt-5 text-xs font-semibold uppercase tracking-widest text-neutral-400">{cite}</footer>}
    </blockquote>
  )
}

/** Tabela de duas colunas com cabeçalho */
function Rows({ head, items }: { head: [string, string]; items: [string, string][] }) {
  return (
    <div data-anim className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] gap-3 bg-neutral-900 px-4 py-2.5 sm:px-6">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 sm:text-[10px]">{head[0]}</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FF2C03] sm:text-[10px]">{head[1]}</span>
      </div>
      <ul className="divide-y divide-black/[0.07]">
        {items.map(([a, b], i) => (
          <li key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
            <span className="text-[13px] font-semibold leading-tight text-neutral-900 sm:text-base">{a}</span>
            <span className="text-[13px] leading-snug text-neutral-600 sm:text-base">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type CardItem = { icon: typeof Store; t: string; d: string }
function CardsGrid({ items, cols = 'sm:grid-cols-2 lg:grid-cols-3' }: { items: CardItem[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${cols}`}>
      {items.map(({ icon: Icon, t, d }, i) => (
        <div
          key={i}
          data-anim
          className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:border-[#FF2C03]/40 hover:shadow-md sm:p-5"
        >
          <Icon className="h-5 w-5 text-[#FF2C03] sm:h-6 sm:w-6" strokeWidth={2} />
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-neutral-900 sm:text-lg">
            {t}
          </h3>
          <p className="mt-1 text-[13px] leading-snug text-neutral-600 sm:text-sm">{d}</p>
        </div>
      ))}
    </div>
  )
}

type Step = { a: string; o?: string }
function Steps({ items, cols = 'sm:grid-cols-2' }: { items: Step[]; cols?: string }) {
  return (
    <ol className={`grid grid-cols-1 gap-x-7 gap-y-2.5 ${cols}`}>
      {items.map((s, i) => (
        <li key={i} data-anim className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight text-neutral-900 sm:text-base">{s.a}</p>
            {s.o && <p className="text-xs leading-snug text-neutral-500 sm:text-sm">{s.o}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div data-anim className="rounded-2xl border border-[#FF2C03]/25 bg-[#FF2C03]/[0.06] p-4 sm:p-5">
      <p className="text-sm font-medium leading-snug text-neutral-800 sm:text-base">{children}</p>
    </div>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p data-anim className="text-sm leading-snug text-neutral-500 sm:text-base">
      {children}
    </p>
  )
}

/* ----------------------------------------------------------------------------
 * Dados
 * -------------------------------------------------------------------------- */

const AREAS: CardItem[] = [
  { icon: Store, t: 'Container principal', d: 'Café, lanches, açaí, bebidas, operação e loja SOMMA.' },
  { icon: Package, t: 'Guarda-volumes', d: 'Apoio aos corredores durante treinos e eventos.' },
  { icon: Users, t: 'Praça SOMMA', d: 'Espaço de convivência, encontro e permanência.' },
  { icon: Dumbbell, t: 'Área Evolve', d: 'Mobilidade, funcional, fortalecimento, alongamento e recovery.' },
  { icon: ShoppingBag, t: 'Área Decathlon', d: 'Teste de produtos, running lab, lançamentos e experiências.' },
  { icon: Megaphone, t: 'Área de patrocinadores', d: 'Ativações, sampling, ações de marca e eventos.' },
]

const ARQ: CardItem[] = [
  { icon: Users, t: 'SOMMA', d: 'Comunidade, operação, cultura e eventos.' },
  { icon: Landmark, t: 'GDF', d: 'Espaço público, autorização e legitimidade.' },
  { icon: Dumbbell, t: 'Evolve', d: 'Saúde, performance e preparação física.' },
  { icon: ShoppingBag, t: 'Decathlon', d: 'Equipamentos, produtos e democratização do esporte.' },
  { icon: Megaphone, t: 'Patrocinadores', d: 'Sustentabilidade financeira e ativações.' },
  { icon: Heart, t: 'Comunidade', d: 'Recorrência, pertencimento e validação.' },
]

const GDF_VALIDA: [string, string][] = [
  ['Interesse público', 'Encontros gratuitos, saúde, bem-estar, esporte e convivência.'],
  ['Capacidade operacional', 'Histórico de eventos, equipe corporativa e insiders.'],
  ['Sustentabilidade financeira', 'Café, loja, patrocínios, ativações e parceiros.'],
  ['Compatibilidade com o parque', 'Container leve, modular, integrado à natureza.'],
  ['Segurança jurídica', 'Projeto formal, termo de cooperação ou permissão de uso.'],
  ['Baixo risco político', 'Projeto gratuito, democrático e de impacto coletivo.'],
]

const CONTRAPARTIDAS: [string, string][] = [
  ['Corridas gratuitas semanais', 'Incentivo ao esporte'],
  ['Programação esportiva aberta', 'Saúde pública'],
  ['Ações de bem-estar', 'Prevenção e qualidade de vida'],
  ['Ocupação qualificada do parque', 'Mais uso e mais vida urbana'],
  ['Eventos comunitários', 'Integração social'],
  ['Presença organizada', 'Segurança passiva'],
  ['Cuidado com o entorno', 'Melhor conservação do espaço'],
  ['Parcerias com marcas', 'Menor dependência de verba pública'],
]

const ABORDAGEM: Step[] = [
  { a: 'Alinhar internamente a tese', o: 'Todos os sócios falando a mesma língua' },
  { a: 'Criar dossiê SOMMA', o: 'Provar comunidade, impacto e histórico' },
  { a: 'Criar masterplan da Estação', o: 'Estrutura, operação, contrapartidas e parceiros' },
  { a: 'Criar render conceitual', o: 'Tornar o projeto visual e tangível' },
  { a: 'Mapear exigências jurídicas', o: 'Permissão de uso, cooperação ou chamamento' },
  { a: 'Conversar com a Administração do Parque', o: 'Entender o caminho institucional correto' },
  { a: 'Conversar com a Secretaria de Esporte', o: 'Posicionar como projeto esportivo e urbano' },
  { a: 'Levar parceiros âncora', o: 'Evolve, Decathlon e patrocinadores dão credibilidade' },
  { a: 'Ajustar a proposta conforme orientação', o: 'Adaptar ao caminho indicado' },
  { a: 'Protocolar formalmente', o: 'Entrar com a documentação correta' },
]

const CONTAINER: [string, string][] = [
  ['Modular', 'Pode crescer em fases'],
  ['Reversível', 'Não parece ocupação definitiva agressiva'],
  ['Baixo impacto', 'Melhor para aprovação em área pública'],
  ['Instalação rápida', 'Menor complexidade de obra'],
  ['Visual moderno', 'Aumenta a percepção de qualidade'],
  ['Integrado ao verde', 'Pode preservar árvores e paisagem'],
]

const DECA_SOMMA: [string, string][] = [
  ['Todo mundo pode correr', 'Todo mundo pode praticar esporte'],
  ['Comunidade democrática', 'Produtos acessíveis'],
  ['Entrada no esporte', 'Democratização do esporte'],
  ['Movimento popular', 'Marca de massa'],
  ['Encontros recorrentes', 'Relacionamento contínuo'],
]

const DECA_GANHA: [string, string][] = [
  ['Relacionamento contínuo', 'O público encontra o SOMMA toda semana'],
  ['Teste real de produtos', 'Experimentar tênis, roupas e acessórios correndo'],
  ['Aquisição de clientes', 'Muitos membros estão começando no esporte'],
  ['Posicionamento local', 'Marca ligada ao maior movimento de corrida de Brasília'],
  ['Conteúdo orgânico', 'Ativações geram vídeos, fotos, reviews e depoimentos'],
  ['Vendas indiretas', 'A experiência aumenta a intenção de compra'],
  ['Dados e aprendizado', 'Comportamento real do corredor iniciante'],
  ['Marca com propósito', 'Democratização do esporte na prática'],
]

const RUNNING_LAB: [string, string][] = [
  ['Teste de tênis', 'Membro testa no treino e devolve após a corrida'],
  ['Teste de vestuário', 'Camisetas, shorts, viseiras, mochilas e acessórios'],
  ['Lançamentos', 'Apresentação de novas linhas de corrida'],
  ['Desafios', 'Corridas com check-in e premiações'],
  ['Reviews reais', 'Corredores gravam opiniões após o uso'],
  ['Cupons', 'Benefícios exclusivos para membros SOMMA'],
]

const PRIMEIRO_TENIS: Step[] = [
  { a: 'Pessoa chega ao SOMMA' },
  { a: 'Faz check-in gratuito' },
  { a: 'Recebe orientação básica para começar' },
  { a: 'Conhece produtos acessíveis da Decathlon' },
  { a: 'Participa do treino' },
  { a: 'Ganha cupom ou condição especial' },
  { a: 'Entra na comunidade' },
]

const SELECAO: [string, string][] = [
  ['Iniciante', 'Tênis acessível, camiseta dry, garrafa'],
  ['Corrida', 'Meia, boné, pochete, manguito'],
  ['Caminhada', 'Roupas leves, viseira, mochila'],
  ['Hidratação', 'Squeeze, isotônicos, acessórios'],
  ['Recovery', 'Rolo, elástico, massageador'],
]

const SOMMA_GANHA: [string, string][] = [
  ['Credibilidade', 'A marca global aumenta o peso institucional'],
  ['Estrutura', 'Mobiliário, equipamentos e produtos'],
  ['Receita', 'Patrocínio, ativações, comissões ou campanhas'],
  ['Experiência', 'Mais valor para os membros no encontro'],
  ['Conteúdo', 'Testes e ativações geram mídia'],
  ['Força com o GDF', 'Projeto com marcas fortes parece mais estruturado'],
  ['Demanda', 'Produtos e experiências aumentam a permanência'],
]

const EVOLVE: [string, string][] = [
  ['Mobilidade', 'Preparação antes dos treinos'],
  ['Alongamento', 'Pós-treino e prevenção'],
  ['Funcional', 'Fortalecimento geral'],
  ['Recovery', 'Recuperação'],
  ['Prevenção de lesões', 'Educação e suporte'],
  ['Avaliações', 'Geração de leads para a academia'],
]

const PITCH: [string, string][] = [
  ['Sócios', 'Vamos transformar comunidade em instituição física'],
  ['Time corporativo', 'A Estação é a casa da comunidade que vocês ajudaram a criar'],
  ['GDF', 'Amplia saúde, esporte e convivência sem depender de verba pública'],
  ['Evolve', 'Liderem a camada de performance e saúde do maior movimento de corrida do DF'],
  ['Decathlon', 'Sejam a marca que democratiza a corrida com uma comunidade real'],
  ['Patrocinadores', 'Saiam de eventos pontuais para uma plataforma recorrente'],
]

const EXECUCAO: Step[] = [
  { a: 'Reunião interna dos sócios', o: 'Alinhar visão e narrativa' },
  { a: 'Criar dossiê SOMMA', o: 'Organizar números e histórico' },
  { a: 'Criar masterplan da Estação', o: 'Detalhar conceito, áreas e operação' },
  { a: 'Criar renders', o: 'Materializar visualmente o projeto' },
  { a: 'Conversar com a Evolve', o: 'Validar parceira âncora já existente' },
  { a: 'Conversar com a Decathlon', o: 'Validar parceira estratégica' },
  { a: 'Ajustar proposta com parceiros', o: 'Fortalecer a tese antes do GDF' },
  { a: 'Conversa com a Administração do Parque', o: 'Entender o caminho institucional' },
  { a: 'Reunião com a Secretaria de Esporte', o: 'Posicionar como interesse público' },
  { a: 'Mapear exigências legais', o: 'Evitar erros de protocolo' },
  { a: 'Formalizar pedido ou cooperação', o: 'Entrar pelo caminho correto' },
  { a: 'Estruturar captação', o: 'Fechar parceiros e investimento' },
  { a: 'Implantar piloto', o: 'Começar modular e escalável' },
]

const CONCL: [string, string][] = [
  ['Para o GDF', 'Projeto de interesse público.'],
  ['Para a Decathlon', 'Plataforma viva de democratização do esporte.'],
  ['Para a Evolve', 'Centro outdoor de performance e saúde.'],
  ['Para o SOMMA', 'A casa física da comunidade.'],
]

/* ----------------------------------------------------------------------------
 * Slides
 * -------------------------------------------------------------------------- */

type Slide = { section: string; node: ReactNode; center?: boolean }

const SLIDES: Slide[] = [
  // 0 — Capa
  {
    section: 'Capa',
    center: true,
    node: (
      <div className="text-center">
        <Eyebrow>Resumo técnico do projeto · Parque da Cidade — Brasília/DF</Eyebrow>
        <h1
          data-anim
          className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight text-neutral-900 text-6xl sm:text-8xl lg:text-[8.5rem]"
        >
          Estação<br />
          <span className="text-[#FF2C03]">SOMMA</span>
        </h1>
        <p data-anim className="mx-auto mt-6 max-w-2xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          A primeira base permanente de esporte, saúde, bem-estar e convivência urbana do Parque da Cidade.
        </p>
        <p data-anim className="mt-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
          Use as setas ← → para navegar
        </p>
      </div>
    ),
  },

  // 1 — Tese central
  {
    section: 'A tese central',
    node: (
      <>
        <Eyebrow>01 · A tese central</Eyebrow>
        <p data-anim className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
          A forma correta de posicionar o projeto:
        </p>
        <Narrative>
          A Estação SOMMA será a <O>primeira base permanente</O> de esporte, saúde, bem-estar e convivência urbana do
          Parque da Cidade, sustentada por uma <O>operação comercial leve</O> e por <O>parceiros estratégicos</O>.
        </Narrative>
        <div data-anim className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['+5 mil', 'membros cadastrados'],
            ['Todo sábado', 'encontros gratuitos'],
            ['Parque da Cidade', 'presença consolidada'],
          ].map(([n, l]) => (
            <div key={l} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#FF2C03] sm:text-3xl">
                {n}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-500 sm:text-sm">{l}</p>
            </div>
          ))}
        </div>
        <Note>
          O SOMMA já possui o ativo mais difícil — comunidade. A Estação nasce para dar estrutura física a algo que já
          acontece organicamente.
        </Note>
      </>
    ),
  },

  // 2 — O que vamos construir
  {
    section: 'O hub',
    node: (
      <>
        <Head
          k="02 · O que vamos construir"
          title="Um micro hub modular, leve e de baixo impacto"
          sub="Estrutura permanente para uma comunidade que já ocupa o parque de forma organizada — não um ponto comercial."
        />
        <CardsGrid items={AREAS} />
      </>
    ),
  },

  // 3 — Como convencer o GDF
  {
    section: 'GDF · posição',
    node: (
      <>
        <Head k="03 · Como convencer o GDF" title="Pedir espaço ou oferecer solução" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <div data-anim className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500">
              <X className="h-3.5 w-3.5" /> O erro
            </span>
            <p className="mt-3 text-lg font-semibold leading-snug text-neutral-700 sm:text-xl">
              “Queremos abrir um café no Parque da Cidade.”
            </p>
            <p className="mt-3 text-sm text-neutral-500">Coloca o SOMMA na categoria de qualquer operador comercial.</p>
          </div>
          <div data-anim className="rounded-2xl border border-[#FF2C03]/30 bg-[#FF2C03]/[0.06] p-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#FF2C03]">
              <Check className="h-3.5 w-3.5" /> A abordagem correta
            </span>
            <p className="mt-3 text-lg font-semibold leading-snug text-neutral-900 sm:text-xl">
              “O SOMMA já realiza uma das maiores ativações esportivas gratuitas recorrentes do DF. Queremos estruturar
              uma base permanente para ampliar esse impacto.”
            </p>
          </div>
        </div>
        <Note>
          No primeiro caso, o SOMMA <strong className="font-semibold text-neutral-700">pede espaço</strong>. No segundo,{' '}
          <strong className="font-semibold text-neutral-700">oferece uma solução para a cidade</strong>.
        </Note>
      </>
    ),
  },

  // 4 — O que o GDF precisa validar
  {
    section: 'GDF · validação',
    node: (
      <>
        <Head k="04 · O que o GDF precisa validar" title="Seis pontos de avaliação" />
        <Rows head={['O que o GDF avalia', 'Como o SOMMA responde']} items={GDF_VALIDA} />
      </>
    ),
  },

  // 5 — Narrativa institucional
  {
    section: 'Narrativa institucional',
    node: (
      <>
        <Eyebrow>05 · A principal narrativa institucional</Eyebrow>
        <Pull cite="A frase que guia a conversa com o governo">
          A operação comercial financia um projeto comunitário gratuito de interesse público.
        </Pull>
        <Callout>
          <strong className="font-bold">Objeção:</strong> por que permitir uma operação privada em espaço público?{' '}
          <strong className="font-bold text-[#FF2C03]">Resposta:</strong> porque ela viabiliza contrapartidas públicas
          recorrentes, gratuitas e organizadas.
        </Callout>
      </>
    ),
  },

  // 6 — Contrapartidas públicas
  {
    section: 'Contrapartidas',
    node: (
      <>
        <Head
          k="06 · Contrapartidas públicas"
          title="O que a cidade recebe"
          sub="Benefícios que a população recebe em troca da possibilidade de uso do espaço."
        />
        <Rows head={['Contrapartida', 'Benefício para o GDF']} items={CONTRAPARTIDAS} />
        <Note>O SOMMA já entrega parte disso hoje, sem custo. A Estação institucionaliza, organiza e amplia o impacto.</Note>
      </>
    ),
  },

  // 7 — Como abordar o GDF na prática
  {
    section: 'Abordagem',
    node: (
      <>
        <Head k="07 · Como abordar o GDF na prática" title="Dez passos — começando pelo entendimento" />
        <Steps items={ABORDAGEM} />
        <Callout>
          A primeira reunião não é de pedido. É de entendimento: “Estamos estruturando um projeto permanente de esporte,
          saúde e convivência para o Parque da Cidade e gostaríamos de entender o melhor caminho institucional para
          viabilizá-lo junto ao GDF.”
        </Callout>
      </>
    ),
  },

  // 8 — A importância do container
  {
    section: 'Container',
    node: (
      <>
        <Head
          k="08 · A importância do container"
          title="A tecnologia construtiva — não o produto"
          sub="O produto é a Estação SOMMA. O container é apenas o meio."
        />
        <Rows head={['Característica', 'Valor institucional']} items={CONTAINER} />
        <Callout>
          A linguagem ideal não é “container”. É: <O>estrutura modular leve, reversível e integrada ao parque</O>.
        </Callout>
      </>
    ),
  },

  // 9 — O papel da Decathlon
  {
    section: 'Decathlon',
    node: (
      <>
        <Head
          k="09 · O papel da Decathlon"
          title="Público democrático encontra marca de massa"
          sub="O público do SOMMA é democrático, com forte presença de classe C, D e classe média — pessoas comuns entrando no esporte."
        />
        <Rows head={['SOMMA', 'Decathlon']} items={DECA_SOMMA} />
        <Note>A Decathlon não ganha apenas exposição. Ela ganha acesso a uma comunidade viva.</Note>
      </>
    ),
  },

  // 10 — O que a Decathlon ganha
  {
    section: 'Decathlon · ganhos',
    node: (
      <>
        <Head k="10 · O que a Decathlon ganha" title="Oito ganhos concretos" />
        <Rows head={['Ganho', 'Explicação']} items={DECA_GANHA} />
        <Callout>
          A tese não é “patrocine o SOMMA”. É: <O>vamos construir juntos o principal hub democrático de esporte, corrida
          e bem-estar de Brasília</O>.
        </Callout>
      </>
    ),
  },

  // 11 — Running Lab
  {
    section: 'Running Lab',
    node: (
      <>
        <Head
          k="11 · Ideias práticas · Decathlon Running Lab"
          title="Experimentação de produtos na Estação"
          sub="Um espaço dentro da Estação para testar produtos em uso real."
        />
        <Rows head={['Ativação', 'Como funciona']} items={RUNNING_LAB} />
      </>
    ),
  },

  // 12 — Primeiro Tênis
  {
    section: 'Primeiro Tênis',
    node: (
      <>
        <Head
          k="11 · Ideias práticas · Programa Primeiro Tênis"
          title="A jornada de quem está começando"
          sub="Uma iniciativa para quem quer começar a correr — conversa direta com a democratização do esporte."
        />
        <Steps items={PRIMEIRO_TENIS} />
      </>
    ),
  },

  // 13 — Seleção
  {
    section: 'Seleção by Decathlon',
    node: (
      <>
        <Head
          k="11 · Ideias práticas · Seleção SOMMA by Decathlon"
          title="Curadoria, não mini-loja"
          sub="Não transformar a Estação numa mini Decathlon. Poucos produtos, bem escolhidos."
        />
        <Rows head={['Categoria', 'Exemplos']} items={SELECAO} />
        <Note>A curadoria reforça confiança.</Note>
      </>
    ),
  },

  // 14 — Como o SOMMA ganha com a Decathlon
  {
    section: 'SOMMA + Decathlon',
    node: (
      <>
        <Head k="12 · Como o SOMMA ganha com a Decathlon" title="Sete ganhos para o SOMMA" />
        <Rows head={['Ganho para o SOMMA', 'Explicação']} items={SOMMA_GANHA} />
        <Callout>
          SOMMA sozinho é um movimento. <O>SOMMA + Evolve + Decathlon é um ecossistema</O>.
        </Callout>
      </>
    ),
  },

  // 15 — O papel da Evolve
  {
    section: 'Evolve',
    node: (
      <>
        <Head
          k="13 · O papel da Evolve"
          title="Evolve Outdoor Performance Center"
          sub="A parceira âncora já existente. Não “academia no parque” — um espaço para complementar a corrida."
        />
        <Rows head={['Área', 'Função']} items={EVOLVE} />
        <Note>Para o GDF, a narrativa é “centro de promoção de saúde”, não “academia privada”.</Note>
      </>
    ),
  },

  // 16 — Arquitetura de parceria
  {
    section: 'Arquitetura',
    node: (
      <>
        <Head
          k="14 · Arquitetura de parceria"
          title="De movimento a ecossistema"
          sub="Cada parceiro com um papel claro transforma o projeto numa solução urbana colaborativa."
        />
        <CardsGrid items={ARQ} />
      </>
    ),
  },

  // 17 — Pitch para cada público
  {
    section: 'Pitch por público',
    node: (
      <>
        <Head k="15 · Pitch para cada público" title="Uma mensagem para cada interlocutor" />
        <Rows head={['Público', 'Mensagem principal']} items={PITCH} />
      </>
    ),
  },

  // 18 — Narrativa GDF
  {
    section: 'Narrativa · GDF',
    node: (
      <>
        <Head k="16 · Exemplo de narrativa para o GDF" title="Como vender ao governo" />
        <Narrative cite="Narrativa institucional">
          “O SOMMA já reúne milhares de pessoas no Parque da Cidade em atividades gratuitas, organizadas e recorrentes. A
          Estação SOMMA nasce para dar infraestrutura a esse movimento, ampliando o acesso da população ao esporte, à
          saúde e à convivência urbana. A operação comercial de alimentação, loja e parcerias será o mecanismo de
          sustentabilidade financeira para manter uma programação pública gratuita, segura e permanente.”
        </Narrative>
      </>
    ),
  },

  // 19 — Narrativa Decathlon
  {
    section: 'Narrativa · Decathlon',
    node: (
      <>
        <Head k="17 · Exemplo de narrativa para a Decathlon" title="A missão ganha vida" />
        <Narrative cite="Narrativa de parceria">
          “A Decathlon tem como missão tornar o esporte acessível. O SOMMA já construiu uma comunidade democrática de
          corrida, formada por pessoas comuns que querem se movimentar, melhorar sua saúde e pertencer a algo maior. A
          Estação SOMMA pode ser o ponto físico onde essa missão ganha vida em Brasília, com experimentação de produtos,
          running lab, desafios, conteúdo e relacionamento direto com milhares de potenciais consumidores.”
        </Narrative>
      </>
    ),
  },

  // 20 — Narrativa Evolve
  {
    section: 'Narrativa · Evolve',
    node: (
      <>
        <Head k="18 · Exemplo de narrativa para a Evolve" title="De patrocínio a presença física" />
        <Narrative cite="Narrativa de parceria">
          “A Evolve já é a principal parceira do SOMMA. A Estação representa a oportunidade de transformar essa parceria
          em presença física e experiência de marca. Em vez de apenas patrocinar o movimento, a Evolve pode liderar a
          camada de saúde, mobilidade, fortalecimento e performance da comunidade, criando um centro outdoor de promoção
          da saúde dentro do Parque da Cidade.”
        </Narrative>
      </>
    ),
  },

  // 21 — Ordem de execução
  {
    section: 'Execução',
    node: (
      <>
        <Head k="19 · Ordem recomendada de execução" title="Treze passos até o piloto" />
        <Steps items={EXECUCAO} cols="sm:grid-cols-2 lg:grid-cols-3" />
      </>
    ),
  },

  // 22 — Conclusão
  {
    section: 'Conclusão',
    node: (
      <>
        <Head k="20 · Conclusão estratégica" title="De movimento a instituição" />
        <Narrative>
          O SOMMA já construiu o ativo mais difícil: <O>pessoas</O>. A Estação é a próxima fase — transforma um movimento
          em instituição.
        </Narrative>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CONCL.map(([t, d]) => (
            <div key={t} data-anim className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">{t}</p>
              <p className="mt-1.5 text-base font-semibold leading-snug text-neutral-800 sm:text-lg">{d}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // 23 — Frase final
  {
    section: 'Fecho',
    center: true,
    node: (
      <div className="max-w-4xl text-center">
        <Eyebrow>A frase que resume tudo</Eyebrow>
        <p
          data-anim
          className="mt-6 font-[family-name:var(--font-display)] uppercase leading-[1.0] tracking-tight text-neutral-900 text-3xl sm:text-5xl lg:text-[3.6rem]"
        >
          A Estação SOMMA não é um café no Parque da Cidade.
        </p>
        <p data-anim className="mx-auto mt-7 max-w-2xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          É uma <O>infraestrutura de comunidade</O>, financiada por uma operação comercial sustentável, que transforma
          esporte, saúde e convivência em <O>impacto público real</O>.
        </p>
      </div>
    ),
  },
]

/* ----------------------------------------------------------------------------
 * Deck
 * -------------------------------------------------------------------------- */

export function EstacaoClient() {
  const [active, setActive] = useState(0)
  const [fs, setFs] = useState(false)
  const [menu, setMenu] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const total = SLIDES.length

  const go = useCallback((n: number) => setActive((a) => Math.min(Math.max(n, 0), total - 1)), [total])
  const next = useCallback(() => setActive((a) => Math.min(a + 1, total - 1)), [total])
  const prev = useCallback(() => setActive((a) => Math.max(a - 1, 0)), [])

  const toggleFs = useCallback(() => {
    if (typeof document === 'undefined') return
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
  }, [])

  // Reveal de cada slide
  useEffect(() => {
    const el = slideRef.current
    if (!el) return
    const targets = el.querySelectorAll('[data-anim]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.055 },
      )
    }, el)
    return () => ctx.revert()
  }, [active])

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menu && e.key === 'Escape') return setMenu(false)
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          prev()
          break
        case 'Home':
          go(0)
          break
        case 'End':
          go(total - 1)
          break
        case 'f':
        case 'F':
          toggleFs()
          break
        case 'o':
        case 'O':
          setMenu((m) => !m)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, toggleFs, total, menu])

  // Fullscreen state
  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) next()
      else prev()
    }
    touch.current = null
  }

  const slide = SLIDES[active]
  const pct = ((active + 1) / total) * 100

  return (
    <main className="fixed inset-0 overflow-hidden bg-white font-[family-name:var(--font-body)] text-neutral-900">
      {/* Barra de progresso (topo) */}
      <div className="absolute inset-x-0 top-0 z-40 h-[3px] bg-black/5">
        <div className="h-full bg-[#FF2C03] transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))] sm:px-8">
        <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-neutral-900">
          Estação <span className="text-[#FF2C03]">SOMMA</span>
        </span>
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 sm:block">
          {slide.section}
        </span>
      </header>

      {/* Viewport do slide */}
      <div
        key={active}
        ref={slideRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="h-full overflow-y-auto px-5 pb-24 pt-20 sm:px-10 sm:pb-24 sm:pt-24"
      >
        <div
          className={`mx-auto flex min-h-full max-w-5xl flex-col gap-4 sm:gap-5 ${
            slide.center ? 'items-center justify-center' : 'justify-center'
          }`}
        >
          {slide.node}
        </div>
      </div>

      {/* Controles (rodapé) */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] sm:px-8">
        <button
          onClick={() => setMenu(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-600 shadow-sm transition hover:border-[#FF2C03]/40 hover:text-[#FF2C03]"
          aria-label="Visão geral"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 shadow-sm">
          <button
            onClick={prev}
            disabled={active === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 transition hover:bg-black/5 disabled:opacity-30"
            aria-label="Anterior"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[3.2rem] text-center text-xs font-bold tabular-nums tracking-wider text-neutral-500">
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button
            onClick={next}
            disabled={active === total - 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2C03] text-white transition hover:bg-[#e62700] disabled:opacity-30"
            aria-label="Próximo"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={toggleFs}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-600 shadow-sm transition hover:border-[#FF2C03]/40 hover:text-[#FF2C03]"
          aria-label="Tela cheia"
        >
          {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>

      {/* Overview */}
      {menu && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 pt-[max(1.1rem,env(safe-area-inset-top))] sm:px-8">
            <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight">
              Visão geral · <span className="text-[#FF2C03]">{total} slides</span>
            </span>
            <button
              onClick={() => setMenu(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-600 transition hover:text-[#FF2C03]"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid flex-1 grid-cols-2 content-start gap-2 overflow-y-auto p-5 sm:grid-cols-3 sm:p-8 lg:grid-cols-4">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  go(i)
                  setMenu(false)
                }}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                  i === active
                    ? 'border-[#FF2C03] bg-[#FF2C03]/[0.06]'
                    : 'border-black/10 bg-white hover:border-[#FF2C03]/40'
                }`}
              >
                <span className="font-[family-name:var(--font-display)] text-sm tabular-nums text-[#FF2C03]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[13px] font-semibold leading-tight text-neutral-700">{s.section}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
