"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";

export async function updateReviewStatus(
  reviewId: string,
  status: "approved" | "rejected"
): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId);

  if (error) {
    console.error("[updateReviewStatus]", error);
    throw new Error("Impossible de mettre à jour cet avis.");
  }

  revalidatePath("/admin/avis");
}
