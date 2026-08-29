import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { formatPrice } from "@/lib/format";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductRating } from "@/components/product/product-rating";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { CustomOrderContact } from "@/components/product/custom-order-contact";
import { ProductGrid } from "@/components/product/product-grid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.nameFr} — NADYA Art & Handcraft` : "NADYA",
    description: product?.descriptionFr,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-nadya-black/50">
        <Link href="/produits" className="hover:text-nadya-gold-dark">
          Boutique
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/categories/${category.slug}`} className="hover:text-nadya-gold-dark">
              {category.nameFr}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-nadya-black/70">{product.nameFr}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery categorySlug={product.categorySlug} />

        <div className="flex flex-col">
          <p className="text-xs tracking-[0.2em] text-nadya-gold-dark uppercase">
            {category?.nameFr}
          </p>
          <h1 className="mt-2 font-display text-3xl text-nadya-black">{product.nameFr}</h1>
          <p className="mt-1 text-nadya-black/60">{product.subtitleFr}</p>

          <div className="mt-3">
            <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-medium text-nadya-black">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-nadya-black/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-nadya-black/75">{product.descriptionFr}</p>

          <div className="mt-4">
            <p className="mb-1 text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
              Matières
            </p>
            <ul className="text-sm text-nadya-black/70">
              {product.materialsFr.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            {product.isCustomizable ? (
              <CustomOrderContact product={product} />
            ) : (
              <AddToCartForm product={product} />
            )}
          </div>

          <p className="mt-4 text-xs text-nadya-black/50">
            Livraison en Tunisie · Paiement à la livraison · Retrait possible à Sfax
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl text-nadya-black">
            Vous aimerez aussi
          </h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
