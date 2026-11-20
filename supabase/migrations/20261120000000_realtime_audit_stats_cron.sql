-- Realtime, audit log, triggers, dashboard RPCs and scheduled jobs (pg_cron).

-- ── 1) Realtime: broadcast row changes to logged-in clients (RLS still applies) ──
do $$
declare t text;
begin
  foreach t in array array['members','events','announcements','polls','applications','donations',
                           'requests','payments','notifications','event_checkins','documents'] loop
    if not exists (select 1 from pg_publication_tables
                   where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ── 2) updated_at columns kept current by a trigger ──────────────────────────
create or replace function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end; $$;

do $$
declare t text;
begin
  foreach t in array array['members','events','requests','payments','applications'] loop
    execute format('alter table public.%I add column if not exists updated_at timestamptz not null default now()', t);
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format('create trigger touch_updated_at before update on public.%I
                    for each row execute function private.touch_updated_at()', t);
  end loop;
end $$;

-- ── 3) Audit log: every change to important tables is recorded automatically ──
create table public.audit_log (
  id          bigint generated always as identity primary key,
  at          timestamptz not null default now(),
  actor_id    uuid,
  actor_email text,
  table_name  text not null,
  action      text not null check (action in ('INSERT','UPDATE','DELETE')),
  record_id   text,
  changed     text[] not null default '{}',
  summary     text not null default ''
);
create index audit_log_at_idx on public.audit_log (at desc);
alter table public.audit_log enable row level security;
create policy "audit_log: admin read" on public.audit_log for select to authenticated
  using ((select private.is_admin()));
-- No insert/update/delete policies: rows are written only by the trigger below.

create or replace function private.log_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  o     jsonb := case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end;
  n     jsonb := case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end;
  r     jsonb := coalesce(n, o);
  cols  text[] := '{}';
  label text;
begin
  if tg_op = 'UPDATE' then
    -- Changed top-level columns plus changed keys inside the `extra` jsonb.
    select coalesce(array_agg(distinct k order by k), '{}') into cols from (
      select key as k from jsonb_each(n)
        where key not in ('updated_at','extra') and n -> key is distinct from o -> key
      union all
      select e.key from jsonb_each(coalesce(n -> 'extra', '{}')) e
        where (o -> 'extra' -> e.key) is distinct from e.value
      union all
      select e.key from jsonb_each(coalesce(o -> 'extra', '{}')) e
        where not (coalesce(n -> 'extra', '{}') ? e.key)
    ) s;
    if cardinality(cols) = 0 then return null; end if;
  end if;

  if tg_table_name in ('payments','event_checkins','donations','requests') then
    label := (select m.name from public.members m where m.id = (r ->> 'member_id')::bigint);
  end if;
  if tg_table_name = 'payments' then
    label := concat_ws(' · ', label, 'CHF ' || (r ->> 'amount'), r ->> 'status');
  elsif tg_table_name = 'donations' then
    label := concat_ws(' · ', coalesce(label, 'Anonim'), 'CHF ' || (r ->> 'amount'));
  elsif tg_table_name = 'requests' then
    label := concat_ws(' · ', label, r -> 'extra' ->> 'type', r ->> 'status');
  end if;
  label := coalesce(label, r ->> 'name', r ->> 'title', r ->> 'question', '');

  insert into public.audit_log (actor_id, actor_email, table_name, action, record_id, changed, summary)
  values (auth.uid(), auth.jwt() ->> 'email', tg_table_name, tg_op,
          coalesce(r ->> 'id', concat(r ->> 'event_id', ':', r ->> 'member_id')),
          cols, left(label, 200));
  return null;
end; $$;

-- Polls are left out on purpose: logging vote updates would reveal who voted what.
do $$
declare t text;
begin
  foreach t in array array['members','payments','events','announcements','requests',
                           'documents','applications','donations','event_checkins'] loop
    execute format('drop trigger if exists audit_change on public.%I', t);
    execute format('create trigger audit_change after insert or update or delete on public.%I
                    for each row execute function private.log_change()', t);
  end loop;
end $$;

-- ── 4) Confirming a payment marks the member as paid and clears their reminders ──
create or replace function private.on_payment_confirmed()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'konfirmuar' and old.status is distinct from 'konfirmuar'
     and new.year = extract(year from now())::int then
    update public.members set pay = 'paguar' where id = new.member_id and pay = 'papaguar';
    update public.notifications set read_at = now()
      where member_id = new.member_id and kind = 'kujtese_pagese' and read_at is null;
  end if;
  return new;
end; $$;

create trigger payment_confirmed after update of status on public.payments
  for each row execute function private.on_payment_confirmed();

