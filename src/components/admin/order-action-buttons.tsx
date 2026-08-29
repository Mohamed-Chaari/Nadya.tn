"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/orders/admin-actions";
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
  const actions = NEXT_ACTIONS[status];

  if (actions.length === 0) return null;

  function handleClick(nextStatus: OrderStatus) {
    if (nextStatus === "cancelled" && !confirm("Annuler cette commande ?")) return;
    startTransition(async () => {
      await updateOrderStatus(orderId, nextStatus);
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
              ? "border-red-300 text-red-700 hover:bg-red-50"
              : "border-nadya-black text-nadya-black hover:bg-nadya-black hover:text-nadya-cream"
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
