import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { updateProduct } from "@/lib/products/admin-actions";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Modifier le produit — Admin NADYA",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-nadya-black">Modifier « {product.nameFr} »</h1>
      <ProductForm product={product} action={updateProduct.bind(null, id)} />
    </div>
  );
}
