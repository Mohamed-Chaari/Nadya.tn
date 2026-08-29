import { useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations("Products");

  if (products.length === 0) {
    return <div className="py-20 text-center text-nadya-black/50">{t("noResults")}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
