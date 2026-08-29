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
      <h1 className="mb-6 font-display text-2xl text-nadya-black">Coupons</h1>

      <div className="mb-8">
        <CouponForm />
      </div>

      {coupons.length === 0 ? (
        <p className="border border-nadya-line bg-white p-8 text-center text-sm text-nadya-black/50">
          Aucun coupon pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto border border-nadya-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nadya-line text-left text-xs tracking-[0.1em] text-nadya-black/50 uppercase">
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
                <tr key={coupon.id} className="border-b border-nadya-line last:border-0">
                  <td className="px-4 py-3 font-medium text-nadya-black">{coupon.code}</td>
                  <td className="px-4 py-3 text-nadya-black/70">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : formatPrice(coupon.discountValue)}
                    {coupon.minOrderAmount != null && (
                      <span className="block text-xs text-nadya-black/40">
                        min. {formatPrice(coupon.minOrderAmount)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-nadya-black/70">
                    {coupon.usedCount}
                    {coupon.maxUses != null ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-nadya-black/70">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
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
      )}
    </div>
  );
}
