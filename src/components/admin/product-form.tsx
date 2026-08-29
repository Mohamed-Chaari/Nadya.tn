"use client";

import { useState } from "react";
import { categories } from "@/lib/data/categories";
import { slugify } from "@/lib/slugify";
import type { ProductFormInput, ProductActionResult } from "@/lib/products/admin-actions";
import type { Product } from "@/lib/types";

const fieldClass =
  "w-full border border-nadya-line bg-white px-3 py-2.5 text-sm text-nadya-black focus:border-nadya-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 uppercase";

export function ProductForm({
  product,
  action,
}: {
  product?: Product;
  action: (input: ProductFormInput) => Promise<ProductActionResult>;
}) {
  const [form, setForm] = useState({
    slug: product?.slug ?? "",
    nameFr: product?.nameFr ?? "",
    subtitleFr: product?.subtitleFr ?? "",
    categorySlug: product?.categorySlug ?? categories[0].slug,
    price: product?.price?.toString() ?? "",
    compareAtPrice: product?.compareAtPrice?.toString() ?? "",
    images: product?.images.join("\n") ?? "",
    descriptionFr: product?.descriptionFr ?? "",
    descriptionAr: product?.descriptionAr ?? "",
    descriptionEn: product?.descriptionEn ?? "",
    materialsFr: product?.materialsFr.join("\n") ?? "",
    materialsAr: product?.materialsAr?.join("\n") ?? "",
    materialsEn: product?.materialsEn?.join("\n") ?? "",
    stock: product?.stock?.toString() ?? "0",
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? false,
    isCustomizable: product?.isCustomizable ?? false,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const input: ProductFormInput = {
      slug: form.slug.trim(),
      nameFr: form.nameFr.trim(),
      subtitleFr: form.subtitleFr.trim(),
      categorySlug: form.categorySlug,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      descriptionFr: form.descriptionFr.trim(),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      materialsFr: form.materialsFr.split("\n").map((s) => s.trim()).filter(Boolean),
      materialsAr: form.materialsAr.split("\n").map((s) => s.trim()).filter(Boolean),
      materialsEn: form.materialsEn.split("\n").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isCustomizable: form.isCustomizable,
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
        <label className={labelClass}>Sous-titre</label>
        <input
          type="text"
          value={form.subtitleFr}
          onChange={(e) => update("subtitleFr", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Catégorie *</label>
          <select
            required
            value={form.categorySlug}
            onChange={(e) => update("categorySlug", e.target.value as typeof form.categorySlug)}
            className={fieldClass}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nameFr}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Stock *</label>
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Prix (DT) *</label>
          <input
            required
            type="number"
            min={0}
            step="0.001"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Prix barré (optionnel)</label>
          <input
            type="number"
            min={0}
            step="0.001"
            value={form.compareAtPrice}
            onChange={(e) => update("compareAtPrice", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          required
          rows={4}
          value={form.descriptionFr}
          onChange={(e) => update("descriptionFr", e.target.value)}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Matières (une par ligne)</label>
        <textarea
          rows={3}
          value={form.materialsFr}
          onChange={(e) => update("materialsFr", e.target.value)}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="border-t border-nadya-line pt-5">
        <p className="mb-4 text-xs tracking-[0.15em] text-nadya-black/40 uppercase">
          Traductions (optionnel — le français s&apos;affiche par défaut si vide)
        </p>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Description (arabe)</label>
            <textarea
              rows={3}
              dir="rtl"
              value={form.descriptionAr}
              onChange={(e) => update("descriptionAr", e.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Matières (arabe, une par ligne)</label>
            <textarea
              rows={3}
              dir="rtl"
              value={form.materialsAr}
              onChange={(e) => update("materialsAr", e.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Description (anglais)</label>
            <textarea
              rows={3}
              value={form.descriptionEn}
              onChange={(e) => update("descriptionEn", e.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Matières (anglais, une par ligne)</label>
            <textarea
              rows={3}
              value={form.materialsEn}
              onChange={(e) => update("materialsEn", e.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Images — URLs (une par ligne)</label>
        <textarea
          rows={3}
          value={form.images}
          onChange={(e) => update("images", e.target.value)}
          placeholder="https://..."
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-nadya-black">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => update("isFeatured", e.target.checked)}
          />
          Mise en avant
        </label>
        <label className="flex items-center gap-2 text-sm text-nadya-black">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={(e) => update("isNew", e.target.checked)}
          />
          Nouveauté
        </label>
        <label className="flex items-center gap-2 text-sm text-nadya-black">
          <input
            type="checkbox"
            checked={form.isCustomizable}
            onChange={(e) => update("isCustomizable", e.target.checked)}
          />
          Personnalisable
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-nadya-black px-6 py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/40"
      >
        {isSubmitting ? "Enregistrement..." : product ? "Enregistrer" : "Créer le produit"}
      </button>
    </form>
  );
}
