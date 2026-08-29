"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { useCart } from "@/lib/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { categories } from "@/lib/data/categories";

const navLinks = [
  { href: "/produits", label: "Tous les produits" },
  ...categories.map((c) => ({ href: `/categories/${c.slug}`, label: c.nameFr })),
];

export function SiteHeader() {
  const { itemCount, openDrawer } = useCart();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-nadya-line bg-nadya-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            className="flex h-9 w-9 items-center justify-center lg:hidden"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span className="block h-px w-5 bg-nadya-black" />
              <span className="block h-px w-5 bg-nadya-black" />
              <span className="block h-px w-5 bg-nadya-black" />
            </div>
          </button>

          <Logo />

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-nadya-ink/80 transition hover:text-nadya-gold-dark"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/produits"
              aria-label="Rechercher"
              className="hidden h-9 w-9 items-center justify-center text-nadya-ink/80 hover:text-nadya-gold-dark sm:flex"
            >
              <SearchIcon />
            </Link>
            <button
              onClick={openDrawer}
              aria-label="Ouvrir le panier"
              className="relative flex h-9 w-9 items-center justify-center text-nadya-ink/80 hover:text-nadya-gold-dark"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-nadya-gold px-1 text-[0.6rem] font-medium text-nadya-black">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="flex flex-col gap-1 border-t border-nadya-line px-4 py-3 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm tracking-wide text-nadya-ink/80 hover:text-nadya-gold-dark"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
      <path d="M6 6L4.5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </svg>
  );
}
