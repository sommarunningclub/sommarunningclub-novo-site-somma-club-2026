// Utilitários de formatação de tempo para cronometragem do revezamento.
// Tempos sempre armazenados em milissegundos no banco.

export function msParaDisplay(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) ms = 0
  const totalSegundos = Math.floor(ms / 1000)
  const minutos = Math.floor(totalSegundos / 60)
  const segundos = totalSegundos % 60
  const milis = Math.floor(ms % 1000)
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}.${String(milis).padStart(3, '0')}`
}

// Aceita: "MM:SS.ms", "M:SS.ms", "SS.ms", "SS"
// Retorna ms ou NaN se inválido.
export function displayParaMs(str: string): number {
  if (!str) return NaN
  const limpo = str.trim().replace(',', '.')

  // Caso "MM:SS.ms" ou "M:SS.ms"
  const matchCompleto = limpo.match(/^(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/)
  if (matchCompleto) {
    const m = parseInt(matchCompleto[1], 10)
    const s = parseInt(matchCompleto[2], 10)
    const ms = matchCompleto[3] ? parseInt(matchCompleto[3].padEnd(3, '0'), 10) : 0
    if (s >= 60) return NaN
    return m * 60_000 + s * 1000 + ms
  }

  // Caso "SS.ms" ou "SS"
  const matchSeg = limpo.match(/^(\d{1,3})(?:\.(\d{1,3}))?$/)
  if (matchSeg) {
    const s = parseInt(matchSeg[1], 10)
    const ms = matchSeg[2] ? parseInt(matchSeg[2].padEnd(3, '0'), 10) : 0
    return s * 1000 + ms
  }

  return NaN
}

export function segundosParaMs(s: number): number {
  return Math.round(s * 1000)
}

export const MODALIDADES = [
  { num: 1, nome: 'Corrida saltada' },
  { num: 2, nome: 'Corrida lateral esquerda' },
  { num: 3, nome: 'Corrida de costas' },
  { num: 4, nome: 'Corrida lateral direita' },
] as const

export type Modalidade = 1 | 2 | 3 | 4
export type Fase = 'classificatoria' | 'final'
export type Sexo = 'M' | 'F'
export type TipoProva = 'normal' | 'dinamico'

export const TIPO_PROVA_LABEL: Record<TipoProva, string> = {
  normal: 'Atletismo normal',
  dinamico: 'Dinâmica',
}
