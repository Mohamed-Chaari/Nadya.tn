import type { Product } from "@/lib/types";

// Product names/subtitles are brand identity and always stay French,
// regardless of site locale — only description/materials are translated,
// falling back to French when a translation hasn't been added yet.

export function getLocalizedDescription(product: Product, locale: string): string {
  if (locale === "ar" && product.descriptionAr) return product.descriptionAr;
  if (locale === "en" && product.descriptionEn) return product.descriptionEn;
  return product.descriptionFr;
}

export function getLocalizedMaterials(product: Product, locale: string): string[] {
  if (locale === "ar" && product.materialsAr) return product.materialsAr;
  if (locale === "en" && product.materialsEn) return product.materialsEn;
  return product.materialsFr;
}
