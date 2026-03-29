# Módulo de Sorteio Somma Club — Spec de Design

**Data:** 2026-03-29
**Status:** Aprovado

---

## Visão Geral

Módulo de sorteio integrado à área Insider do Site Somma Club. Permite ao operador (logado via CPF) sortear ganhadores entre os participantes que fizeram check-in em um evento, com filtros flexíveis, animação slot machine e controle de confirmação/ausência.

---

## Contexto de Integração

### Dois repositórios, mesmo Supabase

- **Site Somma Club** (`sommarunningclub-novo-site-somma-club-2026`): Next.js 15 + TypeScript + Tailwind + shadcn/ui. Onde o módulo será construído.
- **Sistema de Gestão** (`v0-sistema-somma-de-gestao`): Contém os módulos de eventos e check-in. Mesmo projeto Supabase.

### Tabelas existentes consumidas

**`eventos`**
| Campo | Tipo |
|-------|------|
| `id` | uuid (PK) |
| `titulo` | text |
| `data_evento` | date |
| `checkin_status` | text ('aberto'/'bloqueado'/'encerrado') |
| `pelotoes` | text[] (default: ['4km','6km','8km']) |
| `horario_inicio` | time |
| `local` | text |
| `created_at` | timestamptz |

**`checkins`**
| Campo | Tipo |
|-------|------|
| `id` | uuid (PK) |
| `nome_completo` | text |
| `email` | text |
| `telefone` | varchar |
| `cpf` | text (XXX.XXX.XXX-XX) |
| `sexo` | text ('masculino'/'feminino') |
| `pelotao` | text ('4km'/'6km'/'8km') |
| `data_do_evento` | date |
| `nome_do_evento` | text |
| `evento_id` | uuid (FK → eventos) |
| `data_hora_checkin` | timestamptz |
| `validacao_do_checkin` | bool |
| `validated_at` | timestamptz |

---

## Decisões de Design

| Decisão | Resposta |
|---------|----------|
| Acesso | Insider (login CPF) — mesma autenticação existente |
| Localização | Página dedicada dentro da área Insider (`/insider-conect`) |
| Pool de participantes | Tabela `checkins` (não existe tabela de inscrições separada) |
| Filtro de validação | Opcional — operador escolhe |
| Filtros disponíveis | Sexo, pelotão, dia de inscrição, validação do check-in |
| Ganhadores por sorteio | Operador define quantidade |
| Confirmação | Flexível — marca confirmado/ausente a qualquer momento |
| Ausente | Resorteio manual pelo operador |
| Repetição de ganhador | Permitida — pode ganhar mais de uma vez no mesmo evento |
| Histórico | Evento atual + eventos anteriores |
| Animação | Slot machine em canvas revelando nome letra por letra |

---

## Banco de Dados — Tabelas Novas

### `sorteios`

