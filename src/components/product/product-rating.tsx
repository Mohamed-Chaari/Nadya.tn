export function ProductRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-nadya-gold" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
        ))}
      </div>
      <span className="text-sm text-nadya-black/60">
        {rating.toFixed(1)} ({reviewCount} avis)
      </span>
    </div>
  );
}
