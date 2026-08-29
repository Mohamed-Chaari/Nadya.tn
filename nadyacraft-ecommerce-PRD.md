# NADYA — Art & Handcraft — E-commerce Platform
### Product Requirements Document (PRD) — v1

**Client:** NADYA — Art & Handcraft (luxury handcrafted bridal/wedding jewelry, Sfax, since 2023) — Facebook: facebook.com/nadyacraft.tn
**Goal:** Full custom, premium, end-to-end e-commerce platform — storefront + admin dashboard, built step by step with Claude Code.

---

## 1. Vision
A polished, trustworthy, "big-platform" quality online store for **NADYA — Art & Handcraft** (based in Sfax, since 2023) — a luxury handcrafted bridal/wedding jewelry brand: crowns/tiaras, hair combs & pins, necklaces, hair vines. Tagline: *"NADYA — pour les femmes inoubliables."* Something that feels as complete and professional as major e-commerce platforms, while matching the brand's elegant, premium visual identity.

**Existing audience/assets:**
- Facebook page (facebook.com/nadyacraft.tn) — 9.4K followers, active community, real customer testimonials/reviews already posted
- Logo + brand identity already exist: wordmark "NADYA" in black-to-gold gradient, "ART & HANDCRAFT / since 2023" subtitle, cream/pearl textured backgrounds
- Product photography style: soft, elegant, close-up shots on neutral/cream backgrounds, poetic French product names (e.g. "Rosée scintillante", "Peigne reine de cristal", "L'écrin fleuri")
- Design direction: premium/boutique feel — black, gold, cream palette, elegant typography — NOT a generic/basic e-commerce look

## 2. Tech Stack
| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js (React) + Tailwind CSS | SSR/SEO friendly, responsive by default (works on PC + mobile browser) |
| Backend | Next.js API routes (or NestJS if it grows) | Keep monorepo simple for solo dev |
| Database + Auth + Storage | **Supabase** (Postgres) | One platform for DB, admin auth, and product image storage — simplifies stack, free tier |
| Payments | Cash on Delivery (COD) at launch → Konnect / Flouci later | Stripe/PayPal not viable in Tunisia |
| Notifications | **WhatsApp Cloud API** (Meta, official) — automated order confirmations/status updates | Free tier covers typical small-business volume; no email needed |
| Hosting | Vercel (frontend) + Supabase (backend/DB) | Start free-tier, upgrade later |
| Domain | TBD (.tn or .com) | Not purchased yet |

## 3. Internationalization (i18n)
- Languages: **Arabic (RTL)** + **French** (+ English optional later)
- **No fixed default language** — auto-detect from the visitor's browser/device locale on first visit
- Manual language switcher available on every page, persists per session
- Arabic requires full RTL layout (not just translated strings) — mirrored nav, forms, product cards, etc.

## 4. Branding
- **Logo + branding assets already provided** (NADYA wordmark, black-to-gold gradient, cream/pearl textures) — logo file on hand
- Product categories (based on actual catalog): Couronnes/Tiares, Colliers, Peignes, Hair vines/pièces de cheveux — each item often has an artistic French name + category subtitle
- Design system should extend the existing branding consistently across web/admin: premium, elegant, bridal-fashion feel

## 5. Feature Scope

### Customer-facing (storefront)
- Product catalog: categories, product detail pages, image gallery
- Search + filters (category, price) + sorting
- Product reviews & ratings
- Wishlist / favorites
- Cart → Guest checkout (no forced account creation), **phone number required, email NOT required**
- Coupons / promo codes, discounts
- Order tracking (status: pending → confirmed → shipped → delivered)
- Related / "you may also like" products
- Fully responsive (mobile browser = primary use case in TN)
- Additional "delight" features to evaluate: recently viewed items, low-stock urgency badges, social proof (X sold recently), Instagram/Facebook feed embed

### Admin dashboard (for Nadya + team)
- **Multi-admin**: Nadya (owner) + additional accounts (staff/family), role-based access
- Login (secure, admin-only)
- **Main/home view = Orders list** (front and center on login) — every order shows customer phone number, items, status
- Simple, organized UI: clear action buttons per order (Confirm / Shipped / Delivered / Cancel), click-to-call button next to phone number, WhatsApp status updates sent automatically
- Product management: add/edit/delete, stock levels, low-stock alerts
- Customer list (from orders)
- Coupon management
- Analytics: sales over time, best sellers, revenue overview
- Mobile-friendly admin (usable from phone, not just PC) — designed to be easy for a non-technical user

### Mobile
- Phase 1: fully responsive site (PC + phone browser)
- Phase 2: PWA (installable, app-like, no app store needed)
- Phase 3 (optional, later): native app via React Native if still needed after PWA

## 6. Payments
- Launch: **Cash on Delivery (COD)** only
- Later: add Konnect and/or Flouci for online payment

## 7. Build Roadmap (step-by-step, via Claude Code)
1. **Phase 1 — Storefront core:** product catalog, product page, cart (no payment yet)
2. **Phase 2 — Checkout & Orders:** COD checkout flow, order confirmation + notifications
3. **Phase 3 — Admin dashboard:** product & order management, basic analytics
4. **Phase 4 — i18n:** Arabic RTL + French, auto-detect + switcher
5. **Phase 5 — Extras:** reviews, wishlist, coupons, PWA
6. **Phase 6 — Deploy:** domain, hosting, go live

## 8. Delivery Integration — ADEX
- Nadya works with **ADEX** (adex.tn) for delivery — they have a client portal (my.adex.tn), which strongly suggests business/API access exists for pro accounts, even without public documentation
- **Strong signal:** other Tunisian e-commerce SaaS platforms (e.g. Converty) already offer automated delivery-company integration for local carriers — worth referencing when asking ADEX
- Next action: Nadya (or team) contacts ADEX directly (55 781 000 / contact@adex.tn) and asks specifically for **API/webhook access for a pro/business account**, mentioning that other platforms already automate this with local carriers
- **If API available:** confirmed order in admin → auto-creates shipment in ADEX + syncs tracking number back
- **If no API:** build fallback — admin exports order data in ADEX's required format (CSV or ready label) to speed up manual entry; revisit automation later
- Architecture should keep shipping as a pluggable module, so ADEX (or another carrier later) can be swapped in without rebuilding the order flow

## 9. Open Items (to confirm before/during build)
- Branding assets (logo files, color codes, fonts) — to be provided
- Domain name choice
- WhatsApp/SMS provider account (for notifications)
- Approx. product catalog size (for seeding initial data)
