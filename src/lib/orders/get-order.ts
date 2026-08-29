import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { CategorySlug, OrderStatus } from "@/lib/types";

export interface OrderWithItems {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  shippingGouvernorat: string;
  shippingDelegation: string;
  shippingLocalite: string | null;
  desiredDeliveryDate: string | null;
  notes: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: {
    productSlug: string;
    productName: string;
    categorySlug: CategorySlug;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}

export async function getOrderByNumber(orderNumber: number): Promise<OrderWithItems | null> {
  const supabase = getSupabaseServiceClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    customerAddress: order.customer_address,
    shippingGouvernorat: order.shipping_gouvernorat,
    shippingDelegation: order.shipping_delegation,
    shippingLocalite: order.shipping_localite,
    desiredDeliveryDate: order.desired_delivery_date,
    notes: order.notes,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shipping_fee),
    total: Number(order.total),
    createdAt: order.created_at,
    items: (items ?? []).map((i) => ({
      productSlug: i.product_slug,
      productName: i.product_name,
      categorySlug: i.category_slug,
      unitPrice: Number(i.unit_price),
      quantity: i.quantity,
      lineTotal: Number(i.line_total),
    })),
  };
}
