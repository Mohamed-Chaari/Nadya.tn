"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const t = useTranslations("Products");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="flex max-w-sm items-center gap-2">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full border border-nadya-line bg-nadya-cream px-3 py-2 text-sm text-nadya-black placeholder:text-nadya-black/40 focus:border-nadya-gold focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 border border-nadya-black px-3 py-2 text-sm text-nadya-black hover:bg-nadya-black hover:text-nadya-cream"
      >
        {t("search")}
      </button>
    </form>
  );
}
