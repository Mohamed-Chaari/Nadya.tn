"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/lib/products/admin-actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    startTransition(async () => {
      await deleteProduct(productId);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="text-xs text-red-700 underline underline-offset-4 hover:text-red-900 disabled:opacity-50"
    >
      Supprimer
    </button>
  );
}
