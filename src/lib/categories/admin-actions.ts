"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";

export interface CategoryFormInput {
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  sortOrder: number;
}

export interface CategoryActionResult {
  success: boolean;
  error?: string;
}

function toRow(input: CategoryFormInput) {
  return {
    slug: input.slug,
    name_fr: input.nameFr,
    name_ar: input.nameAr || null,
    name_en: input.nameEn || null,
    description_fr: input.descriptionFr,
    description_ar: input.descriptionAr || null,
    description_en: input.descriptionEn || null,
    sort_order: input.sortOrder,
  };
}

function validate(input: CategoryFormInput): string | null {
  if (!input.slug.trim()) return "Le slug est requis.";
  if (!input.nameFr.trim()) return "Le nom est requis.";
  return null;
}

export async function createCategory(input: CategoryFormInput): Promise<CategoryActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Non autorisé." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("categories").insert(toRow(input));

  if (error) {
    console.error("[createCategory]", error);
    if (error.code === "23505") return { success: false, error: "Ce slug existe déjà." };
    return { success: false, error: "Une erreur est survenue." };
  }

  revalidatePath("/admin/categories");
  // Categories render on the storefront's statically-generated homepage, nav,
  // footer, and category pages — revalidate the whole tree so admin changes
  // show up immediately instead of waiting for the next deploy.
  revalidatePath("/", "layout");
  redirect("/admin/categories?toast=created");
}

export async function updateCategory(
  id: string,
  input: CategoryFormInput
): Promise<CategoryActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Non autorisé." };

  const validationError = validate(input);
  if (validationError) return { success: false, error: validationError };

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("categories").update(toRow(input)).eq("id", id);

  if (error) {
    console.error("[updateCategory]", error);
    if (error.code === "23505") return { success: false, error: "Ce slug existe déjà." };
    return { success: false, error: "Une erreur est survenue." };
  }

  revalidatePath("/admin/categories");
  // Categories render on the storefront's statically-generated homepage, nav,
  // footer, and category pages — revalidate the whole tree so admin changes
  // show up immediately instead of waiting for the next deploy.
  revalidatePath("/", "layout");
  redirect("/admin/categories?toast=updated");
}

export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Non autorisé." };

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("[deleteCategory]", error);
    if (error.code === "23503") {
      return {
        success: false,
        error: "Impossible de supprimer : des produits utilisent encore cette catégorie.",
      };
    }
    return { success: false, error: "Impossible de supprimer cette catégorie." };
  }

  revalidatePath("/admin/categories");
  // Categories render on the storefront's statically-generated homepage, nav,
  // footer, and category pages — revalidate the whole tree so admin changes
  // show up immediately instead of waiting for the next deploy.
  revalidatePath("/", "layout");
  return { success: true };
}
