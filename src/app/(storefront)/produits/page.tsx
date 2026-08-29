import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/data/products";
import { filterAndSortProducts, type SortOption } from "@/lib/filter-products";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/product/search-bar";

export const metadata: Metadata = {
  title: "Tous les produits — NADYA Art & Handcraft",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = await getAllProducts();

  const filtered = filterAndSortProducts(products, {
    categorySlug: typeof params.categorie === "string" ? params.categorie : undefined,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    sort: (typeof params.tri === "string" ? params.tri : undefined) as SortOption | undefined,
    q: typeof params.q === "string" ? params.q : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-nadya-black">Tous les produits</h1>
        <p className="mt-2 text-sm text-nadya-black/60">
          {filtered.length} pièce{filtered.length > 1 ? "s" : ""} artisanale
          {filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      <Suspense>
        <div className="mb-6">
          <SearchBar />
        </div>
        <ProductFilters />
      </Suspense>

      <div className="mt-8">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
