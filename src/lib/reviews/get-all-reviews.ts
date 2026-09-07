import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string | null;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export async function getAllReviews(): Promise<AdminReview[]> {
  const supabase = getSupabaseServiceClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, product_id, customer_name, customer_phone, rating, comment, status, created_at")
    .order("created_at", { ascending: false });

  if (error || !reviews) {
    console.error("[getAllReviews]", error);
    return [];
  }

  const productIds = [...new Set(reviews.map((r) => r.product_id))];
  const { data: products } = await supabase
    .from("products")
    .select("id, name_fr")
    .in("id", productIds.length > 0 ? productIds : ["00000000-0000-0000-0000-000000000000"]);

  const nameById = new Map((products ?? []).map((p) => [p.id, p.name_fr]));

  return reviews.map((r) => ({
    id: r.id,
    productId: r.product_id,
    productName: nameById.get(r.product_id) ?? "—",
    customerName: r.customer_name,
    customerPhone: r.customer_phone,
    rating: r.rating,
    comment: r.comment,
    status: r.status as AdminReview["status"],
    createdAt: r.created_at,
  }));
}
