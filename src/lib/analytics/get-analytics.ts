import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export interface DailySales {
  date: string;
  revenue: number;
}

export interface BestSeller {
  productName: string;
  quantity: number;
  revenue: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDay: DailySales[];
  bestSellers: BestSeller[];
}

const DAYS_WINDOW = 14;

export async function getAnalytics(): Promise<AnalyticsSummary> {
  const supabase = getSupabaseServiceClient();

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, total, status, created_at");

  if (ordersError || !orders) {
    console.error("[getAnalytics]", ordersError);
    return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, salesByDay: [], bestSellers: [] };
  }

  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = validOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const salesByDay: DailySales[] = [];
  const revenueByDate = new Map<string, number>();
  for (const order of validOrders) {
    const date = order.created_at.slice(0, 10);
    revenueByDate.set(date, (revenueByDate.get(date) ?? 0) + Number(order.total));
  }
  for (let i = DAYS_WINDOW - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    salesByDay.push({ date: key, revenue: revenueByDate.get(key) ?? 0 });
  }

  const validOrderIds = new Set(validOrders.map((o) => o.id));
  const { data: items } = await supabase
    .from("order_items")
    .select("order_id, product_name, quantity, line_total");

  const byProduct = new Map<string, BestSeller>();
  for (const item of items ?? []) {
    if (!validOrderIds.has(item.order_id)) continue;
    const existing = byProduct.get(item.product_name);
    if (existing) {
      existing.quantity += item.quantity;
      existing.revenue += Number(item.line_total);
    } else {
      byProduct.set(item.product_name, {
        productName: item.product_name,
        quantity: item.quantity,
        revenue: Number(item.line_total),
      });
    }
  }
  const bestSellers = Array.from(byProduct.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8);

  return { totalRevenue, totalOrders, averageOrderValue, salesByDay, bestSellers };
}
