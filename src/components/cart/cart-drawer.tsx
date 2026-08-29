"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";
import type { CategorySlug } from "@/lib/types";

export function CartDrawer() {
  const { lines, isDrawerOpen, closeDrawer, subtotal, setQuantity, removeItem } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fermer le panier"
        className="absolute inset-0 bg-nadya-black/40"
        onClick={closeDrawer}
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-nadya-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-nadya-line px-6 py-5">
          <h2 className="font-display text-lg text-nadya-black">Votre panier</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fermer"
            className="text-nadya-black/60 hover:text-nadya-black"
          >
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-nadya-black/60">Votre panier est vide.</p>
            <Link
              href="/produits"
              onClick={closeDrawer}
              className="text-sm font-medium text-nadya-gold-dark underline underline-offset-4"
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-4">
                  <ProductPlaceholderArt
                    categorySlug={line.categorySlug as CategorySlug}
                    className="h-20 w-20 shrink-0 rounded"
                  />
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/produits/${line.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-medium text-nadya-black hover:text-nadya-gold-dark"
                    >
                      {line.nameFr}
                    </Link>
                    <span className="mt-1 text-sm text-nadya-black/60">
                      {formatPrice(line.price)}
                    </span>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-nadya-line">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          aria-label="Diminuer la quantité"
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
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="text-xs text-nadya-black/50 underline underline-offset-4 hover:text-nadya-black"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-nadya-line px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-nadya-black/70">Sous-total</span>
                <span className="font-medium text-nadya-black">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/panier"
                onClick={closeDrawer}
                className="block w-full bg-nadya-black py-3 text-center text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink"
              >
                Voir le panier
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
