"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toggleCouponActive, deleteCoupon } from "@/lib/coupons/admin-actions";
import { useToast } from "@/components/admin/toast-provider";

export function CouponRowActions({
  couponId,
  isActive,
}: {
  couponId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Admin.Toast");
  const { showToast } = useToast();

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleCouponActive(couponId, !isActive);
        showToast("success", isActive ? t("couponDeactivated") : t("couponActivated"));
      } catch {
        showToast("error", t("error"));
      }
    });
  }

  function handleDelete() {
    if (!confirm("Supprimer définitivement ce coupon ?")) return;
    startTransition(async () => {
      try {
        await deleteCoupon(couponId);
        showToast("success", t("couponDeleted"));
      } catch {
        showToast("error", t("error"));
      }
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
        className="text-xs text-red-700 dark:text-red-400 underline underline-offset-4 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
