"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";

export interface CreateCouponInput {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  expiresAt: string | null;
}

export interface CouponActionResult {
  success: boolean;
  error?: string;
}

export async function createCoupon(input: CreateCouponInput): Promise<CouponActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Non autorisé." };

  const code = input.code.trim().toUpperCase();
  if (!code) return { success: false, error: "Le code est requis." };
  if (input.discountValue <= 0) return { success: false, error: "La valeur doit être positive." };

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("coupons").insert({
    code,
    discount_type: input.discountType,
    discount_value: input.discountValue,
    min_order_amount: input.minOrderAmount,
    max_uses: input.maxUses,
    expires_at: input.expiresAt,
  });

  if (error) {
    console.error("[createCoupon]", error);
    if (error.code === "23505") return { success: false, error: "Ce code existe déjà." };
    return { success: false, error: "Une erreur est survenue." };
  }

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponActive(couponId: string, isActive: boolean): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("coupons")
    .update({ is_active: isActive })
    .eq("id", couponId);

  if (error) {
    console.error("[toggleCouponActive]", error);
    throw new Error("Impossible de mettre à jour le coupon.");
  }

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(couponId: string): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("coupons").delete().eq("id", couponId);

  if (error) {
    console.error("[deleteCoupon]", error);
    throw new Error("Impossible de supprimer le coupon.");
  }

  revalidatePath("/admin/coupons");
}
