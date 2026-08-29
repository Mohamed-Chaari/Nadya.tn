import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/lib/products/admin-actions";

export const metadata: Metadata = {
  title: "Nouveau produit — Admin NADYA",
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-nadya-black">Nouveau produit</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
