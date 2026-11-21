-- Real numbers for the public home page (anonymous visitors): counts only, no personal data.
create or replace function public.public_stats()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'members', (select count(*) from public.members where status = 'aktiv' and id < 9000),
    'events', (select count(*) from public.events e
               where e.public and coalesce(e.extra ->> 'miratuar', 'true') <> 'false' and e.extra ->> 'grupi' is null
                 and coalesce(e.extra ->> 'date', '') ~ '^\d{1,2}\.\d{1,2}\.\d{4}$'
                 and to_date(e.extra ->> 'date', 'DD.MM.YYYY') >= (now() at time zone 'Europe/Zurich')::date));
$$;
revoke all on function public.public_stats() from public;
grant execute on function public.public_stats() to anon, authenticated;
