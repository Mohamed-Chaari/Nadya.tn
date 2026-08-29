"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-nadya-line">
        <button
          type="button"
          className="px-3 py-2 text-sm disabled:opacity-30"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={outOfStock}
          aria-label="Diminuer la quantité"
        >
          −
        </button>
        <span className="min-w-[2rem] text-center text-sm">{quantity}</span>
        <button
          type="button"
          className="px-3 py-2 text-sm disabled:opacity-30"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={outOfStock}
          aria-label="Augmenter la quantité"
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
        {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
      </button>
    </div>
  );
}
