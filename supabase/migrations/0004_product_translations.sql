-- NADYA — Art & Handcraft
-- Phase 4 (i18n): Arabic/English product copy. name_fr and subtitle_fr are
-- deliberately NOT duplicated here — product names are brand identity and
-- always display in French regardless of site locale. Only the
-- translatable copy (description, materials) gets per-locale columns,
-- nullable so the storefront can fall back to French when empty.

alter table public.products
  add column description_ar text,
  add column description_en text,
  add column materials_ar text[],
  add column materials_en text[];
