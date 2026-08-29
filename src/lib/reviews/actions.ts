"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export interface SubmitReviewInput {
  productId: string;
  productSlug: string;
  customerName: string;
  customerPhone?: string;
  rating: number;
  comment: string;
}

export interface SubmitReviewResult {
  success: boolean;
  errorCode?: "nameRequired" | "commentRequired" | "invalidRating" | "generic";
}

export async function submitReview(input: SubmitReviewInput): Promise<SubmitReviewResult> {
  const name = input.customerName.trim();
  const comment = input.comment.trim();

  if (!name) return { success: false, errorCode: "nameRequired" };
  if (!comment) return { success: false, errorCode: "commentRequired" };
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return { success: false, errorCode: "invalidRating" };
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("reviews").insert({
    product_id: input.productId,
    customer_name: name,
    customer_phone: input.customerPhone?.trim() || null,
    rating: input.rating,
    comment,
    status: "pending",
  });

  if (error) {
    console.error("[submitReview]", error);
    return { success: false, errorCode: "generic" };
  }

  revalidatePath(`/produits/${input.productSlug}`);
  return { success: true };
}
