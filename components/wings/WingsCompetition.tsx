import { Footprints, Ruler, Users, Trophy, Award, ClipboardCheck } from 'lucide-react'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

const summaryCards = [
  { icon: Footprints, title: 'Formato', body: '2 masculino + 2 feminino por equipe' },
  { icon: Ruler, title: 'Distância', body: '100m por atleta = 400m total' },
  { icon: Users, title: 'Baterias', body: '4 equipes por bateria' },
  { icon: Trophy, title: 'Classificação', body: '8 melhores tempos vão às finais' },
  { icon: Award, title: 'Premiação', body: 'Top 3 atléticas levam prêmios' },
  { icon: ClipboardCheck, title: 'Staff', body: '1 responsável por equipe' },
]

const modalities = [
  {
    n: 1,
    title: 'Um pé só',
    body: 'O participante escolhe um pé antes de largar e não pode trocar durante toda a passagem.',
  },
  {
    n: 2,
    title: 'Dois pés juntos saltando',
    body: 'Deve avançar sempre com os dois pés juntos em cada salto. Sem salto alternado.',
  },
  {
    n: 3,
    title: 'Corrida de costas',
    body: 'Pode olhar para trás, porém é proibido girar o tronco para a frente durante o percurso.',
  },
  {
    n: 4,
    title: 'Engatinhando em 4 apoios',
    body: 'Pés e mãos sempre no chão. Joelhos não precisam tocar a pista.',
  },
]

export default function WingsCompetition() {
  return (
    <section className="bg-white py-12 sm:py-24 px-4 sm:px-8" style={fontBody}>
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho com fundo amarelo */}
        <div className="inline-block bg-wfl-yellow px-3 py-2 sm:px-4 max-w-full">
          <h2
            className="text-sm sm:text-xl font-extrabold tracking-wider uppercase text-wfl-navy leading-tight"
          >
            Atividade competitiva — Revezamento 4×100m misto
          </h2>
        </div>

        {/* Cards de resumo */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {summaryCards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="relative bg-wfl-card border-t-2 border-wfl-red px-3 sm:px-4 pt-3 pb-3 sm:pt-4 sm:pb-4"
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-wfl-red mb-1.5 sm:mb-2" aria-hidden="true" />
              <p className="text-xs sm:text-sm font-bold text-wfl-navy">{title}</p>
              <p className="mt-1 text-xs text-wfl-dark/70 leading-snug">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Modalidades */}
        <div className="mt-8 sm:mt-10">
          <h3
            className="text-2xl sm:text-4xl uppercase text-wfl-navy leading-none"
            style={fontDisplay}
          >
            As 4 modalidades obrigatórias
          </h3>
          <p className="mt-2 text-sm text-wfl-dark/60 max-w-2xl">
            Cada atleta da equipe corre 100m em uma modalidade diferente. A ordem é
            decidida pela própria equipe antes de cada bateria.
          </p>

          <ol className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
            {modalities.map(m => (
              <li
                key={m.n}
                className="flex items-start gap-3 sm:gap-4 border border-wfl-border bg-white hover:bg-wfl-card/40 transition-colors px-4 py-3.5 sm:px-6 sm:py-5 rounded-2xl sm:rounded-full"
              >
                <span
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-wfl-red text-white font-bold flex items-center justify-center text-sm sm:text-base"
                  aria-hidden="true"
                >
                  {m.n}
                </span>
                <div className="min-w-0">
                  <p className="text-sm sm:text-lg font-bold text-wfl-navy leading-tight">
                    {m.title}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-wfl-dark/70 leading-relaxed">
                    {m.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Linha de regras finais */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-wfl-navy text-white p-4 sm:p-6">
            <p
              className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-wfl-yellow"
            >
              Classificatórias
            </p>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              Os <span className="text-wfl-yellow font-semibold">8 melhores tempos
              totais</span> dos 400m avançam para a final. Cronometragem oficial feita
              pelo staff de cada equipe.
            </p>
          </div>
          <div className="bg-wfl-red text-white p-4 sm:p-6">
            <p
              className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-wfl-yellow"
            >
              Final
            </p>
            <p className="mt-2 text-sm text-white/90 leading-relaxed">
              As <span className="text-wfl-yellow font-semibold">3 atléticas</span> com
              melhor tempo total no revezamento levam <span className="text-wfl-yellow font-semibold">premiações no pódio</span>.
              Resultado afixado em placar ao vivo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
