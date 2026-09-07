import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export interface PreviousCustomerInfo {
  name: string;
  address: string;
  gouvernorat: string;
  delegation: string;
  localite: string | null;
  orderCount: number;
}

export async function getPreviousCustomerInfo(
  rawPhone: string
): Promise<PreviousCustomerInfo | null> {
  const phone = rawPhone.replace(/[^\d+]/g, "");
  if (!phone) return null;

  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("customer_name, customer_address, shipping_gouvernorat, shipping_delegation, shipping_localite")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("customer_phone", phone);

  const latest = data[0];
  return {
    name: latest.customer_name,
    address: latest.customer_address,
    gouvernorat: latest.shipping_gouvernorat,
    delegation: latest.shipping_delegation,
    localite: latest.shipping_localite,
    orderCount: count ?? 1,
  };
}
