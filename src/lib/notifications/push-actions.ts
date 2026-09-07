"use server";

import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";

export interface PushSubscriptionInput {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function subscribeToPush(subscription: PushSubscriptionInput): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("admin_push_subscriptions").upsert(
    {
      admin_id: admin.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    console.error("[subscribeToPush]", error);
    throw new Error("Impossible d'activer les notifications.");
  }
}

export async function unsubscribeFromPush(endpoint: string): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Non autorisé.");

  const supabase = getSupabaseServiceClient();
  await supabase.from("admin_push_subscriptions").delete().eq("endpoint", endpoint);
}
