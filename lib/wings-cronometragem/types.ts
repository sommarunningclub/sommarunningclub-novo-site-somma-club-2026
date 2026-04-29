import type { Fase, Modalidade, Sexo } from './tempo'

export type AtleticaComp = {
  id: string
  nome: string
  sigla: string | null
  cor: string
  foto_url: string | null
  created_at: string
}

export type AtletaComp = {
  id: string
  atletica_id: string
  nome: string
  sexo: Sexo
  modalidade: Modalidade
  created_at: string
}

export type RunComp = {
  id: string
  atletica_id: string
  fase: Fase
  bateria: number | null
  raia: number | null
  tempo_bruto_ms: number
  penalidade_1_ms: number
  penalidade_2_ms: number
  penalidade_3_ms: number
  penalidade_4_ms: number
  tempo_final_ms: number
  observacoes: string | null
  created_at: string
}

export type RankingRow = {
  atletica: AtleticaComp
  atletas: AtletaComp[]
  melhorRun: RunComp | null
  posicao: number
}
