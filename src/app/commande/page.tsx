import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commande — NADYA Art & Handcraft",
};

export default function CheckoutPlaceholderPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-2xl text-nadya-black">
        Le paiement à la livraison arrive bientôt
      </h1>
      <p className="text-nadya-black/60">
        Le tunnel de commande (coordonnées, téléphone, confirmation par WhatsApp) est en
        cours de construction. Votre panier reste sauvegardé.
      </p>
      <Link
        href="/panier"
        className="mt-2 border border-nadya-black px-5 py-2.5 text-sm text-nadya-black hover:bg-nadya-black hover:text-nadya-cream"
      >
        Retour au panier
      </Link>
    </div>
  );
}
