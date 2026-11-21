-- Full membership form ("Formular anëtarësimi").
-- The public form stores everything in applications.extra (readable only with the 'members' permission).
-- On approval the details move to member_details: a separate table because members is readable by
-- every staff role, while the form holds sensitive data (personal number, family finances, signature).
-- member_details is readable only by the member themself and by admin/kryetar/sekretar.

create table if not exists public.member_details (
  member_id bigint primary key references public.members(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.member_details enable row level security;

drop policy if exists "member_details: self or members-perm read" on public.member_details;
create policy "member_details: self or members-perm read" on public.member_details for select to authenticated
  using ((select private.has_perm('members')) or member_id = (select private.my_member_id()));
drop policy if exists "member_details: members-perm write" on public.member_details;
create policy "member_details: members-perm write" on public.member_details for all to authenticated
  using ((select private.has_perm('members'))) with check ((select private.has_perm('members')));

revoke all on public.member_details from anon;
grant select, insert, update, delete on public.member_details to authenticated;

drop trigger if exists touch_updated_at on public.member_details;
create trigger touch_updated_at before update on public.member_details
  for each row execute function private.touch_updated_at();

-- Approve an application: create (or reuse) the member, copy the form into member_details,
-- mark the application 'aprovuar'. Returns the member id.
create or replace function public.approve_application(p_id bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare a public.applications; v_member bigint; v_today text := to_char(now() at time zone 'Europe/Zurich', 'DD.MM.YYYY');
begin
  if not private.has_perm('members') then raise exception 'not allowed' using errcode = '42501'; end if;
  select * into a from public.applications where id = p_id;
  if a.id is null then raise exception 'no application %', p_id using errcode = 'P0002'; end if;

  select id into v_member from public.members where lower(email) = lower(a.email) limit 1;
  if v_member is null then
    select coalesce(max(id), 0) + 1 into v_member from public.members where id < 9000;
    insert into public.members (id, name, email, status, pay, extra) values (
      v_member, a.name, lower(a.email), 'aktiv', 'papaguar',
      jsonb_build_object('role', 'Anëtar', 'joined', v_today,
        'kanton', coalesce(a.extra ->> 'kanton', ''), 'phone', coalesce(a.extra ->> 'phone', ''),
        'prof', coalesce(a.extra ->> 'prof', ''), 'dob', coalesce(a.extra ->> 'dob', '')));
  end if;

  insert into public.member_details (member_id, data)
  values (v_member, a.extra - 'notified_at' - 'approvedDate' - 'paidDate' || jsonb_build_object('application_id', a.id))
  on conflict (member_id) do update set data = public.member_details.data || excluded.data;

  update public.applications
     set status = 'aprovuar', extra = extra || jsonb_build_object('approvedDate', v_today)
   where id = p_id and status in ('aplikim', 'refuzuar');
  return v_member;
end; $$;

revoke all on function public.approve_application(bigint) from public, anon;
grant execute on function public.approve_application(bigint) to authenticated;
