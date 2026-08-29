"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { createOrder } from "@/lib/orders/actions";
import { formatPrice } from "@/lib/format";

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    notes: "",
  });

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createOrder({ ...form, lines });

    if (!result.success || !result.orderNumber) {
      setError(result.error ?? "Une erreur est survenue. Merci de réessayer.");
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/commande/confirmation/${result.orderNumber}`);
  }

  if (lines.length === 0) {
    return (
      <p className="text-center text-nadya-black/60">
        Votre panier est vide — ajoutez des articles avant de commander.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            Nom complet *
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
            Téléphone *
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
          <p className="mt-1 text-xs text-nadya-black/50">
            Utilisé pour confirmer votre commande par téléphone/WhatsApp.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            Adresse *
          </label>
          <input
            required
            type="text"
            value={form.customerAddress}
            onChange={(e) => updateField("customerAddress", e.target.value)}
            className="w-full border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            Ville *
          </label>
          <input
            required
            type="text"
            value={form.customerCity}
            onChange={(e) => updateField("customerCity", e.target.value)}
            className="w-full border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
            Notes (optionnel)
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="w-full resize-none border border-nadya-line bg-nadya-cream px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>

      <div className="h-fit border border-nadya-line p-6">
        <h2 className="font-display text-lg text-nadya-black">Résumé de la commande</h2>
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
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-nadya-black/70">Sous-total</span>
          <span className="font-medium text-nadya-black">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-nadya-black/50">
          Frais de livraison confirmés par téléphone
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-nadya-black py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/40"
        >
          {isSubmitting ? "Envoi en cours..." : "Confirmer la commande"}
        </button>
        <p className="mt-3 text-center text-xs text-nadya-black/50">
          Paiement à la livraison (COD)
        </p>
      </div>
    </form>
  );
}
