"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/admin/toast-provider";

export function ProductListToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const t = useTranslations("Admin.Toast");
  const toastParam = searchParams.get("toast");

  useEffect(() => {
    if (toastParam === "created") {
      showToast("success", t("productCreated"));
      router.replace("/admin/produits", { scroll: false });
    } else if (toastParam === "updated") {
      showToast("success", t("productUpdated"));
      router.replace("/admin/produits", { scroll: false });
    }
    // Only re-run when the URL signal changes, not when showToast/t/router identities change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastParam]);

  return null;
}
