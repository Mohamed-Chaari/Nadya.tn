-- NADYA — Art & Handcraft
-- Phase 6b: admin push notifications (new orders) + returning-customer loyalty.
--
-- admin_push_subscriptions stores one row per admin device that has opted
-- into browser/PWA push notifications (Web Push API — free, no third-party
-- SMS/WhatsApp service involved).

create table if not exists public.admin_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admin_users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_push_subscriptions enable row level security;
-- No policies: only the service_role key (server-side) reads/writes this.
