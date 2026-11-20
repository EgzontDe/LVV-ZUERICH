-- Pagesat dhe donacionet (2026-11-21)
-- 1. members.pay ndjek pagesat e konfirmuara të vitit (edhe kur një konfirmim anulohet).
-- 2. RPC admin_set_paid: Financat shënojnë pagesë me kesh / e anulojnë, pa leje mbi tabelën members.
-- 3. Donacionet kanë status: anëtari dërgon "ne_pritje" (TWINT), Financat konfirmojnë.

-- 1 ---------------------------------------------------------------------------
create or replace function private.on_payment_confirmed()
returns trigger language plpgsql security definer set search_path = '' as $$
declare y int := extract(year from now())::int;
begin
  if new.year <> y then return new; end if;
  if new.status = 'konfirmuar' and (tg_op = 'INSERT' or old.status is distinct from 'konfirmuar') then
    update public.members set pay = 'paguar' where id = new.member_id and pay = 'papaguar';
    update public.notifications set read_at = now()
      where member_id = new.member_id and kind = 'kujtese_pagese' and read_at is null;
  elsif tg_op = 'UPDATE' and old.status = 'konfirmuar' and new.status <> 'konfirmuar'
        and not exists (select 1 from public.payments p where p.member_id = new.member_id and p.year = y
                        and p.status = 'konfirmuar' and p.id <> new.id) then
    update public.members set pay = 'papaguar' where id = new.member_id and pay = 'paguar';
  end if;
  return new;
end; $$;

drop trigger if exists payment_confirmed on public.payments;
create trigger payment_confirmed after insert or update of status on public.payments
  for each row execute function private.on_payment_confirmed();

-- 2 ---------------------------------------------------------------------------
create or replace function public.admin_set_paid(p_member bigint, p_paid boolean, p_amount numeric default null, p_method text default 'kesh')
returns void language plpgsql security definer set search_path = '' as $$
declare y int := extract(year from now())::int;
begin
  if not private.has_perm('payments') then raise exception 'not allowed' using errcode = '42501'; end if;
  if p_paid then
    if not exists (select 1 from public.payments where member_id = p_member and year = y and status = 'konfirmuar') then
      insert into public.payments (member_id, year, amount, method, status)
      values (p_member, y, coalesce(p_amount, 150), coalesce(nullif(p_method, ''), 'kesh'), 'konfirmuar');
    end if;
    update public.members set pay = 'paguar' where id = p_member and pay = 'papaguar';
  else
    update public.payments set status = 'refuzuar' where member_id = p_member and year = y and status = 'konfirmuar';
    update public.members set pay = 'papaguar' where id = p_member and pay = 'paguar';
  end if;
end; $$;
revoke execute on function public.admin_set_paid(bigint, boolean, numeric, text) from public, anon;
grant execute on function public.admin_set_paid(bigint, boolean, numeric, text) to authenticated;

-- 3 ---------------------------------------------------------------------------
alter table public.donations add column if not exists status text not null default 'konfirmuar';
alter table public.donations drop constraint if exists donations_status_check;
alter table public.donations add constraint donations_status_check check (status in ('ne_pritje','konfirmuar','refuzuar'));
-- Nga tani anëtarët i dërgojnë si "në pritje"; donacionet ekzistuese mbeten të konfirmuara.
alter table public.donations alter column status set default 'ne_pritje';

alter policy "donations: read" on public.donations
  using (status = 'konfirmuar' or (select private.has_perm('donations')) or member_id = (select private.my_member_id()));
alter policy "donations: insert" on public.donations
  with check ((select private.has_perm('donations'))
              or (member_id = (select private.my_member_id()) and status = 'ne_pritje'));
drop policy if exists "donations: admin update" on public.donations;
create policy "donations: admin update" on public.donations for update to authenticated
  using ((select private.has_perm('donations'))) with check ((select private.has_perm('donations')));

-- Statistikat numërojnë vetëm donacionet e konfirmuara
create or replace function public.finance_monthly(p_year integer default null)
returns table(month integer, payments numeric, donations numeric)
language plpgsql stable security definer set search_path = '' as $$
declare y int := coalesce(p_year, extract(year from now())::int);
begin
  if not private.has_perm('payments') then raise exception 'not allowed' using errcode = '42501'; end if;
  return query
    select g.m,
           coalesce((select sum(p.amount) from public.payments p
                     where p.status = 'konfirmuar' and extract(year from p.created_at) = y
                       and extract(month from p.created_at) = g.m), 0),
           coalesce((select sum(d.amount) from public.donations d
                     where d.status = 'konfirmuar' and extract(year from d.created_at) = y
                       and extract(month from d.created_at) = g.m), 0)
    from generate_series(1, 12) as g(m)
    order by g.m;
end; $$;

create or replace function public.admin_dashboard_stats()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare y int := extract(year from now())::int;
begin
  if not private.is_staff() then raise exception 'not staff' using errcode = '42501'; end if;
  return jsonb_build_object(
    'year',               y,
    'members_total',      (select count(*) from public.members),
    'members_active',     (select count(*) from public.members where status = 'aktiv'),
    'paid',               (select count(*) from public.members where pay = 'paguar'),
    'unpaid',             (select count(*) from public.members where pay = 'papaguar'),
    'exempt',             (select count(*) from public.members where pay = 'liruar' or (extra ->> 'exempt') = 'true'),
    'collected_year',     (select coalesce(sum(amount), 0) from public.payments where status = 'konfirmuar' and year = y),
    'pending_payments',   (select count(*) from public.payments where status = 'ne_pritje'),
    'donations_total',    (select coalesce(sum(amount), 0) from public.donations where status = 'konfirmuar'),
    'pending_donations',  (select count(*) from public.donations where status = 'ne_pritje'),
    'open_requests',      (select count(*) from public.requests where status = 'pret'),
    'new_applications',   (select count(*) from public.applications where status = 'aplikim'),
    'upcoming_events',    (select count(*) from public.events where coalesce((extra ->> 'past')::boolean, false) = false),
    'checkins_total',     (select count(*) from public.event_checkins),
    'changes_last_7_days',(select count(*) from public.audit_log where at > now() - interval '7 days')
  );
end; $$;
