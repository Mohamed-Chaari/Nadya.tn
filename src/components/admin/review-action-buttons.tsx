"use client";

import { useTransition } from "react";
import { updateReviewStatus } from "@/lib/reviews/admin-actions";

export function ReviewActionButtons({
  reviewId,
  status,
}: {
  reviewId: string;
  status: "pending" | "approved" | "rejected";
}) {
  const [isPending, startTransition] = useTransition();

  if (status !== "pending") return null;

  function handleClick(next: "approved" | "rejected") {
    startTransition(async () => {
      await updateReviewStatus(reviewId, next);
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleClick("approved")}
        className="border border-nadya-black px-3 py-1.5 text-xs font-medium text-nadya-black transition hover:bg-nadya-black hover:text-nadya-cream disabled:opacity-50"
      >
        Approuver
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleClick("rejected")}
        className="border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
      >
        Rejeter
      </button>
    </div>
  );
}
