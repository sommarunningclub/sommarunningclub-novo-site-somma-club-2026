'use client'

import { X, Trophy } from 'lucide-react'
import { useRanking } from './useRanking'
import { msParaDisplay } from '@/lib/wings-cronometragem/tempo'
import type { RankingRow } from '@/lib/wings-cronometragem/types'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

const MEDALHA = ['🥇', '🥈', '🥉']
const COR_PODIO = ['#FFD400', '#C0C0C0', '#CD7F32']

export default function PodioPreview({ onClose }: { onClose: () => void }) {
  // Mostra o pódio sempre baseado na FINAL (que é o que decide o resultado)
  const { ranking, loading } = useRanking('final')

  const completos = ranking.filter(r => r.estado === 'completo')
  const top3 = completos.slice(0, 3)
  const restantes = completos.slice(3)
  const semTempo = ranking.filter(r => r.estado !== 'completo')

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur overflow-y-auto"
      style={{ ...fontBody, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center px-3 py-6" onClick={e => e.stopPropagation()}>
        <div className="w-full max-w-4xl bg-wfl-navy border border-white/10 shadow-2xl">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-wfl-navy/95 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">Preview · Admin</p>
              <h2 className="text-2xl sm:text-3xl uppercase leading-none flex items-center gap-2" style={fontDisplay}>
                <Trophy className="w-6 h-6 text-wfl-yellow" /> Pódio Final
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-8">
            {loading ? (
              <p className="text-center text-white/40 py-12">Carregando…</p>
            ) : completos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 text-sm mb-2">Sem equipes completas na final ainda.</p>
                <p className="text-[11px] text-white/40">Cada equipe precisa de 1 run de atletismo + 1 dinâmica para entrar no pódio.</p>
              </div>
            ) : (
              <>
                {/* Pódio top 3 */}
                {top3.length > 0 && <Podio top3={top3} />}

                {/* Restantes */}
                {restantes.length > 0 && (
                  <section>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-white/50 font-bold mb-3">
                      Demais classificados ({restantes.length})
                    </h3>
                    <ul className="space-y-1.5">
                      {restantes.map(linha => (
                        <LinhaResultado key={linha.atletica.id} linha={linha} />
                      ))}
                    </ul>
                  </section>
                )}

                {/* Sem tempo / parcial */}
                {semTempo.length > 0 && (
                  <section>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-white/30 font-bold mb-3">
                      Não competiram / incompletas ({semTempo.length})
                    </h3>
                    <ul className="space-y-1">
                      {semTempo.map(linha => (
                        <li
                          key={linha.atletica.id}
                          className="flex items-center justify-between gap-3 px-3 py-2 bg-white/5 border-l-2"
                          style={{ borderLeftColor: linha.atletica.cor }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-6 h-6 flex-shrink-0 rounded-full border-2"
                              style={{ borderColor: linha.atletica.cor, backgroundColor: `${linha.atletica.cor}33` }}
                              aria-hidden
                            />
                            <p className="text-xs sm:text-sm text-white/60 truncate">{linha.atletica.nome}</p>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold flex-shrink-0">
                            {linha.estado === 'parcial' ? '1 prova feita' : 'Sem tempo'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>

          <footer className="border-t border-white/10 px-4 sm:px-6 py-3 text-[10px] text-white/40 text-center">
            Tempos com desconto de barras já aplicado · Top 3 do pódio · Atualiza em tempo real
          </footer>
        </div>
      </div>
    </div>
  )
}

function Podio({ top3 }: { top3: RankingRow[] }) {
  // Layout: 2º à esquerda, 1º central (mais alto), 3º à direita
  const [primeiro, segundo, terceiro] = [top3[0], top3[1] ?? null, top3[2] ?? null]
  return (
    <section>
      <h3 className="text-xs uppercase tracking-[0.25em] text-wfl-yellow font-bold mb-4 text-center">
        🏆 Top 3
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end">
        <CardPodio linha={segundo} pos={2} alturaPx={120} />
        <CardPodio linha={primeiro} pos={1} alturaPx={170} />
        <CardPodio linha={terceiro} pos={3} alturaPx={90} />
      </div>
    </section>
  )
}

function CardPodio({
  linha,
  pos,
  alturaPx,
}: {
  linha: RankingRow | null
  pos: number
  alturaPx: number
}) {
  if (!linha) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs" style={{ height: alturaPx }}>
          —
        </div>
      </div>
    )
  }
  const corMedalha = COR_PODIO[pos - 1]
  return (
    <div className="flex flex-col items-center">
      {/* Avatar + nome em cima */}
      <div className="flex flex-col items-center gap-1.5 mb-2 min-w-0 w-full">
        <div
          className={`relative overflow-hidden border-4 ${pos === 1 ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'}`}
          style={{ borderColor: corMedalha, borderRadius: '9999px' }}
        >
          {linha.atletica.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={linha.atletica.foto_url} alt={linha.atletica.nome} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white/80 font-bold"
              style={{ backgroundColor: `${linha.atletica.cor}55`, ...fontDisplay }}
            >
              <span className={pos === 1 ? 'text-2xl' : 'text-xl'}>
                {(linha.atletica.sigla || linha.atletica.nome).slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <p
          className={`uppercase leading-tight text-center w-full ${pos === 1 ? 'text-base sm:text-xl' : 'text-sm sm:text-base'}`}
          style={fontDisplay}
        >
          {linha.atletica.nome}
        </p>
        <p className={`font-mono font-bold tabular-nums ${pos === 1 ? 'text-xl sm:text-2xl text-wfl-yellow' : 'text-base sm:text-lg text-white/90'}`}>
          {linha.tempoCombinadoMs != null ? msParaDisplay(linha.tempoCombinadoMs) : '—'}
        </p>
        {linha.descontoBarrasMs > 0 && (
          <p className="text-[10px] text-white/50">
            🏋️ −{linha.descontoBarrasMs / 1000}s
          </p>
        )}
      </div>

      {/* Bloco do pódio */}
      <div
        className="w-full flex items-center justify-center text-3xl sm:text-5xl font-bold border-t-4"
        style={{
          height: alturaPx,
          backgroundColor: `${corMedalha}22`,
          borderTopColor: corMedalha,
          color: corMedalha,
          ...fontDisplay,
        }}
      >
        <div className="flex flex-col items-center leading-none">
          <span className="text-2xl sm:text-3xl mb-1">{MEDALHA[pos - 1]}</span>
          <span>{pos}º</span>
        </div>
      </div>
    </div>
  )
}

function LinhaResultado({ linha }: { linha: RankingRow }) {
  const tem = linha.tempoCombinadoMs != null
  return (
    <li
      className="flex items-center gap-2.5 px-3 py-2.5 bg-white/5 border-l-4"
      style={{ borderLeftColor: linha.atletica.cor }}
    >
      <span
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold tabular-nums text-white/80"
        style={fontDisplay}
      >
        {linha.posicao}º
      </span>
      <div
        className="relative w-9 h-9 flex-shrink-0 overflow-hidden border-2"
        style={{ borderColor: linha.atletica.cor, borderRadius: '9999px' }}
      >
        {linha.atletica.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={linha.atletica.foto_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/80"
            style={{ backgroundColor: `${linha.atletica.cor}33` }}
          >
            {(linha.atletica.sigla || linha.atletica.nome).slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{linha.atletica.nome}</p>
        <p className="text-[10px] text-white/40 tabular-nums">
          {linha.melhorRunNormal && (
            <>
              <span className="text-wfl-yellow">A</span> {msParaDisplay(linha.melhorRunNormal.tempo_final_ms)}
            </>
          )}
          {linha.melhorRunNormal && linha.melhorRunDinamico && ' · '}
          {linha.melhorRunDinamico && (
            <>
              <span className="text-wfl-red">D</span> {msParaDisplay(linha.melhorRunDinamico.tempo_final_ms)}
            </>
          )}
          {linha.descontoBarrasMs > 0 && (
            <>
              {' · '}
              <span className="text-wfl-yellow">🏋️ −{linha.descontoBarrasMs / 1000}s</span>
            </>
          )}
        </p>
      </div>
      <span
        className={`font-mono font-bold tabular-nums text-base sm:text-lg flex-shrink-0 ${
          linha.totalPenalidadesMs > 0 ? 'text-wfl-red' : 'text-wfl-yellow'
        }`}
      >
        {tem ? msParaDisplay(linha.tempoCombinadoMs!) : '—'}
      </span>
    </li>
  )
}
