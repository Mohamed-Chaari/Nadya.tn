"use client";

import { useWishlist } from "@/lib/wishlist/wishlist-context";
import type { Product } from "@/lib/types";

export function WishlistButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { isInWishlist, toggle } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      className={`flex items-center justify-center transition ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className={active ? "text-nadya-gold" : "text-nadya-black/60 hover:text-nadya-gold"}
      >
        <path
          d="M12 20.5s-7.5-4.6-10-9.2C.5 8 1.8 4.5 5 3.6c2.1-.6 4.2.3 5.5 2.1C11.8 3.9 13.9 3 16 3.6c3.2.9 4.5 4.4 3 7.7-2.5 4.6-10 9.2-10 9.2Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
