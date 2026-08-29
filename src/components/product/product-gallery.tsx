"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";
import type { CategorySlug } from "@/lib/types";

export function ProductGallery({
  categorySlug,
  images,
  productName,
}: {
  categorySlug: CategorySlug;
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const slots: (string | undefined)[] = hasImages ? images : Array.from({ length: 3 });

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {slots.map((src, i) => (
          <button
            key={src ?? i}
            type="button"
            onClick={() => setActive(i)}
            className={`relative aspect-square w-16 shrink-0 overflow-hidden border-2 transition sm:w-20 ${
              active === i ? "border-nadya-gold" : "border-transparent"
            }`}
          >
            {hasImages && src ? (
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              <ProductPlaceholderArt categorySlug={categorySlug} className="h-full w-full" />
            )}
          </button>
        ))}
      </div>
      <div className="relative aspect-square w-full flex-1">
        {hasImages ? (
          <Image
            src={images[active]}
            alt={productName}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        ) : (
          <ProductPlaceholderArt categorySlug={categorySlug} className="h-full w-full" />
        )}
      </div>
    </div>
  );
}
