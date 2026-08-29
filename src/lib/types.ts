export type CategorySlug = "couronnes-tiares" | "colliers" | "peignes" | "hair-vines";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Category {
  slug: CategorySlug;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
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
  materialsFr: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
