// Categories are admin-editable (stored in the `categories` table), so the
// slug is no longer a fixed set of literals — just a stable string identity.
export type CategorySlug = string;

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Category {
  id: string;
  slug: CategorySlug;
  nameFr: string;
  nameAr: string | null;
  nameEn: string | null;
  descriptionFr: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  nameFr: string;
  subtitleFr: string;
  categorySlug: CategorySlug;
  price: number;
  compareAtPrice?: number;
  images: string[];
  descriptionFr: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  materialsFr: string[];
  materialsAr: string[] | null;
  materialsEn: string[] | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
