-- App settings (key/value). Logged-in users can read them; only admins can change them.
-- Values are set in the dashboard / SQL editor, not in this file, so private data stays out of git.
create table public.settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "settings: read" on public.settings for select to authenticated using (true);
create policy "settings: admin insert" on public.settings for insert to authenticated with check ((select private.is_admin()));
create policy "settings: admin update" on public.settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "settings: admin delete" on public.settings for delete to authenticated using ((select private.is_admin()));

-- Keys used by the app:
--   twint_number  text    e.g. "+41 79 123 45 67"  (shown to members in the TWINT payment screen)
--   fee_override  number  e.g. 1  (replaces the CHF 150 fee while testing; delete the row to go back)
