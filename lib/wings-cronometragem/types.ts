import type { Fase, Modalidade, Sexo, TipoProva } from './tempo'

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
  tipo_prova: TipoProva
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

export type EstadoEquipe = 'completo' | 'parcial' | 'sem-tempo'

export type RankingRow = {
  atletica: AtleticaComp
  atletas: AtletaComp[]
  melhorRunNormal: RunComp | null
  melhorRunDinamico: RunComp | null
  /** Soma dos tempos finais de normal + dinâmica. null se faltar uma. */
  tempoCombinadoMs: number | null
  /** Total de penalidades acumulado nas runs. */
  totalPenalidadesMs: number
  estado: EstadoEquipe
  posicao: number
  /**
   * Mantido por compat com componentes antigos do show.
   * Aponta pra "melhor referência" pra animação:
   * preferência: dinâmico > normal > null.
   */
  melhorRun: RunComp | null
}
