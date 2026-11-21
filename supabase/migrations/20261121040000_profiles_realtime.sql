-- A role change in Cilësimet → Rolet reaches the person at once (their menu updates without reloading).
-- RLS still applies: each user only receives changes to their own profile row (admins: all rows).
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles') then
    alter publication supabase_realtime add table public.profiles;
  end if;
end $$;
