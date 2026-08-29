"use server";

import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { orderNotifier } from "@/lib/notifications/notify-order";
import type { CartLine } from "@/lib/cart/cart-context";

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  notes?: string;
  lines: CartLine[];
}

export interface CheckoutResult {
  success: boolean;
  orderNumber?: number;
  error?: string;
}

function isValidTunisianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 12;
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const name = input.customerName.trim();
  const phone = input.customerPhone.replace(/[^\d+]/g, "");
  const address = input.customerAddress.trim();
  const city = input.customerCity.trim();

  if (!name) return { success: false, error: "Le nom est requis." };
  if (!isValidTunisianPhone(phone)) {
    return { success: false, error: "Numéro de téléphone invalide." };
  }
  if (!address) return { success: false, error: "L'adresse est requise." };
  if (!city) return { success: false, error: "La ville est requise." };
  if (input.lines.length === 0) return { success: false, error: "Le panier est vide." };

  const subtotal = input.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const supabase = getSupabaseServiceClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      customer_city: city,
      notes: input.notes?.trim() || null,
      subtotal,
      shipping_fee: shippingFee,
      total,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[createOrder] failed to insert order", orderError);
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.lines.map((line) => ({
      order_id: order.id,
      product_id: line.productId,
      product_slug: line.slug,
      product_name: line.nameFr,
      category_slug: line.categorySlug,
      unit_price: line.price,
      quantity: line.quantity,
      line_total: line.price * line.quantity,
    }))
  );

  if (itemsError) {
    console.error("[createOrder] failed to insert order_items", itemsError);
    await supabase.from("orders").delete().eq("id", order.id);
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }

  const itemSummary = input.lines.map((l) => `${l.quantity}× ${l.nameFr}`).join(", ");
  await orderNotifier.sendOrderConfirmation({
    orderNumber: order.order_number,
    customerName: name,
    customerPhone: phone,
    total,
    itemSummary,
  });

  return { success: true, orderNumber: order.order_number };
}
