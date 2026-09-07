"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { createOrder, lookupReturningCustomer } from "@/lib/orders/actions";
import { checkCoupon } from "@/lib/coupons/actions";
import { formatPrice } from "@/lib/format";
import { LocationSelector, type LocationValue } from "@/components/checkout/location-selector";
import { SHIPPING_FEE } from "@/lib/config/shipping";
import { LOYALTY_DISCOUNT_RATE } from "@/lib/config/loyalty";

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
  const [isReturningCustomer, setReturningCustomer] = useState(false);
  const [checkedPhone, setCheckedPhone] = useState("");

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

  async function handlePhoneBlur() {
    const phone = form.customerPhone.trim();
    if (!phone || phone.replace(/\D/g, "").length < 8 || phone === checkedPhone) return;
    setCheckedPhone(phone);

    const previous = await lookupReturningCustomer(phone);
    if (!previous) {
      setReturningCustomer(false);
      return;
    }

    setReturningCustomer(true);
    if (!form.customerName.trim()) updateField("customerName", previous.name);
    if (!form.customerAddress.trim()) updateField("customerAddress", previous.address);
    if (!location.gouvernorat) {
      setLocation({
        gouvernorat: previous.gouvernorat,
        delegation: previous.delegation,
        localite: previous.localite ?? "",
      });
    }
  }

  const loyaltyDiscount =
    !appliedCoupon && isReturningCustomer ? Math.round(subtotal * LOYALTY_DISCOUNT_RATE * 1000) / 1000 : 0;
  const discount = appliedCoupon?.discount ?? loyaltyDiscount;
  const total = Math.max(0, subtotal + SHIPPING_FEE - discount);

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
    return <p className="text-center text-nadya-black/60 dark:text-nadya-cream/60">{t("emptyCart")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("fullName")} *
          </label>
          <input
            required
            type="text"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("phone")} *
          </label>
          <input
            required
            type="tel"
            inputMode="tel"
            placeholder="+216 XX XXX XXX"
            value={form.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
            onBlur={handlePhoneBlur}
            className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
          />
          <p className="mt-1 text-xs text-nadya-black/50 dark:text-nadya-cream/50">{t("phoneHelp")}</p>
          {isReturningCustomer && (
            <p className="mt-1.5 text-xs text-nadya-gold-dark">
              Bienvenue à nouveau ! Vos informations ont été pré-remplies et vous bénéficiez de{" "}
              {Math.round(LOYALTY_DISCOUNT_RATE * 100)}% de réduction fidélité 💛
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("address")} *
          </label>
          <input
            required
            type="text"
            value={form.customerAddress}
            onChange={(e) => updateField("customerAddress", e.target.value)}
            className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
          />
        </div>

        <LocationSelector value={location} onChange={setLocation} />

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("deliveryDate")}
          </label>
          <input
            type="date"
            min={tomorrow}
            value={form.desiredDeliveryDate}
            onChange={(e) => updateField("desiredDeliveryDate", e.target.value)}
            className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
          />
          <p className="mt-1 text-xs text-nadya-black/50 dark:text-nadya-cream/50">{t("deliveryDateHelp")}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("notes")}
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="w-full resize-none border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
          />
        </div>

        {errorCode && <p className="text-sm text-red-700 dark:text-red-400">{tErrors(errorCode)}</p>}
      </div>

      <div className="h-fit border border-nadya-line dark:border-nadya-gold/15 p-6">
        <h2 className="font-display text-lg text-nadya-black dark:text-nadya-cream">{t("orderSummary")}</h2>
        <ul className="mt-4 space-y-2 border-b border-nadya-line dark:border-nadya-gold/15 pb-4 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3">
              <span className="text-nadya-black/70 dark:text-nadya-cream/70">
                {line.quantity}× {line.nameFr}
              </span>
              <span className="text-nadya-black dark:text-nadya-cream">{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          {appliedCoupon ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-nadya-black/70 dark:text-nadya-cream/70">
                {t("couponApplied", { code: appliedCoupon.code })}
              </span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs text-nadya-black/50 dark:text-nadya-cream/50 underline underline-offset-4 hover:text-nadya-black dark:text-nadya-cream"
              >
                {t("removeCoupon")}
              </button>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
                {t("couponCode")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t("couponPlaceholder")}
                  className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isCheckingCoupon}
                  className="shrink-0 border border-nadya-black dark:border-nadya-cream px-3 py-2 text-sm text-nadya-black dark:text-nadya-cream hover:bg-nadya-black hover:text-nadya-cream dark:hover:bg-nadya-cream dark:bg-nadya-black dark:hover:text-nadya-black dark:text-nadya-cream disabled:opacity-50"
                >
                  {isCheckingCoupon ? t("applying") : t("apply")}
                </button>
              </div>
              {couponError && <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">{tErrors(couponError)}</p>}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-nadya-black/70 dark:text-nadya-cream/70">{tCart("subtotal")}</span>
            <span className="text-nadya-black dark:text-nadya-cream">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-nadya-black/70 dark:text-nadya-cream/70">{tCart("shipping")}</span>
            <span className="text-nadya-black dark:text-nadya-cream">{formatPrice(SHIPPING_FEE)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-nadya-gold-dark">
              <span>{appliedCoupon ? t("discount") : "Réduction fidélité"}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-nadya-line dark:border-nadya-gold/15 pt-1.5 text-base font-medium text-nadya-black dark:text-nadya-cream">
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
        <p className="mt-3 text-center text-xs text-nadya-black/50 dark:text-nadya-cream/50">{t("cod")}</p>
      </div>
    </form>
  );
}
