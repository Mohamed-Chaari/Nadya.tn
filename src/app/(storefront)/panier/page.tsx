import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Votre panier — NADYA Art & Handcraft",
};

export default function CartPage() {
  return <CartPageContent />;
}
