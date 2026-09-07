"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";

export function WishlistPageContent() {
  const { items, remove } = useWishlist();
  const t = useTranslations("Wishlist");
  const tCart = useTranslations("Cart");

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl text-nadya-black dark:text-nadya-cream">{t("empty")}</h1>
        <p className="text-nadya-black/60 dark:text-nadya-cream/60">{t("emptyHint")}</p>
        <Link
          href="/produits"
          className="mt-2 border border-nadya-black dark:border-nadya-cream px-5 py-2.5 text-sm text-nadya-black dark:text-nadya-cream hover:bg-nadya-black hover:text-nadya-cream dark:hover:bg-nadya-cream dark:bg-nadya-black dark:hover:text-nadya-black dark:text-nadya-cream"
        >
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl text-nadya-black dark:text-nadya-cream">{t("title")}</h1>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.productId} className="group">
            <Link href={`/produits/${item.slug}`} className="block">
              <ProductPlaceholderArt
                categorySlug={item.categorySlug}
                className="aspect-[4/5] w-full"
              />
              <div className="mt-3">
                <h3 className="font-display text-base text-nadya-black dark:text-nadya-cream">{item.nameFr}</h3>
                <p className="mt-1.5 text-sm font-medium text-nadya-black dark:text-nadya-cream">
                  {formatPrice(item.price)}
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => remove(item.productId)}
              className="mt-2 text-xs text-nadya-black/50 dark:text-nadya-cream/50 underline underline-offset-4 hover:text-nadya-black dark:text-nadya-cream"
            >
              {tCart("remove")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
