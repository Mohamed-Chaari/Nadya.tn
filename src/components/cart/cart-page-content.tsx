"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";
import type { CategorySlug } from "@/lib/types";
import { SHIPPING_FEE } from "@/lib/config/shipping";

export function CartPageContent() {
  const { lines, subtotal, setQuantity, removeItem } = useCart();
  const t = useTranslations("Cart");

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl text-nadya-black">{t("emptyTitle")}</h1>
        <p className="text-nadya-black/60">{t("emptyHint")}</p>
        <Link
          href="/produits"
          className="mt-2 border border-nadya-black px-5 py-2.5 text-sm text-nadya-black hover:bg-nadya-black hover:text-nadya-cream"
        >
          {t("viewShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl text-nadya-black">{t("title")}</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <ul className="divide-y divide-nadya-line lg:col-span-2">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-4 py-5">
              <ProductPlaceholderArt
                categorySlug={line.categorySlug as CategorySlug}
                className="h-24 w-24 shrink-0"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/produits/${line.slug}`}
                      className="font-display text-base text-nadya-black hover:text-nadya-gold-dark"
                    >
                      {line.nameFr}
                    </Link>
                    <p className="mt-1 text-sm text-nadya-black/60">
                      {formatPrice(line.price)}
                    </p>
                  </div>
                  <p className="font-medium text-nadya-black">
                    {formatPrice(line.price * line.quantity)}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center border border-nadya-line">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm"
                      onClick={() => setQuantity(line.productId, line.quantity - 1)}
                      aria-label={t("decrease")}
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm"
                      onClick={() => setQuantity(line.productId, line.quantity + 1)}
                      aria-label={t("increase")}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.productId)}
                    className="text-xs text-nadya-black/50 underline underline-offset-4 hover:text-nadya-black"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border border-nadya-line p-6">
          <h2 className="font-display text-lg text-nadya-black">{t("summary")}</h2>
          <div className="mt-4 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-nadya-black/70">{t("subtotal")}</span>
              <span className="text-nadya-black">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-nadya-black/70">{t("shipping")}</span>
              <span className="text-nadya-black">{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-nadya-line pt-1.5 text-base font-medium text-nadya-black">
              <span>{t("total")}</span>
              <span>{formatPrice(subtotal + SHIPPING_FEE)}</span>
            </div>
          </div>
          <Link
            href="/commande"
            className="mt-6 block w-full bg-nadya-black py-3 text-center text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink"
          >
            {t("checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
