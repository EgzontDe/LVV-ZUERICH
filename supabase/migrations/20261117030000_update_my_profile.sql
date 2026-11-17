-- Members can edit their own basic data (name, phone, canton, profession, date of birth).
-- Payment status, member status, role and email stay admin-only.
drop function if exists public.update_my_phone(text);

create or replace function public.update_my_profile(p jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  mid    bigint := private.my_member_id();
  v_name text := nullif(trim(p ->> 'name'), '');
  v_extra jsonb := '{}'::jsonb;
  k text;
begin
  if mid is null then raise exception 'no member record for this account'; end if;
  if v_name is not null and length(v_name) not between 2 and 120 then raise exception 'invalid name'; end if;

  foreach k in array array['phone','kanton','prof','dob'] loop
    if p ? k then
      if length(coalesce(p ->> k, '')) > 120 then raise exception 'value too long: %', k; end if;
      v_extra := v_extra || jsonb_build_object(k, trim(coalesce(p ->> k, '')));
    end if;
  end loop;

  update public.members
     set name  = coalesce(v_name, name),
         extra = extra || v_extra
   where id = mid;

  if v_name is not null then
    update public.profiles set full_name = v_name where id = (select auth.uid());
  end if;
end; $$;

revoke execute on function public.update_my_profile(jsonb) from public, anon;
grant execute on function public.update_my_profile(jsonb) to authenticated;
