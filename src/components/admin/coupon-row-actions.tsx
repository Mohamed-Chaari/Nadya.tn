"use client";

import { useTransition } from "react";
import { toggleCouponActive, deleteCoupon } from "@/lib/coupons/admin-actions";

export function CouponRowActions({
  couponId,
  isActive,
}: {
  couponId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCouponActive(couponId, !isActive);
    });
  }

  function handleDelete() {
    if (!confirm("Supprimer définitivement ce coupon ?")) return;
    startTransition(async () => {
      await deleteCoupon(couponId);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        className="text-xs text-nadya-gold-dark underline underline-offset-4 hover:text-nadya-gold disabled:opacity-50"
      >
        {isActive ? "Désactiver" : "Activer"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="text-xs text-red-700 underline underline-offset-4 hover:text-red-900 disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
