import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";
import { LOW_STOCK_THRESHOLD } from "@/lib/config/catalog";
import { WishlistButton } from "@/components/product/wishlist-button";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("ProductCard");

  return (
    <Link href={`/produits/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.nameFr}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ProductPlaceholderArt
            categorySlug={product.categorySlug}
            className="h-full w-full transition duration-500 group-hover:scale-105"
          />
        )}
        {product.isNew && (
          <span className="absolute start-3 top-3 bg-nadya-black px-2 py-1 text-[0.6rem] tracking-[0.15em] text-nadya-cream uppercase">
            {t("new")}
          </span>
        )}
        {!product.isNew && product.compareAtPrice && (
          <span className="absolute start-3 top-3 bg-nadya-gold px-2 py-1 text-[0.6rem] tracking-[0.15em] text-nadya-black uppercase">
            {t("promo")}
          </span>
        )}
        {product.isCustomizable && (
          <span className="absolute end-3 top-3 border border-nadya-gold bg-nadya-cream/95 px-2 py-1 text-[0.6rem] tracking-[0.1em] text-nadya-gold-dark uppercase">
            {t("customizable")}
          </span>
        )}
        {product.stock <= LOW_STOCK_THRESHOLD && (
          <span className="absolute bottom-3 start-3 bg-nadya-cream/95 px-2 py-1 text-[0.6rem] tracking-[0.1em] text-nadya-black/80 uppercase">
            {t("lowStock", { count: product.stock })}
          </span>
        )}
        <WishlistButton
          product={product}
          className="absolute bottom-3 end-3 h-8 w-8 rounded-full bg-nadya-cream/95 shadow-sm"
          iconClassName="text-nadya-black/60 hover:text-nadya-gold"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-display text-base text-nadya-black dark:text-nadya-cream">{product.nameFr}</h3>
        <p className="mt-0.5 text-xs text-nadya-black/50 dark:text-nadya-cream/50">{product.subtitleFr}</p>
        {product.reviewCount > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <span className="text-nadya-gold">★</span>
            <span className="text-nadya-black/70 dark:text-nadya-cream/70">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-medium text-nadya-black dark:text-nadya-cream">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-nadya-black/40 dark:text-nadya-cream/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
