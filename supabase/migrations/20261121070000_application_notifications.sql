-- In-app notification (bell) for admin, kryetar and sekretar when someone applies for membership.
-- The trigger runs as the table owner, so the public (anon) form can create the notifications.

create or replace function private.notify_new_application()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.notifications (member_id, kind, title, body)
  select m.id, 'aplikim_i_ri', 'Aplikim i ri për anëtarësim',
         new.name || coalesce(' · ' || nullif(new.extra ->> 'qyteti', ''), '') || ' — hape te Onboarding'
  from public.profiles p
  join public.members m on lower(m.email) = lower(p.email)
  where p.role in ('admin', 'kryetar', 'sekretar') and p.deleted_at is null;
  return new;
end; $$;

drop trigger if exists notify_new_application on public.applications;
create trigger notify_new_application after insert on public.applications
  for each row execute function private.notify_new_application();

-- Financat reads payment reminders of all members, but not the board's own notifications.
drop policy if exists "notifications: admin or own read" on public.notifications;
create policy "notifications: admin or own read" on public.notifications for select to authenticated
  using (((select private.has_perm('payments')) and kind = 'kujtese_pagese')
         or member_id = (select private.my_member_id()));
