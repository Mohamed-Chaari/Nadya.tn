"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { getCategoryName } from "@/lib/category-i18n";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/lib/types";

const priceRanges = [
  { key: "all", min: undefined, max: undefined },
  { key: "under", min: undefined, max: 30 },
  { key: "range-30-50", min: 30, max: 50 },
  { key: "range-50-70", min: 50, max: 70 },
  { key: "range-70-100", min: 70, max: 100 },
  { key: "over", min: 100, max: undefined },
] as const;

export function ProductFilters({
  categories,
  showCategoryFilter = true,
}: {
  categories: Category[];
  showCategoryFilter?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Products");
  const locale = useLocale();

  const sortOptions = [
    { value: "featured", label: t("sortFeatured") },
    { value: "newest", label: t("sortNewest") },
    { value: "price-asc", label: t("sortPriceAsc") },
    { value: "price-desc", label: t("sortPriceDesc") },
  ];

  function priceRangeLabel(range: (typeof priceRanges)[number]) {
    if (range.key === "all") return t("allPrices");
    if (range.key === "under") return t("under", { amount: formatPrice(range.max!) });
    if (range.key === "over") return t("over", { amount: formatPrice(range.min!) });
    return t("range", { min: formatPrice(range.min!), max: formatPrice(range.max!) });
  }

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
            <p className="mb-2 text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
              {t("category")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateParam("categorie", undefined)}
                className={`border px-3 py-1.5 text-sm transition ${
                  activeCategory === ""
                    ? "border-nadya-black bg-nadya-black text-nadya-cream"
                    : "border-nadya-line dark:border-nadya-gold/15 text-nadya-black/70 dark:text-nadya-cream/70 hover:border-nadya-black dark:hover:border-nadya-cream"
                }`}
              >
                {t("allCategories")}
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => updateParam("categorie", c.slug)}
                  className={`border px-3 py-1.5 text-sm transition ${
                    activeCategory === c.slug
                      ? "border-nadya-black bg-nadya-black text-nadya-cream"
                      : "border-nadya-line dark:border-nadya-gold/15 text-nadya-black/70 dark:text-nadya-cream/70 hover:border-nadya-black dark:hover:border-nadya-cream"
                  }`}
                >
                  {getCategoryName(c, locale)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
            {t("price")}
          </p>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => {
              const isActive =
                (activeMin ?? "") === (range.min?.toString() ?? "") &&
                (activeMax ?? "") === (range.max?.toString() ?? "");
              return (
                <button
                  key={range.key}
                  type="button"
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
                      : "border-nadya-line dark:border-nadya-gold/15 text-nadya-black/70 dark:text-nadya-cream/70 hover:border-nadya-black dark:hover:border-nadya-cream"
                  }`}
                >
                  {priceRangeLabel(range)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <label className="mb-2 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
          {t("sortBy")}
        </label>
        <select
          value={activeSort}
          onChange={(e) => updateParam("tri", e.target.value)}
          className="border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-1.5 text-sm text-nadya-black dark:text-nadya-cream"
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
