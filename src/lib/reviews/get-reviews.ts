import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export async function getApprovedReviews(productId: string): Promise<Review[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, customer_name, rating, comment, created_at")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getApprovedReviews]", error);
    return [];
  }

  return data.map((r) => ({
    id: r.id,
    customerName: r.customer_name,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  }));
}
