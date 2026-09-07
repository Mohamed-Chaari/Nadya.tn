import type { Category } from "@/lib/types";

export function getCategoryName(category: Category, locale: string): string {
  if (locale === "ar" && category.nameAr) return category.nameAr;
  if (locale === "en" && category.nameEn) return category.nameEn;
  return category.nameFr;
}

export function getCategoryDescription(category: Category, locale: string): string {
  if (locale === "ar" && category.descriptionAr) return category.descriptionAr;
  if (locale === "en" && category.descriptionEn) return category.descriptionEn;
  return category.descriptionFr;
}
