import "server-only";
import { getSupabaseServerAuthClient } from "@/lib/supabase/ssr-server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export interface CurrentAdmin {
  id: string;
  email: string;
  displayName: string;
  role: "owner" | "staff";
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const authClient = await getSupabaseServerAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) return null;

  const supabase = getSupabaseServiceClient();
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("email, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) return null;

  return {
    id: user.id,
    email: adminRow.email,
    displayName: adminRow.display_name || adminRow.email,
    role: adminRow.role,
  };
}
