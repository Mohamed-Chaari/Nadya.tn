import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produits/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductPlaceholderArt
          categorySlug={product.categorySlug}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-nadya-black px-2 py-1 text-[0.6rem] tracking-[0.15em] text-nadya-cream uppercase">
            Nouveau
          </span>
        )}
        {!product.isNew && product.compareAtPrice && (
          <span className="absolute left-3 top-3 bg-nadya-gold px-2 py-1 text-[0.6rem] tracking-[0.15em] text-nadya-black uppercase">
            Promo
          </span>
        )}
        {product.stock <= 4 && (
          <span className="absolute bottom-3 left-3 bg-nadya-cream/95 px-2 py-1 text-[0.6rem] tracking-[0.1em] text-nadya-black/80 uppercase">
            Plus que {product.stock} en stock
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display text-base text-nadya-black">{product.nameFr}</h3>
        <p className="mt-0.5 text-xs text-nadya-black/50">{product.subtitleFr}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-medium text-nadya-black">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-nadya-black/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
