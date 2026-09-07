import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

export interface AdminOrderListItem {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  total: number;
  createdAt: string;
  itemSummary: string;
}

export async function getAllOrders(): Promise<AdminOrderListItem[]> {
  const supabase = getSupabaseServiceClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, status, customer_name, customer_phone, total, created_at")
    .order("created_at", { ascending: false });

  if (error || !orders) {
    console.error("[getAllOrders]", error);
    return [];
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("order_id, product_name, quantity");

  const summaryByOrder = new Map<string, string>();
  for (const item of items ?? []) {
    const existing = summaryByOrder.get(item.order_id) ?? "";
    const piece = `${item.quantity}× ${item.product_name}`;
    summaryByOrder.set(item.order_id, existing ? `${existing}, ${piece}` : piece);
  }

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    status: o.status,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    total: Number(o.total),
    createdAt: o.created_at,
    itemSummary: summaryByOrder.get(o.id) ?? "",
  }));
}
