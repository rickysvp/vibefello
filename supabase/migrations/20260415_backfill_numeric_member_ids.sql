do $$
declare
  current_max integer;
  legacy_count integer;
begin
  select coalesce(max(member_id::int), 0)
  into current_max
  from public.waitlist
  where member_id ~ '^[0-9]{3}$';

  select count(*)
  into legacy_count
  from public.waitlist
  where paid = true
    and (
      member_id is null
      or member_id !~ '^[0-9]{3}$'
    );

  if current_max + legacy_count > 999 then
    raise exception 'Member ID capacity reached (999). current_max=%, legacy_count=%', current_max, legacy_count;
  end if;

  with legacy as (
    select
      email,
      row_number() over (
        order by coalesce(paid_at, checkout_started_at, created_at, now()) asc, email asc
      ) as offset
    from public.waitlist
    where paid = true
      and (
        member_id is null
        or member_id !~ '^[0-9]{3}$'
      )
  ),
  base as (
    select coalesce(max(member_id::int), 0) as max_id
    from public.waitlist
    where member_id ~ '^[0-9]{3}$'
  )
  update public.waitlist as w
  set member_id = lpad((base.max_id + legacy.offset)::text, 3, '0'),
      updated_at = now()
  from legacy, base
  where w.email = legacy.email;
end $$;
