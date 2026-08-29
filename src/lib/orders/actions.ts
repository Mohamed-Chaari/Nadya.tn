"use server";

import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { orderNotifier } from "@/lib/notifications/notify-order";
import type { CartLine } from "@/lib/cart/cart-context";
import { tunisiaGovernorates } from "@/lib/data/tunisia-locations";
import { SHIPPING_FEE } from "@/lib/config/shipping";
import { validateCoupon } from "@/lib/coupons/validate";

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  shippingGouvernorat: string;
  shippingDelegation: string;
  shippingLocalite: string;
  desiredDeliveryDate?: string;
  notes?: string;
  couponCode?: string;
  lines: CartLine[];
}

export type CheckoutErrorCode =
  | "nameRequired"
  | "invalidPhone"
  | "addressRequired"
  | "invalidLocation"
  | "emptyCart"
  | "generic";

export interface CheckoutResult {
  success: boolean;
  orderNumber?: number;
  errorCode?: CheckoutErrorCode;
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

  if (!name) return { success: false, errorCode: "nameRequired" };
  if (!isValidTunisianPhone(phone)) return { success: false, errorCode: "invalidPhone" };
  if (!address) return { success: false, errorCode: "addressRequired" };
  if (!isValidGouvernoratDelegation(gouvernorat, delegation)) {
    return { success: false, errorCode: "invalidLocation" };
  }
  if (input.lines.length === 0) return { success: false, errorCode: "emptyCart" };

  const subtotal = input.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shippingFee = SHIPPING_FEE;

  // Re-validate the coupon server-side — never trust a client-computed
  // discount. Silently ignores an invalid/expired code rather than failing
  // the whole order, since the client already surfaced errors before submit.
  let couponCode: string | null = null;
  let discountAmount = 0;
  if (input.couponCode?.trim()) {
    const couponResult = await validateCoupon(input.couponCode, subtotal);
    if (couponResult.valid) {
      couponCode = couponResult.code ?? null;
      discountAmount = couponResult.discountAmount ?? 0;
    }
  }

  const total = subtotal + shippingFee - discountAmount;

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
      coupon_code: couponCode,
      discount_amount: discountAmount,
      total,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[createOrder] failed to insert order", orderError);
    return { success: false, errorCode: "generic" };
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
    return { success: false, errorCode: "generic" };
  }

  if (couponCode) {
    const { error: rpcError } = await supabase.rpc("increment_coupon_used_count", {
      coupon_code: couponCode,
    });
    if (rpcError) console.error("[createOrder] failed to increment coupon usage", rpcError);
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
