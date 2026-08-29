"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "@/components/admin/logout-button";

const navLinks = [
  { href: "/admin", label: "Commandes", exact: true },
  { href: "/admin/produits", label: "Produits", exact: false },
  { href: "/admin/avis", label: "Avis", exact: false },
  { href: "/admin/coupons", label: "Coupons", exact: false },
  { href: "/admin/clients", label: "Clients", exact: false },
  { href: "/admin/analytics", label: "Analytics", exact: false },
];

export function AdminNav({
  displayName,
  role,
}: {
  displayName: string;
  role: string;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 bg-nadya-black text-nadya-cream">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg tracking-wide">
            NADYA <span className="text-nadya-gold-light">Admin</span>
          </Link>
          <nav className="hidden gap-5 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${
                  isActive(link.href, link.exact)
                    ? "text-nadya-gold-light"
                    : "text-nadya-cream/70 hover:text-nadya-cream"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <span className="text-xs text-nadya-cream/60">
            {displayName} · {role === "owner" ? "Propriétaire" : "Staff"}
          </span>
          <LogoutButton />
        </div>

        <button
          type="button"
          className="sm:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <div className="flex flex-col gap-1.5">
            <span className="block h-px w-5 bg-nadya-cream" />
            <span className="block h-px w-5 bg-nadya-cream" />
            <span className="block h-px w-5 bg-nadya-cream" />
          </div>
        </button>
      </div>

      {isMenuOpen && (
        <div className="flex flex-col gap-3 border-t border-nadya-cream/10 px-4 py-4 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm ${
                isActive(link.href, link.exact) ? "text-nadya-gold-light" : "text-nadya-cream/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-nadya-cream/10 pt-3">
            <span className="text-xs text-nadya-cream/60">
              {displayName} · {role === "owner" ? "Propriétaire" : "Staff"}
            </span>
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  );
}
