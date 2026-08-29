import type { Metadata } from "next";
import { getAnalytics } from "@/lib/analytics/get-analytics";
import { formatPrice } from "@/lib/format";
import { SalesBarChart } from "@/components/admin/sales-bar-chart";

export const metadata: Metadata = {
  title: "Analytics — Admin NADYA",
};

export default async function AdminAnalyticsPage() {
  const { totalRevenue, totalOrders, averageOrderValue, salesByDay, bestSellers } =
    await getAnalytics();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-nadya-black dark:text-nadya-cream">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-5">
          <p className="text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            Chiffre d&apos;affaires
          </p>
          <p className="mt-2 font-display text-2xl text-nadya-black dark:text-nadya-cream">
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-5">
          <p className="text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            Commandes (hors annulées)
          </p>
          <p className="mt-2 font-display text-2xl text-nadya-black dark:text-nadya-cream">{totalOrders}</p>
        </div>
        <div className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-5">
          <p className="text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            Panier moyen
          </p>
          <p className="mt-2 font-display text-2xl text-nadya-black dark:text-nadya-cream">
            {formatPrice(averageOrderValue)}
          </p>
        </div>
      </div>

      <div className="mt-6 border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-5">
        <h2 className="mb-4 font-display text-lg text-nadya-black dark:text-nadya-cream">
          Ventes des 14 derniers jours
        </h2>
        <SalesBarChart data={salesByDay} />
      </div>

      <div className="mt-6 border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-5">
        <h2 className="mb-4 font-display text-lg text-nadya-black dark:text-nadya-cream">Meilleures ventes</h2>
        {bestSellers.length === 0 ? (
          <p className="text-sm text-nadya-black/50 dark:text-nadya-cream/50">Pas encore de ventes.</p>
        ) : (
          <ul className="divide-y divide-nadya-line">
            {bestSellers.map((item, i) => (
              <li key={item.productName} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm text-nadya-black/40 dark:text-nadya-cream/40">{i + 1}</span>
                  <span className="text-sm text-nadya-black dark:text-nadya-cream">{item.productName}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-nadya-black/60 dark:text-nadya-cream/60">{item.quantity} vendus</span>
                  <span className="font-medium text-nadya-black dark:text-nadya-cream">
                    {formatPrice(item.revenue)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
