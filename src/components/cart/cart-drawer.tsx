"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";

export function CartDrawer() {
  const { lines, isDrawerOpen, closeDrawer, subtotal, setQuantity, removeItem } = useCart();
  const t = useTranslations("Cart");

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t("closeCart")}
        className="absolute inset-0 bg-nadya-black/40"
        onClick={closeDrawer}
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-nadya-cream dark:bg-nadya-black shadow-2xl">
        <div className="flex items-center justify-between border-b border-nadya-line dark:border-nadya-gold/15 px-6 py-5">
          <h2 className="font-display text-lg text-nadya-black dark:text-nadya-cream">{t("title")}</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t("close")}
            className="text-nadya-black/60 dark:text-nadya-cream/60 hover:text-nadya-black dark:text-nadya-cream"
          >
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-nadya-black/60 dark:text-nadya-cream/60">{t("empty")}</p>
            <Link
              href="/produits"
              onClick={closeDrawer}
              className="text-sm font-medium text-nadya-gold-dark underline underline-offset-4"
            >
              {t("browse")}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
                    {line.image ? (
                      <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <ProductPlaceholderArt
                        categorySlug={line.categorySlug}
                        className="h-full w-full"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/produits/${line.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-medium text-nadya-black dark:text-nadya-cream hover:text-nadya-gold-dark"
                    >
                      {line.nameFr}
                    </Link>
                    <span className="mt-1 text-sm text-nadya-black/60 dark:text-nadya-cream/60">
                      {formatPrice(line.price)}
                    </span>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-nadya-line dark:border-nadya-gold/15">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          aria-label={t("decrease")}
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          aria-label={t("increase")}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="text-xs text-nadya-black/50 dark:text-nadya-cream/50 underline underline-offset-4 hover:text-nadya-black dark:text-nadya-cream"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-nadya-line dark:border-nadya-gold/15 px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-nadya-black/70 dark:text-nadya-cream/70">{t("subtotal")}</span>
                <span className="font-medium text-nadya-black dark:text-nadya-cream">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/panier"
                onClick={closeDrawer}
                className="block w-full bg-nadya-black py-3 text-center text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink"
              >
                {t("viewCart")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
