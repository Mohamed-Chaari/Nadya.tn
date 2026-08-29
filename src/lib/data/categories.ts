import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "couronnes-tiares",
    nameFr: "Couronnes & Tiares",
    nameAr: "أكاليل وتيجان",
    descriptionFr: "Des pièces maîtresses pour sublimer la mariée le jour J.",
  },
  {
    slug: "colliers",
    nameFr: "Colliers",
    nameAr: "قلائد",
    descriptionFr: "Colliers artisanaux, du délicat au majestueux.",
  },
  {
    slug: "peignes",
    nameFr: "Peignes",
    nameAr: "أمشاط الشعر",
    descriptionFr: "Peignes ornés, faits main, pour une coiffure de reine.",
  },
  {
    slug: "hair-vines",
    nameFr: "Hair Vines",
    nameAr: "سلاسل الشعر",
    descriptionFr: "Chaînes délicates qui se glissent dans la coiffure.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
