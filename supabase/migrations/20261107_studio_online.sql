-- Seiyun Studio v1: owner-scoped private drafts, atomic public publishing, and photos.
create table if not exists public.studio_private (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  draft jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.studio_live (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  published jsonb not null,
  revision bigint not null default 1,
  published_at timestamptz not null default now()
);
create table if not exists public.studio_history (
  owner_id uuid not null references auth.users(id) on delete cascade,
  revision bigint not null,
  published jsonb not null,
  published_at timestamptz not null default now(),
  primary key (owner_id, revision)
);

alter table public.studio_private enable row level security;
alter table public.studio_live enable row level security;
alter table public.studio_history enable row level security;

revoke all on public.studio_private from anon, authenticated;
revoke all on public.studio_live from anon, authenticated;
revoke all on public.studio_history from anon, authenticated;
grant select, insert, update, delete on public.studio_private to authenticated;
grant select on public.studio_live to anon, authenticated;
grant select on public.studio_history to authenticated;

create policy "owner can read own draft" on public.studio_private
 for select to authenticated using (owner_id = (select auth.uid()));
create policy "owner can add own draft" on public.studio_private
 for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "owner can change own draft" on public.studio_private
 for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "owner can delete own draft" on public.studio_private
 for delete to authenticated using (owner_id = (select auth.uid()));
create policy "anyone can read only published" on public.studio_live
 for select to anon, authenticated using (true);
create policy "owner can read own revision history" on public.studio_history
 for select to authenticated using (owner_id = (select auth.uid()));

create or replace function public.publish_studio()
returns bigint language plpgsql security definer set search_path = '' as $$
declare
  who uuid := (select auth.uid());
  snapshot jsonb;
  product jsonb;
  variant jsonb;
  count_visible integer := 0;
  old_row record;
  next_revision bigint;
begin
  if who is null then raise exception 'Authentication required' using errcode='28000'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(who::text));
  select draft into snapshot from public.studio_private where owner_id = who for update;
  if snapshot is null or jsonb_typeof(snapshot->'products') <> 'array' or jsonb_typeof(snapshot->'screens') <> 'array' then
    raise exception 'Valid draft with products and screens required' using errcode='22023';
  end if;
  if jsonb_array_length(snapshot->'screens') = 0 then raise exception 'At least one screen required'; end if;
  for product in select value from jsonb_array_elements(snapshot->'products') loop
    if coalesce(product->>'enabled','true') <> 'false' then
      count_visible := count_visible + 1;
      if length(trim(coalesce(product->>'name',''))) = 0 or product->>'name' ~ '^Drink [0-9]+$'
         or length(trim(coalesce(product->>'category',''))) = 0
         or jsonb_typeof(product->'sizes') <> 'array' then
        raise exception 'Visible product requires name, category and sizes' using errcode='22023';
      end if;
      if jsonb_array_length(product->'sizes') = 0 then raise exception 'Visible product must have at least one price'; end if;
      for variant in select value from jsonb_array_elements(product->'sizes') loop
        if length(trim(coalesce(variant->>'name',''))) = 0 or
           coalesce(variant->>'price','') !~ '^[0-9]+([.][0-9]{1,2})?$' then
          raise exception 'Invalid product size or price' using errcode='22023';
        end if;
      end loop;
    end if;
  end loop;
  if count_visible = 0 then raise exception 'At least one visible product is required'; end if;
  select * into old_row from public.studio_live where owner_id = who for update;
  next_revision := coalesce(old_row.revision,0) + 1;
  if old_row.revision is not null then
    insert into public.studio_history(owner_id,revision,published,published_at)
      values(who,old_row.revision,old_row.published,old_row.published_at)
      on conflict (owner_id,revision) do nothing;
  end if;
  snapshot := jsonb_set(snapshot,'{revision}', to_jsonb(next_revision),true);
  insert into public.studio_live(owner_id,published,revision,published_at)
     values(who,snapshot,next_revision,now())
     on conflict (owner_id) do update set published=excluded.published,revision=excluded.revision,published_at=excluded.published_at;
  return next_revision;
end; $$;
revoke all on function public.publish_studio() from public, anon;
grant execute on function public.publish_studio() to authenticated;

create or replace function public.rollback_studio(target_revision bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare
  who uuid := (select auth.uid());
  old_row record;
  target_doc jsonb;
  next_revision bigint;
begin
  if who is null then raise exception 'Authentication required' using errcode='28000'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(who::text));
  select * into old_row from public.studio_live where owner_id = who for update;
  if old_row.revision is null then raise exception 'Nothing published yet'; end if;
  select published into target_doc from public.studio_history where owner_id=who and revision=target_revision;
  if target_doc is null then raise exception 'Revision not in history'; end if;
  insert into public.studio_history(owner_id,revision,published,published_at)
    values(who,old_row.revision,old_row.published,old_row.published_at)
    on conflict (owner_id,revision) do nothing;
  next_revision := old_row.revision + 1;
  target_doc := jsonb_set(target_doc,'{revision}',to_jsonb(next_revision),true);
  update public.studio_live set published=target_doc, revision=next_revision, published_at=now() where owner_id=who;
  return next_revision;
end; $$;
revoke all on function public.rollback_studio(bigint) from public, anon;
grant execute on function public.rollback_studio(bigint) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('menu-products','menu-products',true,6291456,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public,
file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy "studio owners upload photos only to own folder" on storage.objects
for insert to authenticated with check (bucket_id='menu-products' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "studio owners list own photos" on storage.objects
for select to authenticated using (bucket_id='menu-products' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "studio owners remove own photos" on storage.objects
for delete to authenticated using (bucket_id='menu-products' and (storage.foldername(name))[1] = (select auth.uid())::text);