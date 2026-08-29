# NADYA — Art & Handcraft

E-commerce platform for NADYA — Art & Handcraft, a luxury handcrafted bridal/wedding jewelry
brand based in Sfax, Tunisia (since 2023). Built with Next.js, Tailwind CSS, and Supabase.

See `nadyacraft-ecommerce-PRD.md` (client-provided) for full product requirements and roadmap.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Status

**Phase 1 — Storefront core** (in progress): product catalog, product detail pages, cart.
No payment/checkout yet (Phase 2), no i18n yet (Phase 4), no admin dashboard yet (Phase 3).

Product data currently comes from `src/lib/data/products.ts` (seed/mock data) rather than
Supabase — swap in `src/lib/supabase/client.ts` once a Supabase project is provisioned and
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. Product photography has
not been supplied yet, so product images render as elegant gold-line placeholder art
(`src/components/ui/product-placeholder-art.tsx`) keyed by category; swap in real photo URLs
via the `Product.images` field once available.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres, Auth, Storage) — not yet connected
- Cash on Delivery at launch; Konnect/Flouci later
- WhatsApp Cloud API for order notifications (not yet built)
