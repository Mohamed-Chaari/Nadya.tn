"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadProductImageAction, deleteProductImageAction } from "@/lib/products/image-actions";

export function ProductImageUpload({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const files = Array.from(fileList);

    startUpload(async () => {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadProductImageAction(formData);
        if (result.success) {
          uploaded.push(result.url);
        } else {
          setError(result.error);
        }
      }
      if (uploaded.length > 0) onChange([...images, ...uploaded]);
    });

    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove(url: string) {
    onChange(images.filter((img) => img !== url));
    deleteProductImageAction(url).catch(() => {});
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
        Photos
      </label>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div
            key={url}
            className="group relative h-24 w-24 shrink-0 overflow-hidden border border-nadya-line dark:border-nadya-gold/15"
          >
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              aria-label="Supprimer cette image"
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-nadya-black/70 text-xs text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 border border-dashed border-nadya-line dark:border-nadya-gold/15 text-xs text-nadya-black/50 dark:text-nadya-cream/50 transition hover:border-nadya-gold hover:text-nadya-gold-dark disabled:opacity-50"
        >
          {isUploading ? (
            "Envoi..."
          ) : (
            <>
              <span className="text-lg leading-none">+</span>
              <span>Ajouter</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>}
    </div>
  );
}
