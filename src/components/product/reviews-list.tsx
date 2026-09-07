import { getTranslations, getLocale } from "next-intl/server";
import type { Review } from "@/lib/reviews/get-reviews";

const DATE_LOCALES: Record<string, string> = { fr: "fr-FR", ar: "ar-TN", en: "en-US" };

export async function ReviewsList({ reviews }: { reviews: Review[] }) {
  const t = await getTranslations("Reviews");
  const locale = await getLocale();

  if (reviews.length === 0) {
    return <p className="text-sm text-nadya-black/50 dark:text-nadya-cream/50">{t("noReviews")}</p>;
  }

  return (
    <ul className="space-y-5">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-nadya-line dark:border-nadya-gold/15 pb-5 last:border-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-nadya-black dark:text-nadya-cream">{review.customerName}</p>
            <p className="text-xs text-nadya-black/40 dark:text-nadya-cream/40">
              {new Date(review.createdAt).toLocaleDateString(DATE_LOCALES[locale] ?? "fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="mt-1 text-nadya-gold" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < review.rating ? "★" : "☆"}</span>
            ))}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-nadya-black/75 dark:text-nadya-cream/75">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
