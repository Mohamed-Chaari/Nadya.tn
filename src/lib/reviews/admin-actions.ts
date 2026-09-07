"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";

type ServiceClient = ReturnType<typeof getSupabaseServiceClient>;

// products.rating/review_count is the single source of truth the storefront
// displays (product cards + detail page) — seeded with small placeholder
// numbers until a product has real approved reviews, at which point this
// keeps it in sync with their actual average/count.
async function syncProductRating(supabase: ServiceClient, productId: string) {
  const { data: approved } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("status", "approved");

  if (!approved || approved.length === 0) return;

  const average = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;

  await supabase
    .from("products")
    .update({ rating: Math.round(average * 10) / 10, review_count: approved.length })
    .eq("id", productId);
}

export async function updateReviewStatus(
  reviewId: string,
  status: "approved" | "rejected"
): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();

  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    console.error("[updateReviewStatus] fetch", fetchError);
    throw new Error("Avis introuvable.");
  }

  const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId);

  if (error) {
    console.error("[updateReviewStatus]", error);
    throw new Error("Impossible de mettre à jour cet avis.");
  }

  await syncProductRating(supabase, review.product_id);

  revalidatePath("/admin/avis");
  // Rating changes show up on the storefront's statically-generated product
  // cards and detail pages — revalidate those too, not just the admin view.
  revalidatePath("/", "layout");
}
