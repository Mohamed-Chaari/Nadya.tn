export type CategorySlug = "couronnes-tiares" | "colliers" | "peignes" | "hair-vines";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Category {
  slug: CategorySlug;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
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
