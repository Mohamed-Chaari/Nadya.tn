"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createCoupon } from "@/lib/coupons/admin-actions";
import { useToast } from "@/components/admin/toast-provider";

const fieldClass =
  "w-full border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase";

export function CouponForm() {
  const router = useRouter();
  const t = useTranslations("Admin.Toast");
  const { showToast } = useToast();
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderAmount: "",
    maxUses: "",
    expiresAt: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createCoupon({
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    });

    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      setSubmitting(false);
      return;
    }

    setForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxUses: "",
      expiresAt: "",
    });
    setSubmitting(false);
    showToast("success", t("couponCreated"));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-5 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Code *</label>
        <input
          required
          type="text"
          value={form.code}
          onChange={(e) => update("code", e.target.value.toUpperCase())}
          placeholder="BIENVENUE10"
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass}>Type *</label>
        <select
          value={form.discountType}
          onChange={(e) => update("discountType", e.target.value as "percentage" | "fixed")}
          className={fieldClass}
        >
          <option value="percentage">Pourcentage (%)</option>
          <option value="fixed">Montant fixe (DT)</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Valeur *</label>
        <input
          required
          type="number"
          min={0}
          step="0.001"
          value={form.discountValue}
          onChange={(e) => update("discountValue", e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass}>Commande min. (optionnel)</label>
        <input
          type="number"
          min={0}
          step="0.001"
          value={form.minOrderAmount}
          onChange={(e) => update("minOrderAmount", e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass}>Utilisations max. (optionnel)</label>
        <input
          type="number"
          min={1}
          value={form.maxUses}
          onChange={(e) => update("maxUses", e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass}>Expiration (optionnel)</label>
        <input
          type="date"
          value={form.expiresAt}
          onChange={(e) => update("expiresAt", e.target.value)}
          className={fieldClass}
        />
      </div>

      {error && <p className="text-sm text-red-700 dark:text-red-400 sm:col-span-3">{error}</p>}

      <div className="sm:col-span-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-nadya-black px-6 py-2.5 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/40"
        >
          {isSubmitting ? "Création..." : "Créer le coupon"}
        </button>
      </div>
    </form>
  );
}
