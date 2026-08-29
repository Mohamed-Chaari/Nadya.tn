import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCategory, getAllCategories } from "@/lib/data/categories";
import { getCategoryName, getCategoryDescription } from "@/lib/category-i18n";
import { getProductsByCategory } from "@/lib/data/products";
import { filterAndSortProducts, type SortOption } from "@/lib/filter-products";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category ? `${category.nameFr} — NADYA Art & Handcraft` : "NADYA" };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [category, allCategories] = await Promise.all([
    getCategory(slug),
    getAllCategories(),
  ]);
  if (!category) notFound();

  const sp = await searchParams;
  const products = await getProductsByCategory(slug);
  const filtered = filterAndSortProducts(products, {
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: (typeof sp.tri === "string" ? sp.tri : undefined) as SortOption | undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-nadya-black dark:text-nadya-cream">
          {getCategoryName(category, locale)}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-nadya-black/60 dark:text-nadya-cream/60">
          {getCategoryDescription(category, locale)}
        </p>
      </div>

      <Suspense>
        <ProductFilters categories={allCategories} showCategoryFilter={false} />
      </Suspense>

      <div className="mt-8">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
