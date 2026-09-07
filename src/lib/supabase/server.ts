import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseServerConfigured = Boolean(supabaseUrl && serviceRoleKey);

// Cached at module scope so every call within the same server process shares
// one client/connection instead of each creating its own. A single page
// render can trigger several of these concurrently (e.g. the storefront
// layout, footer, and page itself each fetching categories) — creating a
// fresh client per call meant a burst of simultaneous DNS lookups for the
// same host, which intermittently failed with ENOTFOUND under load.
let cachedClient: SupabaseClient | undefined;

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
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}
