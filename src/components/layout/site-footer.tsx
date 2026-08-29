import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { categories } from "@/lib/data/categories";

export function SiteFooter() {
  return (
    <footer className="border-t border-nadya-line bg-nadya-black text-nadya-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-nadya-cream/60">
            Bijoux de mariée artisanaux, faits main à Sfax depuis 2023.
            <br />
            <span className="italic">Pour les femmes inoubliables.</span>
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs tracking-[0.2em] text-nadya-gold uppercase">
            Collections
          </h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-nadya-gold-light">
                  {c.nameFr}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs tracking-[0.2em] text-nadya-gold uppercase">
            Aide
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/produits" className="hover:text-nadya-gold-light">
                Boutique
              </Link>
            </li>
            <li>
              <Link href="/panier" className="hover:text-nadya-gold-light">
                Panier
              </Link>
            </li>
            <li>
              <span className="text-nadya-cream/50">Livraison &amp; paiement à la livraison</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs tracking-[0.2em] text-nadya-gold uppercase">
            Suivez-nous
          </h3>
          <a
            href="https://facebook.com/nadyacraft.tn"
            target="_blank"
            rel="noreferrer"
            className="text-sm hover:text-nadya-gold-light"
          >
            facebook.com/nadyacraft.tn
          </a>
          <p className="mt-2 text-sm text-nadya-cream/50">Sfax, Tunisie</p>
        </div>
      </div>

      <div className="border-t border-nadya-cream/10 px-4 py-5 text-center text-xs text-nadya-cream/40 sm:px-6">
        © {new Date().getFullYear()} NADYA — Art & Handcraft. Tous droits réservés.
      </div>
    </footer>
  );
}
