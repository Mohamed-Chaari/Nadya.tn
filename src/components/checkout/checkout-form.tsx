"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { createOrder } from "@/lib/orders/actions";
import { checkCoupon } from "@/lib/coupons/actions";
import { formatPrice } from "@/lib/format";
import { LocationSelector, type LocationValue } from "@/components/checkout/location-selector";
import { SHIPPING_FEE } from "@/lib/config/shipping";

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const COUPON_ERROR_KEYS: Record<string, string> = {
  notFound: "couponNotFound",
  expired: "couponExpired",
  usedUp: "couponUsedUp",
  minOrder: "couponMinOrder",
};

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();
  const [isSubmitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    desiredDeliveryDate: "",
    notes: "",
  });
  const [location, setLocation] = useState<LocationValue>({
    gouvernorat: "",
    delegation: "",
    localite: "",
  });
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(
    null
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckingCoupon, setCheckingCoupon] = useState(false);

  const t = useTranslations("Checkout");
  const tCart = useTranslations("Cart");
  const tErrors = useTranslations("Errors");

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponError(null);
    setCheckingCoupon(true);

    const result = await checkCoupon(couponInput, subtotal);

    if (!result.valid || !result.code) {
      setCouponError(COUPON_ERROR_KEYS[result.errorCode ?? "notFound"] ?? "couponNotFound");
      setCheckingCoupon(false);
      return;
    }

    setAppliedCoupon({ code: result.code, discount: result.discountAmount ?? 0 });
    setCheckingCoupon(false);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  const total = Math.max(0, subtotal + SHIPPING_FEE - (appliedCoupon?.discount ?? 0));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorCode(null);
    setSubmitting(true);

    const result = await createOrder({
      ...form,
      shippingGouvernorat: location.gouvernorat,
      shippingDelegation: location.delegation,
      shippingLocalite: location.localite,
      couponCode: appliedCoupon?.code,
      lines,
    });

    if (!result.success || !result.orderNumber) {
      setErrorCode(result.errorCode ?? "generic");
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/commande/confirmation/${result.orderNumber}`);
  }

  if (lines.length === 0) {
    return <p className="text-center text-nadya-black/60">{t("emptyCart")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            {t("fullName")} *
          </label>
          <input
            required
            type="text"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            className="w-full border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            {t("phone")} *
          </label>
          <input
            required
            type="tel"
            inputMode="tel"
            placeholder="+216 XX XXX XXX"
            value={form.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
            className="w-full border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
          <p className="mt-1 text-xs text-nadya-black/50">{t("phoneHelp")}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            {t("address")} *
          </label>
          <input
            required
            type="text"
            value={form.customerAddress}
            onChange={(e) => updateField("customerAddress", e.target.value)}
            className="w-full border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
        </div>

        <LocationSelector value={location} onChange={setLocation} />

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            {t("deliveryDate")}
          </label>
          <input
            type="date"
            min={tomorrow}
            value={form.desiredDeliveryDate}
            onChange={(e) => updateField("desiredDeliveryDate", e.target.value)}
            className="w-full border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
          <p className="mt-1 text-xs text-nadya-black/50">{t("deliveryDateHelp")}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            {t("notes")}
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="w-full resize-none border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
        </div>

        {errorCode && <p className="text-sm text-red-700">{tErrors(errorCode)}</p>}
      </div>

      <div className="h-fit border border-nadya-line p-6">
        <h2 className="font-display text-lg text-nadya-black">{t("orderSummary")}</h2>
        <ul className="mt-4 space-y-2 border-b border-nadya-line pb-4 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3">
              <span className="text-nadya-black/70">
                {line.quantity}× {line.nameFr}
              </span>
              <span className="text-nadya-black">{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          {appliedCoupon ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-nadya-black/70">
                {t("couponApplied", { code: appliedCoupon.code })}
              </span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs text-nadya-black/50 underline underline-offset-4 hover:text-nadya-black"
              >
                {t("removeCoupon")}
              </button>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
                {t("couponCode")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t("couponPlaceholder")}
                  className="w-full border border-nadya-line bg-nadya-cream px-3 py-2 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isCheckingCoupon}
                  className="shrink-0 border border-nadya-black px-3 py-2 text-sm text-nadya-black hover:bg-nadya-black hover:text-nadya-cream disabled:opacity-50"
                >
                  {isCheckingCoupon ? t("applying") : t("apply")}
                </button>
              </div>
              {couponError && <p className="mt-1.5 text-xs text-red-700">{tErrors(couponError)}</p>}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-nadya-black/70">{tCart("subtotal")}</span>
            <span className="text-nadya-black">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-nadya-black/70">{tCart("shipping")}</span>
            <span className="text-nadya-black">{formatPrice(SHIPPING_FEE)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex items-center justify-between text-nadya-gold-dark">
              <span>{t("discount")}</span>
              <span>-{formatPrice(appliedCoupon.discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-nadya-line pt-1.5 text-base font-medium text-nadya-black">
            <span>{tCart("total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-nadya-black py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/40"
        >
          {isSubmitting ? t("submitting") : t("confirmOrder")}
        </button>
        <p className="mt-3 text-center text-xs text-nadya-black/50">{t("cod")}</p>
      </div>
    </form>
  );
}
