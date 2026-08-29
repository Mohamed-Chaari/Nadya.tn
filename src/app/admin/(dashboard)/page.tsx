import type { Metadata } from "next";
import Link from "next/link";
import { getAllOrders } from "@/lib/orders/get-orders";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderActionButtons } from "@/components/admin/order-action-buttons";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Commandes — Admin NADYA",
};

const FILTER_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Toutes", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "Confirmées", value: "confirmed" },
  { label: "Expédiées", value: "shipped" },
  { label: "Livrées", value: "delivered" },
  { label: "Annulées", value: "cancelled" },
];

interface PageProps {
  searchParams: Promise<{ statut?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { statut } = await searchParams;
  const orders = await getAllOrders();
  const filtered = statut && statut !== "all" ? orders.filter((o) => o.status === statut) : orders;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-nadya-black">Commandes</h1>
        <p className="text-sm text-nadya-black/60">
          {filtered.length} commande{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = (statut ?? "all") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/admin" : `/admin?statut=${tab.value}`}
              className={`border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-nadya-black bg-nadya-black text-nadya-cream"
                  : "border-nadya-line bg-white text-nadya-black/70 hover:border-nadya-black"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="border border-nadya-line bg-white p-8 text-center text-sm text-nadya-black/50">
          Aucune commande.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="border border-nadya-line bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-nadya-black">
                      #{order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-nadya-black/70">{order.customerName}</p>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-nadya-gold-dark hover:underline"
                  >
                    📞 {order.customerPhone}
                  </a>
                </div>
                <div className="text-right">
                  <p className="font-medium text-nadya-black">{formatPrice(order.total)}</p>
                  <p className="text-xs text-nadya-black/50">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-nadya-black/70">{order.itemSummary}</p>

              <div className="mt-4">
                <OrderActionButtons orderId={order.id} status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
