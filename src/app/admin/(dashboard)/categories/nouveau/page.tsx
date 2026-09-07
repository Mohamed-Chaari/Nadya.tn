import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "@/lib/categories/admin-actions";

export const metadata: Metadata = {
  title: "Nouvelle catégorie — Admin NADYA",
};

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-nadya-black dark:text-nadya-cream">Nouvelle catégorie</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
