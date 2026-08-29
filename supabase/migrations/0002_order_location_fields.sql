-- NADYA — Art & Handcraft
-- Structured Tunisia shipping address, matching ADEX's shipment form
-- (Gouvernorat / Délégation / Localité / Adresse complète), plus an
-- optional preferred delivery date. Replaces the free-text customer_city
-- column — in ADEX's own form, "Ville" is actually the gouvernorat level.

alter table public.orders
  add column shipping_gouvernorat text not null default '',
  add column shipping_delegation text not null default '',
  add column shipping_localite text,
  add column desired_delivery_date date;

alter table public.orders alter column shipping_gouvernorat drop default;
alter table public.orders alter column shipping_delegation drop default;

alter table public.orders drop column customer_city;
