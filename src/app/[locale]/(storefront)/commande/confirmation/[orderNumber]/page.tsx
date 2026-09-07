import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOrderByNumber } from "@/lib/orders/get-order";
import { formatPrice } from "@/lib/format";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";

interface PageProps {
  params: Promise<{ locale: string; orderNumber: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OrderConfirmation" });
  return { title: `${t("metaTitle")} — NADYA Art & Handcraft` };
}

const DATE_LOCALES: Record<string, string> = { fr: "fr-FR", ar: "ar-TN", en: "en-US" };

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { locale, orderNumber: orderNumberParam } = await params;
  setRequestLocale(locale);

  const orderNumber = Number(orderNumberParam);
  if (!Number.isInteger(orderNumber)) notFound();

  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const t = await getTranslations("OrderConfirmation");
  const tCheckout = await getTranslations("Checkout");

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="text-xs tracking-[0.3em] text-nadya-gold-dark uppercase">
          {t("thankYou", { name: order.customerName.split(" ")[0] })}
        </span>
        <h1 className="mt-2 font-display text-3xl text-nadya-black dark:text-nadya-cream">
          {t("orderConfirmed", { number: order.orderNumber })}
        </h1>
        <p className="mt-3 text-nadya-black/70 dark:text-nadya-cream/70">
          {t.rich("willContact", {
            phone: order.customerPhone,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>

      <div className="mt-10 border border-nadya-line dark:border-nadya-gold/15">
        <div className="border-b border-nadya-line dark:border-nadya-gold/15 px-6 py-4">
          <h2 className="font-display text-lg text-nadya-black dark:text-nadya-cream">{t("items")}</h2>
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
                  <p className="text-sm font-medium text-nadya-black dark:text-nadya-cream">{item.productName}</p>
                  <p className="text-xs text-nadya-black/50 dark:text-nadya-cream/50">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-medium text-nadya-black dark:text-nadya-cream">
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-1.5 border-t border-nadya-line dark:border-nadya-gold/15 px-6 py-4 text-sm">
          <div className="flex justify-between text-nadya-black/70 dark:text-nadya-cream/70">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-nadya-black/70 dark:text-nadya-cream/70">
            <span>{t("shipping")}</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-nadya-gold-dark">
              <span>
                {tCheckout("discount")}
                {order.couponCode ? ` (${order.couponCode})` : ""}
              </span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1.5 text-base font-medium text-nadya-black dark:text-nadya-cream">
            <span>{t("total")}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 border border-nadya-line dark:border-nadya-gold/15 p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("delivery")}
          </p>
          <p className="mt-1 text-sm text-nadya-black dark:text-nadya-cream">
            {order.customerAddress}
            {order.shippingLocalite ? `, ${order.shippingLocalite}` : ""}
            {", "}
            {order.shippingDelegation}, {order.shippingGouvernorat}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("contact")}
          </p>
          <p className="mt-1 text-sm text-nadya-black dark:text-nadya-cream">{order.customerPhone}</p>
        </div>
        {order.desiredDeliveryDate && (
          <div>
            <p className="text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
              {t("desiredDate")}
            </p>
            <p className="mt-1 text-sm text-nadya-black dark:text-nadya-cream">
              {new Date(order.desiredDeliveryDate).toLocaleDateString(
                DATE_LOCALES[locale] ?? "fr-FR",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </p>
          </div>
        )}
        {order.notes && (
          <div className="sm:col-span-2">
            <p className="text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
              {t("notes")}
            </p>
            <p className="mt-1 text-sm text-nadya-black dark:text-nadya-cream">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/produits"
          className="border border-nadya-black dark:border-nadya-cream px-6 py-3 text-sm text-nadya-black dark:text-nadya-cream hover:bg-nadya-black hover:text-nadya-cream dark:hover:bg-nadya-cream dark:bg-nadya-black dark:hover:text-nadya-black dark:text-nadya-cream"
        >
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
