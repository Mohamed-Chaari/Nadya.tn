"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateReviewStatus } from "@/lib/reviews/admin-actions";
import { useToast } from "@/components/admin/toast-provider";

export function ReviewActionButtons({
  reviewId,
  status,
}: {
  reviewId: string;
  status: "pending" | "approved" | "rejected";
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Admin.Toast");
  const { showToast } = useToast();

  if (status !== "pending") return null;

  function handleClick(next: "approved" | "rejected") {
    startTransition(async () => {
      try {
        await updateReviewStatus(reviewId, next);
        showToast("success", next === "approved" ? t("reviewApproved") : t("reviewRejected"));
      } catch {
        showToast("error", t("error"));
      }
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleClick("approved")}
        className="border border-nadya-black dark:border-nadya-cream px-3 py-1.5 text-xs font-medium text-nadya-black dark:text-nadya-cream transition hover:bg-nadya-black hover:text-nadya-cream dark:hover:bg-nadya-cream dark:bg-nadya-black dark:hover:text-nadya-black dark:text-nadya-cream disabled:opacity-50"
      >
        Approuver
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleClick("rejected")}
        className="border border-red-300 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
      >
        Rejeter
      </button>
    </div>
  );
}
