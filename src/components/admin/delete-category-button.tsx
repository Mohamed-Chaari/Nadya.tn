"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteCategory } from "@/lib/categories/admin-actions";
import { useToast } from "@/components/admin/toast-provider";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Admin.Toast");
  const { showToast } = useToast();

  function handleClick() {
    if (!confirm("Supprimer définitivement cette catégorie ?")) return;
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        showToast("success", t("categoryDeleted"));
      } else {
        showToast("error", result.error ?? t("error"));
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="text-xs text-red-700 dark:text-red-400 underline underline-offset-4 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
    >
      Supprimer
    </button>
  );
}