-- ── 5) Dashboard / finance RPCs (computed in Postgres, admin only) ──────────
create or replace function public.admin_dashboard_stats()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare y int := extract(year from now())::int;
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  return jsonb_build_object(
    'year',               y,
    'members_total',      (select count(*) from public.members),
    'members_active',     (select count(*) from public.members where status = 'aktiv'),
    'paid',               (select count(*) from public.members where pay = 'paguar'),
    'unpaid',             (select count(*) from public.members where pay = 'papaguar'),
    'exempt',             (select count(*) from public.members where pay = 'liruar' or (extra ->> 'exempt') = 'true'),
    'collected_year',     (select coalesce(sum(amount), 0) from public.payments where status = 'konfirmuar' and year = y),
    'pending_payments',   (select count(*) from public.payments where status = 'ne_pritje'),
    'donations_total',    (select coalesce(sum(amount), 0) from public.donations),
    'open_requests',      (select count(*) from public.requests where status = 'pret'),
    'new_applications',   (select count(*) from public.applications where status = 'aplikim'),
    'upcoming_events',    (select count(*) from public.events where coalesce((extra ->> 'past')::boolean, false) = false),
    'checkins_total',     (select count(*) from public.event_checkins),
    'changes_last_7_days',(select count(*) from public.audit_log where at > now() - interval '7 days')
  );
end; $$;

create or replace function public.finance_monthly(p_year int default null)
returns table (month int, payments numeric, donations numeric)
language plpgsql stable security definer set search_path = '' as $$
declare y int := coalesce(p_year, extract(year from now())::int);
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  return query
    select g.m,
           coalesce((select sum(p.amount) from public.payments p
                     where p.status = 'konfirmuar' and extract(year from p.created_at) = y
                       and extract(month from p.created_at) = g.m), 0),
           coalesce((select sum(d.amount) from public.donations d
                     where extract(year from d.created_at) = y
                       and extract(month from d.created_at) = g.m), 0)
    from generate_series(1, 12) as g(m)
    order by g.m;
end; $$;

-- ── 6) Scheduled jobs (pg_cron) ──────────────────────────────────────────────
create extension if not exists pg_cron with schema pg_catalog;

-- Unpaid active members get an in-app reminder (at most one unread per 25 days).
create or replace function private.send_payment_reminders()
returns int language plpgsql security definer set search_path = '' as $$
declare
  y int := extract(year from now())::int;
  n int;
begin
  insert into public.notifications (member_id, kind, title, body)
  select m.id, 'kujtese_pagese',
         'Kujtesë: kuota e anëtarësisë ' || y,
         'Kuota vjetore për ' || y || ' nuk është paguar ende. Paguaje te Faturat me TWINT, me referencën VV-'
           || case when m.id < 1000 then lpad(m.id::text, 3, '0') else m.id::text end || '-' || y || '.'
  from public.members m
  where m.pay = 'papaguar' and m.status = 'aktiv'
    and coalesce((m.extra ->> 'exempt')::boolean, false) = false
    and not exists (select 1 from public.notifications x
                    where x.member_id = m.id and x.kind = 'kujtese_pagese'
                      and x.read_at is null and x.created_at > now() - interval '25 days');
  get diagnostics n = row_count;
  return n;
end; $$;

-- A new membership year starts unpaid for everyone who paid last year.
create or replace function private.start_membership_year()
returns int language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  update public.members set pay = 'papaguar' where pay = 'paguar';
  get diagnostics n = row_count;
  return n;
end; $$;

select cron.schedule('kujtesa-pagese-mujore', '0 8 1 * *',  $$select private.send_payment_reminders()$$);
select cron.schedule('viti-i-ri-anetaresise',  '5 0 1 1 *', $$select private.start_membership_year()$$);

-- Admin view of the jobs and their latest run.
create or replace function public.admin_cron_jobs()
returns table (jobname text, schedule text, active boolean, last_run timestamptz, last_status text, last_message text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  return query
    select j.jobname::text, j.schedule::text, j.active, r.start_time, r.status::text, r.return_message::text
    from cron.job j
    left join lateral (select d.start_time, d.status, d.return_message from cron.job_run_details d
                       where d.jobid = j.jobid order by d.start_time desc limit 1) r on true
    where j.jobname in ('kujtesa-pagese-mujore','viti-i-ri-anetaresise')
    order by j.jobname;
end; $$;

-- "Run now" button for the reminder job (admins only).
create or replace function public.admin_run_payment_reminders()
returns int language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  return private.send_payment_reminders();
end; $$;

revoke execute on function public.admin_dashboard_stats(), public.finance_monthly(int),
  public.admin_cron_jobs(), public.admin_run_payment_reminders() from public, anon;
grant execute on function public.admin_dashboard_stats(), public.finance_monthly(int),
  public.admin_cron_jobs(), public.admin_run_payment_reminders() to authenticated;

-- Audit feed in the admin UI listens for new rows.
alter publication supabase_realtime add table public.audit_log;
