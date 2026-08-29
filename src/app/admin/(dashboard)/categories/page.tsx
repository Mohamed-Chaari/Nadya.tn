import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getAllCategories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { CategoryListToast } from "@/components/admin/category-list-toast";

export const metadata: Metadata = {
  title: "Catégories — Admin NADYA",
};

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);

  const productCounts = new Map<string, number>();
  for (const product of products) {
    productCounts.set(product.categorySlug, (productCounts.get(product.categorySlug) ?? 0) + 1);
  }

  return (
    <div>
      <Suspense fallback={null}>
        <CategoryListToast />
      </Suspense>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-nadya-black dark:text-nadya-cream">Catégories</h1>
        <Link
          href="/admin/categories/nouveau"
          className="bg-nadya-black px-4 py-2 text-sm font-medium text-nadya-cream hover:bg-nadya-ink"
        >
          + Nouvelle catégorie
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-8 text-center text-sm text-nadya-black/50 dark:text-nadya-cream/50">
          Aucune catégorie pour le moment.
        </p>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {categories.map((category) => {
              const count = productCounts.get(category.slug) ?? 0;
              return (
                <div key={category.id} className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-nadya-black dark:text-nadya-cream">{category.nameFr}</p>
                      <p className="text-xs text-nadya-black/50 dark:text-nadya-cream/50">{category.slug}</p>
                    </div>
                    <p className="shrink-0 text-xs text-nadya-black/50 dark:text-nadya-cream/50">
                      {count} produit{count > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-4 border-t border-nadya-line dark:border-nadya-gold/15 pt-3">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-xs text-nadya-gold-dark underline underline-offset-4 hover:text-nadya-gold"
                    >
                      Modifier
                    </Link>
                    <DeleteCategoryButton categoryId={category.id} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nadya-line dark:border-nadya-gold/15 text-left text-xs tracking-[0.1em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Produits</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const count = productCounts.get(category.slug) ?? 0;
                  return (
                    <tr key={category.id} className="border-b border-nadya-line dark:border-nadya-gold/15 last:border-0">
                      <td className="px-4 py-3 font-medium text-nadya-black dark:text-nadya-cream">
                        {category.nameFr}
                      </td>
                      <td className="px-4 py-3 text-nadya-black/50 dark:text-nadya-cream/50">{category.slug}</td>
                      <td className="px-4 py-3 text-nadya-black/70 dark:text-nadya-cream/70">{count}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="text-xs text-nadya-gold-dark underline underline-offset-4 hover:text-nadya-gold"
                          >
                            Modifier
                          </Link>
                          <DeleteCategoryButton categoryId={category.id} />
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
