-- Outreach v4: academic calendar, budget requests (→ Financat), post-event feedback.

-- 1. Academic calendar per group (semester start, exams, holidays) with reminders.
create table if not exists public.outreach_calendar (
  id bigint generated always as identity primary key,
  grupi text not null check (grupi in ('studentet', 'rinia')),
  date date not null,
  title text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
alter table public.outreach_calendar enable row level security;
drop policy if exists "outreach_calendar: group perm" on public.outreach_calendar;
create policy "outreach_calendar: group perm" on public.outreach_calendar for all to authenticated
  using ((select private.has_perm(grupi))) with check ((select private.has_perm(grupi)));
revoke all on public.outreach_calendar from anon;
grant select, insert, update, delete on public.outreach_calendar to authenticated;

-- Daily job now also reminds 7 days before and on the day of a calendar date.
create or replace function private.outreach_daily()
returns void language plpgsql security definer set search_path = '' as $$
declare r record; n int; v_today date := (now() at time zone 'Europe/Zurich')::date; k record;
begin
  for r in
    select p.role, m.id as member_id from public.profiles p
    join public.members m on lower(m.email) = lower(p.email)
    where p.role in ('studentet', 'rinia') and p.deleted_at is null
  loop
    select count(*) into n from public.outreach_contacts
     where grupi = r.role and status in ('identifikuar', 'kontaktuar', 'interesuar')
       and coalesce(extra ->> 'kontakti_radhes', '') ~ '^\d{4}-\d{2}-\d{2}$'
       and (extra ->> 'kontakti_radhes')::date <= v_today;
    if n > 0 then
      insert into public.notifications (member_id, kind, title, body)
      values (r.member_id, 'kontakt_i_radhes',
              case when n = 1 then 'Sot ke 1 kontakt për të kontaktuar' else 'Sot ke ' || n || ' kontakte për të kontaktuar' end,
              'Hape faqen ' || case r.role when 'studentet' then 'Studentët' else 'Rinia' end || ' për t''i parë.');
    end if;
    for k in select * from public.outreach_calendar where grupi = r.role and date in (v_today, v_today + 7) loop
      insert into public.notifications (member_id, kind, title, body)
      values (r.member_id, 'kontakt_i_radhes',
              case when k.date = v_today then 'Sot: ' || k.title else 'Pas 7 ditësh: ' || k.title end,
              to_char(k.date, 'DD.MM.YYYY') || coalesce(nullif(' — ' || k.note, ' — '), ''));
    end loop;
  end loop;
  delete from public.outreach_contacts
   where status not in ('aplikoi', 'anetar') and coalesce(extra ->> 'lloji', '') <> 'shoqate'
     and updated_at < now() - interval '12 months';
end; $$;

-- 2. Budget requests from Studentët / Rinia, decided by Financat (or admin/kryetar).
create table if not exists public.budget_requests (
  id bigint generated always as identity primary key,
  grupi text not null check (grupi in ('studentet', 'rinia')),
  event_id bigint references public.events(id) on delete set null,
  amount numeric(10,2) not null check (amount > 0 and amount <= 100000),
  description text not null,
  status text not null default 'ne_pritje' check (status in ('ne_pritje', 'aprovuar', 'refuzuar')),
  answer text not null default '',
  author text not null default '',
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.budget_requests enable row level security;
drop policy if exists "budget_requests: read" on public.budget_requests;
create policy "budget_requests: read" on public.budget_requests for select to authenticated
  using ((select private.has_perm(grupi)) or (select private.has_perm('payments')));
drop policy if exists "budget_requests: group insert" on public.budget_requests;
create policy "budget_requests: group insert" on public.budget_requests for insert to authenticated
  with check ((select private.has_perm(grupi)) and status = 'ne_pritje');
drop policy if exists "budget_requests: finance decide" on public.budget_requests;
create policy "budget_requests: finance decide" on public.budget_requests for update to authenticated
  using ((select private.has_perm('payments'))) with check ((select private.has_perm('payments')));
drop policy if exists "budget_requests: group delete pending" on public.budget_requests;
create policy "budget_requests: group delete pending" on public.budget_requests for delete to authenticated
  using ((select private.has_perm(grupi)) and status = 'ne_pritje');
revoke all on public.budget_requests from anon;
grant select, insert, update, delete on public.budget_requests to authenticated;
drop trigger if exists touch_updated_at on public.budget_requests;
create trigger touch_updated_at before update on public.budget_requests
  for each row execute function private.touch_updated_at();

create or replace function private.notify_budget()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_group text := case new.grupi when 'studentet' then 'Studentët' else 'Rinia' end;
begin
  if tg_op = 'INSERT' then
    insert into public.notifications (member_id, kind, title, body)
    select m.id, 'buxhet', 'Kërkesë për buxhet · ' || v_group,
           'CHF ' || to_char(new.amount, 'FM999990.00') || ' — ' || left(new.description, 120)
    from public.profiles p join public.members m on lower(m.email) = lower(p.email)
    where p.role in ('admin', 'kryetar', 'financa') and p.deleted_at is null;
  elsif new.status <> old.status and new.status in ('aprovuar', 'refuzuar') then
    insert into public.notifications (member_id, kind, title, body)
    select m.id, 'buxhet',
           'Buxheti ' || case new.status when 'aprovuar' then 'u aprovua ✓' else 'u refuzua' end,
           'CHF ' || to_char(new.amount, 'FM999990.00') || ' — ' || left(new.description, 80)
             || coalesce(nullif(' · ' || new.answer, ' · '), '')
    from auth.users u join public.members m on lower(m.email) = lower(u.email)
    where u.id = new.created_by;
  end if;
  return new;
end; $$;
drop trigger if exists notify_budget on public.budget_requests;
create trigger notify_budget after insert or update of status on public.budget_requests
  for each row execute function private.notify_budget();

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'budget_requests') then
    alter publication supabase_realtime add table public.budget_requests;
  end if;
end $$;

-- 3. Feedback after an event (members who attended / said they come).
create table if not exists public.event_feedback (
  event_id bigint not null references public.events(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  liked text not null default '',
  next text not null default '',
  created_at timestamptz not null default now(),
  primary key (event_id, member_id)
);
alter table public.event_feedback enable row level security;
drop policy if exists "event_feedback: own" on public.event_feedback;
create policy "event_feedback: own" on public.event_feedback for select to authenticated
  using (member_id = (select private.my_member_id()) or (select private.has_perm('events')));
drop policy if exists "event_feedback: own insert" on public.event_feedback;
create policy "event_feedback: own insert" on public.event_feedback for insert to authenticated
  with check (member_id = (select private.my_member_id()));
revoke all on public.event_feedback from anon;
grant select, insert on public.event_feedback to authenticated;

-- Anonymous summary for events staff and the group secretary of a group event.
create or replace function public.event_feedback_summary(p_event bigint)
returns table(answers int, avg_rating numeric, liked text[], next text[])
language plpgsql stable security definer set search_path = '' as $$
declare e public.events;
begin
  select * into e from public.events where id = p_event;
  if e.id is null or not (private.has_perm('events') or private.has_perm(e.extra ->> 'grupi')) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query
    select count(*)::int, round(avg(f.rating), 1),
           array_remove(array_agg(nullif(f.liked, '')), null), array_remove(array_agg(nullif(f.next, '')), null)
    from public.event_feedback f where f.event_id = p_event;
end; $$;
revoke all on function public.event_feedback_summary(bigint) from public, anon;
grant execute on function public.event_feedback_summary(bigint) to authenticated;
