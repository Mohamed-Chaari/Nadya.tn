import type { DailySales } from "@/lib/analytics/get-analytics";
import { formatPrice } from "@/lib/format";

export function SalesBarChart({ data }: { data: DailySales[] }) {
  const max = Math.max(1, ...data.map((d) => d.revenue));

  return (
    <div className="flex h-48 items-end gap-1.5">
      {data.map((day) => {
        const heightPct = Math.max(2, (day.revenue / max) * 100);
        return (
          <div key={day.date} className="group relative flex flex-1 flex-col items-center">
            <div className="pointer-events-none absolute -top-8 hidden whitespace-nowrap rounded bg-nadya-black px-2 py-1 text-[0.65rem] text-nadya-cream group-hover:block">
              {formatPrice(day.revenue)}
            </div>
            <div
              className="w-full bg-nadya-gold transition-colors group-hover:bg-nadya-gold-dark"
              style={{ height: `${heightPct}%` }}
            />
            <span className="mt-1.5 text-[0.6rem] text-nadya-black/40">
              {new Date(day.date).toLocaleDateString("fr-FR", { day: "numeric", month: "numeric" })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
