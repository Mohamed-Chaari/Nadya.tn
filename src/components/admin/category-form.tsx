"use client";

import { useState } from "react";
import { slugify } from "@/lib/slugify";
import type { CategoryFormInput, CategoryActionResult } from "@/lib/categories/admin-actions";
import type { Category } from "@/lib/types";

const fieldClass =
  "w-full border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase";

export function CategoryForm({
  category,
  action,
}: {
  category?: Category;
  action: (input: CategoryFormInput) => Promise<CategoryActionResult>;
}) {
  const [form, setForm] = useState({
    slug: category?.slug ?? "",
    nameFr: category?.nameFr ?? "",
    nameAr: category?.nameAr ?? "",
    nameEn: category?.nameEn ?? "",
    descriptionFr: category?.descriptionFr ?? "",
    descriptionAr: category?.descriptionAr ?? "",
    descriptionEn: category?.descriptionEn ?? "",
    sortOrder: category?.sortOrder?.toString() ?? "0",
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const input: CategoryFormInput = {
      slug: form.slug.trim(),
      nameFr: form.nameFr.trim(),
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      descriptionFr: form.descriptionFr.trim(),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      sortOrder: Number(form.sortOrder) || 0,
    };

    const result = await action(input);
    if (result && !result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className={labelClass}>Nom *</label>
        <input
          required
          type="text"
          value={form.nameFr}
          onChange={(e) => {
            update("nameFr", e.target.value);
            if (!slugTouched) update("slug", slugify(e.target.value));
          }}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Slug (URL) *</label>
        <input
          required
          type="text"
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          value={form.descriptionFr}
          onChange={(e) => update("descriptionFr", e.target.value)}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Ordre d&apos;affichage</label>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => update("sortOrder", e.target.value)}
          className={`${fieldClass} max-w-[8rem]`}
        />
      </div>

      <div className="border-t border-nadya-line dark:border-nadya-gold/15 pt-5">
        <p className="mb-4 text-xs tracking-[0.15em] text-nadya-black/40 dark:text-nadya-cream/40 uppercase">
          Traductions (optionnel — le français s&apos;affiche par défaut si vide)
        </p>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Nom (arabe)</label>
            <input
              type="text"
              dir="rtl"
              value={form.nameAr}
              onChange={(e) => update("nameAr", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description (arabe)</label>
            <textarea
              rows={2}
              dir="rtl"
              value={form.descriptionAr}
              onChange={(e) => update("descriptionAr", e.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Nom (anglais)</label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => update("nameEn", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description (anglais)</label>
            <textarea
              rows={2}
              value={form.descriptionEn}
              onChange={(e) => update("descriptionEn", e.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-700 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-nadya-black px-6 py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/40"
      >
        {isSubmitting ? "Enregistrement..." : category ? "Enregistrer" : "Créer la catégorie"}
      </button>
    </form>
  );
}
