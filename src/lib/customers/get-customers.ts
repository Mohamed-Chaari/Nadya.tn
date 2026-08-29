import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export interface CustomerSummary {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

export async function getCustomers(): Promise<CustomerSummary[]> {
  const supabase = getSupabaseServiceClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("customer_name, customer_phone, total, status, created_at")
    .order("created_at", { ascending: false });

  if (error || !orders) {
    console.error("[getCustomers]", error);
    return [];
  }

  const byPhone = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const existing = byPhone.get(order.customer_phone);
    const isCancelled = order.status === "cancelled";

    if (!existing) {
      byPhone.set(order.customer_phone, {
        phone: order.customer_phone,
        name: order.customer_name,
        orderCount: isCancelled ? 0 : 1,
        totalSpent: isCancelled ? 0 : Number(order.total),
        lastOrderAt: order.created_at,
      });
    } else if (!isCancelled) {
      existing.orderCount += 1;
      existing.totalSpent += Number(order.total);
    }
  }

  return Array.from(byPhone.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}
