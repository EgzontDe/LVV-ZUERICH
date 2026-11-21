-- Outreach v2 (Studentët / Rinia):
--  1. contacts get status 'anetar'; applications link themselves to matching contacts (email/phone),
--     approval turns the contact into 'anetar'
--  2. my_referrals(): applications made with my link (name + status only)
--  3. daily job: "Sot ke N kontakte për të kontaktuar" notification + deletes stale contacts after 12 months
--  4. group events (extra.grupi, extra.miratuar=false until events/admin approve), RSVP names
--  5. group announcements and polls (extra.grupi), my_groups() for the member view
--  6. mentors (outreach_mentors), my_mentor()

-- 1 ────────────────────────────────────────────────────────────────────────
alter table public.outreach_contacts drop constraint if exists outreach_contacts_status_check;
alter table public.outreach_contacts add constraint outreach_contacts_status_check
  check (status in ('identifikuar', 'kontaktuar', 'interesuar', 'aplikoi', 'anetar', 'jo'));

create or replace function private.phone_key(p text)
returns text language sql immutable set search_path = '' as $$
  select nullif(right(regexp_replace(coalesce(p, ''), '\D', '', 'g'), 9), '');
$$;

create or replace function private.link_application_to_contacts()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.outreach_contacts c
       set status = case when c.status = 'anetar' then c.status else 'aplikoi' end,
           extra = c.extra || jsonb_build_object('application_id', new.id)
     where (c.email <> '' and lower(c.email) = lower(new.email))
        or (private.phone_key(c.phone) is not null and private.phone_key(c.phone) = private.phone_key(new.extra ->> 'phone'));
  elsif new.status in ('aprovuar', 'pret_pagesen', 'aktiv') and old.status is distinct from new.status then
    update public.outreach_contacts set status = 'anetar'
     where extra ->> 'application_id' = new.id::text and status <> 'anetar';
  end if;
  return new;
end; $$;
drop trigger if exists link_application_to_contacts on public.applications;
create trigger link_application_to_contacts after insert or update of status on public.applications
  for each row execute function private.link_application_to_contacts();

-- 2 ────────────────────────────────────────────────────────────────────────
create or replace function public.my_referrals()
returns table(name text, status text, applied text, approved text)
language sql stable security definer set search_path = '' as $$
  select a.name, a.status, a.extra ->> 'applied', a.extra ->> 'approvedDate'
  from public.applications a
  where a.extra ->> 'referredById' = (select private.my_member_id())::text
  order by a.created_at desc;
$$;
revoke all on function public.my_referrals() from public, anon;
grant execute on function public.my_referrals() to authenticated;

-- 3 ────────────────────────────────────────────────────────────────────────
create or replace function private.outreach_daily()
returns void language plpgsql security definer set search_path = '' as $$
declare r record; n int;
begin
  for r in
    select p.role, m.id as member_id from public.profiles p
    join public.members m on lower(m.email) = lower(p.email)
    where p.role in ('studentet', 'rinia') and p.deleted_at is null
  loop
    select count(*) into n from public.outreach_contacts
     where grupi = r.role and status in ('identifikuar', 'kontaktuar', 'interesuar')
       and coalesce(extra ->> 'kontakti_radhes', '') ~ '^\d{4}-\d{2}-\d{2}$'
       and (extra ->> 'kontakti_radhes')::date <= (now() at time zone 'Europe/Zurich')::date;
    if n > 0 then
      insert into public.notifications (member_id, kind, title, body)
      values (r.member_id, 'kontakt_i_radhes',
              case when n = 1 then 'Sot ke 1 kontakt për të kontaktuar' else 'Sot ke ' || n || ' kontakte për të kontaktuar' end,
              'Hape faqen ' || case r.role when 'studentet' then 'Studentët' else 'Rinia' end || ' për t''i parë.');
    end if;
  end loop;
  -- Privacy: people who never became members are not kept forever.
  delete from public.outreach_contacts
   where status not in ('aplikoi', 'anetar') and coalesce(extra ->> 'lloji', '') <> 'shoqate'
     and updated_at < now() - interval '12 months';
end; $$;
revoke all on function private.outreach_daily() from public, anon, authenticated;
select cron.schedule('outreach-ditore', '0 6 * * *', $$select private.outreach_daily()$$);

-- 4 ────────────────────────────────────────────────────────────────────────
drop policy if exists "events: group insert" on public.events;
create policy "events: group insert" on public.events for insert to authenticated
  with check ((select private.has_perm(extra ->> 'grupi')) and coalesce(extra ->> 'miratuar', '') = 'false');
