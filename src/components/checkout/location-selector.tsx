"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { tunisiaGovernorates } from "@/lib/data/tunisia-locations";
import { normalizeForSearch } from "@/lib/text";

export interface LocationValue {
  gouvernorat: string;
  delegation: string;
  localite: string;
}

interface LocationSelectorProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

const fieldClass =
  "w-full border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none disabled:opacity-50";
const labelClass = "mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase";

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const t = useTranslations("Checkout");
  const selectedGovernorate = tunisiaGovernorates.find((g) => g.name === value.gouvernorat);
  const delegations = selectedGovernorate?.delegations ?? [];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className={labelClass}>{t("gouvernorat")} *</label>
        <select
          required
          value={value.gouvernorat}
          onChange={(e) =>
            onChange({ gouvernorat: e.target.value, delegation: "", localite: value.localite })
          }
          className={fieldClass}
        >
          <option value="" disabled>
            {t("selectPlaceholder")}
          </option>
          {tunisiaGovernorates.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <DelegationCombobox
        options={delegations}
        value={value.delegation}
        disabled={!value.gouvernorat}
        onChange={(delegation) => onChange({ ...value, delegation })}
      />

      <div className="sm:col-span-2">
        <label className={labelClass}>{t("localityOptional")}</label>
        <input
          type="text"
          value={value.localite}
          onChange={(e) => onChange({ ...value, localite: e.target.value })}
          placeholder={t("localityPlaceholder")}
          className={fieldClass}
        />
      </div>
    </div>
  );
}

function DelegationCombobox({
  options,
  value,
  disabled,
  onChange,
}: {
  options: string[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("Checkout");
  const [query, setQuery] = useState("");
  const [isOpen, setOpen] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    if (!query) return options;
    const needle = normalizeForSearch(query);
    return options.filter((o) => normalizeForSearch(o).includes(needle));
  }, [options, query]);

  function selectOption(option: string) {
    onChange(option);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <label className={labelClass}>{t("delegation")} *</label>
      <input
        type="text"
        required
        disabled={disabled}
        value={isOpen ? query : value}
        placeholder={disabled ? t("chooseGouvernoratFirst") : t("searchPlaceholder")}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => setOpen(false), 120);
        }}
        className={fieldClass}
      />
      {isOpen && !disabled && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-nadya-black/50 dark:text-nadya-cream/50">{t("noResults")}</li>
          ) : (
            filtered.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (blurTimeout.current) clearTimeout(blurTimeout.current);
                    selectOption(option);
                  }}
                  className={`block w-full px-3 py-2 text-start text-sm hover:bg-nadya-pearl dark:bg-nadya-onyx ${
                    option === value ? "bg-nadya-pearl dark:bg-nadya-onyx font-medium" : ""
                  }`}
                >
                  {option}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
