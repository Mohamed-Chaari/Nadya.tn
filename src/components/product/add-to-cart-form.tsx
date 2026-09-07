"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;
  const t = useTranslations("AddToCart");

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-nadya-line dark:border-nadya-gold/15">
        <button
          type="button"
          className="px-3 py-2 text-sm disabled:opacity-30"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={outOfStock}
          aria-label={t("decrease")}
        >
          −
        </button>
        <span className="min-w-[2rem] text-center text-sm">{quantity}</span>
        <button
          type="button"
          className="px-3 py-2 text-sm disabled:opacity-30"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={outOfStock}
          aria-label={t("increase")}
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={outOfStock}
        onClick={() => addItem(product, quantity)}
        className="flex-1 bg-nadya-black py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/30"
      >
        {outOfStock ? t("outOfStock") : t("addToCart")}
      </button>
    </div>
  );
}
