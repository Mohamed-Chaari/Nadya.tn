"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";
import type { CategorySlug } from "@/lib/types";

export interface ProductFormInput {
  slug: string;
  nameFr: string;
  subtitleFr: string;
  categorySlug: CategorySlug;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  materialsFr: string[];
  materialsAr: string[];
  materialsEn: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
}

export interface ProductActionResult {
  success: boolean;
  error?: string;
}

function toRow(input: ProductFormInput) {
  return {
    slug: input.slug,
    name_fr: input.nameFr,
    subtitle_fr: input.subtitleFr,
    category_slug: input.categorySlug,
    price: input.price,
    compare_at_price: input.compareAtPrice,
    images: input.images,
    description_fr: input.descriptionFr,
    description_ar: input.descriptionAr || null,
    description_en: input.descriptionEn || null,
    materials_fr: input.materialsFr,
    materials_ar: input.materialsAr.length > 0 ? input.materialsAr : null,
    materials_en: input.materialsEn.length > 0 ? input.materialsEn : null,
    stock: input.stock,
    is_featured: input.isFeatured,
    is_new: input.isNew,
    is_customizable: input.isCustomizable,
  };
}

function validate(input: ProductFormInput): string | null {
  if (!input.slug.trim()) return "Le slug est requis.";
  if (!input.nameFr.trim()) return "Le nom est requis.";
  if (!input.descriptionFr.trim()) return "La description est requise.";
  if (input.price <= 0) return "Le prix doit être supérieur à 0.";
  if (input.stock < 0) return "Le stock ne peut pas être négatif.";
  return null;
}

export async function createProduct(input: ProductFormInput): Promise<ProductActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Non autorisé." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("products").insert(toRow(input));

  if (error) {
    console.error("[createProduct]", error);
    if (error.code === "23505") return { success: false, error: "Ce slug existe déjà." };
    return { success: false, error: "Une erreur est survenue." };
  }

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function updateProduct(
  id: string,
  input: ProductFormInput
): Promise<ProductActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Non autorisé." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);

  if (error) {
    console.error("[updateProduct]", error);
    if (error.code === "23505") return { success: false, error: "Ce slug existe déjà." };
    return { success: false, error: "Une erreur est survenue." };
  }

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function deleteProduct(id: string): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[deleteProduct]", error);
    throw new Error("Impossible de supprimer ce produit.");
  }

  revalidatePath("/admin/produits");
}
