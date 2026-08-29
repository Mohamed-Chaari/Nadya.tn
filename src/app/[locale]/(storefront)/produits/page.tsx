import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllProducts } from "@/lib/data/products";
import { filterAndSortProducts, type SortOption } from "@/lib/filter-products";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/product/search-bar";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });
  return { title: `${t("title")} — NADYA Art & Handcraft` };
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const t = await getTranslations("Products");
  const products = await getAllProducts();

  const filtered = filterAndSortProducts(products, {
    categorySlug: typeof sp.categorie === "string" ? sp.categorie : undefined,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: (typeof sp.tri === "string" ? sp.tri : undefined) as SortOption | undefined,
    q: typeof sp.q === "string" ? sp.q : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-nadya-black">{t("title")}</h1>
        <p className="mt-2 text-sm text-nadya-black/60">{t("count", { count: filtered.length })}</p>
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
