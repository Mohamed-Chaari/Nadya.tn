"use server";

import { getCurrentAdmin } from "@/lib/admin/get-current-admin";
import { uploadProductImage, deleteProductImage } from "@/lib/storage/product-images";

const MAX_FILE_BYTES = 15 * 1024 * 1024;

export async function uploadProductImageAction(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Non autorisé." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { success: false, error: "Aucun fichier reçu." };
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Ce fichier n'est pas une image." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { success: false, error: "Image trop volumineuse (max 15 Mo)." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadProductImage(buffer);
    return { success: true, url };
  } catch (error) {
    console.error("[uploadProductImageAction]", error);
    return { success: false, error: "Échec de l'envoi de l'image." };
  }
}

export async function deleteProductImageAction(url: string): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) return;
  await deleteProductImage(url);
}