```sql
CREATE TABLE sorteios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evento_id UUID REFERENCES eventos(id),
  titulo TEXT NOT NULL,
  filtros_aplicados JSONB,
  total_elegiveis INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  criado_por TEXT
);

CREATE INDEX idx_sorteios_evento ON sorteios(evento_id);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid (PK) | ID do sorteio |
| `evento_id` | uuid (FK → eventos) | Evento vinculado |
| `titulo` | text | Título/descrição do prêmio |
| `filtros_aplicados` | jsonb | Filtros usados no momento do sorteio |
| `total_elegiveis` | integer | Tamanho do pool no momento |
| `created_at` | timestamptz | Data/hora da execução |
| `criado_por` | text | Nome do Insider que operou |

### `sorteio_ganhadores`

```sql
CREATE TABLE sorteio_ganhadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sorteio_id UUID REFERENCES sorteios(id) ON DELETE CASCADE,
  checkin_id UUID REFERENCES checkins(id),
  posicao INTEGER NOT NULL,
  numero_sorteado INTEGER,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'ausente')),
  confirmado_em TIMESTAMPTZ,
  substituido_por UUID REFERENCES sorteio_ganhadores(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sorteio_ganhadores_sorteio ON sorteio_ganhadores(sorteio_id);
CREATE INDEX idx_sorteio_ganhadores_status ON sorteio_ganhadores(status);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid (PK) | ID do registro |
| `sorteio_id` | uuid (FK → sorteios) | Sorteio vinculado |
| `checkin_id` | uuid (FK → checkins) | Check-in do ganhador |
| `posicao` | integer | Posição (1º, 2º, 3º...) |
| `numero_sorteado` | integer | Número sorteado no pool |
| `status` | text | 'pendente' / 'confirmado' / 'ausente' |
| `confirmado_em` | timestamptz | Quando foi confirmado |
| `substituido_por` | uuid (FK → sorteio_ganhadores) | Quem substituiu (resorteio) |
| `created_at` | timestamptz | Data de criação |

**Notas:**
- `criado_por` é text (nome do Insider), não FK — login é por CPF sem Supabase Auth
- Sem constraint de unicidade no `checkin_id` — ganhador pode repetir
- `substituido_por` aponta para o ganhador que tomou a vaga do ausente

---

## API Routes

Todas server-side usando `SUPABASE_SERVICE_ROLE_KEY`.

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/sorteio/participantes` | GET | Busca check-ins filtrados + estatísticas |
| `/api/sorteio/sortear` | POST | Executa sorteio e salva resultado |
| `/api/sorteio/ganhadores/[id]/confirmar` | PATCH | Marca ganhador como confirmado |
| `/api/sorteio/ganhadores/[id]/ausente` | PATCH | Marca ganhador como ausente |
| `/api/sorteio/ganhadores/[id]/resorteio` | POST | Sorteia substituto para ausente |
| `/api/sorteio/historico` | GET | Lista sorteios do evento |

### GET `/api/sorteio/participantes`

**Query params:** `evento_id` (obrigatório), `sexo`, `pelotao`, `data_inscricao`, `validacao`

**Retorno:**
```json
{
  "participantes": [
    {
      "id": "uuid",
      "nome_completo": "...",
      "email": "...",
      "telefone": "...",
      "sexo": "masculino",
      "pelotao": "6km",
      "data_hora_checkin": "...",
      "validacao_do_checkin": true,
      "numero": 1
    }
  ],
  "total": 492,
  "stats": {
    "masculino": 250,
    "feminino": 242,
    "por_pelotao": { "4km": 150, "6km": 200, "8km": 142 },
    "validados": 92,
    "pendentes": 400
  }
}
```

### POST `/api/sorteio/sortear`

**Body:**
```json
{
  "evento_id": "uuid",
  "titulo": "Camiseta Somma",
  "quantidade": 3,
  "filtros": {
    "sexo": "feminino",
    "pelotao": "6km",
    "data_inscricao": "2026-03-21",
    "validacao": true
  },
  "criado_por": "Nome do Insider"
}
```

**Lógica:**
1. Busca check-ins com filtros aplicados
2. Enumera elegíveis (1 a N)
3. Fisher-Yates shuffle com `crypto.getRandomValues`
4. Seleciona os primeiros X
5. Insere em `sorteios` + `sorteio_ganhadores`
6. Retorna ganhadores com dados do check-in

### POST `/api/sorteio/ganhadores/[id]/resorteio`

**Lógica:**
1. Busca o sorteio original e seus filtros
2. Busca o pool original (mesmos filtros)
3. Exclui todos os ganhadores daquele sorteio (confirmados + ausentes + pendentes)
4. Sorteia 1 substituto
5. Insere novo `sorteio_ganhadores` com `substituido_por` linkando ao ausente
6. Atualiza o ausente com referência ao substituto

---

## Componentes Frontend

### Estrutura de arquivos

```
app/insider-conect/
  └── (arquivos existentes)

components/
  └── sorteio/
      ├── SorteioPage.tsx
      ├── SorteioStats.tsx
      ├── SorteioFiltros.tsx
      ├── SorteioMachine.tsx
      ├── SorteioResultado.tsx
      ├── GanhadorCard.tsx
      └── SorteioHistorico.tsx
```

### Componentes

**`SorteioPage`** — Página principal. Orquestra estado, chamadas de API e fluxo entre componentes.

**`SorteioStats`** — Cards de estatísticas do pool. Mostra total, masculino, feminino, por pelotão (4km/6km/8km), validados, pendentes. Atualiza ao mudar filtros.

**`SorteioFiltros`** — Dropdowns: sexo, pelotão, dia de inscrição, validação. Campo numérico "Quantidade de ganhadores". Campo texto "Descrição do prêmio". Botão "Sortear".

**`SorteioMachine`** — Animação slot machine em canvas. Recebe o nome do ganhador, exibe letras girando e parando uma a uma. Faixa de destaque na cor laranja Somma (`#ff2c03`). Caracteres suportam acentos e espaço. Callback `onComplete` ao finalizar. Se múltiplos ganhadores, revela um por vez com transição.

**`SorteioResultado`** — Container dos `GanhadorCard` após animação. Aparece quando o sorteio termina.

**`GanhadorCard`** — Card com: posição, nome, pelotão (badge), sexo, email, telefone. Botões: "Confirmar" (verde), "Ausente" (vermelho). Quando ausente: botão "Resorteio". Ganhador substituto aparece vinculado.

**`SorteioHistorico`** — Lista colapsável de sorteios anteriores do evento. Cada item: data/hora, título do prêmio, filtros usados, ganhadores com status. Consulta eventos anteriores via dropdown de evento no topo.

### Integração com Insider

- Nova entrada na sidebar do Insider (ícone de troféu/dado)
- Reutiliza o componente de seletor de evento existente
- Mesmo padrão visual dark theme
- Componentes shadcn/ui: Button, Card, Select, Badge, Collapsible, Dialog

---

## Lógica do Sorteio — Detalhes

### Algoritmo Fisher-Yates

```typescript
function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const randomBuffer = new Uint32Array(1)
    crypto.getRandomValues(randomBuffer)
    const j = randomBuffer[0] % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
```

### Animação Slot Machine

Adaptação do código canvas fornecido:
- `text` = nome do ganhador em maiúsculas (ex: `"MALU ABREU"`)
- `chars` = `'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÉÊÍÓÔÕÚÇ '` (acentos + espaço)
- Fundo: `#111` (dark theme)
- Faixa de destaque: `#ff2c03` (laranja Somma) no lugar de `#622`
- `scale` ajustado para responsividade
- Componente React com `useRef` (canvas) + `useEffect` (animação)
- Prop `onComplete` disparada quando todas as letras param
- Para múltiplos ganhadores: sequência com transição entre nomes

---

## Fluxo do Usuário

```
1. Insider faz login com CPF (fluxo existente)
2. Clica no ícone de Sorteio na sidebar
3. Seleciona o evento no dropdown
4. Vê as estatísticas do pool
5. Aplica filtros desejados (opcional)
6. Define quantidade de ganhadores
7. Escreve descrição do prêmio (opcional)
8. Clica "Sortear"
9. Animação slot machine revela cada ganhador
10. Cards dos ganhadores aparecem
11. Operador marca "Confirmar" ou "Ausente" quando quiser
12. Se ausente → clica "Resorteio" → nova animação → substituto aparece
13. Histórico fica na parte inferior da página
```

---

## Fora de Escopo

- Login/autenticação nova (reutiliza CPF do Insider)
- Campo `kit_retirado` (não existe no banco)
- Notificações por email/SMS para ganhadores
- Publicação de resultados em página pública
- Impressão/exportação de resultados
