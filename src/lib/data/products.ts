import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

interface ProductRow {
  id: string;
  slug: string;
  name_fr: string;
  subtitle_fr: string;
  category_slug: Product["categorySlug"];
  price: number;
  compare_at_price: number | null;
  images: string[];
  description_fr: string;
  description_ar: string | null;
  description_en: string | null;
  materials_fr: string[];
  materials_ar: string[] | null;
  materials_en: string[] | null;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  is_customizable: boolean;
  rating: number;
  review_count: number;
  created_at: string;
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    nameFr: row.name_fr,
    subtitleFr: row.subtitle_fr,
    categorySlug: row.category_slug,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    images: row.images,
    descriptionFr: row.description_fr,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en,
    materialsFr: row.materials_fr,
    materialsAr: row.materials_ar,
    materialsEn: row.materials_en,
    stock: row.stock,
    isFeatured: row.is_featured,
    isNew: row.is_new,
    isCustomizable: row.is_customizable,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    createdAt: row.created_at,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllProducts]", error);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapRow(data as ProductRow);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapRow(data as ProductRow);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", categorySlug)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getProductsByCategory]", error);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

export async function getNewProducts(): Promise<Product[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_new", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getNewProducts]", error);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", product.categorySlug)
    .neq("id", product.id)
    .limit(limit);

  if (error) {
    console.error("[getRelatedProducts]", error);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}
