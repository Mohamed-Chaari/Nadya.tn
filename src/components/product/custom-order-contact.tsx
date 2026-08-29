import { useTranslations } from "next-intl";
import { MESSENGER_URL, getWhatsAppUrl } from "@/lib/config/contact";
import type { Product } from "@/lib/types";

export function CustomOrderContact({ product }: { product: Product }) {
  const t = useTranslations("CustomOrder");
  const message = t("whatsappMessage", { productName: product.nameFr });

  return (
    <div className="border border-nadya-line bg-nadya-pearl p-5">
      <p className="text-sm text-nadya-black/80">{t("note")}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={MESSENGER_URL}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-nadya-black py-3 text-center text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink"
        >
          {t("messenger")}
        </a>
        <a
          href={getWhatsAppUrl(message)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 border border-nadya-black py-3 text-center text-sm font-medium tracking-wide text-nadya-black transition hover:bg-nadya-black hover:text-nadya-cream"
        >
          {t("whatsapp")}
        </a>
      </div>
    </div>
  );
}
