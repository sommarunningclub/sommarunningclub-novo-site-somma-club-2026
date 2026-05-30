-- Inscrições da collab Somma Club x Esplanada Run 2026
-- Formulário aberto (independente de ser membro do Somma Club)

create table if not exists public.inscricoes_esplanada_run (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  cpf text not null,
  telefone text not null,
  sexo text not null,                  -- 'M' | 'F'
  data_nascimento text not null,       -- DD/MM/AAAA
  tipo_kit text not null,              -- 'UNICO' | 'UNICO_PCD'
  modalidade text not null,            -- '3KM' | '5KM' | '10KM'
  tamanho_camiseta text not null,      -- 'P' | 'M' | 'G' | 'GG' | 'XG'
  cidade text not null,
  estado text not null,                -- UF
  regiao text not null,                -- Norte | Nordeste | Centro-Oeste | Sudeste | Sul
  nacionalidade text not null,         -- 'Brasileiro' | 'Estrangeiro'
  data_de_cadastro timestamptz not null default now()
);

-- Índices úteis para consulta/relatório
create index if not exists idx_iesp_email on public.inscricoes_esplanada_run (email);
create index if not exists idx_iesp_modalidade on public.inscricoes_esplanada_run (modalidade);
create index if not exists idx_iesp_data on public.inscricoes_esplanada_run (data_de_cadastro);

-- RLS ligado. A escrita é feita pelo backend com a service role key (que ignora RLS).
-- Não criamos política pública de insert, então o anon key não consegue gravar direto.
alter table public.inscricoes_esplanada_run enable row level security;
