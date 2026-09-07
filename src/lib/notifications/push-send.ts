import "server-only";
import webpush from "web-push";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    throw new Error("VAPID env vars are missing (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT).");
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

interface NewOrderPushPayload {
  orderNumber: number;
  customerName: string;
  total: number;
  itemSummary: string;
}

export async function notifyAdminsOfNewOrder(payload: NewOrderPushPayload): Promise<void> {
  ensureConfigured();

  const supabase = getSupabaseServiceClient();
  const { data: subscriptions, error } = await supabase
    .from("admin_push_subscriptions")
    .select("id, endpoint, p256dh, auth");

  if (error) {
    console.error("[notifyAdminsOfNewOrder] failed to load subscriptions", error);
    return;
  }
  if (!subscriptions || subscriptions.length === 0) return;

  const notification = JSON.stringify({
    title: `📦 Nouvelle commande #${payload.orderNumber}`,
    body: `${payload.customerName} · ${payload.total} DT · ${payload.itemSummary}`,
    url: "/admin",
  });

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          notification
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          // Subscription is gone (browser data cleared, app uninstalled, etc.) — remove it.
          await supabase.from("admin_push_subscriptions").delete().eq("id", sub.id);
        } else {
          console.error("[notifyAdminsOfNewOrder] send failed", err);
        }
      }
    })
  );
}
