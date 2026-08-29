import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

interface CategoryRow {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string | null;
  name_en: string | null;
  description_fr: string;
  description_ar: string | null;
  description_en: string | null;
  sort_order: number;
}

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    nameFr: row.name_fr,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    descriptionFr: row.description_fr,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en,
    sortOrder: row.sort_order,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getAllCategories]", error);
    return [];
  }
  return (data as CategoryRow[]).map(mapRow);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapRow(data as CategoryRow);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapRow(data as CategoryRow);
}
