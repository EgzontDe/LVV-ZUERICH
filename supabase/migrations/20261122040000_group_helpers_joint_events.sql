-- Pas testit me Fikretin (SP/VV) dhe kryetarin, 2026-11-22:
--  1. Eventet e përbashkëta SP/VV (grupi = 'marredheniet') nuk kërkojnë më aprovim: publikohen menjëherë
--     dhe roli i grupit mund t'i ndryshojë / fshijë. Aprovim kërkojnë vetëm kërkesat për buxhet (budget_requests).
--     Studentët / Rinia mbeten si më parë (miratuar=false deri në aprovim).
--  2. Ndihmësit e grupit: personi përgjegjës zgjedh anëtarë që e ndihmojnë, i aktivizon / çaktivizon
--     dhe u cakton detyra (tabela tasks). Ndihmësit NUK marrin qasje në faqen e grupit.

-- 1 ────────────────────────────────────────────────────────────────────────
drop policy if exists "events: group insert" on public.events;
create policy "events: group insert" on public.events for insert to authenticated
  with check ((select private.has_perm(extra ->> 'grupi'))
    and (coalesce(extra ->> 'miratuar', '') = 'false' or extra ->> 'grupi' = 'marredheniet'));
drop policy if exists "events: group update" on public.events;
create policy "events: group update" on public.events for update to authenticated
  using ((select private.has_perm(extra ->> 'grupi'))
    and (coalesce(extra ->> 'miratuar', '') = 'false' or extra ->> 'grupi' = 'marredheniet'))
  with check ((select private.has_perm(extra ->> 'grupi'))
    and (coalesce(extra ->> 'miratuar', '') = 'false' or extra ->> 'grupi' = 'marredheniet'));
drop policy if exists "events: group delete" on public.events;
create policy "events: group delete" on public.events for delete to authenticated
  using ((select private.has_perm(extra ->> 'grupi'))
    and (coalesce(extra ->> 'miratuar', '') = 'false' or extra ->> 'grupi' = 'marredheniet'));

-- Eventet SP/VV që presin ende aprovim aprovohen tani.
update public.events
   set extra = jsonb_set(extra, '{miratuar}', 'true'::jsonb), public = true
 where extra ->> 'grupi' = 'marredheniet' and coalesce(extra ->> 'miratuar', '') = 'false';

-- 2 ────────────────────────────────────────────────────────────────────────
create table if not exists public.group_helpers (
  grupi      text not null check (grupi in ('studentet', 'rinia', 'marredheniet')),
  member_id  bigint not null references public.members(id) on delete cascade,
  active     boolean not null default true,
  roli       text not null default '' check (length(roli) <= 80),   -- p.sh. "Përkthime", "Foto/video"
  added_by   uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (grupi, member_id)
);
alter table public.group_helpers enable row level security;

create policy "group_helpers: group read" on public.group_helpers for select to authenticated
  using ((select private.has_perm(grupi)) or member_id = (select private.my_member_id()));
create policy "group_helpers: group insert" on public.group_helpers for insert to authenticated
  with check ((select private.has_perm(grupi)));
create policy "group_helpers: group update" on public.group_helpers for update to authenticated
  using ((select private.has_perm(grupi))) with check ((select private.has_perm(grupi)));
create policy "group_helpers: group delete" on public.group_helpers for delete to authenticated
  using ((select private.has_perm(grupi)));

drop trigger if exists touch_updated_at on public.group_helpers;
create trigger touch_updated_at before update on public.group_helpers for each row execute function private.touch_updated_at();
drop trigger if exists audit_change on public.group_helpers;
create trigger audit_change after insert or update or delete on public.group_helpers for each row execute function private.log_change();
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'group_helpers') then
    alter publication supabase_realtime add table public.group_helpers;
  end if;
end $$;

-- Ndihmësit e grupit me emër (roli i grupit nuk e lexon tabelën members).
create or replace function public.group_helpers_list(p_grupi text)
returns table(member_id bigint, name text, active boolean, roli text, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.has_perm(p_grupi) then raise exception 'not allowed' using errcode = '42501'; end if;
  return query
    select h.member_id, m.name, h.active, h.roli, h.created_at
      from public.group_helpers h join public.members m on m.id = h.member_id
     where h.grupi = p_grupi
     order by h.active desc, m.name;
end; $$;
revoke all on function public.group_helpers_list(text) from public, anon;
grant execute on function public.group_helpers_list(text) to authenticated;

-- Kërkim anëtarësh aktivë sipas emrit (vetëm id + emri, maks. 10) për t'i shtuar si ndihmës.
create or replace function public.helper_candidates(p_grupi text, p_q text)
returns table(id bigint, name text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.has_perm(p_grupi) then raise exception 'not allowed' using errcode = '42501'; end if;
  if length(trim(coalesce(p_q, ''))) < 2 then return; end if;
  return query
    select m.id, m.name from public.members m
     where m.status = 'aktiv' and m.name ilike '%' || trim(p_q) || '%'
       and not exists (select 1 from public.group_helpers h where h.grupi = p_grupi and h.member_id = m.id)
     order by m.name limit 10;
end; $$;
revoke all on function public.helper_candidates(text, text) from public, anon;
grant execute on function public.helper_candidates(text, text) to authenticated;
