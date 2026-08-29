import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-2xl tracking-[0.08em] text-gradient-gold">
        NADYA
      </span>
      <span className="mt-1 text-[0.6rem] tracking-[0.3em] text-nadya-ink/70 uppercase">
        Art &amp; Handcraft
        <span className="mx-1 text-nadya-gold">·</span>
        since 2023
      </span>
    </Link>
  );
}
