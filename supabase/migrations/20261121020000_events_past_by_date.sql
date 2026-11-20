-- Eventet e kaluara llogariten sipas datës (jo vetëm nga flamuri "past").
create or replace function private.event_day(p_extra jsonb)
returns date language sql immutable set search_path = '' as $$
  select case
    when p_extra ->> 'date' ~ '^\d{1,2}\.\d{1,2}\.\d{4}$' then to_date(p_extra ->> 'date', 'DD.MM.YYYY')
    when p_extra ->> 'date' ~ '^\d{4}-\d{2}-\d{2}' then to_date(left(p_extra ->> 'date', 10), 'YYYY-MM-DD')
  end;
$$;

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
    'upcoming_events',    (select count(*) from public.events
                            where coalesce((extra ->> 'past')::boolean, false) = false
                              and coalesce(private.event_day(extra) >= current_date, true)),
    'checkins_total',     (select count(*) from public.event_checkins),
    'changes_last_7_days',(select count(*) from public.audit_log where at > now() - interval '7 days')
  );
end; $$;