drop policy if exists "events: group update" on public.events;
create policy "events: group update" on public.events for update to authenticated
  using ((select private.has_perm(extra ->> 'grupi')) and coalesce(extra ->> 'miratuar', '') = 'false')
  with check ((select private.has_perm(extra ->> 'grupi')) and coalesce(extra ->> 'miratuar', '') = 'false');
drop policy if exists "events: group delete" on public.events;
create policy "events: group delete" on public.events for delete to authenticated
  using ((select private.has_perm(extra ->> 'grupi')) and coalesce(extra ->> 'miratuar', '') = 'false');

create or replace function public.event_rsvp_names(p_event bigint)
returns table(name text) language plpgsql stable security definer set search_path = '' as $$
declare e public.events;
begin
  select * into e from public.events where id = p_event;
  if e.id is null or not (private.has_perm('events') or private.has_perm(e.extra ->> 'grupi')) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query select m.name from public.members m where m.id = any(e.rsvp) order by m.name;
end; $$;
revoke all on function public.event_rsvp_names(bigint) from public, anon;
grant execute on function public.event_rsvp_names(bigint) to authenticated;

-- 5 ────────────────────────────────────────────────────────────────────────
drop policy if exists "announcements: group write" on public.announcements;
create policy "announcements: group write" on public.announcements for all to authenticated
  using ((select private.has_perm(extra ->> 'grupi'))) with check ((select private.has_perm(extra ->> 'grupi')));
drop policy if exists "polls: group write" on public.polls;
create policy "polls: group write" on public.polls for all to authenticated
  using ((select private.has_perm(extra ->> 'grupi'))) with check ((select private.has_perm(extra ->> 'grupi')));

-- Which groups the logged-in member belongs to (for showing group news, polls and events).
create or replace function public.my_groups()
returns text[] language sql stable security definer set search_path = '' as $$
  select array_remove(array[
    case when exists (select 1 from public.member_details d where d.member_id = m.id
                       and (d.data ->> 'punesimi' = 'Student/e' or coalesce(d.data ->> 'universiteti', '') <> ''))
         then 'studentet' end,
    case when coalesce(m.extra ->> 'dob', '') ~ '^\d{1,2}\.\d{1,2}\.\d{4}$'
          and date_part('year', age(to_date(m.extra ->> 'dob', 'DD.MM.YYYY'))) between 14 and 30
         then 'rinia' end], null)
  from public.members m where m.id = (select private.my_member_id());
$$;
revoke all on function public.my_groups() from public, anon;
grant execute on function public.my_groups() to authenticated;

-- 6 ────────────────────────────────────────────────────────────────────────
create table if not exists public.outreach_mentors (
  member_id bigint primary key references public.members(id) on delete cascade,
  mentor_id bigint not null references public.members(id) on delete cascade,
  grupi text not null check (grupi in ('studentet', 'rinia')),
  created_at timestamptz not null default now()
);
alter table public.outreach_mentors enable row level security;
drop policy if exists "outreach_mentors: group perm" on public.outreach_mentors;
create policy "outreach_mentors: group perm" on public.outreach_mentors for all to authenticated
  using ((select private.has_perm(grupi))) with check ((select private.has_perm(grupi)));
revoke all on public.outreach_mentors from anon;
grant select, insert, update, delete on public.outreach_mentors to authenticated;

create or replace function public.my_mentor()
returns table(name text, phone text, email text, grupi text)
language sql stable security definer set search_path = '' as $$
  select m.name, coalesce(m.extra ->> 'phone', ''), m.email, o.grupi
  from public.outreach_mentors o join public.members m on m.id = o.mentor_id
  where o.member_id = (select private.my_member_id());
$$;
revoke all on function public.my_mentor() from public, anon;
grant execute on function public.my_mentor() to authenticated;

-- list_group_members now also returns the mentor
drop function if exists public.list_group_members(text);
create function public.list_group_members(p_group text)
returns table(id bigint, name text, email text, phone text, age int,
              universiteti text, fakulteti text, drejtimi text, punesimi text, mentor_id bigint)
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
             coalesce(d.data ->> 'punesimi', '') as punesimi,
             o.mentor_id
      from public.members m
      left join public.member_details d on d.member_id = m.id
      left join public.outreach_mentors o on o.member_id = m.id and o.grupi = p_group
      where m.status = 'aktiv'
    )
    select * from base b
    where (p_group = 'studentet' and (b.punesimi = 'Student/e' or b.universiteti <> ''))
       or (p_group = 'rinia' and b.age between 14 and 30)
    order by b.name;
end; $$;
revoke all on function public.list_group_members(text) from public, anon;
grant execute on function public.list_group_members(text) to authenticated;
