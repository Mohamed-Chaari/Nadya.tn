import { CartProvider } from "@/lib/cart/cart-context";
import { WishlistProvider } from "@/lib/wishlist/wishlist-context";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAllCategories } from "@/lib/data/categories";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories();

  return (
    <CartProvider>
      <WishlistProvider>
        <SiteHeader categories={categories} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </WishlistProvider>
    </CartProvider>
  );
}
