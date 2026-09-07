"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { orderNotifier } from "@/lib/notifications/notify-order";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";
import type { OrderStatus } from "@/lib/types";

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();

  const { data: order, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("order_number, customer_name, customer_phone, total")
    .single();

  if (error || !order) {
    console.error("[updateOrderStatus]", error);
    throw new Error("Impossible de mettre à jour la commande.");
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, quantity")
    .eq("order_id", orderId);

  const itemSummary = (items ?? [])
    .map((i) => `${i.quantity}× ${i.product_name}`)
    .join(", ");

  await orderNotifier.sendStatusUpdate(
    {
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      total: Number(order.total),
      itemSummary,
    },
    status
  );

  revalidatePath("/admin");
}
