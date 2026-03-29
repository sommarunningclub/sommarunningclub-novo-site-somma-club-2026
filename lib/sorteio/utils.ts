// lib/sorteio/utils.ts

/**
 * Fisher-Yates shuffle com crypto.getRandomValues para aleatoriedade criptográfica
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const randomBuffer = new Uint32Array(1)
    crypto.getRandomValues(randomBuffer)
    const j = randomBuffer[0] % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function formatDateTime(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

export function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

export function descricaoFiltros(filtros: Record<string, unknown>): string {
  const partes: string[] = []
  if (filtros.sexo && filtros.sexo !== 'todos') {
    partes.push(filtros.sexo === 'masculino' ? 'Masculino' : 'Feminino')
  }
  if (filtros.pelotao) partes.push(`${filtros.pelotao}`)
  if (filtros.validacao === 'validados') partes.push('Validados')
  if (filtros.validacao === 'pendentes') partes.push('Pendentes')
  if (filtros.data_inscricao) partes.push(`Dia ${formatDate(filtros.data_inscricao as string)}`)
  return partes.length > 0 ? partes.join(' · ') : 'Sem filtros'
}
