import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { LOW_STOCK_THRESHOLD } from "@/lib/config/catalog";

export const metadata: Metadata = {
  title: "Produits — Admin NADYA",
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-nadya-black">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="bg-nadya-black px-4 py-2 text-sm font-medium text-nadya-cream hover:bg-nadya-ink"
        >
          + Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="border border-nadya-line bg-white p-8 text-center text-sm text-nadya-black/50">
          Aucun produit pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto border border-nadya-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nadya-line text-left text-xs tracking-[0.1em] text-nadya-black/50 uppercase">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const category = getCategory(product.categorySlug);
                const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
                return (
                  <tr key={product.id} className="border-b border-nadya-line last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-nadya-black">{product.nameFr}</p>
                      <p className="text-xs text-nadya-black/50">{product.subtitleFr}</p>
                    </td>
                    <td className="px-4 py-3 text-nadya-black/70">{category?.nameFr}</td>
                    <td className="px-4 py-3 text-nadya-black">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          isLowStock ? "font-medium text-red-700" : "text-nadya-black/70"
                        }
                      >
                        {product.stock}
                      </span>
                      {isLowStock && (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[0.65rem] text-red-800">
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
      )}
    </div>
  );
}
