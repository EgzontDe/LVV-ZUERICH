-- After the test: a confirmed payment also moves the member's application to "aktiv" (Onboarding),
-- instead of leaving it at "aprovuar" / "pret_pagesen".
create or replace function private.on_payment_confirmed()
returns trigger language plpgsql security definer set search_path = '' as $$
declare y int := extract(year from now())::int;
begin
  if new.year <> y then return new; end if;
  if new.status = 'konfirmuar' and (tg_op = 'INSERT' or old.status is distinct from 'konfirmuar') then
    update public.members set pay = 'paguar' where id = new.member_id and pay = 'papaguar';
    update public.notifications set read_at = now()
      where member_id = new.member_id and kind = 'kujtese_pagese' and read_at is null;
    update public.applications a
       set status = 'aktiv',
           extra = a.extra || jsonb_build_object('paidDate', to_char(now() at time zone 'Europe/Zurich', 'DD.MM.YYYY'))
     where a.status in ('aprovuar', 'pret_pagesen')
       and lower(a.email) = (select lower(m.email) from public.members m where m.id = new.member_id);
  elsif tg_op = 'UPDATE' and old.status = 'konfirmuar' and new.status <> 'konfirmuar'
        and not exists (select 1 from public.payments p where p.member_id = new.member_id and p.year = y
                        and p.status = 'konfirmuar' and p.id <> new.id) then
    update public.members set pay = 'papaguar' where id = new.member_id and pay = 'paguar';
  end if;
  return new;
end; $$;

-- Applications of members who already paid this year (e.g. from the test) → aktiv.
update public.applications a
   set status = 'aktiv',
       extra = a.extra || jsonb_build_object('paidDate', to_char(now() at time zone 'Europe/Zurich', 'DD.MM.YYYY'))
 where a.status in ('aprovuar', 'pret_pagesen')
   and exists (select 1 from public.members m join public.payments p on p.member_id = m.id
               where lower(m.email) = lower(a.email) and p.status = 'konfirmuar'
                 and p.year = extract(year from now())::int);
