import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/lib/products/admin-actions";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Nouveau produit — Admin NADYA",
};

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-nadya-black dark:text-nadya-cream">Nouveau produit</h1>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
