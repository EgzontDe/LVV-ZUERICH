-- Soft delete of accounts (Cilësimet → Rolet → Fshi):
--  * admin_delete_user: account is blocked at once (banned, sessions ended, no permissions),
--    the member is set to 'joaktiv'. Kept for 30 days.
--  * admin_restore_user: undoes it at any time within those 30 days.
--  * private.purge_deleted_accounts (daily cron): after 30 days the login, profile and member
--    (with personal data, requests, check-ins, notifications) are deleted for good.
--    Payments and donations stay for the finances, without a member link ("Anëtar i fshirë").

alter table public.profiles
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid;

-- Payments survive the member's final deletion.
alter table public.payments alter column member_id drop not null;
alter table public.payments drop constraint if exists payments_member_id_fkey;
alter table public.payments add constraint payments_member_id_fkey
  foreign key (member_id) references public.members(id) on delete set null;

-- A deleted account has no permissions and no member data, even with a still-valid token.
create or replace function private.my_role()
returns text language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select case when deleted_at is null then role else 'deleted' end
       from public.profiles where id = (select auth.uid())),
    'member');
$$;

create or replace function private.my_member_id()
returns bigint language sql stable security definer set search_path = '' as $$
  select m.id from public.members m
  where lower(m.email) = lower((select auth.jwt()) ->> 'email')
    and not exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.deleted_at is not null)
  limit 1;
$$;

create or replace function public.admin_delete_user(p_email text)
returns timestamptz language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_when timestamptz := now();
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  select id into v_id from public.profiles where lower(email) = lower(p_email);
  if v_id is null then raise exception 'no account for %', p_email using errcode = 'P0002'; end if;
  if v_id = (select auth.uid()) then raise exception 'cannot delete own account' using errcode = '42501'; end if;

  update public.profiles set deleted_at = v_when, deleted_by = (select auth.uid()) where id = v_id and deleted_at is null;
  if not found then return (select deleted_at from public.profiles where id = v_id); end if;
  update auth.users set banned_until = now() + interval '100 years' where id = v_id;
  delete from auth.sessions where user_id = v_id;
  update public.members
     set extra = extra || jsonb_build_object('status_before_delete', status), status = 'joaktiv'
   where lower(email) = lower(p_email);
  return v_when;
end; $$;

create or replace function public.admin_restore_user(p_email text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  select id into v_id from public.profiles where lower(email) = lower(p_email) and deleted_at is not null;
  if v_id is null then raise exception 'no deleted account for %', p_email using errcode = 'P0002'; end if;

  update public.profiles set deleted_at = null, deleted_by = null where id = v_id;
  update auth.users set banned_until = null where id = v_id;
  update public.members
     set status = coalesce(extra ->> 'status_before_delete', 'aktiv'), extra = extra - 'status_before_delete'
   where lower(email) = lower(p_email);
end; $$;

create or replace function private.purge_deleted_accounts()
returns integer language plpgsql security definer set search_path = '' as $$
declare r record; n integer := 0;
begin
  for r in select id, email from public.profiles where deleted_at < now() - interval '30 days' loop
    delete from public.members where lower(email) = lower(r.email);
    delete from auth.users where id = r.id;  -- profile goes with it (on delete cascade)
    n := n + 1;
  end loop;
  return n;
end; $$;

-- list_user_roles now also says which accounts are waiting for deletion.
drop function if exists public.list_user_roles();
create function public.list_user_roles()
returns table(email text, full_name text, role text, member_id bigint, deleted_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_admin() then raise exception 'not admin' using errcode = '42501'; end if;
  return query
    select p.email, p.full_name, p.role, m.id, p.deleted_at
    from public.profiles p
    left join public.members m on lower(m.email) = lower(p.email)
    order by p.deleted_at is not null, p.role = 'member', p.email;
end; $$;

revoke all on function public.admin_delete_user(text), public.admin_restore_user(text), public.list_user_roles() from public, anon;
grant execute on function public.admin_delete_user(text), public.admin_restore_user(text), public.list_user_roles() to authenticated;
revoke all on function private.purge_deleted_accounts() from public, anon, authenticated;

select cron.schedule('fshirja-perfundimtare-llogarive', '15 3 * * *', $$select private.purge_deleted_accounts()$$);
