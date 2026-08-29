"use client";

import { useState } from "react";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";
import type { CategorySlug } from "@/lib/types";

export function ProductGallery({
  categorySlug,
  imageCount = 3,
}: {
  categorySlug: CategorySlug;
  imageCount?: number;
}) {
  const [active, setActive] = useState(0);
  const slots = Array.from({ length: imageCount });

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {slots.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`aspect-square w-16 shrink-0 overflow-hidden border-2 transition sm:w-20 ${
              active === i ? "border-nadya-gold" : "border-transparent"
            }`}
          >
            <ProductPlaceholderArt categorySlug={categorySlug} className="h-full w-full" />
          </button>
        ))}
      </div>
      <ProductPlaceholderArt
        categorySlug={categorySlug}
        className="aspect-square w-full flex-1"
      />
    </div>
  );
}
