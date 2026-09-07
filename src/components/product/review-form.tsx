"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitReview } from "@/lib/reviews/actions";

export function ReviewForm({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const t = useTranslations("Reviews");
  const tErrors = useTranslations("Errors");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorCode(null);
    setSubmitting(true);

    const result = await submitReview({
      productId,
      productSlug,
      customerName: name,
      customerPhone: phone || undefined,
      rating,
      comment,
    });

    if (!result.success) {
      setErrorCode(result.errorCode ?? "generic");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="border border-nadya-line dark:border-nadya-gold/15 bg-nadya-pearl dark:bg-nadya-onyx p-5 text-sm text-nadya-black/80 dark:text-nadya-cream/80">
        {t("thankYou")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-nadya-line dark:border-nadya-gold/15 p-5">
      <h3 className="font-display text-base text-nadya-black dark:text-nadya-cream">{t("leaveReview")}</h3>

      <div>
        <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
          {t("yourRating")} *
        </label>
        <div className="flex gap-1 text-2xl text-nadya-gold">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={String(star)}
            >
              {star <= (hoverRating || rating) ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("yourName")} *
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("yourPhone")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
          {t("yourComment")} *
        </label>
        <textarea
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full resize-none border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
        />
      </div>

      {errorCode && <p className="text-sm text-red-700 dark:text-red-400">{tErrors(errorCode)}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-nadya-black px-6 py-2.5 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/40"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
