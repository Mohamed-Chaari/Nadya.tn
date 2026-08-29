import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/data/categories";
import { updateCategory } from "@/lib/categories/admin-actions";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata: Metadata = {
  title: "Modifier la catégorie — Admin NADYA",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-nadya-black dark:text-nadya-cream">
        Modifier « {category.nameFr} »
      </h1>
      <CategoryForm category={category} action={updateCategory.bind(null, id)} />
    </div>
  );
}
