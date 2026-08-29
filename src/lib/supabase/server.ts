import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseServerConfigured = Boolean(supabaseUrl && serviceRoleKey);

/**
 * Service-role client — bypasses RLS. Server-only (Server Actions / route
 * handlers). Never import this from a "use client" component or leak the
 * key to the browser.
 */
export function getSupabaseServiceClient() {
  if (!isSupabaseServerConfigured) {
    throw new Error(
      "Supabase server env vars are missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  return createClient(supabaseUrl as string, serviceRoleKey as string, {
    auth: { persistSession: false },
  });
}
