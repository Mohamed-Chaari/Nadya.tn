-- NADYA — Art & Handcraft
-- Phase 2: orders + order_items
--
-- Product catalog still lives in src/lib/data/products.ts (mock/seed data) as of
-- Phase 1; this migration only adds order persistence. order_items snapshots the
-- product info at time of purchase (name/price/slug) rather than referencing a
-- products table, since there isn't one in Supabase yet — this is standard
-- e-commerce practice anyway (an order should reflect what was actually sold,
-- even if the catalog changes later).
--
-- RLS is enabled on both tables with NO policies for anon/authenticated roles:
-- all reads/writes happen server-side via the service_role key (Next.js Server
-- Actions), so customer phone numbers/addresses are never reachable through the
-- public REST API.

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text not null,
  notes text,
  subtotal numeric(10, 3) not null,
  shipping_fee numeric(10, 3) not null default 0,
  total numeric(10, 3) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists orders_order_number_key on public.orders (order_number);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  product_slug text not null,
  product_name text not null,
  category_slug text not null,
  unit_price numeric(10, 3) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 3) not null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- No policies: anon/authenticated roles get zero access by default under RLS.
-- Only the service_role key (used exclusively in server-side code) can read/write.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row
  execute function public.set_updated_at();
