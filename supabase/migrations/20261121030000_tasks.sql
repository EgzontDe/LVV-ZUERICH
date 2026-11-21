-- Detyrat (Kanban) në databazë (2026-11-21)
-- Stafi (çdo rol përveç anëtarit) sheh dhe menaxhon të gjitha detyrat.
-- Anëtari sheh vetëm detyrat që i janë caktuar dhe ua ndryshon vetëm kolonën (përmes RPC).

create table if not exists public.tasks (
  id         bigint primary key,
  title      text not null check (length(trim(title)) between 2 and 200),
  col        text not null default 'todo' check (col in ('todo','doing','done')),
  assignee   bigint references public.members(id) on delete set null,
  created_by uuid default auth.uid(),
  extra      jsonb not null default '{}'::jsonb,       -- priority, due, note
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_assignee_idx on public.tasks(assignee);
alter table public.tasks enable row level security;

create policy "tasks: staff or assignee read" on public.tasks for select to authenticated
  using ((select private.is_staff()) or assignee = (select private.my_member_id()));
create policy "tasks: staff insert" on public.tasks for insert to authenticated
  with check ((select private.is_staff()));
create policy "tasks: staff update" on public.tasks for update to authenticated
  using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "tasks: admin or creator delete" on public.tasks for delete to authenticated
  using ((select private.is_admin()) or created_by = (select auth.uid()));

-- Anëtari zhvendos vetëm detyrën e vet
create or replace function public.set_my_task_col(p_task bigint, p_col text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_col not in ('todo','doing','done') then raise exception 'invalid column' using errcode = '22023'; end if;
  update public.tasks set col = p_col
   where id = p_task and assignee = private.my_member_id();
  if not found then raise exception 'not your task' using errcode = '42501'; end if;
end; $$;
revoke execute on function public.set_my_task_col(bigint, text) from public, anon;
grant execute on function public.set_my_task_col(bigint, text) to authenticated;

-- Realtime, updated_at dhe log auditimi si te tabelat e tjera
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks') then
    alter publication supabase_realtime add table public.tasks;
  end if;
end $$;
drop trigger if exists touch_updated_at on public.tasks;
create trigger touch_updated_at before update on public.tasks for each row execute function private.touch_updated_at();
drop trigger if exists audit_change on public.tasks;
create trigger audit_change after insert or update or delete on public.tasks for each row execute function private.log_change();
