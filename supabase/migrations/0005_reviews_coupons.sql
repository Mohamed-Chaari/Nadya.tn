-- NADYA — Art & Handcraft
-- Phase 5: product reviews (moderated), promo codes, and PWA support.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  customer_name text not null,
  customer_phone text,
  rating smallint not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists reviews_status_idx on public.reviews (status);

alter table public.reviews enable row level security;
-- No public policies: storefront reads approved reviews server-side via the
-- service-role client (same pattern as orders/products), and submission
-- goes through a Server Action — never a public REST insert.

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10, 3) not null check (discount_value > 0),
  min_order_amount numeric(10, 3),
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;
-- No public policies: coupons are validated server-side during checkout via
-- the service-role client, never queried directly from the browser.

alter table public.orders
  add column coupon_code text,
  add column discount_amount numeric(10, 3) not null default 0;

-- Atomic increment avoids a read-then-write race between two concurrent
-- checkouts both redeeming the same limited-use coupon.
create or replace function public.increment_coupon_used_count(coupon_code text)
returns void
language sql
as $$
  update public.coupons
  set used_count = used_count + 1
  where code = coupon_code;
$$;
