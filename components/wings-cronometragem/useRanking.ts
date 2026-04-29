'use client'

import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/wings/supabase'
import type { AtleticaComp, AtletaComp, RunComp, RankingRow } from '@/lib/wings-cronometragem/types'
import type { Fase } from '@/lib/wings-cronometragem/tempo'

function montarRanking(
  atleticas: AtleticaComp[],
  atletas: AtletaComp[],
  runs: RunComp[],
  fase: Fase
): RankingRow[] {
  const runsFase = runs.filter(r => r.fase === fase)
  const melhorPorAtletica = new Map<string, RunComp>()
  for (const run of runsFase) {
    const atual = melhorPorAtletica.get(run.atletica_id)
    if (!atual || run.tempo_final_ms < atual.tempo_final_ms) {
      melhorPorAtletica.set(run.atletica_id, run)
    }
  }

  const linhas: RankingRow[] = atleticas.map(atletica => ({
    atletica,
    atletas: atletas.filter(a => a.atletica_id === atletica.id),
    melhorRun: melhorPorAtletica.get(atletica.id) ?? null,
    posicao: 0,
  }))

  // Ordena: quem tem run primeiro (por tempo), depois quem não tem
  linhas.sort((a, b) => {
    if (a.melhorRun && b.melhorRun) return a.melhorRun.tempo_final_ms - b.melhorRun.tempo_final_ms
    if (a.melhorRun) return -1
    if (b.melhorRun) return 1
    return a.atletica.nome.localeCompare(b.atletica.nome)
  })

  let posicao = 0
  for (const linha of linhas) {
    if (linha.melhorRun) {
      posicao += 1
      linha.posicao = posicao
    }
  }

  return linhas
}

export function useRanking(fase: Fase) {
  const [atleticas, setAtleticas] = useState<AtleticaComp[]>([])
  const [atletas, setAtletas] = useState<AtletaComp[]>([])
  const [runs, setRuns] = useState<RunComp[]>([])
  const [loading, setLoading] = useState(true)
  const [aoVivo, setAoVivo] = useState(false)

  useEffect(() => {
    let cancelado = false
    async function carregar() {
      try {
        const [aR, atR, rR] = await Promise.all([
          fetch('/api/wings-comp/atleticas').then(r => r.json()),
          fetch('/api/wings-comp/atletas').then(r => r.json()),
          fetch('/api/wings-comp/runs').then(r => r.json()),
        ])
        if (cancelado) return
        setAtleticas(aR.atleticas ?? [])
        setAtletas(atR.atletas ?? [])
        setRuns(rR.runs ?? [])
      } finally {
        if (!cancelado) setLoading(false)
      }
    }
    carregar()
    return () => { cancelado = true }
  }, [])

  useEffect(() => {
    const supabase = getBrowserClient()
    const channel = supabase
      .channel('wings-comp-ranking')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wings_comp_runs' }, payload => {
        setRuns(prev => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as RunComp]
          if (payload.eventType === 'UPDATE') {
            return prev.map(r => (r.id === (payload.new as RunComp).id ? (payload.new as RunComp) : r))
          }
          if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as { id: string }).id
            return prev.filter(r => r.id !== oldId)
          }
          return prev
        })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wings_comp_atleticas' }, payload => {
        setAtleticas(prev => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as AtleticaComp]
          if (payload.eventType === 'UPDATE') {
            return prev.map(a => (a.id === (payload.new as AtleticaComp).id ? (payload.new as AtleticaComp) : a))
          }
          if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as { id: string }).id
            return prev.filter(a => a.id !== oldId)
          }
          return prev
        })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wings_comp_atletas' }, payload => {
        setAtletas(prev => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as AtletaComp]
          if (payload.eventType === 'UPDATE') {
            return prev.map(a => (a.id === (payload.new as AtletaComp).id ? (payload.new as AtletaComp) : a))
          }
          if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as { id: string }).id
            return prev.filter(a => a.id !== oldId)
          }
          return prev
        })
      })
      .subscribe(status => {
        setAoVivo(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const ranking = montarRanking(atleticas, atletas, runs, fase)

  return { ranking, loading, aoVivo, atleticas, atletas, runs }
}
