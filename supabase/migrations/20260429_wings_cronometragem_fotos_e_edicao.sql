-- Adiciona foto_url em atleticas + bucket Storage para upload de fotos das equipes.
-- Aplique no SQL Editor do Supabase.

-- =====================================================================
-- 1. Coluna foto_url
-- =====================================================================
alter table public.wings_comp_atleticas
  add column if not exists foto_url text;

-- =====================================================================
-- 2. Bucket público "wings-equipes" (idempotente)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wings-equipes',
  'wings-equipes',
  true,
  5242880, -- 5 MB
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =====================================================================
-- 3. Policies do bucket
--    Leitura pública (anon e authenticated) — fotos aparecem no ranking público.
--    Escrita restrita: só via service_role (rotas API).
--    Como nossas rotas API usam service_role, basta a leitura pública;
--    o upload é feito server-side. Mas deixamos o INSERT/UPDATE/DELETE
--    explicitamente bloqueados pra anon, por segurança.
-- =====================================================================
do $$
begin
  -- Drop policies se já existirem (idempotente)
  drop policy if exists "wings_equipes_read_public" on storage.objects;
  drop policy if exists "wings_equipes_no_anon_write" on storage.objects;
exception when others then null;
end $$;

create policy "wings_equipes_read_public"
  on storage.objects for select
  using (bucket_id = 'wings-equipes');
