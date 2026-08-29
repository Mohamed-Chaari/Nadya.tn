import type { Metadata } from "next";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, getCategoryName } from "@/lib/data/categories";
import { getFeaturedProducts, getNewProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const currentLocale = await getLocale();
  const featured = await getFeaturedProducts();
  const newArrivals = await getNewProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-nadya-pearl bg-noise-texture">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="text-xs tracking-[0.3em] text-nadya-gold-dark uppercase">
            {t("tagline")}
          </span>
          <h1 className="max-w-2xl font-display text-4xl leading-tight text-nadya-black sm:text-5xl">
            {t("heroTitle")} <span className="text-gradient-gold">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="max-w-md text-nadya-black/70">{t("heroSubtitle")}</p>
          <Link
            href="/produits"
            className="mt-2 bg-nadya-black px-7 py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink"
          >
            {t("discoverCollection")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-center font-display text-2xl text-nadya-black">
          {t("ourCollections")}
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <ProductPlaceholderArt
                categorySlug={category.slug}
                className="aspect-square w-full transition duration-500 group-hover:scale-[1.02]"
              />
              <p className="mt-3 text-center font-display text-base text-nadya-black">
                {getCategoryName(category, currentLocale)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-nadya-black">{t("featured")}</h2>
            <Link
              href="/produits"
              className="text-sm text-nadya-gold-dark underline underline-offset-4"
            >
              {t("seeAll")}
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-nadya-black">{t("newArrivals")}</h2>
            <Link
              href="/produits?tri=newest"
              className="text-sm text-nadya-gold-dark underline underline-offset-4"
            >
              {t("seeAll")}
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}

      <section className="border-t border-nadya-line bg-nadya-black">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <span className="text-xs tracking-[0.3em] text-nadya-gold uppercase">
            {t("ourStory")}
          </span>
          <p className="mt-4 font-display text-xl leading-relaxed text-nadya-cream sm:text-2xl">
            {t("storyText")}
          </p>
          <a
            href="https://facebook.com/nadyacraft.tn"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm text-nadya-gold-light underline underline-offset-4"
          >
            {t("followUsFacebook")}
          </a>
        </div>
      </section>
    </div>
  );
}
