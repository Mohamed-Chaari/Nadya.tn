import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { categories, getCategoryName } from "@/lib/data/categories";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();

  return (
    <footer className="border-t border-nadya-line bg-nadya-black text-nadya-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-nadya-cream/60">
            {t("tagline")}
            <br />
            <span className="italic">{t("taglineQuote")}</span>
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs tracking-[0.2em] text-nadya-gold uppercase">
            {t("collections")}
          </h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-nadya-gold-light">
                  {getCategoryName(c, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs tracking-[0.2em] text-nadya-gold uppercase">
            {t("help")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/produits" className="hover:text-nadya-gold-light">
                {t("shop")}
              </Link>
            </li>
            <li>
              <Link href="/panier" className="hover:text-nadya-gold-light">
                {t("cart")}
              </Link>
            </li>
            <li>
              <span className="text-nadya-cream/50">{t("deliveryPayment")}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs tracking-[0.2em] text-nadya-gold uppercase">
            {t("followUs")}
          </h3>
          <a
            href="https://facebook.com/nadyacraft.tn"
            target="_blank"
            rel="noreferrer"
            className="text-sm hover:text-nadya-gold-light"
          >
            facebook.com/nadyacraft.tn
          </a>
          <p className="mt-2 text-sm text-nadya-cream/50">{t("location")}</p>
        </div>
      </div>

      <div className="border-t border-nadya-cream/10 px-4 py-5 text-center text-xs text-nadya-cream/40 sm:px-6">
        © {new Date().getFullYear()} NADYA — Art & Handcraft. {t("rights")}
      </div>
    </footer>
  );
}
