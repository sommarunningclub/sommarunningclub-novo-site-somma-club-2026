# Módulo de Sorteio Somma Club — Plano de Implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: Use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`) para rastreamento.

**Objetivo:** Adicionar módulo de sorteio integrado à área Insider do Site Somma Club, com filtros, animação slot machine e controle de ganhadores.

**Arquitetura:** Novo módulo `ModuloSorteio` dentro da página Insider existente (`/insider-conect`), seguindo o mesmo padrão de `ModuloCheckins` e `ModuloValidar`. API routes server-side com Supabase service role key. Animação slot machine em canvas para revelar ganhadores.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase, Canvas API, lucide-react

---

## Estrutura de Arquivos

### Arquivos a criar:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `lib/sorteio/types.ts` | Tipos TypeScript do módulo |
| `lib/sorteio/utils.ts` | Fisher-Yates shuffle, formatadores |
| `app/api/sorteio/participantes/route.ts` | GET: busca check-ins filtrados + estatísticas |
| `app/api/sorteio/sortear/route.ts` | POST: executa sorteio e salva resultado |
| `app/api/sorteio/ganhadores/[id]/confirmar/route.ts` | PATCH: marca ganhador confirmado |
| `app/api/sorteio/ganhadores/[id]/ausente/route.ts` | PATCH: marca ganhador ausente |
| `app/api/sorteio/ganhadores/[id]/resorteio/route.ts` | POST: sorteia substituto |
| `app/api/sorteio/historico/route.ts` | GET: lista sorteios do evento |
| `components/sorteio/SorteioMachine.tsx` | Animação slot machine em canvas |
| `components/sorteio/GanhadorCard.tsx` | Card individual do ganhador |
| `components/sorteio/SorteioHistorico.tsx` | Lista colapsável de sorteios anteriores |

### Arquivos a modificar:

| Arquivo | Modificação |
|---------|-------------|
| `app/insider-conect/page.tsx` | Adicionar `ModuloSorteio` + ícone na navegação |

---

## Task 1: Tipos e Utilitários

**Arquivos:**
- Criar: `lib/sorteio/types.ts`
- Criar: `lib/sorteio/utils.ts`

- [ ] **Passo 1: Criar `lib/sorteio/types.ts`**

```typescript
// lib/sorteio/types.ts

export type FiltrosSorteio = {
  evento_id: string
  sexo?: 'masculino' | 'feminino'
  pelotao?: '4km' | '6km' | '8km'
  data_inscricao?: string
  validacao?: 'todos' | 'validados' | 'pendentes'
}

export type ParticipanteSorteio = {
  id: string
  nome_completo: string
  email: string
  telefone: string
  cpf: string
  sexo: string
  pelotao: string
  data_hora_checkin: string
  validacao_do_checkin: boolean
  numero: number
}

export type EstatisticasSorteio = {
  total: number
  masculino: number
  feminino: number
  por_pelotao: Record<string, number>
  validados: number
  pendentes: number
}

export type Ganhador = {
  id: string
  sorteio_id: string
  checkin_id: string
  posicao: number
  numero_sorteado: number
  status: 'pendente' | 'confirmado' | 'ausente'
  confirmado_em: string | null
  substituido_por: string | null
  created_at: string
  checkin: {
    nome_completo: string
    email: string
    telefone: string
    cpf: string
    sexo: string
    pelotao: string
  }
  substituto?: Ganhador
}

export type Sorteio = {
  id: string
  evento_id: string
  titulo: string
  filtros_aplicados: FiltrosSorteio
  total_elegiveis: number
  created_at: string
  criado_por: string
  ganhadores: Ganhador[]
}
```

- [ ] **Passo 2: Criar `lib/sorteio/utils.ts`**

```typescript
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
```

- [ ] **Passo 3: Commit**

```bash
git add lib/sorteio/types.ts lib/sorteio/utils.ts
git commit -m "feat(sorteio): adicionar tipos e utilitários do módulo de sorteio"
```

---

## Task 2: API — Buscar Participantes

**Arquivos:**
- Criar: `app/api/sorteio/participantes/route.ts`

- [ ] **Passo 1: Criar a API route**

