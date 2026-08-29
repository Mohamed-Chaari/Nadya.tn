import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export type CouponErrorCode = "notFound" | "expired" | "usedUp" | "minOrder";

export interface CouponValidationResult {
  valid: boolean;
  errorCode?: CouponErrorCode;
  couponId?: string;
  code?: string;
  discountAmount?: number;
}

export async function validateCoupon(
  rawCode: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, errorCode: "notFound" };

  const supabase = getSupabaseServiceClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !coupon) return { valid: false, errorCode: "notFound" };

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, errorCode: "expired" };
  }

  if (coupon.max_uses != null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, errorCode: "usedUp" };
  }

  if (coupon.min_order_amount != null && subtotal < Number(coupon.min_order_amount)) {
    return { valid: false, errorCode: "minOrder" };
  }

  const discountAmount =
    coupon.discount_type === "percentage"
      ? Math.round(((subtotal * Number(coupon.discount_value)) / 100) * 1000) / 1000
      : Math.min(Number(coupon.discount_value), subtotal);

  return { valid: true, couponId: coupon.id, code: coupon.code, discountAmount };
}
