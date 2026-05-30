// Motor de detecção de duplicidade / antifraude do Esplanada Run.
// Sem dependências externas: similaridade de nome por trigramas (equivalente ao pg_trgm).

export interface InscritoFraud {
  id: string
  nome: string
  cpf: string
  email: string
  telefone: string
  data_nascimento: string
  cidade: string
  estado: string
}

export const onlyDigits = (s: string) => (s || '').replace(/\D/g, '')

export function normalizeName(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function trigrams(input: string): Set<string> {
  const s = `  ${input} `
  const set = new Set<string>()
  for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3))
  return set
}

// Similaridade 0..1 (Jaccard de trigramas), aproxima similarity() do pg_trgm
export function nameSimilarity(a: string, b: string): number {
  const na = normalizeName(a)
  const nb = normalizeName(b)
  if (!na || !nb) return 0
  if (na === nb) return 1
  const A = trigrams(na)
  const B = trigrams(nb)
  let inter = 0
  A.forEach((t) => { if (B.has(t)) inter++ })
  const union = A.size + B.size - inter
  return union ? inter / union : 0
}

export interface ScoreResult {
  score: number
  reasons: string[]
}

// Calcula o score de um registro comparando com todos os outros
export function computeScore(target: InscritoFraud, others: InscritoFraud[]): ScoreResult {
  let score = 0
  const reasons: string[] = []
  const tCpf = onlyDigits(target.cpf)
  const tTel = onlyDigits(target.telefone)
  const tEmail = (target.email || '').trim().toLowerCase()
  const tNasc = (target.data_nascimento || '').trim()
  const tCidade = `${(target.cidade || '').trim().toLowerCase()}/${(target.estado || '').trim().toLowerCase()}`

  let cpfHit = false, telHit = false, nascHit = false, emailHit = false, nomeHit = false, cidadeHit = false

  for (const o of others) {
    if (o.id === target.id) continue
    if (!cpfHit && tCpf && onlyDigits(o.cpf) === tCpf) cpfHit = true
    if (!telHit && tTel && onlyDigits(o.telefone) === tTel) telHit = true
    if (!nascHit && tNasc && (o.data_nascimento || '').trim() === tNasc) nascHit = true
    if (!emailHit && tEmail && (o.email || '').trim().toLowerCase() === tEmail) emailHit = true
    if (!nomeHit && nameSimilarity(target.nome, o.nome) >= 0.6) nomeHit = true
    if (!cidadeHit && `${(o.cidade || '').trim().toLowerCase()}/${(o.estado || '').trim().toLowerCase()}` === tCidade) cidadeHit = true
  }

  if (cpfHit) { score += 50; reasons.push('mesmo CPF') }
  if (telHit) { score += 30; reasons.push('mesmo telefone') }
  if (nascHit) { score += 30; reasons.push('mesma data de nascimento') }
  if (emailHit) { score += 20; reasons.push('mesmo e-mail') }
  if (nomeHit) { score += 20; reasons.push('nome muito similar') }
  if (cidadeHit && reasons.length > 0) { score += 10; reasons.push('mesma cidade/estado') }

  return { score, reasons }
}

export type AuditStatus = 'ativo' | 'duplicado' | 'suspeito' | 'cancelado' | 'revisao_manual'

export function statusFromScore(score: number): AuditStatus {
  if (score >= 100) return 'duplicado'
  if (score >= 70) return 'suspeito'
  return 'ativo'
}

// Agrupa possíveis duplicados via union-find usando sinais fortes
export function buildDuplicateGroups(rows: InscritoFraud[]): Map<string, string[]> {
  const parent = new Map<string, string>()
  const find = (x: string): string => {
    let r = x
    while (parent.get(r) !== r) r = parent.get(r)!
    let cur = x
    while (parent.get(cur) !== r) { const nxt = parent.get(cur)!; parent.set(cur, r); cur = nxt }
    return r
  }
  const union = (a: string, b: string) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb) }

  rows.forEach((r) => parent.set(r.id, r.id))

  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i], b = rows[j]
      const sameCpf = onlyDigits(a.cpf) && onlyDigits(a.cpf) === onlyDigits(b.cpf)
      const sameTel = onlyDigits(a.telefone) && onlyDigits(a.telefone) === onlyDigits(b.telefone)
      const sameEmail = a.email && a.email.trim().toLowerCase() === (b.email || '').trim().toLowerCase()
      const sim = nameSimilarity(a.nome, b.nome)
      const sameNasc = a.data_nascimento && (a.data_nascimento || '').trim() === (b.data_nascimento || '').trim()
      const strongLink = sameCpf || sameTel || sameEmail || sim >= 0.85 || (sim >= 0.6 && sameNasc)
      if (strongLink) union(a.id, b.id)
    }
  }

  const groups = new Map<string, string[]>()
  rows.forEach((r) => {
    const root = find(r.id)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root)!.push(r.id)
  })
  // Mantém só grupos com mais de 1 membro
  const result = new Map<string, string[]>()
  groups.forEach((members, root) => { if (members.length > 1) result.set(root, members) })
  return result
}
