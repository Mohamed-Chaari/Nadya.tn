import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { getFeaturedProducts, getNewProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPlaceholderArt } from "@/components/ui/product-placeholder-art";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-nadya-pearl bg-noise-texture">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="text-xs tracking-[0.3em] text-nadya-gold-dark uppercase">
            Fait main à Sfax, depuis 2023
          </span>
          <h1 className="max-w-2xl font-display text-4xl leading-tight text-nadya-black sm:text-5xl">
            NADYA — pour les <span className="text-gradient-gold">femmes inoubliables</span>
          </h1>
          <p className="max-w-md text-nadya-black/70">
            Couronnes, tiares, peignes et bijoux de cheveux artisanaux, pensés pour sublimer
            votre jour le plus précieux.
          </p>
          <Link
            href="/produits"
            className="mt-2 bg-nadya-black px-7 py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink"
          >
            Découvrir la collection
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-center font-display text-2xl text-nadya-black">
          Nos collections
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
                {category.nameFr}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-nadya-black">Pièces phares</h2>
            <Link
              href="/produits"
              className="text-sm text-nadya-gold-dark underline underline-offset-4"
            >
              Voir tout
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-nadya-black">Nouveautés</h2>
            <Link
              href="/produits?tri=newest"
              className="text-sm text-nadya-gold-dark underline underline-offset-4"
            >
              Voir tout
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}

      <section className="border-t border-nadya-line bg-nadya-black">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <span className="text-xs tracking-[0.3em] text-nadya-gold uppercase">
            Notre histoire
          </span>
          <p className="mt-4 font-display text-xl leading-relaxed text-nadya-cream sm:text-2xl">
            Depuis 2023 à Sfax, chaque pièce NADYA est façonnée à la main avec soin, pour
            accompagner les femmes dans leurs moments les plus précieux.
          </p>
          <a
            href="https://facebook.com/nadyacraft.tn"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm text-nadya-gold-light underline underline-offset-4"
          >
            Suivez-nous sur Facebook
          </a>
        </div>
      </section>
    </div>
  );
}
