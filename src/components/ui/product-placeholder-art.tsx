import type { CategorySlug } from "@/lib/types";

const MOTIFS: Record<CategorySlug, string> = {
  "couronnes-tiares": "M50 78 L38 40 L50 52 L58 30 L68 52 L78 34 L72 78 Z",
  colliers: "M28 34 Q50 68 72 34 M50 60 L50 78 M44 72 L56 72",
  peignes: "M30 30 H70 V40 H30 Z M34 40 V78 M42 40 V78 M50 40 V78 M58 40 V78 M66 40 V78",
  "hair-vines": "M26 30 Q50 30 40 50 Q30 70 50 70 Q70 70 60 50 Q50 30 74 30",
};

export function ProductPlaceholderArt({
  categorySlug,
  className = "",
}: {
  categorySlug: CategorySlug;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-nadya-pearl bg-noise-texture ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-2/5 w-2/5 text-nadya-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={MOTIFS[categorySlug]} />
      </svg>
      <div className="pointer-events-none absolute inset-0 border border-nadya-line/60" />
    </div>
  );
}
