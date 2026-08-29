"use server";

import { validateCoupon, type CouponErrorCode } from "@/lib/coupons/validate";

export interface CheckCouponResult {
  valid: boolean;
  errorCode?: CouponErrorCode;
  code?: string;
  discountAmount?: number;
}

export async function checkCoupon(rawCode: string, subtotal: number): Promise<CheckCouponResult> {
  const result = await validateCoupon(rawCode, subtotal);
  return {
    valid: result.valid,
    errorCode: result.errorCode,
    code: result.code,
    discountAmount: result.discountAmount,
  };
}
