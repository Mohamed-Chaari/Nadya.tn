import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { ProductListToast } from "@/components/admin/product-list-toast";
import { LOW_STOCK_THRESHOLD } from "@/lib/config/catalog";

function ProductThumb({ src, alt }: { src: string | undefined; alt: string }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-nadya-line dark:border-nadya-gold/15 bg-nadya-pearl dark:bg-nadya-onyx">
      {src && <Image src={src} alt={alt} fill sizes="48px" className="object-cover" />}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Produits — Admin NADYA",
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <div>
      <Suspense fallback={null}>
        <ProductListToast />
      </Suspense>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-nadya-black dark:text-nadya-cream">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="bg-nadya-black px-4 py-2 text-sm font-medium text-nadya-cream hover:bg-nadya-ink"
        >
          + Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-8 text-center text-sm text-nadya-black/50 dark:text-nadya-cream/50">
          Aucun produit pour le moment.
        </p>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {products.map((product) => {
              const category = categoryBySlug.get(product.categorySlug);
              const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
              return (
                <div key={product.id} className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <ProductThumb src={product.images[0]} alt={product.nameFr} />
                      <div>
                        <p className="font-medium text-nadya-black dark:text-nadya-cream">{product.nameFr}</p>
                        <p className="text-xs text-nadya-black/50 dark:text-nadya-cream/50">{product.subtitleFr}</p>
                        <p className="mt-1 text-xs text-nadya-black/40 dark:text-nadya-cream/40">{category?.nameFr}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm text-nadya-black dark:text-nadya-cream">{formatPrice(product.price)}</p>
                      <p
                        className={`text-xs ${isLowStock ? "font-medium text-red-700 dark:text-red-400" : "text-nadya-black/50 dark:text-nadya-cream/50"}`}
                      >
                        Stock : {product.stock}
                      </p>
                      {isLowStock && (
                        <span className="mt-1 inline-block rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-[0.65rem] text-red-800 dark:text-red-300">
                          Stock bas
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 border-t border-nadya-line dark:border-nadya-gold/15 pt-3">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="text-xs text-nadya-gold-dark underline underline-offset-4 hover:text-nadya-gold"
                    >
                      Modifier
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nadya-line dark:border-nadya-gold/15 text-left text-xs tracking-[0.1em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const category = categoryBySlug.get(product.categorySlug);
                  const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
                  return (
                    <tr key={product.id} className="border-b border-nadya-line dark:border-nadya-gold/15 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductThumb src={product.images[0]} alt={product.nameFr} />
                          <div>
                            <p className="font-medium text-nadya-black dark:text-nadya-cream">{product.nameFr}</p>
                            <p className="text-xs text-nadya-black/50 dark:text-nadya-cream/50">{product.subtitleFr}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-nadya-black/70 dark:text-nadya-cream/70">{category?.nameFr}</td>
                      <td className="px-4 py-3 text-nadya-black dark:text-nadya-cream">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            isLowStock ? "font-medium text-red-700 dark:text-red-400" : "text-nadya-black/70 dark:text-nadya-cream/70"
                          }
                        >
                          {product.stock}
                        </span>
                        {isLowStock && (
                          <span className="ml-2 rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-[0.65rem] text-red-800 dark:text-red-300">
                            Stock bas
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/produits/${product.id}`}
                            className="text-xs text-nadya-gold-dark underline underline-offset-4 hover:text-nadya-gold"
                          >
                            Modifier
                          </Link>
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
