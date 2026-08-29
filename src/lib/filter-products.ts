import type { Product } from "@/lib/types";

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  q?: string;
}

export function filterAndSortProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = products;

  if (filters.categorySlug) {
    result = result.filter((p) => p.categorySlug === filters.categorySlug);
  }
  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.nameFr.toLowerCase().includes(q) ||
        p.subtitleFr.toLowerCase().includes(q) ||
        p.descriptionFr.toLowerCase().includes(q)
    );
  }

  const sorted = [...result];
  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      break;
    default:
      sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return sorted;
}
