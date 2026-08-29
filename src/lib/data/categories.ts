import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "couronnes-tiares",
    nameFr: "Couronnes & Tiares",
    nameAr: "أكاليل وتيجان",
    nameEn: "Crowns & Tiaras",
    descriptionFr: "Des pièces maîtresses pour sublimer la mariée le jour J.",
    descriptionAr: "قطع مميزة تُبرز جمال العروس في يومها الكبير.",
    descriptionEn: "Statement pieces to make the bride shine on her big day.",
  },
  {
    slug: "colliers",
    nameFr: "Colliers",
    nameAr: "قلائد",
    nameEn: "Necklaces",
    descriptionFr: "Colliers artisanaux, du délicat au majestueux.",
    descriptionAr: "قلائد يدوية الصنع، من الرقيقة إلى الفخمة.",
    descriptionEn: "Handcrafted necklaces, from delicate to majestic.",
  },
  {
    slug: "peignes",
    nameFr: "Peignes",
    nameAr: "أمشاط الشعر",
    nameEn: "Combs",
    descriptionFr: "Peignes ornés, faits main, pour une coiffure de reine.",
    descriptionAr: "أمشاط مزخرفة، مصنوعة يدويًا، لتسريحة تليق بملكة.",
    descriptionEn: "Ornate, handmade combs, fit for a queen's hairstyle.",
  },
  {
    slug: "hair-vines",
    nameFr: "Hair Vines",
    nameAr: "سلاسل الشعر",
    nameEn: "Hair Vines",
    descriptionFr: "Chaînes délicates qui se glissent dans la coiffure.",
    descriptionAr: "سلاسل رقيقة تندمج بلطف في تسريحة الشعر.",
    descriptionEn: "Delicate chains that weave gracefully into the hairstyle.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(category: Category, locale: string): string {
  if (locale === "ar") return category.nameAr;
  if (locale === "en") return category.nameEn;
  return category.nameFr;
}

export function getCategoryDescription(category: Category, locale: string): string {
  if (locale === "ar") return category.descriptionAr;
  if (locale === "en") return category.descriptionEn;
  return category.descriptionFr;
}
