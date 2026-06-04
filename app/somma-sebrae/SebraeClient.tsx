'use client'

import type { ReactNode } from 'react'
import {
  Deck,
  BASE_SLIDES,
  O,
  Eyebrow,
  Title,
  Head,
  Pull,
  Narrative,
  Rows,
  Callout,
  Note,
  type Slide,
} from '../estacao-somma-club/EstacaoClient'

/* ----------------------------------------------------------------------------
 * Componentes específicos do deck SEBRAE
 * -------------------------------------------------------------------------- */

function Lead({ children }: { children: ReactNode }) {
  return (
    <p data-anim className="text-lg font-medium leading-snug text-neutral-800 sm:text-2xl lg:text-[1.7rem]">
      {children}
    </p>
  )
}

function Chips({ label, items }: { label?: string; items: string[] }) {
  return (
    <div data-anim className="space-y-2">
      {label && <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {items.map((c, i) => (
          <span
            key={i}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Caixa de fluxo/diagrama */
function Box({
  children,
  tone = 'plain',
  sub,
}: {
  children: ReactNode
  tone?: 'dark' | 'accent' | 'outline' | 'plain'
  sub?: ReactNode
}) {
  const cls =
    tone === 'dark'
      ? 'border-black/10 bg-neutral-900 text-white'
      : tone === 'accent'
        ? 'border-2 border-[#FF2C03] bg-white text-[#FF2C03] shadow-sm'
        : tone === 'outline'
          ? 'border-[#FF2C03]/30 bg-[#FF2C03]/[0.06] text-neutral-900'
          : 'border-black/10 bg-white text-neutral-900 shadow-sm'
  return (
    <div data-anim className={`rounded-2xl border p-4 text-center ${cls}`}>
      <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight sm:text-lg">{children}</p>
      {sub && <p className="mt-0.5 text-xs font-medium text-neutral-400">{sub}</p>}
    </div>
  )
}

function Arrow() {
  return <div className="flex justify-center text-neutral-300">↓</div>
}

/** Fases com status */
function Phases({ items }: { items: { fase: string; t: string; d: string; done?: boolean }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((p, i) => (
        <div
          key={i}
          data-anim
          className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
            p.done ? 'border-emerald-300 bg-emerald-50/60' : 'border-black/10 bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF2C03]">{p.fase}</span>
            {p.done && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">✓ feito</span>}
          </div>
          <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-neutral-900">
            {p.t}
          </h3>
          <p className="mt-1 text-sm leading-snug text-neutral-600">{p.d}</p>
        </div>
      ))}
    </div>
  )
}

/** Cartão de cargo (organograma) */
function RoleCard({
  role,
  person,
  mission,
  dono,
  resp,
  equipe,
  skills,
  kpis,
}: {
  role: string
  person?: string
  mission?: ReactNode
  dono?: string
  resp?: string[]
  equipe?: string[]
  skills?: string[]
  kpis?: string[]
}) {
  return (
    <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-neutral-900 sm:text-2xl">
          {role}
        </h3>
        {person && (
          <span className="rounded-full bg-[#FF2C03]/10 px-3 py-1 text-xs font-bold text-[#FF2C03]">{person}</span>
        )}
      </div>
      {mission && <p className="mt-2 text-sm font-semibold leading-snug text-neutral-700 sm:text-base">{mission}</p>}
      {dono && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Dono de: <span className="text-neutral-700">{dono}</span>
        </p>
      )}
      {resp && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Responsabilidades</p>
          <ul className="mt-1.5 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
            {resp.map((r, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-neutral-700 sm:text-sm">
                <span className="text-[#FF2C03]">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
      {equipe && (
        <p className="mt-3 text-[13px] text-neutral-600 sm:text-sm">
          <span className="font-semibold text-neutral-800">Equipe:</span> {equipe.join(' · ')}
        </p>
      )}
      {skills && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.map((s, i) => (
            <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
              {s}
            </span>
          ))}
        </div>
      )}
      {kpis && (
        <div className="mt-3 rounded-xl border border-black/[0.06] bg-neutral-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Métricas</p>
          <p className="mt-1 text-[13px] font-medium text-neutral-700 sm:text-sm">{kpis.join(' · ')}</p>
        </div>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Slides — Camada SEBRAE / Living Lab
 * -------------------------------------------------------------------------- */

const SEBRAE_SLIDES: Slide[] = [
  // Divisor
  {
    section: 'SEBRAE · Capítulo 2',
    center: true,
    node: (
      <div className="text-center">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FF2C03] sm:text-xs">
          Parte 2 · Captação via SEBRAE
        </p>
        <h2
          data-anim
          className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.92] tracking-tight text-neutral-900 text-4xl sm:text-6xl lg:text-7xl"
        >
          Somma<br />
          <span className="text-[#FF2C03]">Living Lab</span>
        </h2>
        <p data-anim className="mx-auto mt-6 max-w-2xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          Uma camada acima da Estação: o laboratório vivo de empreendedorismo wellness.
        </p>
      </div>
    ),
  },

  // A tese ajustada para SEBRAE
  {
    section: 'SEBRAE · A virada',
    node: (
      <>
        <Head k="SEBRAE · A virada de tese" title="A Estação capta mais do que o Somma sozinho" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <div data-anim className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">✕ O erro com o SEBRAE</span>
            <p className="mt-3 text-lg font-semibold leading-snug text-neutral-700 sm:text-xl">
              “Tenho um clube de corrida com 5 mil pessoas e quero abrir um espaço.”
            </p>
          </div>
          <div data-anim className="rounded-2xl border border-[#FF2C03]/30 bg-[#FF2C03]/[0.06] p-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF2C03]">✓ A narrativa vencedora</span>
            <p className="mt-3 text-lg font-semibold leading-snug text-neutral-900 sm:text-xl">
              “Construímos uma infraestrutura de ativação econômica do setor de esporte, saúde e bem-estar que conecta
              consumidores, pequenos negócios, tecnologia e ocupação urbana.”
            </p>
          </div>
        </div>
        <Note>Com a segunda frase, o projeto encaixa exatamente no que o SEBRAE existe para fomentar.</Note>
      </>
    ),
  },

  // Conceito Living Lab
  {
    section: 'Living Lab',
    node: (
      <>
        <Head k="SEBRAE · O conceito" title="A Estação vira um laboratório vivo de negócios" />
        <Narrative cite="A narrativa para o SEBRAE">
          “Todos os sábados, milhares de consumidores de saúde e esporte passam pelo Somma. Queremos transformar esse
          fluxo em uma plataforma para pequenos negócios testarem, validarem e venderem seus produtos.”
        </Narrative>
        <Callout>
          O nome <O>Somma Living Lab</O> é só conceito — mas é exatamente o tipo de projeto que o SEBRAE adora: empreendedorismo
          wellness aplicado.
        </Callout>
      </>
    ),
  },

  // 1. Desenvolvimento de pequenos negócios
  {
    section: 'SEBRAE · Pequenos negócios',
    node: (
      <>
        <Head
          k="Onde o SEBRAE entra · 1"
          title="Desenvolvimento de pequenos negócios"
          sub="Além de Decathlon e Evolve (grandes marcas), entram as micro marcas locais."
        />
        <Chips
          label="Micro marcas de:"
          items={[
            'moda fitness local',
            'comida saudável',
            'suplementos artesanais',
            'cafés',
            'fisioterapeutas',
            'nutricionistas',
            'personal trainers',
            'pequenos produtores',
          ]}
        />
        <Callout>
          A Estação vira uma <O>“feira permanente curada”</O>. Exemplo: todo mês, 10 marcas locais selecionadas pelo Somma
          + SEBRAE.
        </Callout>
        <Chips label="Cada marca recebe:" items={['vitrine', 'mentoria', 'dados', 'clientes', 'vendas']} />
      </>
    ),
  },

  // 2. Validação de negócios
  {
    section: 'SEBRAE · Validação',
    node: (
      <>
        <Head
          k="Onde o SEBRAE entra · 2"
          title="Somma Lab de validação de negócios"
          sub="O Somma tem algo que pouquíssimas empresas têm: público físico recorrente."
        />
        <Lead>
          Programa de aceleração <O>Wellness Brasília</O>.
        </Lead>
        <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Exemplo real</p>
          <p className="mt-2 text-base leading-snug text-neutral-700 sm:text-lg">
            Uma empreendedora cria uma marca de barra de proteína. O caminho normal: criar Instagram, pagar anúncio,
            esperar meses. No Somma: <strong>sábado ela coloca 300 amostras na mão do público certo</strong> e recebe na
            hora feedback, pesquisa, dados e as primeiras vendas.
          </p>
          <p className="mt-3 text-sm font-semibold text-[#FF2C03]">Isso é inovação aplicada.</p>
        </div>
      </>
    ),
  },

  // 3. Dados e tecnologia
  {
    section: 'SEBRAE · Dados & tech',
    node: (
      <>
        <Head
          k="Onde o SEBRAE entra · 3"
          title="Dados e tecnologia"
          sub="O SEBRAE não vai financiar “container”. Mas pode financiar inteligência."
        />
        <Callout>
          O que o SEBRAE financia: uma <O>plataforma de inteligência para a economia wellness</O>. A Estação é só a
          manifestação física.
        </Callout>
        <Chips
          label="O app Somma vira:"
          items={[
            'cadastro',
            'check-in',
            'marketplace de negócios locais',
            'cupons',
            'avaliação de produtos',
            'mapa de parceiros',
            'comunidade',
          ]}
        />
      </>
    ),
  },

  // Ecossistema + Lab (diagrama)
  {
    section: 'Ecossistema + Lab',
    node: (
      <>
        <Head k="SEBRAE · O ecossistema" title="Onde o Somma Lab se encaixa" />
        <div className="space-y-2.5">
          <Box tone="dark">Grupo Somma</Box>
          <Arrow />
          <Box tone="outline" sub="a audiência">Somma Club</Box>
          <Arrow />
          <Box tone="accent" sub="hub físico">Estação Somma</Box>
          <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {['Somma Retail', 'Somma Eventos', 'Somma Mídia', 'Somma Assessoria'].map((t) => (
              <div key={t} className="rounded-xl border border-black/10 bg-white p-2.5 text-center text-xs font-semibold text-neutral-700 shadow-sm">
                {t}
              </div>
            ))}
          </div>
          <div data-anim className="rounded-2xl border-2 border-dashed border-[#FF2C03]/50 bg-[#FF2C03]/[0.05] p-3 text-center">
            <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-tight text-[#FF2C03]">
              Somma Lab <span className="text-neutral-500">· empreendedorismo e inovação</span>
            </p>
          </div>
        </div>
        <Note>O Somma Lab é exatamente a peça que conversa com o SEBRAE.</Note>
      </>
    ),
  },

  // Parceiros estratégicos
  {
    section: 'Parceiros estratégicos',
    node: (
      <>
        <Head k="SEBRAE · Arquitetura de parceria" title="Cada pilar, um parceiro" />
        <Rows
          head={['Pilar', 'Parceiro']}
          items={[
            ['Comunidade', 'Somma'],
            ['Desenvolvimento empreendedor', 'SEBRAE'],
            ['Performance', 'Evolve'],
            ['Equipamentos', 'Decathlon'],
            ['Tecnologia', 'startups / healthtechs'],
            ['Alimentação', 'pequenos negócios locais'],
            ['Experiência', 'patrocinadores'],
          ]}
        />
      </>
    ),
  },

  // A frase ajustada
  {
    section: 'SEBRAE · A frase',
    node: (
      <>
        <Eyebrow>SEBRAE · A virada de narrativa</Eyebrow>
        <div data-anim className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Antes</p>
          <p className="mt-1 text-lg font-medium text-neutral-500 line-through sm:text-xl">
            A operação comercial sustenta um projeto gratuito de impacto coletivo.
          </p>
        </div>
        <Pull cite="A frase que muda a percepção">O impacto coletivo gera uma plataforma econômica sustentável.</Pull>
        <Note>
          Não parece que você está pedindo permissão para vender. Parece que você criou um <O>motor econômico</O>.
        </Note>
      </>
    ),
  },

  // As 4 fases
  {
    section: 'SEBRAE · As 4 fases',
    node: (
      <>
        <Head k="SEBRAE · Visão de caminho" title="As quatro fases do Somma" />
        <Phases
          items={[
            { fase: 'Fase 1', t: 'Comunidade', d: 'O Somma prova comunidade.', done: true },
            { fase: 'Fase 2', t: 'Infraestrutura física', d: 'A Estação Somma.' },
            { fase: 'Fase 3', t: 'Plataforma econômica', d: 'Entra o SEBRAE.' },
            { fase: 'Fase 4', t: 'Replicação', d: 'Águas Claras, Noroeste, Goiânia, São Paulo.' },
          ]}
        />
      </>
    ),
  },

  // O argumento mais forte
  {
    section: 'SEBRAE · O argumento',
    node: (
      <>
        <Head k="SEBRAE · O argumento decisivo" title="O que realmente convence o SEBRAE" />
        <Narrative cite="O argumento milionário">
          “Criamos uma concentração semanal de consumidores e agora queremos transformar essa audiência em oportunidade
          para centenas de pequenos negócios da economia da saúde.”
        </Narrative>
        <Callout>
          A Estação deixa de ser custo de infraestrutura e vira <O>política de desenvolvimento econômico</O>. O argumento
          não são os 5 mil corredores — é o que eles representam para centenas de negócios.
        </Callout>
      </>
    ),
  },

  /* --------------------------------------------------------------------------
   * Bloco — Estrutura do Grupo Somma (organograma operacional)
   * ------------------------------------------------------------------------ */

  {
    section: 'Grupo · Visão',
    center: true,
    node: (
      <div className="text-center">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FF2C03] sm:text-xs">
          Parte 3 · Como organizar o time
        </p>
        <h2
          data-anim
          className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.92] tracking-tight text-neutral-900 text-4xl sm:text-6xl lg:text-7xl"
        >
          Grupo <span className="text-[#FF2C03]">SOMMA</span>
        </h2>
        <p data-anim className="mx-auto mt-6 max-w-2xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          Não uma “assessoria de corrida”, mas uma empresa de comunidade, mídia e experiência. Estrutura enxuta, com áreas
          compartilhadas atendendo todas as unidades.
        </p>
      </div>
    ),
  },

  {
    section: 'Grupo · Diretoria',
    node: (
      <>
        <Head k="Grupo Somma · Diretoria / Sócios" title="As três cadeiras de comando" />
        <div className="grid grid-cols-1 gap-3">
          <RoleCard
            role="CEO / Estratégia Geral"
            person="Alexandre"
            mission="Garantir visão, expansão e crescimento do ecossistema."
            resp={['estratégia do grupo', 'relacionamento institucional GDF/SEBRAE', 'grandes patrocinadores', 'novas receitas', 'expansão para outras cidades', 'cultura Somma']}
          />
          <RoleCard
            role="Diretor de Comunidade e Operações"
            person="Diogo"
            mission="Garantir que a experiência Somma aconteça com excelência."
            resp={['encontros semanais', 'insiders', 'voluntários', 'experiência do membro', 'operação dos eventos', 'qualidade da entrega']}
          />
          <RoleCard
            role="Diretor Técnico / Performance"
            person="João"
            mission="Garantir autoridade esportiva."
            resp={['metodologia de treino', 'assessoria', 'treinadores', 'evolução dos atletas', 'programas esportivos', 'relacionamento com profissionais']}
          />
        </div>
      </>
    ),
  },

  {
    section: 'Grupo · Marketing',
    node: (
      <>
        <Head k="Áreas Corporativas · 1" title="Marketing & Comunidade" />
        <div className="grid grid-cols-1 gap-3">
          <RoleCard
            role="Head de Marketing"
            person="Cristina"
            mission="Transformar comunidade em marca."
            resp={['calendário de conteúdo', 'campanhas', 'posicionamento Somma', 'crescimento da comunidade', 'redes sociais', 'storytelling']}
          />
          <RoleCard
            role="Audiovisual"
            person="João Victor"
            mission="Transformar o movimento em mídia."
            resp={['vídeos', 'reels', 'YouTube', 'cobertura dos eventos', 'conteúdo para patrocinadores']}
          />
          <RoleCard
            role="Social / Conteúdo"
            person="Alex"
            mission="Escalar distribuição."
            resp={['posts', 'calendário editorial', 'comunidade digital', 'newsletters', 'WhatsApp']}
            kpis={['crescimento de seguidores', 'alcance', 'engajamento', 'novos membros']}
          />
        </div>
      </>
    ),
  },

  {
    section: 'Grupo · Operações',
    node: (
      <>
        <Head k="Áreas Corporativas · 2" title="Operações & Experiência" />
        <div className="grid grid-cols-1 gap-3">
          <RoleCard
            role="Head Operações e CX"
            person="Alexandre"
            mission="Fazer a comunidade funcionar."
            resp={['operação de sábado', 'jornada do membro', 'check-in', 'relacionamento', 'NPS', 'insiders']}
          />
          <RoleCard
            role="Operações de Campo"
            person="Joseph"
            resp={['montagem', 'logística', 'fornecedores', 'materiais', 'suporte']}
          />
          <RoleCard
            role="Coordenador de Eventos"
            person="vaga futura"
            resp={['Somma Race', 'eventos corporativos', 'ativações']}
            kpis={['check-ins', 'recorrência', 'satisfação', 'custo operacional']}
          />
        </div>
      </>
    ),
  },

  {
    section: 'Grupo · Receita',
    node: (
      <>
        <Head
          k="Áreas Corporativas · 3"
          title="Receita & Parcerias"
          sub="Hoje, a área mais importante a criar — transformar audiência em dinheiro."
        />
        <RoleCard
          role="Head de Receita"
          person="Alexandre (inicialmente)"
          mission="Transformar audiência em receita."
          kpis={['MRR de patrocínio', 'contratos fechados', 'ticket médio']}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-neutral-900">Somma Mídia</h3>
            <p className="mt-1 text-[13px] text-neutral-500">Venda para: Decathlon, Evolve, marcas wellness, empresas.</p>
            <p className="mt-2 text-sm text-neutral-700">Patrocínio mensal · naming rights · ativações · conteúdo patrocinado</p>
          </div>
          <div data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-neutral-900">Somma B2B</h3>
            <p className="mt-1 text-[13px] text-neutral-500">Venda para: empresas.</p>
            <p className="mt-2 text-sm text-neutral-700">Corrida corporativa · qualidade de vida · eventos</p>
          </div>
        </div>
      </>
    ),
  },

  {
    section: 'Grupo · Retail',
    node: (
      <>
        <Head k="Áreas Corporativas · 4" title="Somma Retail" />
        <RoleCard
          role="Head de Retail"
          person="Alex"
          mission="Transformar pertencimento em produto."
          resp={['coleções', 'fornecedores', 'estoque', 'e-commerce', 'collabs']}
          kpis={['faturamento', 'margem', 'estoque parado', 'clientes recorrentes']}
        />
        <Chips label="Produtos:" items={['roupas', 'acessórios', 'kits', 'produtos parceiros']} />
      </>
    ),
  },

  {
    section: 'Grupo · Estação',
    node: (
      <>
        <Head k="Áreas Corporativas · 5" title="Estação Somma" sub="Aqui é praticamente outra empresa dentro do grupo." />
        <RoleCard
          role="Gerente da Estação"
          person="contratação futura"
          mission="Rodar o hub físico."
          resp={['café', 'loja', 'agenda', 'eventos', 'marcas', 'atendimento']}
          equipe={['Barista/atendente 1', 'Barista/atendente 2', 'Operação de fim de semana']}
          kpis={['vendas/dia', 'visitantes', 'margem', 'experiências realizadas']}
        />
      </>
    ),
  },

  {
    section: 'Grupo · Tech & Dados',
    node: (
      <>
        <Head k="Áreas Corporativas · 6" title="Tecnologia, Dados e Produto" />
        <RoleCard
          role="Head de Tech / Dados"
          person="Alex"
          mission="Criar a inteligência do ecossistema."
          resp={['App Somma', 'CRM', 'dados de membros', 'check-in', 'automação', 'dashboards']}
          kpis={['usuários cadastrados', 'MAU', 'recorrência', 'dados coletados']}
        />
      </>
    ),
  },

  {
    section: 'Grupo · Somma Lab',
    node: (
      <>
        <Head k="Áreas Corporativas · 7" title="Somma Lab (SEBRAE)" sub="Pode começar dentro de Receita." />
        <RoleCard
          role="Gestor de Ecossistema"
          mission="Conectar pequenos negócios."
          resp={['selecionar marcas', 'organizar ativações', 'programas SEBRAE', 'relatórios de impacto']}
          kpis={['empreendedores atendidos', 'vendas geradas', 'empresas participantes']}
        />
      </>
    ),
  },

  {
    section: 'Grupo · Organograma',
    node: (
      <>
        <Head k="Grupo Somma · Visão geral" title="O organograma do grupo" />
        <div className="space-y-2.5">
          <div data-anim className="grid grid-cols-3 gap-2">
            {[['Alexandre', 'Estratégia'], ['Diogo', 'Operação'], ['João', 'Performance']].map(([n, r]) => (
              <div key={n} className="rounded-xl border border-black/10 bg-neutral-900 p-2.5 text-center">
                <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-tight text-white">{n}</p>
                <p className="text-[10px] text-white/50">{r}</p>
              </div>
            ))}
          </div>
          <Arrow />
          <Box tone="accent">Grupo Somma</Box>
          <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[['Marketing', 'Conteúdo · Marca · Social'], ['Operação', 'Eventos · Estação · Insiders'], ['Receita', 'Mídia · B2B · Patrocínio'], ['Produto/Dados', 'App · CRM · Dados']].map(([t, s]) => (
              <div key={t} className="rounded-xl border border-black/10 bg-white p-2.5 text-center shadow-sm">
                <p className="text-xs font-bold text-neutral-900">{t}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-neutral-500">{s}</p>
              </div>
            ))}
          </div>
          <Chips label="Unidades:" items={['Somma Club', 'Assessoria', 'Retail', 'Eventos', 'Mídia', 'Estação', 'Somma Lab']} />
        </div>
      </>
    ),
  },

  {
    section: 'Grupo · O ponto-chave',
    node: (
      <>
        <Head k="Grupo Somma · A prioridade" title="Receita no mesmo nível de Operações e Marketing" />
        <Pull>Vocês já provaram comunidade. A próxima fase não é crescer membro — é capturar mais valor por membro.</Pull>
      </>
    ),
  },

  /* --------------------------------------------------------------------------
   * Bloco — Estrutura Holding (madura, C-level)
   * ------------------------------------------------------------------------ */

  {
    section: 'Holding · Referências',
    center: true,
    node: (
      <div className="text-center">
        <p data-anim className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FF2C03] sm:text-xs">
          Parte 4 · A estrutura madura
        </p>
        <h2
          data-anim
          className="mt-5 font-[family-name:var(--font-display)] uppercase leading-[0.92] tracking-tight text-neutral-900 text-4xl sm:text-6xl lg:text-7xl"
        >
          SOMMA <span className="text-[#FF2C03]">Holding</span>
        </h2>
        <p data-anim className="mx-auto mt-6 max-w-2xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          Pensando como Nike, Strava, Gympass, Soho House, Red Bull e Lululemon — community business + wellness + retail +
          mídia + experiências.
        </p>
      </div>
    ),
  },

  {
    section: 'Holding · CEO',
    node: (
      <>
        <Head k="Holding · 1" title="Chief Executive Officer (CEO)" />
        <RoleCard
          role="CEO"
          mission="Transformar visão em estratégia, capital e expansão."
          resp={['visão de longo prazo', 'estratégia corporativa', 'novas cidades / unidades', 'captação de investimento', 'relações institucionais', 'grandes parcerias', 'cultura da empresa']}
          skills={['estratégia', 'liderança', 'captação', 'negociação C-level', 'construção de marca', 'visão de mercado']}
        />
      </>
    ),
  },

  {
    section: 'Holding · CCO',
    node: (
      <>
        <Head k="Holding · 2" title="Chief Community Officer (CCO)" sub="Uma das cadeiras mais importantes. Não é marketing — é pertencimento." />
        <RoleCard
          role="CCO"
          dono="Somma Club"
          mission="Transformar pessoas em comunidade."
          resp={['crescimento da comunidade', 'experiência dos membros', 'jornada do usuário', 'insiders / embaixadores', 'cultura e rituais', 'retenção', 'expansão de capítulos']}
          skills={['community building', 'psicologia de comunidade', 'CX', 'eventos presenciais', 'liderança de voluntários', 'branding cultural']}
          kpis={['membros ativos', 'frequência', 'retenção', 'NPS', 'indicações']}
        />
      </>
    ),
  },

  {
    section: 'Holding · CBO',
    node: (
      <>
        <Head k="Holding · 3" title="Chief Brand Officer (CBO)" sub="A cadeira que Nike e Red Bull dominam: transformar o Somma em movimento cultural." />
        <RoleCard
          role="CBO"
          dono="Somma Media"
          mission="Transformar o Somma em movimento cultural."
          resp={['marca', 'narrativa', 'conteúdo', 'comunicação', 'campanhas', 'PR', 'influenciadores', 'audiovisual', 'identidade']}
          skills={['branding', 'storytelling', 'cultura', 'conteúdo', 'PR', 'social media', 'criação']}
          kpis={['alcance', 'share of voice', 'engajamento', 'brand awareness']}
        />
      </>
    ),
  },

  {
    section: 'Holding · CXO',
    node: (
      <>
        <Head k="Holding · 4" title="Chief Experience Officer (CXO)" sub="Fazer cada contato com o Somma ser memorável." />
        <RoleCard
          role="CXO"
          dono="Somma Eventos · Estação Somma · Experiências"
          mission="Cuidar de toda a experiência física da marca."
          resp={['operação dos encontros', 'produção de eventos', 'design de experiências', 'ativações', 'qualidade operacional', 'padrão Somma']}
          skills={['produção', 'hospitalidade', 'operações', 'customer experience', 'gestão de fornecedores', 'eventos']}
          kpis={['NPS', 'qualidade', 'participação', 'custo operacional']}
        />
      </>
    ),
  },

  {
    section: 'Holding · CRO',
    node: (
      <>
        <Head k="Holding · 5" title="Chief Revenue Officer (CRO)" sub="Precisa existir cedo: transformar audiência em receita." />
        <RoleCard
          role="CRO"
          dono="Somma Ads · Somma Empresas · Parcerias"
          mission="Transformar audiência em receita."
          resp={['receita do grupo', 'patrocínios', 'parcerias comerciais', 'B2B', 'novos contratos', 'precificação', 'crescimento financeiro']}
          skills={['vendas enterprise', 'negociação', 'growth', 'desenvolvimento comercial', 'monetização']}
          kpis={['receita', 'MRR', 'pipeline', 'ticket médio']}
        />
      </>
    ),
  },

  {
    section: 'Holding · CPTO',
    node: (
      <>
        <Head k="Holding · 6" title="Chief Product & Technology Officer (CPTO)" sub="Transformar comunidade em plataforma." />
        <RoleCard
          role="CPTO"
          mission="Transformar comunidade em plataforma."
          resp={['App Somma', 'dados', 'produto digital', 'CRM', 'inteligência artificial', 'automações', 'plataforma de membros']}
          skills={['produto digital', 'dados', 'UX', 'tecnologia', 'growth', 'analytics']}
          kpis={['usuários ativos', 'retenção digital', 'dados coletados', 'conversão']}
        />
      </>
    ),
  },

  {
    section: 'Holding · Retail',
    node: (
      <>
        <Head k="Holding · 7" title="Head of Retail & Merchandising" sub="A lógica Lululemon: transformar identidade em produto." />
        <RoleCard
          role="Head of Retail"
          dono="Somma Store"
          mission="Transformar identidade em produto."
          resp={['coleções', 'collabs', 'desenvolvimento de produtos', 'fornecedores', 'estoque', 'e-commerce', 'margem']}
          skills={['moda', 'produto físico', 'branding', 'supply chain', 'e-commerce']}
          kpis={['GMV', 'margem', 'sell through', 'LTV do cliente']}
        />
      </>
    ),
  },

  {
    section: 'Holding · Performance',
    node: (
      <>
        <Head k="Holding · 8" title="Head of Performance & Wellness" sub="Garantir a autoridade técnica." />
        <RoleCard
          role="Head of Performance"
          dono="Assessoria Somma"
          mission="Garantir a autoridade técnica."
          resp={['metodologia esportiva', 'treinadores', 'programas de evolução', 'conteúdo técnico', 'parcerias de saúde']}
          skills={['educação física', 'gestão técnica', 'ciência esportiva', 'produto fitness']}
          kpis={['alunos ativos', 'retenção', 'evolução', 'satisfação']}
        />
      </>
    ),
  },

  {
    section: 'Holding · CFO',
    node: (
      <>
        <Head k="Holding · 9" title="Chief Financial Officer (CFO)" sub="Transformar crescimento em empresa." />
        <RoleCard
          role="CFO"
          mission="Transformar crescimento em empresa."
          resp={['financeiro', 'controladoria', 'jurídico', 'modelos de negócio', 'indicadores', 'planejamento']}
          skills={['finanças', 'governança', 'captação', 'modelagem financeira']}
          kpis={['EBITDA', 'cash flow', 'margem', 'eficiência']}
        />
      </>
    ),
  },

  {
    section: 'Holding · Organograma',
    node: (
      <>
        <Head k="Holding · Estrutura madura" title="Como o C-level se organiza" />
        <div className="space-y-2.5">
          <Box tone="accent">CEO</Box>
          <Arrow />
          <div data-anim className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {['CCO · Comunidade', 'CBO · Marca e Mídia', 'CXO · Experiência', 'CRO · Receita', 'CPTO · Produto e Dados', 'Head Retail', 'Head Performance', 'CFO'].map((t) => (
              <div key={t} className="rounded-xl border border-black/10 bg-white p-2.5 text-center text-xs font-semibold text-neutral-700 shadow-sm">
                {t}
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },

  {
    section: 'Holding · 3 cadeiras',
    node: (
      <>
        <Head k="Holding · A prioridade" title="As 3 cadeiras mais estratégicas" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['Community', 'A comunidade é o ativo raro.'],
            ['Brand', 'A marca transforma em movimento.'],
            ['Revenue', 'A receita transforma em empresa.'],
          ].map(([t, d]) => (
            <div key={t} data-anim className="rounded-2xl border-2 border-[#FF2C03]/30 bg-[#FF2C03]/[0.06] p-5 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#FF2C03]">{t}</p>
              <p className="mt-1.5 text-sm font-medium leading-snug text-neutral-700">{d}</p>
            </div>
          ))}
        </div>
        <Note>
          O ativo raro vocês já têm: atenção presencial recorrente. Vence quem transformar pertencimento em negócio sem
          destruir a cultura.
        </Note>
      </>
    ),
  },

  // Entregáveis
  {
    section: 'Os 3 entregáveis',
    node: (
      <>
        <Head
          k="Próximo passo concreto"
          title="Três entregáveis para qualquer conversa séria"
          sub="A base para falar com patrocinadores, governo, investidores ou parceiros estratégicos."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['📑', 'Deck institucional', 'Do Grupo Somma — 10 a 15 slides.'],
            ['🏗️', 'Projeto executivo', 'Da Estação Somma — para GDF, SEBRAE e parceiros.'],
            ['📊', 'Plano financeiro', 'De 3 anos — como o ecossistema gera receita.'],
          ].map(([e, t, d]) => (
            <div key={t} data-anim className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <span className="text-2xl">{e}</span>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg uppercase tracking-tight text-neutral-900">{t}</h3>
              <p className="mt-1 text-sm leading-snug text-neutral-600">{d}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  // Fecho SEBRAE
  {
    section: 'Fecho',
    center: true,
    node: (
      <div className="max-w-4xl text-center">
        <Eyebrow>A frase que resume a fase SEBRAE</Eyebrow>
        <p
          data-anim
          className="mt-6 font-[family-name:var(--font-display)] uppercase leading-[1.0] tracking-tight text-neutral-900 text-3xl sm:text-5xl lg:text-[3.4rem]"
        >
          O impacto coletivo gera uma plataforma econômica sustentável.
        </p>
        <p data-anim className="mx-auto mt-7 max-w-2xl text-base font-medium leading-snug text-neutral-600 sm:text-xl">
          O Somma deixa de ser um movimento e vira um <O>ecossistema</O> — e a Estação é a primeira unidade de uma marca
          que pode se replicar pelo país.
        </p>
      </div>
    ),
  },
]

export function SebraeClient() {
  // Deck institucional base (sem o fecho original) + camada SEBRAE / organograma
  const slides = [...BASE_SLIDES.slice(0, -1), ...SEBRAE_SLIDES]
  return <Deck slides={slides} brand={<>SOMMA <span className="text-[#FF2C03]">· SEBRAE</span></>} />
}