```typescript
// app/api/sorteio/participantes/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const evento_id = searchParams.get('evento_id')
    const sexo = searchParams.get('sexo')
    const pelotao = searchParams.get('pelotao')
    const data_inscricao = searchParams.get('data_inscricao')
    const validacao = searchParams.get('validacao')

    if (!evento_id) {
      return NextResponse.json({ error: 'evento_id é obrigatório' }, { status: 400 })
    }

    let query = supabase
      .from('checkins')
      .select('id, nome_completo, email, telefone, cpf, sexo, pelotao, data_hora_checkin, validacao_do_checkin')
      .eq('evento_id', evento_id)
      .order('data_hora_checkin', { ascending: true })

    if (sexo && sexo !== 'todos') {
      query = query.eq('sexo', sexo)
    }
    if (pelotao && pelotao !== 'todos') {
      query = query.eq('pelotao', pelotao)
    }
    if (data_inscricao) {
      query = query.eq('data_do_evento', data_inscricao)
    }
    if (validacao === 'validados') {
      query = query.eq('validacao_do_checkin', true)
    } else if (validacao === 'pendentes') {
      query = query.eq('validacao_do_checkin', false)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const participantes = (data || []).map((p, i) => ({
      ...p,
      numero: i + 1,
    }))

    const stats = {
      total: participantes.length,
      masculino: participantes.filter(p => p.sexo === 'masculino').length,
      feminino: participantes.filter(p => p.sexo === 'feminino').length,
      por_pelotao: participantes.reduce((acc: Record<string, number>, p) => {
        const key = p.pelotao || 'sem_pelotao'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {}),
      validados: participantes.filter(p => p.validacao_do_checkin).length,
      pendentes: participantes.filter(p => !p.validacao_do_checkin).length,
    }

    return NextResponse.json({ participantes, stats })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Passo 2: Testar manualmente**

Executar: `curl "http://localhost:3000/api/sorteio/participantes?evento_id=<ID_EVENTO_REAL>"`
Esperado: JSON com `participantes` (array numerado) e `stats` (contagens)

- [ ] **Passo 3: Commit**

```bash
git add app/api/sorteio/participantes/route.ts
git commit -m "feat(sorteio): adicionar API de participantes com filtros"
```

---

## Task 3: API — Executar Sorteio

**Arquivos:**
- Criar: `app/api/sorteio/sortear/route.ts`

- [ ] **Passo 1: Criar a API route**

```typescript
// app/api/sorteio/sortear/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { fisherYatesShuffle } from '@/lib/sorteio/utils'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { evento_id, titulo, quantidade, filtros, criado_por } = body

    if (!evento_id || !titulo || !quantidade) {
      return NextResponse.json({ error: 'evento_id, titulo e quantidade são obrigatórios' }, { status: 400 })
    }

    // Buscar participantes com filtros
    let query = supabase
      .from('checkins')
      .select('id, nome_completo, email, telefone, cpf, sexo, pelotao, data_hora_checkin, validacao_do_checkin')
      .eq('evento_id', evento_id)
      .order('data_hora_checkin', { ascending: true })

    if (filtros?.sexo && filtros.sexo !== 'todos') {
      query = query.eq('sexo', filtros.sexo)
    }
    if (filtros?.pelotao && filtros.pelotao !== 'todos') {
      query = query.eq('pelotao', filtros.pelotao)
    }
    if (filtros?.data_inscricao) {
      query = query.eq('data_do_evento', filtros.data_inscricao)
    }
    if (filtros?.validacao === 'validados') {
      query = query.eq('validacao_do_checkin', true)
    } else if (filtros?.validacao === 'pendentes') {
      query = query.eq('validacao_do_checkin', false)
    }

    const { data: participantes, error: pError } = await query

    if (pError) {
      return NextResponse.json({ error: pError.message }, { status: 500 })
    }

    if (!participantes || participantes.length === 0) {
      return NextResponse.json({ error: 'Nenhum participante encontrado com os filtros aplicados' }, { status: 400 })
    }

    if (quantidade > participantes.length) {
      return NextResponse.json({
        error: `Quantidade (${quantidade}) maior que participantes disponíveis (${participantes.length})`,
      }, { status: 400 })
    }

    // Enumerar e embaralhar
    const numerados = participantes.map((p, i) => ({ ...p, numero: i + 1 }))
    const embaralhados = fisherYatesShuffle(numerados)
    const sorteados = embaralhados.slice(0, quantidade)

    // Criar registro do sorteio
    const { data: sorteio, error: sError } = await supabase
      .from('sorteios')
      .insert({
        evento_id,
        titulo,
        filtros_aplicados: filtros || {},
        total_elegiveis: participantes.length,
        criado_por: criado_por || null,
      })
      .select()
      .single()

    if (sError) {
      return NextResponse.json({ error: sError.message }, { status: 500 })
    }

    // Inserir ganhadores
    const ganhadores = sorteados.map((p, i) => ({
      sorteio_id: sorteio.id,
      checkin_id: p.id,
      posicao: i + 1,
      numero_sorteado: p.numero,
      status: 'pendente',
    }))

    const { data: ganhadoresInseridos, error: gError } = await supabase
      .from('sorteio_ganhadores')
      .insert(ganhadores)
      .select()

    if (gError) {
      return NextResponse.json({ error: gError.message }, { status: 500 })
    }

    // Montar resposta com dados do checkin
    const resultado = (ganhadoresInseridos || []).map(g => {
      const checkin = sorteados.find(p => p.id === g.checkin_id)
      return {
        ...g,
        checkin: checkin ? {
          nome_completo: checkin.nome_completo,
          email: checkin.email,
          telefone: checkin.telefone,
          cpf: checkin.cpf,
          sexo: checkin.sexo,
          pelotao: checkin.pelotao,
        } : null,
      }
    })

    return NextResponse.json({
      sorteio: { ...sorteio, ganhadores: resultado },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Passo 2: Commit**

```bash
git add app/api/sorteio/sortear/route.ts
git commit -m "feat(sorteio): adicionar API para executar sorteio com Fisher-Yates"
```

---

## Task 4: API — Confirmar, Ausente e Resorteio

**Arquivos:**
- Criar: `app/api/sorteio/ganhadores/[id]/confirmar/route.ts`
- Criar: `app/api/sorteio/ganhadores/[id]/ausente/route.ts`
- Criar: `app/api/sorteio/ganhadores/[id]/resorteio/route.ts`

- [ ] **Passo 1: Criar API de confirmar**

```typescript
// app/api/sorteio/ganhadores/[id]/confirmar/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('sorteio_ganhadores')
      .update({
        status: 'confirmado',
        confirmado_em: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Passo 2: Criar API de ausente**

```typescript
// app/api/sorteio/ganhadores/[id]/ausente/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('sorteio_ganhadores')
      .update({ status: 'ausente' })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Passo 3: Criar API de resorteio**

```typescript
// app/api/sorteio/ganhadores/[id]/resorteio/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { fisherYatesShuffle } from '@/lib/sorteio/utils'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Buscar o ganhador ausente
    const { data: ganhadorAusente, error: gaError } = await supabase
      .from('sorteio_ganhadores')
      .select('*')
      .eq('id', id)
      .single()

    if (gaError || !ganhadorAusente) {
      return NextResponse.json({ error: 'Ganhador não encontrado' }, { status: 404 })
    }

    if (ganhadorAusente.status !== 'ausente') {
      return NextResponse.json({ error: 'Ganhador não está marcado como ausente' }, { status: 400 })
    }

    // Buscar o sorteio original e seus filtros
    const { data: sorteio, error: sError } = await supabase
      .from('sorteios')
      .select('*')
      .eq('id', ganhadorAusente.sorteio_id)
      .single()

    if (sError || !sorteio) {
      return NextResponse.json({ error: 'Sorteio não encontrado' }, { status: 404 })
    }

    // Buscar todos os ganhadores deste sorteio (para excluir do pool)
    const { data: todosGanhadores } = await supabase
      .from('sorteio_ganhadores')
      .select('checkin_id')
      .eq('sorteio_id', sorteio.id)

    const idsExcluidos = new Set((todosGanhadores || []).map(g => g.checkin_id))

    // Buscar pool original com mesmos filtros
    const filtros = sorteio.filtros_aplicados || {}
    let query = supabase
      .from('checkins')
      .select('id, nome_completo, email, telefone, cpf, sexo, pelotao, data_hora_checkin, validacao_do_checkin')
      .eq('evento_id', sorteio.evento_id)
      .order('data_hora_checkin', { ascending: true })

    if (filtros.sexo && filtros.sexo !== 'todos') {
      query = query.eq('sexo', filtros.sexo)
    }
    if (filtros.pelotao && filtros.pelotao !== 'todos') {
      query = query.eq('pelotao', filtros.pelotao)
    }
    if (filtros.data_inscricao) {
      query = query.eq('data_do_evento', filtros.data_inscricao)
    }
    if (filtros.validacao === 'validados') {
      query = query.eq('validacao_do_checkin', true)
    } else if (filtros.validacao === 'pendentes') {
      query = query.eq('validacao_do_checkin', false)
    }

    const { data: pool, error: pError } = await query

    if (pError) {
      return NextResponse.json({ error: pError.message }, { status: 500 })
    }

    // Filtrar excluídos
    const disponiveis = (pool || []).filter(p => !idsExcluidos.has(p.id))

    if (disponiveis.length === 0) {
      return NextResponse.json({ error: 'Nenhum participante disponível para resorteio' }, { status: 400 })
    }

    // Sortear substituto
    const embaralhados = fisherYatesShuffle(disponiveis)
    const substituto = embaralhados[0]
    const numerados = (pool || []).map((p, i) => ({ ...p, numero: i + 1 }))
    const numeroSorteado = numerados.find(p => p.id === substituto.id)?.numero || 0

    // Inserir novo ganhador
    const { data: novoGanhador, error: ngError } = await supabase
      .from('sorteio_ganhadores')
      .insert({
        sorteio_id: sorteio.id,
        checkin_id: substituto.id,
        posicao: ganhadorAusente.posicao,
        numero_sorteado: numeroSorteado,
        status: 'pendente',
      })
      .select()
      .single()

    if (ngError) {
      return NextResponse.json({ error: ngError.message }, { status: 500 })
    }

    // Atualizar ganhador ausente com referência ao substituto
    await supabase
      .from('sorteio_ganhadores')
      .update({ substituido_por: novoGanhador.id })
      .eq('id', id)

    return NextResponse.json({
      ganhador: {
        ...novoGanhador,
        checkin: {
          nome_completo: substituto.nome_completo,
          email: substituto.email,
          telefone: substituto.telefone,
          cpf: substituto.cpf,
          sexo: substituto.sexo,
          pelotao: substituto.pelotao,
        },
      },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Passo 4: Commit**

```bash
git add app/api/sorteio/ganhadores/
git commit -m "feat(sorteio): adicionar APIs de confirmar, ausente e resorteio"
```

---

## Task 5: API — Histórico de Sorteios

**Arquivos:**
- Criar: `app/api/sorteio/historico/route.ts`

- [ ] **Passo 1: Criar a API route**

```typescript
// app/api/sorteio/historico/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const evento_id = searchParams.get('evento_id')

    if (!evento_id) {
      return NextResponse.json({ error: 'evento_id é obrigatório' }, { status: 400 })
    }

    // Buscar sorteios do evento
    const { data: sorteios, error: sError } = await supabase
      .from('sorteios')
      .select('*')
      .eq('evento_id', evento_id)
      .order('created_at', { ascending: false })

    if (sError) {
      return NextResponse.json({ error: sError.message }, { status: 500 })
    }

    if (!sorteios || sorteios.length === 0) {
      return NextResponse.json({ sorteios: [] })
    }

    // Buscar ganhadores de todos os sorteios
    const sorteioIds = sorteios.map(s => s.id)
    const { data: ganhadores, error: gError } = await supabase
      .from('sorteio_ganhadores')
      .select('*')
      .in('sorteio_id', sorteioIds)
      .order('posicao', { ascending: true })

    if (gError) {
      return NextResponse.json({ error: gError.message }, { status: 500 })
    }

    // Buscar dados dos checkins dos ganhadores
    const checkinIds = [...new Set((ganhadores || []).map(g => g.checkin_id))]
    const { data: checkins } = await supabase
      .from('checkins')
      .select('id, nome_completo, email, telefone, cpf, sexo, pelotao')
      .in('id', checkinIds.length > 0 ? checkinIds : ['00000000-0000-0000-0000-000000000000'])

    const checkinMap = new Map((checkins || []).map(c => [c.id, c]))

    // Montar resposta
    const resultado = sorteios.map(s => ({
      ...s,
      ganhadores: (ganhadores || [])
        .filter(g => g.sorteio_id === s.id)
        .map(g => ({
          ...g,
          checkin: checkinMap.get(g.checkin_id) || null,
        })),
    }))

    return NextResponse.json({ sorteios: resultado })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Passo 2: Commit**

```bash
git add app/api/sorteio/historico/route.ts
git commit -m "feat(sorteio): adicionar API de histórico de sorteios"
```

---

## Task 6: Componente — SorteioMachine (Animação Slot Machine)

**Arquivos:**
- Criar: `components/sorteio/SorteioMachine.tsx`

- [ ] **Passo 1: Criar o componente**

```tsx
// components/sorteio/SorteioMachine.tsx
'use client'

import { useRef, useEffect, useCallback } from 'react'

type SorteioMachineProps = {
  nomes: string[]
  onComplete: () => void
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÉÊÍÓÔÕÚÇ 0123456789'.split('')

function criarCharMap() {
  const map: Record<string, number> = {}
  CHARS.forEach((c, i) => { map[c] = i })
  return map
}

const CHAR_MAP = criarCharMap()

export default function SorteioMachine({ nomes, onComplete }: SorteioMachineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nomeAtualRef = useRef(0)
  const animationRef = useRef<number>(0)

  const animarNome = useCallback((nome: string, aoTerminar: () => void) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const text = nome.toUpperCase().split('')
    const scale = Math.min(50, (canvas.width * 0.85) / Math.max(text.length, 1))
    const breaks = 0.003
    const endSpeed = 0.05
    const firstLetter = 180
    const delay = 30

    const offset: number[] = []
    const offsetV: number[] = []

    for (let i = 0; i < text.length; i++) {
      const f = firstLetter + delay * i
      offsetV[i] = endSpeed + breaks * f
      offset[i] = -(1 + f) * (breaks * f + 2 * endSpeed) / 2
    }

    let terminados = 0

    function loop() {
      if (!canvas || !ctx) return

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Faixa de destaque laranja Somma
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(255, 44, 3, 0.15)'
      ctx.fillRect(0, (canvas.height - scale) / 2, canvas.width, scale)

      terminados = 0

      for (let i = 0; i < text.length; i++) {
        ctx.fillStyle = '#ffffff'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.setTransform(
          1, 0, 0, 1,
          Math.floor((canvas.width - scale * (text.length - 1)) / 2),
          Math.floor(canvas.height / 2)
        )

        let o = offset[i]
        while (o < 0) o++
        o %= 1

        const h = Math.ceil(canvas.height / 2 / scale)

        for (let j = -h; j < h; j++) {
          let c = (CHAR_MAP[text[i]] ?? 0) + j - Math.floor(offset[i])
          while (c < 0) c += CHARS.length
          c %= CHARS.length

          const s = 1 - Math.abs(j + o) / (canvas.height / 2 / scale + 1)
          ctx.globalAlpha = s
          ctx.font = `bold ${scale * s}px monospace`
          ctx.fillText(CHARS[c], scale * i, (j + o) * scale)
        }

        offset[i] += offsetV[i]
        offsetV[i] -= breaks

        if (offsetV[i] < endSpeed) {
          offset[i] = 0
          offsetV[i] = 0
          terminados++
        }
      }

      if (terminados >= text.length) {
        // Renderizar o frame final com o nome completo
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1
        ctx.fillStyle = 'rgba(255, 44, 3, 0.15)'
        ctx.fillRect(0, (canvas.height - scale) / 2, canvas.width, scale)

        for (let i = 0; i < text.length; i++) {
          ctx.fillStyle = '#ffffff'
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          ctx.setTransform(
            1, 0, 0, 1,
            Math.floor((canvas.width - scale * (text.length - 1)) / 2),
            Math.floor(canvas.height / 2)
          )
          ctx.globalAlpha = 1
          ctx.font = `bold ${scale}px monospace`
          ctx.fillText(text[i], scale * i, 0)
        }

        setTimeout(aoTerminar, 1500)
        return
      }

      animationRef.current = requestAnimationFrame(loop)
    }

    animationRef.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(2, 2)

    function avancar() {
      if (nomeAtualRef.current >= nomes.length) {
        onComplete()
        return
      }
      animarNome(nomes[nomeAtualRef.current], () => {
        nomeAtualRef.current++
        avancar()
      })
    }

    avancar()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [nomes, onComplete, animarNome])

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-4">
        <p className="text-center text-zinc-500 text-sm mb-4 uppercase tracking-widest">
          Sorteando {nomeAtualRef.current + 1} de {nomes.length}
        </p>
        <canvas
          ref={canvasRef}
          className="w-full rounded-2xl"
          style={{ height: '200px', background: '#111' }}
        />
        <p className="text-center text-[#ff2c03] text-xs mt-4 uppercase tracking-widest animate-pulse">
          Sorteio em andamento...
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Passo 2: Commit**

```bash
git add components/sorteio/SorteioMachine.tsx
git commit -m "feat(sorteio): adicionar componente SorteioMachine com animação slot machine"
```

---

## Task 7: Componente — GanhadorCard

**Arquivos:**
- Criar: `components/sorteio/GanhadorCard.tsx`

- [ ] **Passo 1: Criar o componente**

```tsx
// components/sorteio/GanhadorCard.tsx
'use client'

import { useState } from 'react'
import { Check, X, RefreshCw, Loader2, Trophy, Phone, Mail } from 'lucide-react'
import type { Ganhador } from '@/lib/sorteio/types'

type GanhadorCardProps = {
  ganhador: Ganhador
  onConfirmar: (id: string) => Promise<void>
  onAusente: (id: string) => Promise<void>
  onResorteio: (id: string) => Promise<Ganhador | null>
}

export default function GanhadorCard({ ganhador, onConfirmar, onAusente, onResorteio }: GanhadorCardProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [substituto, setSubstituto] = useState<Ganhador | null>(ganhador.substituto || null)
  const [status, setStatus] = useState(ganhador.status)

  async function handleConfirmar() {
    setLoading('confirmar')
    try {
      await onConfirmar(ganhador.id)
      setStatus('confirmado')
    } finally {
      setLoading(null)
    }
  }

  async function handleAusente() {
    setLoading('ausente')
    try {
      await onAusente(ganhador.id)
      setStatus('ausente')
    } finally {
      setLoading(null)
    }
  }

  async function handleResorteio() {
    setLoading('resorteio')
    try {
      const novo = await onResorteio(ganhador.id)
      if (novo) setSubstituto(novo)
    } finally {
      setLoading(null)
    }
  }

  const corStatus = status === 'confirmado'
    ? 'border-green-800 bg-green-950/30'
    : status === 'ausente'
      ? 'border-red-900 bg-red-950/20'
      : 'border-zinc-800 bg-zinc-900'

  const badgeStatus = status === 'confirmado'
    ? 'bg-green-900/40 text-green-400'
    : status === 'ausente'
      ? 'bg-red-900/40 text-red-400'
      : 'bg-yellow-900/40 text-yellow-400'

  const labelStatus = status === 'confirmado' ? 'Confirmado' : status === 'ausente' ? 'Ausente' : 'Pendente'

  return (
    <div className="space-y-2">
      <div className={`border rounded-xl p-4 transition-all ${corStatus}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff2c03]/10 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-[#ff2c03]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white text-xs font-mono">#{ganhador.numero_sorteado}</span>
                <p className="text-white font-semibold text-sm">{ganhador.checkin.nome_completo}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStatus}`}>
                  {labelStatus}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                {ganhador.checkin.pelotao && (
                  <span className="text-xs bg-[#ff2c03]/10 text-[#ff2c03] px-2 py-0.5 rounded-full">
                    {ganhador.checkin.pelotao}
                  </span>
                )}
                <span className="text-zinc-500 text-xs capitalize">{ganhador.checkin.sexo}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="text-zinc-500 text-xs flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {ganhador.checkin.email}
                </span>
                <span className="text-zinc-500 text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {ganhador.checkin.telefone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {status === 'pendente' && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleConfirmar}
              disabled={loading !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-green-900/30 hover:bg-green-900/50 border border-green-800 text-green-400 rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading === 'confirmar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Confirmar
            </button>
            <button
              onClick={handleAusente}
              disabled={loading !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900 text-red-400 rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading === 'ausente' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Ausente
            </button>
          </div>
        )}

        {status === 'ausente' && !substituto && (
          <div className="mt-3">
            <button
              onClick={handleResorteio}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 bg-[#ff2c03]/10 hover:bg-[#ff2c03]/20 border border-[#ff2c03]/30 text-[#ff2c03] rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading === 'resorteio' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Resorteio
            </button>
          </div>
        )}
      </div>

      {substituto && (
        <div className="ml-6 border-l-2 border-[#ff2c03]/30 pl-4">
          <p className="text-xs text-zinc-500 mb-1">Substituto:</p>
          <GanhadorCard
            ganhador={substituto}
            onConfirmar={onConfirmar}
            onAusente={onAusente}
            onResorteio={onResorteio}
          />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Passo 2: Commit**

```bash
git add components/sorteio/GanhadorCard.tsx
git commit -m "feat(sorteio): adicionar componente GanhadorCard com ações de confirmar/ausente/resorteio"
```

---

## Task 8: Componente — SorteioHistorico

**Arquivos:**
- Criar: `components/sorteio/SorteioHistorico.tsx`

- [ ] **Passo 1: Criar o componente**

```tsx
// components/sorteio/SorteioHistorico.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, Clock, Trophy, Users } from 'lucide-react'
import type { Sorteio } from '@/lib/sorteio/types'
import { formatDateTime, descricaoFiltros } from '@/lib/sorteio/utils'

type SorteioHistoricoProps = {
  sorteios: Sorteio[]
}

export default function SorteioHistorico({ sorteios }: SorteioHistoricoProps) {
  const [expandido, setExpandido] = useState<string | null>(null)

  if (sorteios.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-600 text-sm">Nenhum sorteio realizado neste evento</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sorteios.map(s => {
        const aberto = expandido === s.id
        const confirmados = s.ganhadores.filter(g => g.status === 'confirmado').length
        const ausentes = s.ganhadores.filter(g => g.status === 'ausente').length
        const pendentes = s.ganhadores.filter(g => g.status === 'pendente').length

        return (
          <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandido(aberto ? null : s.id)}
              className="w-full text-left p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Trophy className="w-4 h-4 text-[#ff2c03]" />
                  <p className="text-white font-medium text-sm">{s.titulo}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDateTime(s.created_at)}
                  </span>
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> {s.total_elegiveis} elegíveis
                  </span>
                  <span className="text-zinc-600 text-xs">{descricaoFiltros(s.filtros_aplicados)}</span>
                </div>
                <div className="flex gap-2 mt-1.5">
                  {confirmados > 0 && <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">{confirmados} confirmado{confirmados > 1 ? 's' : ''}</span>}
                  {pendentes > 0 && <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded-full">{pendentes} pendente{pendentes > 1 ? 's' : ''}</span>}
                  {ausentes > 0 && <span className="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">{ausentes} ausente{ausentes > 1 ? 's' : ''}</span>}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform ${aberto ? 'rotate-180' : ''}`} />
            </button>

            {aberto && (
              <div className="border-t border-zinc-800 p-4 space-y-2">
                <p className="text-zinc-500 text-xs mb-2">Operado por: {s.criado_por || '—'}</p>
                {s.ganhadores.map(g => {
                  const corStatus = g.status === 'confirmado'
                    ? 'border-green-900/50 bg-green-950/20'
                    : g.status === 'ausente'
                      ? 'border-red-900/50 bg-red-950/10'
                      : 'border-zinc-700 bg-zinc-800/50'

                  const badgeStatus = g.status === 'confirmado'
                    ? 'bg-green-900/40 text-green-400'
                    : g.status === 'ausente'
                      ? 'bg-red-900/40 text-red-400'
                      : 'bg-yellow-900/40 text-yellow-400'

                  return (
                    <div key={g.id} className={`border rounded-lg p-3 ${corStatus}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-xs font-mono">#{g.numero_sorteado}</span>
                        <p className="text-white text-sm font-medium">{g.checkin?.nome_completo || '—'}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStatus}`}>
                          {g.status === 'confirmado' ? 'Confirmado' : g.status === 'ausente' ? 'Ausente' : 'Pendente'}
                        </span>
                        {g.checkin?.pelotao && (
                          <span className="text-xs bg-[#ff2c03]/10 text-[#ff2c03] px-2 py-0.5 rounded-full">{g.checkin.pelotao}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Passo 2: Commit**

```bash
git add components/sorteio/SorteioHistorico.tsx
git commit -m "feat(sorteio): adicionar componente SorteioHistorico com lista colapsável"
```

---

## Task 9: Integrar ModuloSorteio na Página Insider

**Arquivos:**
- Modificar: `app/insider-conect/page.tsx`

Esta é a task principal que junta tudo. O `ModuloSorteio` será adicionado como novo módulo na página Insider, seguindo exatamente o mesmo padrão dos módulos existentes (`ModuloCheckins`, `ModuloValidar`, `ModuloMembros`).

- [ ] **Passo 1: Adicionar imports no topo do arquivo**

No início de `app/insider-conect/page.tsx`, após os imports existentes de lucide-react, adicionar:

```typescript
import {
  Search, LogOut, Users, ClipboardList, CheckSquare,
  MessageCircle, Check, X, ShieldCheck, ChevronRight,
  ArrowLeft, Loader2, RefreshCw, Lock, ChevronDown,
  Trophy, Dices, Filter,
} from 'lucide-react'
import SorteioMachine from '@/components/sorteio/SorteioMachine'
import GanhadorCard from '@/components/sorteio/GanhadorCard'
import SorteioHistorico from '@/components/sorteio/SorteioHistorico'
import type { Ganhador, Sorteio, EstatisticasSorteio } from '@/lib/sorteio/types'
```

- [ ] **Passo 2: Atualizar o tipo `Modulo`**

Alterar a linha:

```typescript
type Modulo = 'home' | 'membros' | 'checkins' | 'validar'
```

Para:

```typescript
type Modulo = 'home' | 'membros' | 'checkins' | 'validar' | 'sorteio'
```

- [ ] **Passo 3: Criar o componente `ModuloSorteio`**

Inserir antes do comentário `// ─── Painel Principal` (antes da linha 623):

```tsx
// ─── Módulo: Sorteio ─────────────────────────────────────────────────────────

function ModuloSorteio({ insiderNome }: { insiderNome: string }) {
  const [eventos, setEventos] = useState<EventoOption[]>([])
  const [selectedEventoId, setSelectedEventoId] = useState('')
  const [stats, setStats] = useState<EstatisticasSorteio | null>(null)
  const [loading, setLoading] = useState(false)

  // Filtros
  const [sexo, setSexo] = useState('todos')
  const [pelotao, setPelotao] = useState('todos')
  const [dataInscricao, setDataInscricao] = useState('todos')
  const [validacao, setValidacao] = useState('todos')
  const [quantidade, setQuantidade] = useState(1)
  const [titulo, setTitulo] = useState('')

  // Resultado
  const [ganhadores, setGanhadores] = useState<Ganhador[]>([])
  const [sorteando, setSorteando] = useState(false)
  const [nomesAnimacao, setNomesAnimacao] = useState<string[]>([])
  const [animacaoCompleta, setAnimacaoCompleta] = useState(false)

  // Histórico
  const [historico, setHistorico] = useState<Sorteio[]>([])
  const [loadingHistorico, setLoadingHistorico] = useState(false)

  // Datas disponíveis para filtro
  const [datasDisponiveis, setDatasDisponiveis] = useState<string[]>([])

  // Buscar eventos no mount
  useEffect(() => {
    async function carregarEventos() {
      try {
        const res = await fetch('/api/insider/checkins')
        const data = await res.json()
        if (data.eventos) setEventos(data.eventos)
        if (data.evento?.id) setSelectedEventoId(data.evento.id)
      } catch { /* silencioso */ }
    }
    carregarEventos()
  }, [])

  // Buscar participantes quando filtros mudam
  const buscarParticipantes = useCallback(async () => {
    if (!selectedEventoId) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ evento_id: selectedEventoId })
      if (sexo !== 'todos') params.set('sexo', sexo)
      if (pelotao !== 'todos') params.set('pelotao', pelotao)
      if (dataInscricao !== 'todos') params.set('data_inscricao', dataInscricao)
      if (validacao !== 'todos') params.set('validacao', validacao)

      const res = await fetch(`/api/sorteio/participantes?${params}`)
      const data = await res.json()
      if (data.stats) setStats(data.stats)
      if (data.participantes) {
        const datas = [...new Set(data.participantes.map((p: { data_hora_checkin: string }) =>
          new Date(p.data_hora_checkin).toISOString().split('T')[0]
        ))].sort() as string[]
        setDatasDisponiveis(datas)
      }
    } finally {
      setLoading(false)
    }
  }, [selectedEventoId, sexo, pelotao, dataInscricao, validacao])

  useEffect(() => {
    buscarParticipantes()
  }, [buscarParticipantes])

  // Buscar histórico quando evento muda
  const buscarHistorico = useCallback(async () => {
    if (!selectedEventoId) return
    setLoadingHistorico(true)
    try {
      const res = await fetch(`/api/sorteio/historico?evento_id=${selectedEventoId}`)
      const data = await res.json()
      if (data.sorteios) setHistorico(data.sorteios)
    } finally {
      setLoadingHistorico(false)
    }
  }, [selectedEventoId])

  useEffect(() => {
    buscarHistorico()
  }, [buscarHistorico])

  function handleEventoChange(id: string) {
    setSelectedEventoId(id)
    setSexo('todos')
    setPelotao('todos')
    setDataInscricao('todos')
    setValidacao('todos')
    setGanhadores([])
    setAnimacaoCompleta(false)
  }

  async function executarSorteio() {
    if (!selectedEventoId || !titulo.trim()) return

    setSorteando(true)
    setGanhadores([])
    setAnimacaoCompleta(false)

    try {
      const res = await fetch('/api/sorteio/sortear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evento_id: selectedEventoId,
          titulo: titulo.trim(),
          quantidade,
          filtros: {
            sexo: sexo !== 'todos' ? sexo : undefined,
            pelotao: pelotao !== 'todos' ? pelotao : undefined,
            data_inscricao: dataInscricao !== 'todos' ? dataInscricao : undefined,
            validacao: validacao !== 'todos' ? validacao : undefined,
          },
          criado_por: insiderNome,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Erro ao sortear')
        setSorteando(false)
        return
      }

      const ganhadoresResult: Ganhador[] = data.sorteio.ganhadores
      setGanhadores(ganhadoresResult)
      setNomesAnimacao(ganhadoresResult.map(g => g.checkin.nome_completo))
    } catch {
      alert('Erro ao executar sorteio')
      setSorteando(false)
    }
  }

  function handleAnimacaoCompleta() {
    setAnimacaoCompleta(true)
    setSorteando(false)
    buscarHistorico()
  }

  async function handleConfirmar(id: string) {
    await fetch(`/api/sorteio/ganhadores/${id}/confirmar`, { method: 'PATCH' })
    setGanhadores(prev => prev.map(g => g.id === id ? { ...g, status: 'confirmado' as const } : g))
  }

  async function handleAusente(id: string) {
    await fetch(`/api/sorteio/ganhadores/${id}/ausente`, { method: 'PATCH' })
    setGanhadores(prev => prev.map(g => g.id === id ? { ...g, status: 'ausente' as const } : g))
  }

  async function handleResorteio(id: string): Promise<Ganhador | null> {
    const res = await fetch(`/api/sorteio/ganhadores/${id}/resorteio`, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || 'Erro no resorteio')
      return null
    }
    buscarHistorico()
    return data.ganhador
  }

  const selectClass = "w-full appearance-none bg-zinc-900 border border-zinc-700 focus:border-[#ff2c03] text-white rounded-xl px-4 py-3 text-sm outline-none transition-all cursor-pointer"

  return (
    <div className="space-y-4">
      {/* Animação Slot Machine */}
      {sorteando && nomesAnimacao.length > 0 && (
        <SorteioMachine nomes={nomesAnimacao} onComplete={handleAnimacaoCompleta} />
      )}

      {/* Seletor de Evento */}
      {eventos.length > 0 && (
        <EventoSelector
          eventos={eventos}
          selectedId={selectedEventoId}
          onChange={handleEventoChange}
        />
      )}

      {/* Estatísticas */}
      {stats && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Total', valor: stats.total, cor: 'text-white' },
              { label: 'Masculino', valor: stats.masculino, cor: 'text-blue-400' },
              { label: 'Feminino', valor: stats.feminino, cor: 'text-pink-400' },
            ].map(({ label, valor, cor }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(stats.por_pelotao).map(([nome, valor]) => (
              <div key={nome} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#ff2c03]">{valor}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{nome}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Validados', valor: stats.validados, cor: 'text-green-400' },
              { label: 'Pendentes', valor: stats.pendentes, cor: 'text-yellow-400' },
            ].map(({ label, valor, cor }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-[#ff2c03]" />
          <p className="text-white text-sm font-semibold">Filtros do Sorteio</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Sexo</label>
            <div className="relative">
              <select value={sexo} onChange={e => setSexo(e.target.value)} className={selectClass}>
                <option value="todos">Todos</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Pelotão</label>
            <div className="relative">
              <select value={pelotao} onChange={e => setPelotao(e.target.value)} className={selectClass}>
                <option value="todos">Todos</option>
                <option value="4km">4km</option>
                <option value="6km">6km</option>
                <option value="8km">8km</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Dia do Check-in</label>
            <div className="relative">
              <select value={dataInscricao} onChange={e => setDataInscricao(e.target.value)} className={selectClass}>
                <option value="todos">Todos os dias</option>
                {datasDisponiveis.map(d => (
                  <option key={d} value={d}>{new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Validação</label>
            <div className="relative">
              <select value={validacao} onChange={e => setValidacao(e.target.value)} className={selectClass}>
                <option value="todos">Todos</option>
                <option value="validados">Validados</option>
                <option value="pendentes">Pendentes</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Quantidade de ganhadores</label>
            <input
              type="number"
              min={1}
              max={stats?.total || 100}
              value={quantidade}
              onChange={e => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#ff2c03] text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-zinc-500 text-xs mb-1 block">Descrição do prêmio</label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Camiseta Somma"
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#ff2c03] text-white placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={executarSorteio}
          disabled={sorteando || !titulo.trim() || !stats || stats.total === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#ff2c03] hover:bg-[#ff2c03]/90 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider transition-all"
        >
          {sorteando ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Dices className="w-5 h-5" />
          )}
          {sorteando ? 'Sorteando...' : 'Sortear'}
        </button>
      </div>

      {/* Resultado */}
      {animacaoCompleta && ganhadores.length > 0 && (
        <div className="space-y-3">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#ff2c03]" />
            Ganhadores
          </p>
          {ganhadores.map(g => (
            <GanhadorCard
              key={g.id}
              ganhador={g}
              onConfirmar={handleConfirmar}
              onAusente={handleAusente}
              onResorteio={handleResorteio}
            />
          ))}
        </div>
      )}

      {/* Histórico */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          Histórico de Sorteios
        </p>
        {loadingHistorico ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
        ) : (
          <SorteioHistorico sorteios={historico} />
        )}
      </div>
    </div>
  )
}
```

Nota: Importar `Clock` do lucide-react (já deve estar disponível, mas verificar).

- [ ] **Passo 4: Adicionar o módulo Sorteio no array `modulos` dentro do componente `Painel`**

Na função `Painel`, no array `modulos` (linha ~628), adicionar após o último item (`validar`):

```typescript
    {
      id: 'sorteio' as Modulo,
      titulo: 'Sorteio',
      descricao: 'Realize sorteios entre os participantes do evento',
      icone: Dices,
    },
```

- [ ] **Passo 5: Adicionar renderização do `ModuloSorteio` no JSX**

No JSX do `Painel`, onde os módulos são renderizados condicionalmente (linha ~705-711), alterar de:

```tsx
        ) : modulo === 'membros' ? (
          <ModuloMembros />
        ) : modulo === 'checkins' ? (
          <ModuloCheckins />
        ) : (
          <ModuloValidar />
        )}
```

Para:

```tsx
        ) : modulo === 'membros' ? (
          <ModuloMembros />
        ) : modulo === 'checkins' ? (
          <ModuloCheckins />
        ) : modulo === 'validar' ? (
          <ModuloValidar />
        ) : (
          <ModuloSorteio insiderNome={insider.nome} />
        )}
```

- [ ] **Passo 6: Adicionar import de `Clock` no bloco de imports do lucide-react**

Verificar que `Clock` está no import. Adicionar junto com `Trophy`, `Dices`, `Filter` se não estiver:

```typescript
import {
  Search, LogOut, Users, ClipboardList, CheckSquare,
  MessageCircle, Check, X, ShieldCheck, ChevronRight,
  ArrowLeft, Loader2, RefreshCw, Lock, ChevronDown,
  Trophy, Dices, Filter, Clock, Phone, Mail,
} from 'lucide-react'
```

Nota: `Phone` e `Mail` não são usados diretamente aqui (são usados no `GanhadorCard`), mas convém verificar se o import de `GanhadorCard` funciona corretamente.

- [ ] **Passo 7: Commit**

```bash
git add app/insider-conect/page.tsx
git commit -m "feat(sorteio): integrar ModuloSorteio na página Insider com filtros, animação e histórico"
```

---

## Task 10: Teste Manual End-to-End

**Arquivos:** Nenhum arquivo novo.

- [ ] **Passo 1: Iniciar o servidor de desenvolvimento**

```bash
npm run dev
```

- [ ] **Passo 2: Testar login e navegação**

1. Acessar `http://localhost:3000/insider-conect`
2. Fazer login com CPF válido
3. Verificar que o card "Sorteio" aparece na home
4. Clicar no card e verificar que a página carrega

- [ ] **Passo 3: Testar filtros e estatísticas**

1. Selecionar um evento no dropdown
2. Verificar que as estatísticas carregam (Total, Masculino, Feminino, por pelotão)
3. Alterar filtros (sexo, pelotão, validação) e verificar que os números atualizam
4. Verificar filtro de dia de inscrição

- [ ] **Passo 4: Testar sorteio**

1. Preencher "Descrição do prêmio" (ex: "Camiseta Somma")
2. Definir quantidade (ex: 2)
3. Clicar "Sortear"
4. Verificar que a animação slot machine aparece
5. Verificar que os nomes são revelados um por um
6. Verificar que os cards dos ganhadores aparecem após a animação

- [ ] **Passo 5: Testar confirmar/ausente/resorteio**

1. Clicar "Confirmar" em um ganhador → badge muda para verde
2. Clicar "Ausente" em outro ganhador → badge muda para vermelho
3. Clicar "Resorteio" → novo substituto aparece vinculado

- [ ] **Passo 6: Testar histórico**

1. Rolar para baixo e verificar que o histórico mostra o sorteio recém-feito
2. Clicar para expandir e ver os ganhadores
3. Trocar de evento e verificar que o histórico atualiza

- [ ] **Passo 7: Verificar no Supabase**

1. Abrir a tabela `sorteios` no Supabase e verificar que o registro foi criado
2. Abrir a tabela `sorteio_ganhadores` e verificar os ganhadores com status correto

- [ ] **Passo 8: Commit final (se necessário ajustes)**

```bash
git add -A
git commit -m "fix(sorteio): ajustes após teste manual end-to-end"
```

---

## Resumo das Tasks

| Task | Descrição | Arquivos |
|------|-----------|----------|
| 1 | Tipos e utilitários | `lib/sorteio/types.ts`, `lib/sorteio/utils.ts` |
| 2 | API participantes | `app/api/sorteio/participantes/route.ts` |
| 3 | API sortear | `app/api/sorteio/sortear/route.ts` |
| 4 | APIs confirmar/ausente/resorteio | `app/api/sorteio/ganhadores/[id]/*/route.ts` |
| 5 | API histórico | `app/api/sorteio/historico/route.ts` |
| 6 | SorteioMachine (animação) | `components/sorteio/SorteioMachine.tsx` |
| 7 | GanhadorCard | `components/sorteio/GanhadorCard.tsx` |
| 8 | SorteioHistorico | `components/sorteio/SorteioHistorico.tsx` |
| 9 | Integrar no Insider | `app/insider-conect/page.tsx` |
| 10 | Teste manual E2E | Nenhum arquivo novo |
