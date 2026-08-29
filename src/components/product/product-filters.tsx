"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { categories, getCategoryName } from "@/lib/data/categories";
import { formatPrice } from "@/lib/format";

const priceRanges = [
  { key: "all", min: undefined, max: undefined },
  { key: "under", min: undefined, max: 200 },
  { key: "range", min: 200, max: 350 },
  { key: "over", min: 350, max: undefined },
] as const;

export function ProductFilters({ showCategoryFilter = true }: { showCategoryFilter?: boolean }) {
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
            <p className="mb-2 text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
              {t("category")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateParam("categorie", undefined)}
                className={`border px-3 py-1.5 text-sm transition ${
                  activeCategory === ""
                    ? "border-nadya-black bg-nadya-black text-nadya-cream"
                    : "border-nadya-line text-nadya-black/70 hover:border-nadya-black"
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
                      : "border-nadya-line text-nadya-black/70 hover:border-nadya-black"
                  }`}
                >
                  {getCategoryName(c, locale)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
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
                      : "border-nadya-line text-nadya-black/70 hover:border-nadya-black"
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
        <label className="mb-2 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase">
          {t("sortBy")}
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
