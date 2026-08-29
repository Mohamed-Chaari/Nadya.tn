import { useTranslations } from "next-intl";

export function ProductRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const t = useTranslations("ProductDetail");

  return (
    <div className="flex items-center gap-2">
      <div className="flex text-nadya-gold" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
        ))}
      </div>
      <span className="text-sm text-nadya-black/60 dark:text-nadya-cream/60">
        {rating.toFixed(1)} ({t("reviews", { count: reviewCount })})
      </span>
    </div>
  );
}
