import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders/get-order";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";

export const metadata: Metadata = {
  title: "Commande confirmée — NADYA Art & Handcraft",
};

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderNumber: orderNumberParam } = await params;
  const orderNumber = Number(orderNumberParam);
  if (!Number.isInteger(orderNumber)) notFound();

  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="text-xs tracking-[0.3em] text-nadya-gold-dark uppercase">
          Merci {order.customerName.split(" ")[0]} !
        </span>
        <h1 className="mt-2 font-display text-3xl text-nadya-black">
          Commande #{order.orderNumber} confirmée
        </h1>
        <p className="mt-3 text-nadya-black/70">
          Nous vous contacterons au <strong>{order.customerPhone}</strong> pour confirmer les
          détails de livraison. Paiement à la livraison.
        </p>
      </div>

      <div className="mt-10 border border-nadya-line">
        <div className="border-b border-nadya-line px-6 py-4">
          <h2 className="font-display text-lg text-nadya-black">Articles</h2>
        </div>
        <ul className="divide-y divide-nadya-line">
          {order.items.map((item) => (
            <li key={item.productSlug} className="flex items-center gap-4 px-6 py-4">
              <ProductPlaceholderArt
                categorySlug={item.categorySlug}
                className="h-16 w-16 shrink-0"
              />
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-nadya-black">{item.productName}</p>
                  <p className="text-xs text-nadya-black/50">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-medium text-nadya-black">
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-1.5 border-t border-nadya-line px-6 py-4 text-sm">
          <div className="flex justify-between text-nadya-black/70">
            <span>Sous-total</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-nadya-black/70">
            <span>Livraison</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between pt-1.5 text-base font-medium text-nadya-black">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 border border-nadya-line p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.15em] text-nadya-black/50 uppercase">Livraison</p>
          <p className="mt-1 text-sm text-nadya-black">
            {order.customerAddress}
            {order.shippingLocalite ? `, ${order.shippingLocalite}` : ""}
            {", "}
            {order.shippingDelegation}, {order.shippingGouvernorat}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.15em] text-nadya-black/50 uppercase">Contact</p>
          <p className="mt-1 text-sm text-nadya-black">{order.customerPhone}</p>
        </div>
        {order.desiredDeliveryDate && (
          <div>
            <p className="text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
              Date souhaitée
            </p>
            <p className="mt-1 text-sm text-nadya-black">
              {new Date(order.desiredDeliveryDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
        {order.notes && (
          <div className="sm:col-span-2">
            <p className="text-xs tracking-[0.15em] text-nadya-black/50 uppercase">Notes</p>
            <p className="mt-1 text-sm text-nadya-black">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/produits"
          className="border border-nadya-black px-6 py-3 text-sm text-nadya-black hover:bg-nadya-black hover:text-nadya-cream"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
