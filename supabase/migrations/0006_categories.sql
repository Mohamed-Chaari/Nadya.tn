-- NADYA — Art & Handcraft
-- Phase 6: admin-editable categories.
--
-- Categories were previously a hardcoded 4-value list baked into a CHECK
-- constraint on products.category_slug. This migration promotes them to a
-- real table so the admin can add/edit/delete categories, while keeping
-- the existing slug-based identity (used throughout URLs, cart/wishlist
-- snapshots, and the product form) unchanged.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_fr text not null,
  name_ar text,
  name_en text,
  description_fr text not null default '',
  description_ar text,
  description_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
-- No policies: read only via the service-role client server-side, same as
-- admin_users/products/orders — zero public REST exposure.

-- Seed the 4 existing categories so nothing breaks for current products.
insert into public.categories
  (slug, name_fr, name_ar, name_en, description_fr, description_ar, description_en, sort_order)
values
  ('couronnes-tiares', 'Couronnes & Tiares', 'أكاليل وتيجان', 'Crowns & Tiaras',
   'Des pièces maîtresses pour sublimer la mariée le jour J.',
   'قطع مميزة تُبرز جمال العروس في يومها الكبير.',
   'Statement pieces to make the bride shine on her big day.', 0),
  ('colliers', 'Colliers', 'قلائد', 'Necklaces',
   'Colliers artisanaux, du délicat au majestueux.',
   'قلائد يدوية الصنع، من الرقيقة إلى الفخمة.',
   'Handcrafted necklaces, from delicate to majestic.', 1),
  ('peignes', 'Peignes', 'أمشاط الشعر', 'Combs',
   'Peignes ornés, faits main, pour une coiffure de reine.',
   'أمشاط مزخرفة، مصنوعة يدويًا، لتسريحة تليق بملكة.',
   'Ornate, handmade combs, fit for a queen''s hairstyle.', 2),
  ('hair-vines', 'Hair Vines', 'سلاسل الشعر', 'Hair Vines',
   'Chaînes délicates qui se glissent dans la coiffure.',
   'سلاسل رقيقة تندمج بلطف في تسريحة الشعر.',
   'Delicate chains that weave gracefully into the hairstyle.', 3)
on conflict (slug) do nothing;

-- Replace the fixed CHECK constraint with a real FK. Renaming a category's
-- slug cascades to every product referencing it; deleting a category that
-- still has products is blocked (RESTRICT) instead of silently orphaning
-- them. The check constraint's exact auto-generated name isn't hardcoded
-- here in case it differs from the default naming convention.
do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'public.products'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%category_slug%'
  loop
    execute format('alter table public.products drop constraint %I', con.conname);
  end loop;
end $$;

alter table public.products
  add constraint products_category_slug_fkey
  foreign key (category_slug) references public.categories (slug)
  on update cascade on delete restrict;
