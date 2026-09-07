-- NADYA — Art & Handcraft
-- Phase 3: admin auth + real product catalog.
--
-- admin_users links to Supabase Auth (auth.users) and gates access to
-- /admin/* — a user can sign in via Supabase Auth but is only treated as
-- an admin if a matching row exists here (checked server-side, RLS has
-- no public policies so this table is invisible to the anon/public API).
--
-- products replaces the Phase 1 mock catalog (src/lib/data/products.ts)
-- now that the admin dashboard needs to actually manage it.

create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- No policies: only the service_role key (server-side) can read this table.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_fr text not null,
  subtitle_fr text not null default '',
  category_slug text not null
    check (category_slug in ('couronnes-tiares', 'colliers', 'peignes', 'hair-vines')),
  price numeric(10, 3) not null,
  compare_at_price numeric(10, 3),
  images text[] not null default '{}',
  description_fr text not null default '',
  materials_fr text[] not null default '{}',
  stock integer not null default 0,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_customizable boolean not null default false,
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_slug_idx on public.products (category_slug);

alter table public.products enable row level security;
-- No public policies: the storefront reads products server-side (Server
-- Components) via the service-role client, same pattern as orders — the
-- product catalog is never queried directly from the browser.

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();
