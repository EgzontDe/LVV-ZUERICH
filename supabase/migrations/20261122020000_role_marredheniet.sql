-- New narrow role "marredheniet": secretary for relations between VV (Pika Zürich) and SP (Swiss Social Democrats).
-- Reuses the outreach tables (contacts, history, calendar, budget, group events) with grupi = 'marredheniet'.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in
  ('member','admin','kryetar','sekretar','financa','komunikimi','eventet','studentet','rinia','marredheniet'));

alter table public.outreach_contacts drop constraint if exists outreach_contacts_grupi_check;
alter table public.outreach_contacts add constraint outreach_contacts_grupi_check check (grupi in ('studentet','rinia','marredheniet'));
alter table public.outreach_log drop constraint if exists outreach_log_grupi_check;
alter table public.outreach_log add constraint outreach_log_grupi_check check (grupi in ('studentet','rinia','marredheniet'));
alter table public.outreach_calendar drop constraint if exists outreach_calendar_grupi_check;
alter table public.outreach_calendar add constraint outreach_calendar_grupi_check check (grupi in ('studentet','rinia','marredheniet'));
alter table public.budget_requests drop constraint if exists budget_requests_grupi_check;
alter table public.budget_requests add constraint budget_requests_grupi_check check (grupi in ('studentet','rinia','marredheniet'));

create or replace function private.has_perm(p_area text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case private.my_role()
    when 'admin'        then true
    when 'kryetar'      then true
    when 'sekretar'     then p_area in ('members','requests','documents')
    when 'financa'      then p_area in ('payments','donations')
    when 'komunikimi'   then p_area in ('comms','requests')
    when 'eventet'      then p_area in ('events')
    when 'studentet'    then p_area in ('studentet')
    when 'rinia'        then p_area in ('rinia')
    when 'marredheniet' then p_area in ('marredheniet')
    else false
  end;
$$;

create or replace function private.reads_all_members()
returns boolean language sql stable security definer set search_path = '' as $$
  select private.my_role() not in ('member', 'deleted', 'studentet', 'rinia', 'marredheniet');
$$;

create or replace function public.set_user_role(p_email text, p_role text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  if p_role not in ('member','admin','kryetar','sekretar','financa','komunikimi','eventet','studentet','rinia','marredheniet') then
    raise exception 'invalid role %', p_role using errcode = '22023';
  end if;
  if lower(p_email) = lower((select email from public.profiles where id = (select auth.uid())))
     and p_role not in ('admin','kryetar') then
    raise exception 'cannot remove your own admin role' using errcode = '42501';
  end if;
  update public.profiles set role = p_role where lower(email) = lower(p_email);
  if not found then raise exception 'no account for %', p_email using errcode = 'P0002'; end if;
end; $$;

-- Daily reminders also for the relations secretary.
create or replace function private.outreach_daily()
returns void language plpgsql security definer set search_path = '' as $$
declare r record; n int; v_today date := (now() at time zone 'Europe/Zurich')::date; k record;
begin
  for r in
    select p.role, m.id as member_id from public.profiles p
    join public.members m on lower(m.email) = lower(p.email)
    where p.role in ('studentet', 'rinia', 'marredheniet') and p.deleted_at is null
  loop
    select count(*) into n from public.outreach_contacts
     where grupi = r.role and status in ('identifikuar', 'kontaktuar', 'interesuar')
       and coalesce(extra ->> 'kontakti_radhes', '') ~ '^\d{4}-\d{2}-\d{2}$'
       and (extra ->> 'kontakti_radhes')::date <= v_today;
    if n > 0 then
      insert into public.notifications (member_id, kind, title, body)
      values (r.member_id, 'kontakt_i_radhes',
              case when n = 1 then 'Sot ke 1 kontakt për të kontaktuar' else 'Sot ke ' || n || ' kontakte për të kontaktuar' end,
              'Hape faqen ' || case r.role when 'studentet' then 'Studentët' when 'rinia' then 'Rinia' else 'Marrëdhëniet SP/VV' end || ' për t''i parë.');
    end if;
    for k in select * from public.outreach_calendar where grupi = r.role and date in (v_today, v_today + 7) loop
      insert into public.notifications (member_id, kind, title, body)
      values (r.member_id, 'kontakt_i_radhes',
              case when k.date = v_today then 'Sot: ' || k.title else 'Pas 7 ditësh: ' || k.title end,
              to_char(k.date, 'DD.MM.YYYY') || coalesce(nullif(' — ' || k.note, ' — '), ''));
    end loop;
  end loop;
  -- Privacy: people who never became members are not kept forever (not partner relations).
  delete from public.outreach_contacts
   where grupi <> 'marredheniet' and status not in ('aplikoi', 'anetar') and coalesce(extra ->> 'lloji', '') <> 'shoqate'
     and updated_at < now() - interval '12 months';
end; $$;

create or replace function private.notify_budget()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_group text := case new.grupi when 'studentet' then 'Studentët' when 'rinia' then 'Rinia' else 'Marrëdhëniet SP/VV' end;
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
    from (values ('studentet'), ('rinia'), ('marredheniet')) g(grupi)
    left join public.outreach_contacts c on c.grupi = g.grupi
    group by g.grupi;
end; $$;
