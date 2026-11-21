-- Outreach v3 (Studentët / Rinia):
--  1. public "Dua të informohem" form → RPC outreach_signup (anon), with consent; notifies the secretaries
--  2. contact history (outreach_log)
--  3. monthly targets in settings('outreach_targets'), set by admin/kryetar
--  4. outreach_overview() for admin/kryetar: both groups at a glance

-- 1 ────────────────────────────────────────────────────────────────────────
create or replace function public.outreach_signup(p_group text, p_name text, p_phone text, p_email text,
                                                  p_universiteti text, p_consent boolean, p_ref text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v_name text := left(trim(coalesce(p_name, '')), 120);
        v_phone text := left(trim(coalesce(p_phone, '')), 40);
        v_email text := lower(left(trim(coalesce(p_email, '')), 120));
        v_id bigint;
begin
  if p_group not in ('studentet', 'rinia') then raise exception 'invalid group' using errcode = '22023'; end if;
  if v_name = '' or (v_phone = '' and v_email = '') then raise exception 'missing fields' using errcode = '22023'; end if;
  if not coalesce(p_consent, false) then raise exception 'consent required' using errcode = '22023'; end if;

  -- Same person again (email or phone): update instead of a duplicate.
  select id into v_id from public.outreach_contacts c
   where c.grupi = p_group
     and ((v_email <> '' and lower(c.email) = v_email)
       or (private.phone_key(v_phone) is not null and private.phone_key(c.phone) = private.phone_key(v_phone)))
   limit 1;
  if v_id is not null then
    update public.outreach_contacts
       set extra = extra || jsonb_build_object('pelqimi', true, 'burimi', 'formulari')
     where id = v_id;
    return;
  end if;

  insert into public.outreach_contacts (grupi, name, phone, email, status, extra, created_by)
  values (p_group, v_name, v_phone, v_email, 'identifikuar',
          jsonb_strip_nulls(jsonb_build_object('pelqimi', true, 'burimi', 'formulari', 'ku', 'Formulari online',
            'universiteti', nullif(left(trim(coalesce(p_universiteti, '')), 120), ''),
            'referredById', case when coalesce(p_ref, '') ~ '^\d+$' then p_ref end)),
          null);

  insert into public.notifications (member_id, kind, title, body)
  select m.id, 'kontakt_i_radhes', 'Kontakt i ri nga formulari', v_name || ' u regjistrua te "Dua të informohem".'
  from public.profiles p join public.members m on lower(m.email) = lower(p.email)
  where p.role = p_group and p.deleted_at is null;
end; $$;
revoke all on function public.outreach_signup(text, text, text, text, text, boolean, text) from public;
grant execute on function public.outreach_signup(text, text, text, text, text, boolean, text) to anon, authenticated;

-- 2 ────────────────────────────────────────────────────────────────────────
create table if not exists public.outreach_log (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.outreach_contacts(id) on delete cascade,
  grupi text not null check (grupi in ('studentet', 'rinia')),
  kanali text not null default 'Tjetër',
  shenim text not null default '',
  created_by uuid default auth.uid(),
  author text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists outreach_log_contact on public.outreach_log(contact_id);
alter table public.outreach_log enable row level security;
drop policy if exists "outreach_log: group perm" on public.outreach_log;
create policy "outreach_log: group perm" on public.outreach_log for all to authenticated
  using ((select private.has_perm(grupi))) with check ((select private.has_perm(grupi)));
revoke all on public.outreach_log from anon;
grant select, insert, update, delete on public.outreach_log to authenticated;

-- 3 ────────────────────────────────────────────────────────────────────────
insert into public.settings (key, value)
values ('outreach_targets', '{"studentet":{"kontakte":20,"anetare":5},"rinia":{"kontakte":20,"anetare":5}}'::jsonb)
on conflict (key) do nothing;

-- 4 ────────────────────────────────────────────────────────────────────────
create or replace function public.outreach_overview()
returns table(grupi text, kontakte int, kontakte_muaj int, kontaktuar int, anetare int, anetare_muaj int, te_vonuara int)
language plpgsql stable security definer set search_path = '' as $$
declare v_month date := date_trunc('month', now() at time zone 'Europe/Zurich')::date;
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  return query
    select g.grupi,
      count(c.id) filter (where coalesce(c.extra ->> 'lloji', '') <> 'shoqate')::int,
      count(c.id) filter (where coalesce(c.extra ->> 'lloji', '') <> 'shoqate' and c.created_at >= v_month)::int,
      count(c.id) filter (where c.status in ('kontaktuar', 'interesuar', 'aplikoi', 'anetar'))::int,
      count(c.id) filter (where c.status = 'anetar')::int,
      count(c.id) filter (where c.status = 'anetar' and c.updated_at >= v_month)::int,
      count(c.id) filter (where c.status in ('identifikuar', 'kontaktuar', 'interesuar')
        and coalesce(c.extra ->> 'kontakti_radhes', '') ~ '^\d{4}-\d{2}-\d{2}$'
        and (c.extra ->> 'kontakti_radhes')::date < (now() at time zone 'Europe/Zurich')::date)::int
    from (values ('studentet'), ('rinia')) g(grupi)
    left join public.outreach_contacts c on c.grupi = g.grupi
    group by g.grupi;
end; $$;
revoke all on function public.outreach_overview() from public, anon;
grant execute on function public.outreach_overview() to authenticated;
