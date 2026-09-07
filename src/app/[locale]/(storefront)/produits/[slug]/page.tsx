import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { getCategoryName } from "@/lib/category-i18n";
import { formatPrice } from "@/lib/format";
import { getLocalizedDescription, getLocalizedMaterials } from "@/lib/product-i18n";
import { getApprovedReviews, computeReviewStats } from "@/lib/reviews/get-reviews";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductRating } from "@/components/product/product-rating";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { CustomOrderContact } from "@/components/product/custom-order-contact";
import { ProductGrid } from "@/components/product/product-grid";
import { ReviewsList } from "@/components/product/reviews-list";
import { ReviewForm } from "@/components/product/review-form";
import { WishlistButton } from "@/components/product/wishlist-button";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.nameFr} — NADYA Art & Handcraft` : "NADYA",
    description: product ? getLocalizedDescription(product, locale) : undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("ProductDetail");
  const currentLocale = await getLocale();
  const category = await getCategory(product.categorySlug);
  const related = await getRelatedProducts(product);
  const reviews = await getApprovedReviews(product.id);
  const reviewStats = computeReviewStats(reviews);
  const tReviews = await getTranslations("Reviews");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-nadya-black/50 dark:text-nadya-cream/50">
        <Link href="/produits" className="hover:text-nadya-gold-dark">
          {t("breadcrumbShop")}
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/categories/${category.slug}`} className="hover:text-nadya-gold-dark">
              {getCategoryName(category, currentLocale)}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-nadya-black/70 dark:text-nadya-cream/70">{product.nameFr}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery
          categorySlug={product.categorySlug}
          images={product.images}
          productName={product.nameFr}
        />

        <div className="flex flex-col">
          <p className="text-xs tracking-[0.2em] text-nadya-gold-dark uppercase">
            {category ? getCategoryName(category, currentLocale) : null}
          </p>
          <h1 className="mt-2 font-display text-3xl text-nadya-black dark:text-nadya-cream">{product.nameFr}</h1>
          <p className="mt-1 text-nadya-black/60 dark:text-nadya-cream/60">{product.subtitleFr}</p>

          {reviewStats.count > 0 && (
            <div className="mt-3">
              <ProductRating rating={reviewStats.average} reviewCount={reviewStats.count} />
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-medium text-nadya-black dark:text-nadya-cream">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-nadya-black/40 dark:text-nadya-cream/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-nadya-black/75 dark:text-nadya-cream/75">
            {getLocalizedDescription(product, currentLocale)}
          </p>

          <div className="mt-4">
            <p className="mb-1 text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
              {t("materials")}
            </p>
            <ul className="text-sm text-nadya-black/70 dark:text-nadya-cream/70">
              {getLocalizedMaterials(product, currentLocale).map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1">
              {product.isCustomizable ? (
                <CustomOrderContact product={product} />
              ) : (
                <AddToCartForm product={product} />
              )}
            </div>
            {!product.isCustomizable && (
              <WishlistButton
                product={product}
                className="h-11 w-11 shrink-0 border border-nadya-line dark:border-nadya-gold/15"
              />
            )}
          </div>

          <p className="mt-4 text-xs text-nadya-black/50 dark:text-nadya-cream/50">{t("shippingNote")}</p>
        </div>
      </div>

      <div className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display text-2xl text-nadya-black dark:text-nadya-cream">{tReviews("title")}</h2>
          <ReviewsList reviews={reviews} />
        </div>
        <div>
          <ReviewForm productId={product.id} productSlug={product.slug} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl text-nadya-black dark:text-nadya-cream">{t("youMayLike")}</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
