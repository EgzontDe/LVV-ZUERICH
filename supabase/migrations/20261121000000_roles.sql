-- Rolet me përgjegjësi të ndara (2026-11-21)
--
-- Rolet:  member      — vetëm të dhënat e veta
--         admin       — gjithçka (teknik)
--         kryetar     — gjithçka
--         sekretar    — anëtarët, aplikimet, kërkesat, dokumentet/procesverbalet
--         financa     — pagesat, kujtesat e pagesës, donacionet, raportet financiare
--         komunikimi  — njoftimet, sondazhet, kërkesat
--         eventet     — eventet, check-in
--
-- Fushat (areas) që kontrollon private.has_perm():
--   members, payments, donations, events, comms, requests, documents
-- Cilësimet, log-u i auditimit dhe caktimi i roleve: vetëm admin/kryetar (private.is_admin()).

-- 1. Rolet e lejuara ------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('member','admin','kryetar','sekretar','financa','komunikimi','eventet'));

-- 2. Funksionet e lejeve ---------------------------------------------------------
create or replace function private.my_role()
returns text language sql stable security definer set search_path = '' as $$
  select coalesce((select role from public.profiles where id = (select auth.uid())), 'member');
$$;

-- Qasje e plotë: admin dhe kryetar
create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select private.my_role() in ('admin','kryetar');
$$;

-- Çdo rol përveç anëtarit të thjeshtë
create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select private.my_role() <> 'member';
$$;

create or replace function private.has_perm(p_area text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case private.my_role()
    when 'admin'      then true
    when 'kryetar'    then true
    when 'sekretar'   then p_area in ('members','requests','documents')
    when 'financa'    then p_area in ('payments','donations')
    when 'komunikimi' then p_area in ('comms','requests')
    when 'eventet'    then p_area in ('events')
    else false
  end;
$$;

grant execute on function private.my_role(), private.is_staff(), private.has_perm(text) to authenticated;

-- 3. Rregullat RLS ---------------------------------------------------------------
-- members: të gjithë stafi i lexon (financat/eventet duhet të shohin emrat), vetëm 'members' i ndryshon
alter policy "members: admin or self read" on public.members
  using ((select private.is_staff()) or id = (select private.my_member_id()));
alter policy "members: admin insert" on public.members
  with check ((select private.has_perm('members')));
alter policy "members: admin update" on public.members
  using ((select private.has_perm('members'))) with check ((select private.has_perm('members')));
alter policy "members: admin delete" on public.members
  using ((select private.has_perm('members')));

-- applications
alter policy "applications: admin read" on public.applications
  using ((select private.has_perm('members')));
alter policy "applications: admin update" on public.applications
  using ((select private.has_perm('members'))) with check ((select private.has_perm('members')));
alter policy "applications: admin delete" on public.applications
  using ((select private.has_perm('members')));

-- payments
alter policy "payments: admin or own read" on public.payments
  using ((select private.has_perm('payments')) or member_id = (select private.my_member_id()));
alter policy "payments: admin update" on public.payments
  using ((select private.has_perm('payments'))) with check ((select private.has_perm('payments')));
alter policy "payments: member reports own" on public.payments
  with check ((select private.has_perm('payments'))
              or (member_id = (select private.my_member_id()) and status = 'ne_pritje'));

-- notifications (kujtesat e pagesës)
alter policy "notifications: admin or own read" on public.notifications
  using ((select private.has_perm('payments')) or member_id = (select private.my_member_id()));
alter policy "notifications: admin insert" on public.notifications
  with check ((select private.has_perm('payments')));
alter policy "notifications: admin delete" on public.notifications
  using ((select private.has_perm('payments')));

-- donations
alter policy "donations: insert" on public.donations
  with check ((select private.has_perm('donations')) or member_id = (select private.my_member_id()));
alter policy "donations: admin delete" on public.donations
  using ((select private.has_perm('donations')));

-- events + check-in
alter policy "events: admin insert" on public.events
  with check ((select private.has_perm('events')));
alter policy "events: admin update" on public.events
  using ((select private.has_perm('events'))) with check ((select private.has_perm('events')));
alter policy "events: admin delete" on public.events
  using ((select private.has_perm('events')));
alter policy "checkins: admin or own read" on public.event_checkins
  using ((select private.has_perm('events')) or member_id = (select private.my_member_id()));
alter policy "checkins: admin insert" on public.event_checkins
  with check ((select private.has_perm('events')));
alter policy "checkins: admin delete" on public.event_checkins
  using ((select private.has_perm('events')));

-- announcements + polls
alter policy "announcements: admin insert" on public.announcements
  with check ((select private.has_perm('comms')));
alter policy "announcements: admin update" on public.announcements
  using ((select private.has_perm('comms'))) with check ((select private.has_perm('comms')));
alter policy "announcements: admin delete" on public.announcements
  using ((select private.has_perm('comms')));
alter policy "polls: admin insert" on public.polls
  with check ((select private.has_perm('comms')));
alter policy "polls: admin update" on public.polls
  using ((select private.has_perm('comms'))) with check ((select private.has_perm('comms')));
alter policy "polls: admin delete" on public.polls
  using ((select private.has_perm('comms')));

-- requests
alter policy "requests: admin or own read" on public.requests
  using ((select private.has_perm('requests')) or member_id = (select private.my_member_id()));
alter policy "requests: admin update" on public.requests
  using ((select private.has_perm('requests'))) with check ((select private.has_perm('requests')));
alter policy "requests: admin delete" on public.requests
  using ((select private.has_perm('requests')));

-- documents + storage
alter policy "documents: admin insert" on public.documents
  with check ((select private.has_perm('documents')));
alter policy "documents: admin delete" on public.documents
  using ((select private.has_perm('documents')));
alter policy "documents bucket: admin upload" on storage.objects
  with check (bucket_id = 'documents' and (select private.has_perm('documents')));
alter policy "documents bucket: admin delete" on storage.objects
  using (bucket_id = 'documents' and (select private.has_perm('documents')));

-- settings dhe audit_log mbeten vetëm për private.is_admin() (admin/kryetar).

-- profiles: admin/kryetar shohin rolet e të gjithëve
drop policy if exists "profiles: admin read" on public.profiles;
create policy "profiles: admin read" on public.profiles
  for select to authenticated using ((select private.is_admin()));

-- 4. RPC ------------------------------------------------------------------------
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
    'donations_total',    (select coalesce(sum(amount), 0) from public.donations),
    'open_requests',      (select count(*) from public.requests where status = 'pret'),
    'new_applications',   (select count(*) from public.applications where status = 'aplikim'),
    'upcoming_events',    (select count(*) from public.events where coalesce((extra ->> 'past')::boolean, false) = false),
    'checkins_total',     (select count(*) from public.event_checkins),
    'changes_last_7_days',(select count(*) from public.audit_log where at > now() - interval '7 days')
  );
