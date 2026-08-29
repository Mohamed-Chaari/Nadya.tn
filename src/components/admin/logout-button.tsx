"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase/ssr-browser";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserAuthClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-nadya-cream/70 hover:text-nadya-cream"
    >
      Déconnexion
    </button>
  );
}
