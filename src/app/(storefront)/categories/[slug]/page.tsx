import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, categories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { filterAndSortProducts, type SortOption } from "@/lib/filter-products";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? `${category.nameFr} — NADYA Art & Handcraft` : "NADYA" };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
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
        <h1 className="font-display text-3xl text-nadya-black">{category.nameFr}</h1>
        <p className="mt-2 max-w-xl text-sm text-nadya-black/60">{category.descriptionFr}</p>
      </div>

      <Suspense>
        <ProductFilters showCategoryFilter={false} />
      </Suspense>

      <div className="mt-8">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