end; $$;

create or replace function public.admin_run_payment_reminders()
returns integer language plpgsql security definer set search_path = '' as $$
begin
  if not private.has_perm('payments') then raise exception 'not allowed' using errcode = '42501'; end if;
  return private.send_payment_reminders();
end; $$;

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
                     where extract(year from d.created_at) = y
                       and extract(month from d.created_at) = g.m), 0)
    from generate_series(1, 12) as g(m)
    order by g.m;
end; $$;

-- Roli i përdoruesit të loguar (për menunë e aplikacionit)
create or replace function public.my_role()
returns text language sql stable security definer set search_path = '' as $$
  select private.my_role();
$$;
grant execute on function public.my_role() to authenticated;

-- Lista e llogarive dhe roleve (vetëm admin/kryetar)
create or replace function public.list_user_roles()
returns table(email text, full_name text, role text, member_id bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  return query
    select p.email, p.full_name, p.role, m.id
    from public.profiles p
    left join public.members m on lower(m.email) = lower(p.email)
    order by p.role = 'member', p.email;
end; $$;
grant execute on function public.list_user_roles() to authenticated;

-- Cakto rolin e një llogarie (vetëm admin/kryetar; s'mund të heqësh rolin tënd)
create or replace function public.set_user_role(p_email text, p_role text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  if p_role not in ('member','admin','kryetar','sekretar','financa','komunikimi','eventet') then
    raise exception 'invalid role %', p_role using errcode = '22023';
  end if;
  if lower(p_email) = lower((select email from public.profiles where id = (select auth.uid())))
     and p_role not in ('admin','kryetar') then
    raise exception 'cannot remove your own admin role' using errcode = '42501';
  end if;
  update public.profiles set role = p_role where lower(email) = lower(p_email);
  if not found then raise exception 'no account for %', p_email using errcode = 'P0002'; end if;
end; $$;
grant execute on function public.set_user_role(text, text) to authenticated;

-- Përdoruesit e paloguar s'kanë pse t'i thërrasin këto
revoke execute on function public.my_role(), public.list_user_roles(), public.set_user_role(text,text) from public, anon;
grant execute on function public.my_role(), public.list_user_roles(), public.set_user_role(text,text) to authenticated;
