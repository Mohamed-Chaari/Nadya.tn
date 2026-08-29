"use server";

import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { orderNotifier } from "@/lib/notifications/notify-order";
import type { CartLine } from "@/lib/cart/cart-context";
import { tunisiaGovernorates } from "@/lib/data/tunisia-locations";

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  shippingGouvernorat: string;
  shippingDelegation: string;
  shippingLocalite: string;
  desiredDeliveryDate?: string;
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

function isValidGouvernoratDelegation(gouvernorat: string, delegation: string): boolean {
  const gov = tunisiaGovernorates.find((g) => g.name === gouvernorat);
  return Boolean(gov && gov.delegations.includes(delegation));
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const name = input.customerName.trim();
  const phone = input.customerPhone.replace(/[^\d+]/g, "");
  const address = input.customerAddress.trim();
  const gouvernorat = input.shippingGouvernorat.trim();
  const delegation = input.shippingDelegation.trim();
  const localite = input.shippingLocalite.trim();

  if (!name) return { success: false, error: "Le nom est requis." };
  if (!isValidTunisianPhone(phone)) {
    return { success: false, error: "Numéro de téléphone invalide." };
  }
  if (!address) return { success: false, error: "L'adresse est requise." };
  if (!isValidGouvernoratDelegation(gouvernorat, delegation)) {
    return { success: false, error: "Merci de sélectionner un gouvernorat et une délégation valides." };
  }
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
      shipping_gouvernorat: gouvernorat,
      shipping_delegation: delegation,
      shipping_localite: localite || null,
      desired_delivery_date: input.desiredDeliveryDate || null,
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
