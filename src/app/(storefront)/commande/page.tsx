import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Commande — NADYA Art & Handcraft",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl text-nadya-black">Finaliser la commande</h1>
      <CheckoutForm />
    </div>
  );
}
