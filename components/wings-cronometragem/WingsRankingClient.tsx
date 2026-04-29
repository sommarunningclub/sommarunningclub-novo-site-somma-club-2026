'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRanking } from './useRanking'
import { msParaDisplay } from '@/lib/wings-cronometragem/tempo'
import type { Fase } from '@/lib/wings-cronometragem/tempo'
import type { RankingRow } from '@/lib/wings-cronometragem/types'

const fontDisplay = { fontFamily: 'var(--font-bebas), sans-serif' }
const fontBody = { fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }

const MEDALHAS = ['🥇', '🥈', '🥉']

export default function WingsRankingClient() {
  const [fase, setFase] = useState<Fase>('classificatoria')
  const { ranking, loading, aoVivo } = useRanking(fase)

  // Atléticas classificadas para final = top 8 das classificatórias
  const classificadasParaFinal = (() => {
    if (fase !== 'classificatoria') return new Set<string>()
    const comTempo = ranking.filter(r => r.melhorRun)
    return new Set(comTempo.slice(0, 8).map(r => r.atletica.id))
  })()

  return (
    <main className="min-h-screen bg-wfl-navy text-white" style={fontBody}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/Logo_Nova_Somma_Branca_Laranja.svg"
              alt="Somma"
              width={80}
              height={28}
              className="h-7 sm:h-8 w-auto"
            />
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-wfl-yellow font-bold">Ranking ao vivo</p>
              <h1 className="text-base sm:text-xl uppercase leading-none" style={fontDisplay}>
                Wings das Atléticas 2026
              </h1>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              aoVivo ? 'bg-wfl-red text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${aoVivo ? 'bg-white animate-pulse' : 'bg-white/40'}`}
            />
            {aoVivo ? 'AO VIVO' : 'Conectando…'}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(['classificatoria', 'final'] as Fase[]).map(f => (
            <button
              key={f}
              onClick={() => setFase(f)}
              className={`py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                fase === f
                  ? 'bg-wfl-red text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {f === 'classificatoria' ? 'Classificatórias' : 'Final'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-white/40 py-10">Carregando ranking…</p>
        ) : ranking.length === 0 ? (
          <p className="text-center text-white/40 py-10">Nenhuma atlética cadastrada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {ranking.map((linha, idx) => (
              <RankingRowItem
                key={linha.atletica.id}
                linha={linha}
                index={idx}
                classificadaParaFinal={classificadasParaFinal.has(linha.atletica.id)}
              />
            ))}
          </ul>
        )}

        {/* Legenda */}
        <p className="mt-6 text-[10px] text-white/40 text-center uppercase tracking-wider">
          Tempo final = bruto + soma das penalidades · Atualização em tempo real
        </p>
      </div>
    </main>
  )
}

function RankingRowItem({
  linha,
  index,
  classificadaParaFinal,
}: {
  linha: RankingRow
  index: number
  classificadaParaFinal: boolean
}) {
  const { atletica, atletas, melhorRun, posicao } = linha
  const top3 = posicao >= 1 && posicao <= 3
  const totalPenalidades = melhorRun
    ? melhorRun.penalidade_1_ms +
      melhorRun.penalidade_2_ms +
      melhorRun.penalidade_3_ms +
      melhorRun.penalidade_4_ms
    : 0

  return (
    <li
      className={`relative bg-white/5 border-l-4 transition-all ${
        top3 ? 'border-wfl-yellow' : 'border-white/10'
      }`}
      style={{
        borderLeftColor: melhorRun ? atletica.cor : undefined,
      }}
    >
      <div className="px-3 sm:px-4 py-3 grid grid-cols-[40px_1fr_auto] items-center gap-3">
        {/* Posição */}
        <div className="text-center">
          {melhorRun ? (
            top3 ? (
              <span className="text-2xl sm:text-3xl">{MEDALHAS[posicao - 1]}</span>
            ) : (
              <span className="font-mono text-xl sm:text-2xl text-white/70 tabular-nums" style={fontDisplay}>
                {posicao}º
              </span>
            )
          ) : (
            <span className="text-white/30 text-xs">—</span>
          )}
        </div>

        {/* Atlética + atletas */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg uppercase leading-tight truncate" style={fontDisplay}>
              {atletica.nome}
            </h3>
            {atletica.sigla && (
              <span className="text-[9px] uppercase tracking-wider text-white/40 hidden sm:inline">
                · {atletica.sigla}
              </span>
            )}
            {classificadaParaFinal && (
              <span className="px-1.5 py-0.5 bg-wfl-yellow text-wfl-navy text-[9px] font-bold uppercase tracking-wider">
                Final
              </span>
            )}
          </div>
          {atletas.length > 0 && (
            <p className="mt-0.5 text-[10px] sm:text-xs text-white/50 truncate">
              {atletas
                .sort((a, b) => a.modalidade - b.modalidade)
                .map(a => a.nome.split(' ')[0])
                .join(' · ')}
            </p>
          )}
        </div>

        {/* Tempo */}
        <div className="text-right">
          {melhorRun ? (
            <>
              <div
                className={`font-mono text-base sm:text-xl font-bold tabular-nums ${
                  totalPenalidades > 0 ? 'text-wfl-red' : 'text-wfl-yellow'
                }`}
              >
                {msParaDisplay(melhorRun.tempo_final_ms)}
              </div>
              {totalPenalidades > 0 && (
                <div className="text-[9px] text-white/40 tabular-nums">
                  bruto {msParaDisplay(melhorRun.tempo_bruto_ms)} + {(totalPenalidades / 1000).toFixed(1)}s
                </div>
              )}
            </>
          ) : (
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Aguardando</span>
          )}
        </div>
      </div>
    </li>
  )
}
