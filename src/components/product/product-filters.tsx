"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { categories } from "@/lib/data/categories";

const sortOptions: { value: string; label: string }[] = [
  { value: "featured", label: "Mise en avant" },
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

const priceRanges = [
  { label: "Tous les prix", min: undefined, max: undefined },
  { label: "Moins de 200 DT", min: undefined, max: 200 },
  { label: "200 – 350 DT", min: 200, max: 350 },
  { label: "Plus de 350 DT", min: 350, max: undefined },
];

export function ProductFilters({ showCategoryFilter = true }: { showCategoryFilter?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get("categorie") ?? "";
  const activeMin = searchParams.get("min");
  const activeMax = searchParams.get("max");
  const activeSort = searchParams.get("tri") ?? "featured";

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        {showCategoryFilter && (
          <div>
            <p className="mb-2 text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
              Catégorie
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParam("categorie", undefined)}
                className={`border px-3 py-1.5 text-sm transition ${
                  activeCategory === ""
                    ? "border-nadya-black bg-nadya-black text-nadya-cream"
                    : "border-nadya-line text-nadya-black/70 hover:border-nadya-black"
                }`}
              >
                Toutes
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => updateParam("categorie", c.slug)}
                  className={`border px-3 py-1.5 text-sm transition ${
                    activeCategory === c.slug
                      ? "border-nadya-black bg-nadya-black text-nadya-cream"
                      : "border-nadya-line text-nadya-black/70 hover:border-nadya-black"
                  }`}
                >
                  {c.nameFr}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs tracking-[0.15em] text-nadya-black/50 uppercase">Prix</p>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => {
              const isActive =
                (activeMin ?? "") === (range.min?.toString() ?? "") &&
                (activeMax ?? "") === (range.max?.toString() ?? "");
              return (
                <button
                  key={range.label}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (range.min != null) params.set("min", String(range.min));
                    else params.delete("min");
                    if (range.max != null) params.set("max", String(range.max));
                    else params.delete("max");
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className={`border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-nadya-black bg-nadya-black text-nadya-cream"
                      : "border-nadya-line text-nadya-black/70 hover:border-nadya-black"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <label className="mb-2 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
          Trier par
        </label>
        <select
          value={activeSort}
          onChange={(e) => updateParam("tri", e.target.value)}
          className="border border-nadya-line bg-nadya-cream px-3 py-1.5 text-sm text-nadya-black"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
