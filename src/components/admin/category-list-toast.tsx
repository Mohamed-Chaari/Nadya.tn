"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/admin/toast-provider";

export function CategoryListToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const t = useTranslations("Admin.Toast");
  const toastParam = searchParams.get("toast");

  useEffect(() => {
    if (toastParam === "created") {
      showToast("success", t("categoryCreated"));
      router.replace("/admin/categories", { scroll: false });
    } else if (toastParam === "updated") {
      showToast("success", t("categoryUpdated"));
      router.replace("/admin/categories", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastParam]);

  return null;
}
