"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateOrderStatus } from "@/lib/orders/admin-actions";
import { useToast } from "@/components/admin/toast-provider";
import type { OrderStatus } from "@/lib/types";

const NEXT_ACTIONS: Record<OrderStatus, { label: string; status: OrderStatus }[]> = {
  pending: [
    { label: "Confirmer", status: "confirmed" },
    { label: "Annuler", status: "cancelled" },
  ],
  confirmed: [
    { label: "Marquer expédiée", status: "shipped" },
    { label: "Annuler", status: "cancelled" },
  ],
  shipped: [{ label: "Marquer livrée", status: "delivered" }],
  delivered: [],
  cancelled: [],
};

export function OrderActionButtons({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Admin.Toast");
  const { showToast } = useToast();
  const actions = NEXT_ACTIONS[status];

  if (actions.length === 0) return null;

  function handleClick(nextStatus: OrderStatus) {
    if (nextStatus === "cancelled" && !confirm("Annuler cette commande ?")) return;
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, nextStatus);
        showToast("success", t("orderStatusUpdated"));
      } catch {
        showToast("error", t("error"));
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.status}
          type="button"
          disabled={isPending}
          onClick={() => handleClick(action.status)}
          className={`border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
            action.status === "cancelled"
              ? "border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              : "border-nadya-black dark:border-nadya-cream text-nadya-black dark:text-nadya-cream hover:bg-nadya-black hover:text-nadya-cream dark:hover:bg-nadya-cream dark:bg-nadya-black dark:hover:text-nadya-black dark:text-nadya-cream"
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
