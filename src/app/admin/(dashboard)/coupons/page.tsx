import type { Metadata } from "next";
import { getAllCoupons } from "@/lib/coupons/get-coupons";
import { CouponForm } from "@/components/admin/coupon-form";
import { CouponRowActions } from "@/components/admin/coupon-row-actions";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Coupons — Admin NADYA",
};

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-nadya-black dark:text-nadya-cream">Coupons</h1>

      <div className="mb-8">
        <CouponForm />
      </div>

      {coupons.length === 0 ? (
        <p className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-8 text-center text-sm text-nadya-black/50 dark:text-nadya-cream/50">
          Aucun coupon pour le moment.
        </p>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-nadya-black dark:text-nadya-cream">{coupon.code}</p>
                    <p className="mt-0.5 text-sm text-nadya-black/70 dark:text-nadya-cream/70">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : formatPrice(coupon.discountValue)}
                    </p>
                    {coupon.minOrderAmount != null && (
                      <p className="text-xs text-nadya-black/40 dark:text-nadya-cream/40">
                        min. {formatPrice(coupon.minOrderAmount)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      coupon.isActive
                        ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300"
                        : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60"
                    }`}
                  >
                    {coupon.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-nadya-black/50 dark:text-nadya-cream/50">
                  <span>
                    {coupon.usedCount}
                    {coupon.maxUses != null ? ` / ${coupon.maxUses}` : ""} utilisation
                    {coupon.usedCount > 1 ? "s" : ""}
                  </span>
                  <span>
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString("fr-FR")
                      : "Sans expiration"}
                  </span>
                </div>
                <div className="mt-3 border-t border-nadya-line dark:border-nadya-gold/15 pt-3">
                  <CouponRowActions couponId={coupon.id} isActive={coupon.isActive} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nadya-line dark:border-nadya-gold/15 text-left text-xs tracking-[0.1em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Réduction</th>
                  <th className="px-4 py-3">Utilisations</th>
                  <th className="px-4 py-3">Expiration</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-nadya-line dark:border-nadya-gold/15 last:border-0">
                    <td className="px-4 py-3 font-medium text-nadya-black dark:text-nadya-cream">{coupon.code}</td>
                    <td className="px-4 py-3 text-nadya-black/70 dark:text-nadya-cream/70">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : formatPrice(coupon.discountValue)}
                      {coupon.minOrderAmount != null && (
                        <span className="block text-xs text-nadya-black/40 dark:text-nadya-cream/40">
                          min. {formatPrice(coupon.minOrderAmount)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-nadya-black/70 dark:text-nadya-cream/70">
                      {coupon.usedCount}
                      {coupon.maxUses != null ? ` / ${coupon.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-nadya-black/70 dark:text-nadya-cream/70">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          coupon.isActive
                            ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300"
                            : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60"
                        }`}
                      >
                        {coupon.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <CouponRowActions couponId={coupon.id} isActive={coupon.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
