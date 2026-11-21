-- Two narrow staff roles for outreach:
--   studentet  "Sekretare për identifikimin dhe kontaktimin e Studentëve"
--   rinia      "Sekretare e Rinisë"
-- Each sees only: the members of its group (contact fields only, via RPC list_group_members),
-- its own contact list (outreach_contacts, filtered by grupi) and the shared Kanban (tasks).
-- They do NOT read the full members table, applications, member_details, payments.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in
  ('member','admin','kryetar','sekretar','financa','komunikimi','eventet','studentet','rinia'));

create or replace function private.has_perm(p_area text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case private.my_role()
    when 'admin'      then true
    when 'kryetar'    then true
    when 'sekretar'   then p_area in ('members','requests','documents')
    when 'financa'    then p_area in ('payments','donations')
    when 'komunikimi' then p_area in ('comms','requests')
    when 'eventet'    then p_area in ('events')
    when 'studentet'  then p_area in ('studentet')
    when 'rinia'      then p_area in ('rinia')
    else false
  end;
$$;

-- Staff = anyone with a management role (Kanban, dashboard counts). A deleted account is never staff.
create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select private.my_role() not in ('member', 'deleted');
$$;

-- Who may read the whole members table: staff except the narrow outreach roles.
create or replace function private.reads_all_members()
returns boolean language sql stable security definer set search_path = '' as $$
  select private.my_role() not in ('member', 'deleted', 'studentet', 'rinia');
$$;
drop policy if exists "members: admin or self read" on public.members;
create policy "members: admin or self read" on public.members for select
  using ((select private.reads_all_members()) or id = (select private.my_member_id()));

create or replace function public.set_user_role(p_email text, p_role text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  if p_role not in ('member','admin','kryetar','sekretar','financa','komunikimi','eventet','studentet','rinia') then
    raise exception 'invalid role %', p_role using errcode = '22023';
  end if;
  if lower(p_email) = lower((select email from public.profiles where id = (select auth.uid())))
     and p_role not in ('admin','kryetar') then
    raise exception 'cannot remove your own admin role' using errcode = '42501';
  end if;
  update public.profiles set role = p_role where lower(email) = lower(p_email);
  if not found then raise exception 'no account for %', p_email using errcode = 'P0002'; end if;
end; $$;

-- The outreach secretary's own working list (people identified / contacted, members or not).
create table if not exists public.outreach_contacts (
  id bigint generated always as identity primary key,
  grupi text not null check (grupi in ('studentet', 'rinia')),
  name text not null,
  phone text not null default '',
  email text not null default '',
  status text not null default 'identifikuar'
    check (status in ('identifikuar', 'kontaktuar', 'interesuar', 'aplikoi', 'jo')),
  extra jsonb not null default '{}'::jsonb,   -- universiteti, fakulteti, ku, shenime, kontakti_radhes
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.outreach_contacts enable row level security;
drop policy if exists "outreach_contacts: group perm" on public.outreach_contacts;
create policy "outreach_contacts: group perm" on public.outreach_contacts for all to authenticated
  using ((select private.has_perm(grupi))) with check ((select private.has_perm(grupi)));
revoke all on public.outreach_contacts from anon;
grant select, insert, update, delete on public.outreach_contacts to authenticated;
drop trigger if exists touch_updated_at on public.outreach_contacts;
create trigger touch_updated_at before update on public.outreach_contacts
  for each row execute function private.touch_updated_at();
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'outreach_contacts') then
    alter publication supabase_realtime add table public.outreach_contacts;
  end if;
end $$;

-- Members of a group, with contact fields only.
--   studentet: employment status "Student/e" or a university given in the membership form
--   rinia:     age 14–30 (from the date of birth)
create or replace function public.list_group_members(p_group text)
returns table(id bigint, name text, email text, phone text, age int,
              universiteti text, fakulteti text, drejtimi text, punesimi text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if p_group not in ('studentet', 'rinia') or not private.has_perm(p_group) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query
    with base as (
      select m.id, m.name, m.email, coalesce(m.extra ->> 'phone', '') as phone,
             case when coalesce(m.extra ->> 'dob', '') ~ '^\d{1,2}\.\d{1,2}\.\d{4}$'
                  then date_part('year', age(to_date(m.extra ->> 'dob', 'DD.MM.YYYY')))::int end as age,
             coalesce(d.data ->> 'universiteti', '') as universiteti,
             coalesce(d.data ->> 'fakulteti', '') as fakulteti,
             coalesce(d.data ->> 'drejtimi', '') as drejtimi,
             coalesce(d.data ->> 'punesimi', '') as punesimi
      from public.members m
      left join public.member_details d on d.member_id = m.id
      where m.status = 'aktiv'
    )
    select * from base b
    where (p_group = 'studentet' and (b.punesimi = 'Student/e' or b.universiteti <> ''))
       or (p_group = 'rinia' and b.age between 14 and 30)
    order by b.name;
end; $$;
revoke all on function public.list_group_members(text) from public, anon;
grant execute on function public.list_group_members(text) to authenticated;

-- Referral link (?ref=<member id>): the form stores referredById; the name is filled in here,
-- because the public form cannot read members.
create or replace function private.fill_referred_by()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(new.extra ->> 'referredById', '') ~ '^\d+$' then
    new.extra := new.extra || jsonb_build_object('referredBy',
      (select name from public.members where id = (new.extra ->> 'referredById')::bigint));
  end if;
  return new;
end; $$;
drop trigger if exists fill_referred_by on public.applications;
create trigger fill_referred_by before insert on public.applications
  for each row execute function private.fill_referred_by();
